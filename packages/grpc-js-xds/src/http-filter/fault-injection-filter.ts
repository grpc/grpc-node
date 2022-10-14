/*
 * Copyright 2021 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// This is a non-public, unstable API, but it's very convenient
import { loadProtosWithOptionsSync } from '@grpc/proto-loader/build/src/util';
import { experimental, logVerbosity, Metadata, status } from '@grpc/grpc-js';
import { Any__Output } from '../generated/google/protobuf/Any';
import Filter = experimental.Filter;
import FilterFactory = experimental.FilterFactory;
import BaseFilter = experimental.BaseFilter;
import CallStream = experimental.CallStream;
import { HttpFilterConfig, registerHttpFilter } from '../http-filter';
import { HTTPFault__Output } from '../generated/envoy/extensions/filters/http/fault/v3/HTTPFault';
import { envoyFractionToFraction, Fraction } from '../fraction';
import { Duration__Output } from '../generated/google/protobuf/Duration';

const TRACER_NAME = 'fault_injection';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/filters/http/fault/v3/fault.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build/http-filter
      __dirname + '/../../../deps/xds/',
      __dirname + '/../../../deps/envoy-api/',
      __dirname + '/../../../deps/protoc-gen-validate/'
    ],
  }
);

interface FixedDelayConfig {
  kind: 'fixed';
  durationMs: number;
  percentage: Fraction;
}

interface HeaderDelayConfig {
  kind: 'header';
  percentage: Fraction;
}

interface GrpcAbortConfig {
  kind: 'grpc';
  code: status;
  percentage: Fraction;
}

interface HeaderAbortConfig {
  kind: 'header';
  percentage: Fraction;
}

interface FaultInjectionConfig {
  delay: FixedDelayConfig | HeaderDelayConfig | null;
  abort: GrpcAbortConfig | HeaderAbortConfig | null;
  maxActiveFaults: number;
}

interface FaultInjectionFilterConfig extends HttpFilterConfig {
  typeUrl: 'type.googleapis.com/envoy.extensions.filters.http.fault.v3.HTTPFault';
  config: FaultInjectionConfig;
}

const FAULT_INJECTION_FILTER_URL = 'type.googleapis.com/envoy.extensions.filters.http.fault.v3.HTTPFault';

const toObjectOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

function parseAnyMessage<MessageType>(message: Any__Output): MessageType | null {
  const typeName = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const messageType = resourceRoot.lookup(typeName);
  if (messageType) {
    const decodedMessage = (messageType as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as MessageType;
  } else {
    return null;
  }
}

function durationToMs(duration: Duration__Output): number {
  return Number.parseInt(duration.seconds) * 1000 + duration.nanos / 1_000_000;
}

function httpCodeToGrpcStatus(code: number): status {
  switch (code) {
    case 400: return status.INTERNAL;
    case 401: return status.UNAUTHENTICATED;
    case 403: return status.PERMISSION_DENIED;
    case 404: return status.UNIMPLEMENTED;
    case 429: return status.UNAVAILABLE;
    case 502: return status.UNAVAILABLE;
    case 503: return status.UNAVAILABLE;
    case 504: return status.UNAVAILABLE;
    default: return status.UNKNOWN;
  }
}

function parseHTTPFaultConfig(encodedConfig: Any__Output): FaultInjectionFilterConfig | null {
  if (encodedConfig.type_url !== FAULT_INJECTION_FILTER_URL) {
    trace('Config parsing failed: unexpected type URL: ' + encodedConfig.type_url);
    return null;
  }
  const parsedMessage = parseAnyMessage<HTTPFault__Output>(encodedConfig);
  if (parsedMessage === null) {
    trace('Config parsing failed: failed to parse HTTPFault message');
    return null;
  }
  trace('Parsing HTTPFault message ' + JSON.stringify(parsedMessage, undefined, 2));
  const result: FaultInjectionConfig = {
    delay: null,
    abort: null,
    maxActiveFaults: Infinity
  };
  // Parse delay field
  if (parsedMessage.delay !== null) {
    if (parsedMessage.delay.percentage === null) {
      trace('Config parsing failed: delay.percentage unset');
      return null;
    }
    const percentage = envoyFractionToFraction(parsedMessage.delay.percentage);
    switch (parsedMessage.delay.fault_delay_secifier /* sic */) {
      case 'fixed_delay':
        result.delay = {
          kind: 'fixed',
          durationMs: durationToMs(parsedMessage.delay.fixed_delay!),
          percentage: percentage
        };
        break;
      case 'header_delay':
        result.delay = {
          kind: 'header',
          percentage: percentage
        };
        break;
      default:
        trace('Config parsing failed: delay.fault_delay_secifier has unexpected value ' + parsedMessage.delay.fault_delay_secifier);
        // Should not be possible
        return null;
    }
  }
  // Parse abort field
  if (parsedMessage.abort !== null) {
    if (parsedMessage.abort.percentage === null) {
      trace('Config parsing failed: abort.percentage unset');
      return null;
    }
    const percentage = envoyFractionToFraction(parsedMessage.abort.percentage);
    switch (parsedMessage.abort.error_type) {
      case 'http_status':
        result.abort = {
          kind: 'grpc',
          code: httpCodeToGrpcStatus(parsedMessage.abort.http_status!),
          percentage: percentage
        };
        break;
      case 'grpc_status':
        result.abort = {
          kind: 'grpc',
          code: parsedMessage.abort.grpc_status!,
          percentage: percentage
        }
        break;
      case 'header_abort':
        result.abort = {
          kind: 'header',
          percentage: percentage
        };
        break;
      default:
        trace('Config parsing failed: abort.error_type has unexpected value ' + parsedMessage.abort.error_type);
        // Should not be possible
        return null;
    }
  }
  // Parse max_active_faults field
  if (parsedMessage.max_active_faults !== null) {
    result.maxActiveFaults = parsedMessage.max_active_faults.value;
  }
  return {
    typeUrl: FAULT_INJECTION_FILTER_URL,
    config: result
  };
}

function asyncTimeout(timeMs: number): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, timeMs);
  });
}

/**
 * Returns true with probability numerator/denominator.
 * @param numerator 
 * @param denominator 
 */
function rollRandomPercentage(numerator: number, denominator: number): boolean {
  return Math.random() * denominator < numerator;
}

const DELAY_DURATION_HEADER_KEY = 'x-envoy-fault-delay-request';
const DELAY_PERCENTAGE_HEADER_KEY = 'x-envoy-fault-delay-request-percentage';
const ABORT_GRPC_HEADER_KEY = 'x-envoy-fault-abort-grpc-request';
const ABORT_HTTP_HEADER_KEY = 'x-envoy-fault-abort-request';
const ABORT_PERCENTAGE_HEADER_KEY = 'x-envoy-fault-abort-request-percentage';

const NUMBER_REGEX = /\d+/;

let totalActiveFaults = 0;

class FaultInjectionFilter extends BaseFilter implements Filter {
  constructor(private config: FaultInjectionConfig) {
    super();
  }

  async sendMetadata(metadataPromise: Promise<Metadata>): Promise<Metadata> {
    const metadata = await metadataPromise;
    // Handle delay
    if (totalActiveFaults < this.config.maxActiveFaults && this.config.delay) {
      let duration = 0;
      let numerator = this.config.delay.percentage.numerator;
      const denominator = this.config.delay.percentage.denominator;
      if (this.config.delay.kind === 'fixed') {
        duration = this.config.delay.durationMs;
      } else {
        const durationHeader = metadata.get(DELAY_DURATION_HEADER_KEY);
        for (const value of durationHeader) {
          if (typeof value !== 'string') {
            continue;
          }
          if (NUMBER_REGEX.test(value)) {
            duration = Number.parseInt(value);
            break;
          }
        }
        const percentageHeader = metadata.get(DELAY_PERCENTAGE_HEADER_KEY);
        for (const value of percentageHeader) {
          if (typeof value !== 'string') {
            continue;
          }
          if (NUMBER_REGEX.test(value)) {
            numerator = Math.min(numerator, Number.parseInt(value));
            break;
          }
        }
      }
      if (rollRandomPercentage(numerator, denominator)) {
        totalActiveFaults++;
        await asyncTimeout(duration);
        totalActiveFaults--;
      }
    }
    // Handle abort
    if (totalActiveFaults < this.config.maxActiveFaults && this.config.abort) {
      let abortStatus: status | null = null;
      let numerator = this.config.abort.percentage.numerator;
      const denominator = this.config.abort.percentage.denominator;
      if (this.config.abort.kind === 'grpc') {
        abortStatus = this.config.abort.code;
      } else {
        const grpcStatusHeader = metadata.get(ABORT_GRPC_HEADER_KEY);
        for (const value of grpcStatusHeader) {
          if (typeof value !== 'string') {
            continue;
          }
          if (NUMBER_REGEX.test(value)) {
            abortStatus = Number.parseInt(value);
            break;
          }
        }
        /* Fall back to looking for HTTP status header if the gRPC status
         * header is not present. */
        if (abortStatus === null) {
          const httpStatusHeader = metadata.get(ABORT_HTTP_HEADER_KEY);
          for (const value of httpStatusHeader) {
            if (typeof value !== 'string') {
              continue;
            }
            if (NUMBER_REGEX.test(value)) {
              abortStatus = httpCodeToGrpcStatus(Number.parseInt(value));
              break;
            }
          }
        }
        const percentageHeader = metadata.get(ABORT_PERCENTAGE_HEADER_KEY);
        for (const value of percentageHeader) {
          if (typeof value !== 'string') {
            continue;
          }
          if (NUMBER_REGEX.test(value)) {
            numerator = Math.min(numerator, Number.parseInt(value));
            break;
          }
        }
      }
      if (abortStatus !== null && rollRandomPercentage(numerator, denominator)) {
        return Promise.reject({code: abortStatus, details: 'Fault injected', metadata: new Metadata()});
      }
    }
    return metadata;
  }
}

class FaultInjectionFilterFactory implements FilterFactory<FaultInjectionFilter> {
  private config: FaultInjectionConfig;
  constructor(config: HttpFilterConfig, overrideConfig?: HttpFilterConfig) {
    if (overrideConfig?.typeUrl === FAULT_INJECTION_FILTER_URL) {
      this.config = overrideConfig.config;
    } else {
      this.config = config.config;
    }
  }

  createFilter(): FaultInjectionFilter {
    return new FaultInjectionFilter(this.config);
  }
}

export function setup() {
  registerHttpFilter(FAULT_INJECTION_FILTER_URL, {
    parseTopLevelFilterConfig: parseHTTPFaultConfig,
    parseOverrideFilterConfig: parseHTTPFaultConfig,
    httpFilterConstructor: FaultInjectionFilterFactory
  });
}