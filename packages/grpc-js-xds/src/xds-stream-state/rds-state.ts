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

import { experimental, logVerbosity, StatusObject } from "@grpc/grpc-js";
import { EXPERIMENTAL_FAULT_INJECTION } from "../environment";
import { RouteConfiguration__Output } from "../generated/envoy/config/route/v3/RouteConfiguration";
import { Any__Output } from "../generated/google/protobuf/Any";
import { validateOverrideFilter } from "../http-filter";
import { CdsLoadBalancingConfig } from "../load-balancer-cds";
import { HandleResponseResult, RejectedResourceEntry, ResourcePair, Watcher, XdsStreamState } from "./xds-stream-state";
import ServiceConfig = experimental.ServiceConfig;

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
  'suffix_match'];
const SUPPORTED_CLUSTER_SPECIFIERS = ['cluster', 'weighted_clusters', 'cluster_header'];

export class RdsState implements XdsStreamState<RouteConfiguration__Output> {
  versionInfo = '';
  nonce = '';

  private watchers: Map<string, Watcher<RouteConfiguration__Output>[]> = new Map<string, Watcher<RouteConfiguration__Output>[]>();
  private latestResponses: RouteConfiguration__Output[] = [];
  private latestIsV2 = false;

  constructor(private updateResourceNames: () => void) {}

  addWatcher(routeConfigName: string, watcher: Watcher<RouteConfiguration__Output>) {
    trace('Adding RDS watcher for routeConfigName ' + routeConfigName);
    let watchersEntry = this.watchers.get(routeConfigName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.watchers.set(routeConfigName, watchersEntry);
    }
    watchersEntry.push(watcher);

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    const isV2 = this.latestIsV2;
    for (const message of this.latestResponses) {
      if (message.name === routeConfigName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          trace('Reporting existing RDS update for new watcher for routeConfigName ' + routeConfigName);
          watcher.onValidUpdate(message, isV2);
        });
      }
    }
    if (addedServiceName) {
      this.updateResourceNames();
    }
  }

  removeWatcher(routeConfigName: string, watcher: Watcher<RouteConfiguration__Output>): void {
    trace('Removing RDS watcher for routeConfigName ' + routeConfigName);
    const watchersEntry = this.watchers.get(routeConfigName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.watchers.delete(routeConfigName);
      }
    }
    if (removedServiceName) {
      this.updateResourceNames();
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.watchers.keys());
  }

  validateResponse(message: RouteConfiguration__Output, isV2: boolean): boolean {
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
      if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
        for (const filterConfig of Object.values(virtualHost.typed_per_filter_config ?? {})) {
          if (!validateOverrideFilter(filterConfig)) {
            return false;
          }
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
        if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
          for (const [name, filterConfig] of Object.entries(route.typed_per_filter_config ?? {})) {
            if (!validateOverrideFilter(filterConfig)) {
              return false;
            }
          }
        }
        if (route.route!.cluster_specifier === 'weighted_clusters') {
          let weightSum = 0;
          for (const clusterWeight of route.route.weighted_clusters!.clusters) {
            weightSum += clusterWeight.weight?.value ?? 0;
          }
          if (weightSum !== route.route.weighted_clusters!.total_weight?.value ?? 100) {
            return false;
          }
          if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
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

  handleResponses(responses: ResourcePair<RouteConfiguration__Output>[], isV2: boolean): HandleResponseResult {
    const validResponses: RouteConfiguration__Output[] = [];
    let result: HandleResponseResult = {
      accepted: [],
      rejected: [],
      missing: []
    }
    for (const {resource, raw} of responses) {
      if (this.validateResponse(resource, isV2)) {
        validResponses.push(resource);
        result.accepted.push({
          name: resource.name, 
          raw: raw});
      } else {
        trace('RDS validation failed for message ' + JSON.stringify(resource));
        result.rejected.push({
          name: resource.name, 
          raw: raw,
          error: `Route validation failed for resource ${resource.name}`
        });
      }
    }
    this.latestResponses = validResponses;
    this.latestIsV2 = isV2;
    const allRouteConfigNames = new Set<string>();
    for (const message of validResponses) {
      allRouteConfigNames.add(message.name);
      const watchers = this.watchers.get(message.name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message, isV2);
      }
    }
    trace('Received RDS response with route config names [' + Array.from(allRouteConfigNames) + ']');
    return result;
  }

  reportStreamError(status: StatusObject): void {
    for (const watcherList of this.watchers.values()) {
      for (const watcher of watcherList) {
        watcher.onTransientError(status);
      }
    }
  }
}