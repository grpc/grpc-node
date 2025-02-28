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
import { ValidationResult, XdsDecodeContext, XdsDecodeResult, XdsResourceType } from "./xds-resource-type";
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

  /**
   * @param policy
   * @returns A list of validation errors, if there are any. An empty list indicates success
   */
  private validateRetryPolicy(policy: RetryPolicy__Output | null): string[] {
    if (policy === null) {
      return [];
    }
    const errors: string[] = [];
    const numRetries = policy.num_retries?.value ?? 1
    if (numRetries < 1) {
      errors.push(`Invalid policy.num_retries.value: ${numRetries}`);
    }
    if (policy.retry_back_off) {
      if (policy.retry_back_off.base_interval) {
        const baseInterval = durationToMs(policy.retry_back_off.base_interval)!;
        const maxInterval = durationToMs(policy.retry_back_off.max_interval) ?? (10 * baseInterval);
        if (baseInterval <= 0) {
          errors.push(`Invalid retry_back_off.base_interval: ${JSON.stringify(policy.retry_back_off.base_interval)}`);
        }
        if (maxInterval < baseInterval) {
          errors.push(`retry_back_off.max_interval < retry_back_off.base_interval: ${JSON.stringify(policy.retry_back_off.max_interval)} vs ${JSON.stringify(policy.retry_back_off.base_interval)}`);
        }
      } else {
        errors.push('retry_back_off.base_interval unset');
      }
    }
    return errors;
  }

  public validateResource(message: RouteConfiguration__Output): ValidationResult<RouteConfiguration__Output> {
    const errors: string[] = [];
    // https://github.com/grpc/proposal/blob/master/A28-xds-traffic-splitting-and-routing.md#response-validation
    for (const virtualHost of message.virtual_hosts) {
      const errorPrefix = `virtual_hosts[${virtualHost.name}]`;
      for (const domainPattern of virtualHost.domains) {
        const starIndex = domainPattern.indexOf('*');
        const lastStarIndex = domainPattern.lastIndexOf('*');
        // A domain pattern can have at most one wildcard *
        if (starIndex !== lastStarIndex) {
          errors.push(`${errorPrefix}: domains entry has multiple wildcards: ${domainPattern}`);
        }
        // A wildcard * can either be absent or at the beginning or end of the pattern
        if (!(starIndex === -1 || starIndex === 0 || starIndex === domainPattern.length - 1)) {
          errors.push(`${errorPrefix}: domains entry has wildcard in the middle: ${domainPattern}`);
        }
      }
      if (EXPERIMENTAL_FAULT_INJECTION) {
        for (const filterConfig of Object.values(virtualHost.typed_per_filter_config ?? {})) {
          if (!validateOverrideFilter(filterConfig)) {
            errors.push(`${errorPrefix}: typed_per_filter_config validation failed for type_url: ${filterConfig.type_url}`);
          }
        }
      }
      if (EXPERIMENTAL_RETRY) {
        errors.push(...this.validateRetryPolicy(virtualHost.retry_policy).map(error => `${errorPrefix}.retry_policy: ${error}`));
      }
      for (const route of virtualHost.routes) {
        const routeErrorPrefix = `${errorPrefix}.routes[${route.name}]`;
        const match = route.match;
        if (match) {
          if (match.path_specifier) {
            if (SUPPORTED_PATH_SPECIFIERS.indexOf(match.path_specifier) < 0) {
              errors.push(`${routeErrorPrefix}.match: unsupported path_specifier: ${match.path_specifier}`);
            }
          } else {
            errors.push(`${routeErrorPrefix}.match: no path_specifier set`);
          }
          for (const headers of match.headers) {
            if (headers.header_match_specifier && SUPPPORTED_HEADER_MATCH_SPECIFIERS.indexOf(headers.header_match_specifier) < 0) {
              errors.push(`${routeErrorPrefix}.match.headers[${headers.name}]: unsupported header_match_specifier: ${headers.header_match_specifier}`);
            }
          }
        } else {
          errors.push(`${routeErrorPrefix}.match unset`);
        }
        switch (route.action) {
          case 'route': {

            if ((route.route === undefined) || (route.route === null)) {
              errors.push(`${routeErrorPrefix}.route unset`);
              break;
            }
            if (route.route.cluster_specifier && SUPPORTED_CLUSTER_SPECIFIERS.indexOf(route.route.cluster_specifier) < 0) {
              errors.push(`${routeErrorPrefix}: unsupported route.cluster_specifier: ${route.route.cluster_specifier}`);
            }
            if (EXPERIMENTAL_FAULT_INJECTION) {
              for (const [name, filterConfig] of Object.entries(route.typed_per_filter_config ?? {})) {
                if (!validateOverrideFilter(filterConfig)) {
                  errors.push(`${routeErrorPrefix}.typed_per_filter_config[${name}] validation failed`);
                }
              }
            }
            if (EXPERIMENTAL_RETRY) {
              errors.push(...this.validateRetryPolicy(route.route.retry_policy).map(error => `${routeErrorPrefix}.route.retry_policy: ${error}`));
            }
            if (route.route!.cluster_specifier === 'weighted_clusters') {
              let weightSum = 0;
              for (const clusterWeight of route.route.weighted_clusters!.clusters) {
                weightSum += clusterWeight.weight?.value ?? 0;
              }
              if (weightSum === 0) {
                errors.push(`${routeErrorPrefix}.route.weighted_clusters sum of weights is 0`);
              }
              if (weightSum > UINT32_MAX) {
                errors.push(`${routeErrorPrefix}.route.weighted_clusters sum of weights is greater than UINT32_MAX`);
              }
              if (EXPERIMENTAL_FAULT_INJECTION) {
                for (const weightedCluster of route.route!.weighted_clusters!.clusters) {
                  for (const [name, filterConfig] of Object.entries(weightedCluster.typed_per_filter_config ?? {})) {
                    if (!validateOverrideFilter(filterConfig)) {
                      errors.push(`${routeErrorPrefix}.route.weighted_clusters.clusters[${weightedCluster.name}].typed_per_filter_config[${name}] validation failed`);
                    }
                  }
                }
              }
            }
            break;
          }
          case 'non_forwarding_action':
            continue;
          default:
            errors.push(`${routeErrorPrefix}: unsupported action: ${route.action}`);
        }
      }
    }
    if (errors.length === 0) {
      return {
        valid: true,
        result: message
      };
    } else {
      return {
        valid: false,
        errors
      }
    }
  }

  decode(context: XdsDecodeContext, resource: Any__Output): XdsDecodeResult {
    if (resource.type_url !== RDS_TYPE_URL) {
      throw new Error(
        `ADS Error: Invalid resource type ${resource.type_url}, expected ${RDS_TYPE_URL}`
      );
    }
    const message = decodeSingleResource(RDS_TYPE_URL, resource.value);
    trace('Decoded raw resource of type ' + RDS_TYPE_URL + ': ' + JSON.stringify(message, undefined, 2));
    const validationResult = this.validateResource(message);
    if (validationResult.valid) {
      return {
        name: validationResult.result.name,
        value: validationResult.result
      };
    } else {
      return {
        name: message.name,
        error: `RouteConfiguration message validation failed: [${validationResult.errors}]`
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
