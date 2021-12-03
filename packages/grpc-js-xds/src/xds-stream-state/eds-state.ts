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
import { isIPv4, isIPv6 } from "net";
import { ClusterLoadAssignment__Output } from "../generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { Any__Output } from "../generated/google/protobuf/Any";
import { HandleResponseResult, RejectedResourceEntry, ResourcePair, Watcher, XdsStreamState } from "./xds-stream-state";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export class EdsState implements XdsStreamState<ClusterLoadAssignment__Output> {
  public versionInfo = '';
  public nonce = '';

  private watchers: Map<
    string,
    Watcher<ClusterLoadAssignment__Output>[]
  > = new Map<string, Watcher<ClusterLoadAssignment__Output>[]>();

  private latestResponses: ClusterLoadAssignment__Output[] = [];
  private latestIsV2 = false;

  constructor(private updateResourceNames: () => void) {}

  /**
   * Add the watcher to the watcher list. Returns true if the list of resource
   * names has changed, and false otherwise.
   * @param edsServiceName
   * @param watcher
   */
  addWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ): void {
    let watchersEntry = this.watchers.get(edsServiceName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.watchers.set(edsServiceName, watchersEntry);
    }
    trace('Adding EDS watcher (' + watchersEntry.length + ' ->' + (watchersEntry.length + 1) + ') for edsServiceName ' + edsServiceName);
    watchersEntry.push(watcher);

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    const isV2 = this.latestIsV2;
    for (const message of this.latestResponses) {
      if (message.cluster_name === edsServiceName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          trace('Reporting existing EDS update for new watcher for edsServiceName ' + edsServiceName);
          watcher.onValidUpdate(message, isV2);
        });
      }
    }
    if (addedServiceName) {
      this.updateResourceNames();
    }
  }

  removeWatcher(
    edsServiceName: string,
    watcher: Watcher<ClusterLoadAssignment__Output>
  ): void {
    trace('Removing EDS watcher for edsServiceName ' + edsServiceName);
    const watchersEntry = this.watchers.get(edsServiceName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        trace('Removed EDS watcher (' + watchersEntry.length + ' -> ' + (watchersEntry.length - 1) + ') for edsServiceName ' + edsServiceName);
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.watchers.delete(edsServiceName);
      }
    }
    if (removedServiceName) {
      this.updateResourceNames();
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.watchers.keys());
  }

  /**
   * Validate the ClusterLoadAssignment object by these rules:
   * https://github.com/grpc/proposal/blob/master/A27-xds-global-load-balancing.md#clusterloadassignment-proto
   * @param message
   */
  private validateResponse(message: ClusterLoadAssignment__Output) {
    for (const endpoint of message.endpoints) {
      for (const lb of endpoint.lb_endpoints) {
        const socketAddress = lb.endpoint?.address?.socket_address;
        if (!socketAddress) {
          return false;
        }
        if (socketAddress.port_specifier !== 'port_value') {
          return false;
        }
        if (!(isIPv4(socketAddress.address) || isIPv6(socketAddress.address))) {
          return false;
        }
      }
    }
    return true;
  }

  handleResponses(responses: ResourcePair<ClusterLoadAssignment__Output>[], isV2: boolean): HandleResponseResult {
    const validResponses: ClusterLoadAssignment__Output[] = [];
    let result: HandleResponseResult = {
      accepted: [],
      rejected: [],
      missing: []
    }
    for (const {resource, raw} of responses) {
      if (this.validateResponse(resource)) {
        validResponses.push(resource);
        result.accepted.push({
          name: resource.cluster_name,
          raw: raw});
      } else {
        trace('EDS validation failed for message ' + JSON.stringify(resource));
        result.rejected.push({
          name: resource.cluster_name, 
          raw: raw,
          error: `ClusterLoadAssignment validation failed for resource ${resource.cluster_name}`
        });
      }
    }
    this.latestResponses = validResponses;
    this.latestIsV2 = isV2;
    const allClusterNames: Set<string> = new Set<string>();
    for (const message of validResponses) {
      allClusterNames.add(message.cluster_name);
      const watchers = this.watchers.get(message.cluster_name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message, isV2);
      }
    }
    trace('Received EDS updates for cluster names [' + Array.from(allClusterNames) + ']');
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