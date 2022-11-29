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
 *
 */

import { EXPERIMENTAL_FAULT_INJECTION, EXPERIMENTAL_RETRY } from "../environment";
import { RetryPolicy__Output } from "../generated/envoy/config/route/v3/RetryPolicy";
import { RouteConfiguration__Output } from "../generated/envoy/config/route/v3/RouteConfiguration";
import { Duration__Output } from "../generated/google/protobuf/Duration";
import { validateOverrideFilter } from "../http-filter";
import { BaseXdsStreamState, XdsStreamState } from "./xds-stream-state";

const SUPPORTED_PATH_SPECIFIERS = ['prefix', 'path', 'safe_regex'];
const SUPPPORTED_HEADER_MATCH_SPECIFIERS = [
  'exact_match',
  'safe_regex_match',
  'range_match',
  'present_match',
  'prefix_match',
  'suffix_match'];
const SUPPORTED_CLUSTER_SPECIFIERS = ['cluster', 'weighted_clusters', 'cluster_header'];

function durationToMs(duration: Duration__Output | null): number | null {
  if (duration === null) {
    return null;
  }
  return (Number.parseInt(duration.seconds) * 1000 + duration.nanos / 1_000_000) | 0;
}

export class RdsState extends BaseXdsStreamState<RouteConfiguration__Output> implements XdsStreamState<RouteConfiguration__Output> {
  protected isStateOfTheWorld(): boolean {
    return false;
  }
  protected getResourceName(resource: RouteConfiguration__Output): string {
    return resource.name;
  }
  protected getProtocolName(): string {
    return 'RDS';
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

  validateResponse(message: RouteConfiguration__Output): boolean {
    // https://github.com/grpc/proposal/blob/master/A28-xds-traffic-splitting-and-routing.md#response-validation
    for (const virtualHost of message.virtual_hosts) {
      for (const domainPattern of virtualHost.domains) {
        const starIndex = domainPattern.indexOf('*');
        const lastStarIndex = domainPattern.lastIndexOf('*');
        // A domain pattern can have at most one wildcard *
        if (starIndex !== lastStarIndex) {
          return false;
        }
        // A wildcard * can either be absent or at the beginning or end of the pattern
        if (!(starIndex === -1 || starIndex === 0 || starIndex === domainPattern.length - 1)) {
          return false;
        }
      }
      if (EXPERIMENTAL_FAULT_INJECTION) {
        for (const filterConfig of Object.values(virtualHost.typed_per_filter_config ?? {})) {
          if (!validateOverrideFilter(filterConfig)) {
            return false;
          }
        }
      }
      if (EXPERIMENTAL_RETRY) {
        if (!this.validateRetryPolicy(virtualHost.retry_policy)) {
          return false;
        }
      }
      for (const route of virtualHost.routes) {
        const match = route.match;
        if (!match) {
          return false;
        }
        if (SUPPORTED_PATH_SPECIFIERS.indexOf(match.path_specifier) < 0) {
          return false;
        }
        for (const headers of match.headers) {
          if (SUPPPORTED_HEADER_MATCH_SPECIFIERS.indexOf(headers.header_match_specifier) < 0) {
            return false;
          }
        }
        if (route.action !== 'route') {
          return false;
        }
        if ((route.route === undefined) || (route.route === null) || SUPPORTED_CLUSTER_SPECIFIERS.indexOf(route.route.cluster_specifier) < 0) {
          return false;
        }
        if (EXPERIMENTAL_FAULT_INJECTION) {
          for (const [name, filterConfig] of Object.entries(route.typed_per_filter_config ?? {})) {
            if (!validateOverrideFilter(filterConfig)) {
              return false;
            }
          }
        }
        if (EXPERIMENTAL_RETRY) {
          if (!this.validateRetryPolicy(route.route.retry_policy)) {
            return false;
          }
        }
        if (route.route!.cluster_specifier === 'weighted_clusters') {
          if (route.route.weighted_clusters!.total_weight?.value === 0) {
            return false;
          }
          let weightSum = 0;
          for (const clusterWeight of route.route.weighted_clusters!.clusters) {
            weightSum += clusterWeight.weight?.value ?? 0;
          }
          if (weightSum !== route.route.weighted_clusters!.total_weight?.value ?? 100) {
            return false;
          }
          if (EXPERIMENTAL_FAULT_INJECTION) {
            for (const weightedCluster of route.route!.weighted_clusters!.clusters) {
              for (const filterConfig of Object.values(weightedCluster.typed_per_filter_config ?? {})) {
                if (!validateOverrideFilter(filterConfig)) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  }
}