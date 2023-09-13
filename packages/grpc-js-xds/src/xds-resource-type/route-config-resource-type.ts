/*
 * Copyright 2023 gRPC authors.
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
 *
 */

import { experimental, logVerbosity } from "@grpc/grpc-js";
import { EXPERIMENTAL_FAULT_INJECTION, EXPERIMENTAL_RETRY } from "../environment";
import { RetryPolicy__Output } from "../generated/envoy/config/route/v3/RetryPolicy";
import { RouteConfiguration__Output } from "../generated/envoy/config/route/v3/RouteConfiguration";
import { Any__Output } from "../generated/google/protobuf/Any";
import { Duration__Output } from "../generated/google/protobuf/Duration";
import { validateOverrideFilter } from "../http-filter";
import { RDS_TYPE_URL, decodeSingleResource } from "../resources";
import { Watcher, XdsClient } from "../xds-client";
import { XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const SUPPORTED_PATH_SPECIFIERS = ['prefix', 'path', 'safe_regex'];
const SUPPPORTED_HEADER_MATCH_SPECIFIERS = [
  'exact_match',
  'safe_regex_match',
  'range_match',
  'present_match',
  'prefix_match',
  'suffix_match',
  'string_match'];
const SUPPORTED_CLUSTER_SPECIFIERS = ['cluster', 'weighted_clusters', 'cluster_header'];

const UINT32_MAX = 0xFFFFFFFF;

function durationToMs(duration: Duration__Output | null): number | null {
  if (duration === null) {
    return null;
  }
  return (Number.parseInt(duration.seconds) * 1000 + duration.nanos / 1_000_000) | 0;
}

export class RouteConfigurationResourceType extends XdsResourceType {
  private static singleton: RouteConfigurationResourceType = new RouteConfigurationResourceType();

  private constructor() {
    super();
  }

  static get() {
    return RouteConfigurationResourceType.singleton;
  }

  getTypeUrl(): string {
    return 'envoy.config.route.v3.RouteConfiguration';
  }

  private validateRetryPolicy(policy: RetryPolicy__Output | null): boolean {
    if (policy === null) {
      return true;
    }
    const numRetries = policy.num_retries?.value ?? 1
    if (numRetries < 1) {
      return false;
    }
    if (policy.retry_back_off) {
      if (!policy.retry_back_off.base_interval) {
        return false;
      }
      const baseInterval = durationToMs(policy.retry_back_off.base_interval)!;
      const maxInterval = durationToMs(policy.retry_back_off.max_interval) ?? (10 * baseInterval);
      if (!(maxInterval >= baseInterval) && (baseInterval > 0)) {
        return false;
      }
    }
    return true;
  }

  public validateResource(message: RouteConfiguration__Output): RouteConfiguration__Output | null {
    // https://github.com/grpc/proposal/blob/master/A28-xds-traffic-splitting-and-routing.md#response-validation
    for (const virtualHost of message.virtual_hosts) {
      for (const domainPattern of virtualHost.domains) {
        const starIndex = domainPattern.indexOf('*');
        const lastStarIndex = domainPattern.lastIndexOf('*');
        // A domain pattern can have at most one wildcard *
        if (starIndex !== lastStarIndex) {
          return null;
        }
        // A wildcard * can either be absent or at the beginning or end of the pattern
        if (!(starIndex === -1 || starIndex === 0 || starIndex === domainPattern.length - 1)) {
          return null;
        }
      }
      if (EXPERIMENTAL_FAULT_INJECTION) {
        for (const filterConfig of Object.values(virtualHost.typed_per_filter_config ?? {})) {
          if (!validateOverrideFilter(filterConfig)) {
            return null;
          }
        }
      }
      if (EXPERIMENTAL_RETRY) {
        if (!this.validateRetryPolicy(virtualHost.retry_policy)) {
          return null;
        }
      }
      for (const route of virtualHost.routes) {
        const match = route.match;
        if (!match) {
          return null;
        }
        if (SUPPORTED_PATH_SPECIFIERS.indexOf(match.path_specifier) < 0) {
          return null;
        }
        for (const headers of match.headers) {
          if (SUPPPORTED_HEADER_MATCH_SPECIFIERS.indexOf(headers.header_match_specifier) < 0) {
            return null;
          }
        }
        if (route.action !== 'route') {
          return null;
        }
        if ((route.route === undefined) || (route.route === null) || SUPPORTED_CLUSTER_SPECIFIERS.indexOf(route.route.cluster_specifier) < 0) {
          return null;
        }
        if (EXPERIMENTAL_FAULT_INJECTION) {
          for (const [name, filterConfig] of Object.entries(route.typed_per_filter_config ?? {})) {
            if (!validateOverrideFilter(filterConfig)) {
              return null;
            }
          }
        }
        if (EXPERIMENTAL_RETRY) {
          if (!this.validateRetryPolicy(route.route.retry_policy)) {
            return null;
          }
        }
        if (route.route!.cluster_specifier === 'weighted_clusters') {
          let weightSum = 0;
          for (const clusterWeight of route.route.weighted_clusters!.clusters) {
            weightSum += clusterWeight.weight?.value ?? 0;
          }
          if (weightSum === 0 || weightSum > UINT32_MAX) {
            return null;
          }
          if (EXPERIMENTAL_FAULT_INJECTION) {
            for (const weightedCluster of route.route!.weighted_clusters!.clusters) {
              for (const filterConfig of Object.values(weightedCluster.typed_per_filter_config ?? {})) {
                if (!validateOverrideFilter(filterConfig)) {
                  return null;
                }
              }
            }
          }
        }
      }
    }
    return message;
  }

  decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== RDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${RDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(RDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + RDS_TYPE_URL + ': ' + JSON.stringify(message, undefined, 2));
    const validatedMessage = this.validateResource(message);
    if (validatedMessage) {
      return {
        name: validatedMessage.name,
        value: validatedMessage
      };
    } else {
      return {
        name: message.name,
        error: 'Route configuration message validation failed'
      };
    }
  }

  allResourcesRequiredInSotW(): boolean {
    return false;
  }

  static startWatch(client: XdsClient, name: string, watcher: Watcher<RouteConfiguration__Output>) {
    client.watchResource(RouteConfigurationResourceType.get(), name, watcher);
  }

  static cancelWatch(client: XdsClient, name: string, watcher: Watcher<RouteConfiguration__Output>) {
    client.cancelResourceWatch(RouteConfigurationResourceType.get(), name, watcher);
  }
}
