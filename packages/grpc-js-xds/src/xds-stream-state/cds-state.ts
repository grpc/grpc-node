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
import { Cluster__Output } from "../generated/envoy/config/cluster/v3/Cluster";
import { Any__Output } from "../generated/google/protobuf/Any";
import { EdsState } from "./eds-state";
import { HandleResponseResult, RejectedResourceEntry, ResourcePair, Watcher, XdsStreamState } from "./xds-stream-state";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export class CdsState implements XdsStreamState<Cluster__Output> {
  versionInfo = '';
  nonce = '';

  private watchers: Map<string, Watcher<Cluster__Output>[]> = new Map<
    string,
    Watcher<Cluster__Output>[]
  >();

  private latestResponses: Cluster__Output[] = [];
  private latestIsV2 = false;

  constructor(
    private edsState: EdsState,
    private updateResourceNames: () => void
  ) {}

  /**
   * Add the watcher to the watcher list. Returns true if the list of resource
   * names has changed, and false otherwise.
   * @param clusterName
   * @param watcher
   */
  addWatcher(clusterName: string, watcher: Watcher<Cluster__Output>): void {
    trace('Adding CDS watcher for clusterName ' + clusterName);
    let watchersEntry = this.watchers.get(clusterName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.watchers.set(clusterName, watchersEntry);
    }
    watchersEntry.push(watcher);

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    const isV2 = this.latestIsV2;
    for (const message of this.latestResponses) {
      if (message.name === clusterName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          trace('Reporting existing CDS update for new watcher for clusterName ' + clusterName);
          watcher.onValidUpdate(message, isV2);
        });
      }
    }
    if (addedServiceName) {
      this.updateResourceNames();
    }
  }

  removeWatcher(clusterName: string, watcher: Watcher<Cluster__Output>): void {
    trace('Removing CDS watcher for clusterName ' + clusterName);
    const watchersEntry = this.watchers.get(clusterName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.watchers.delete(clusterName);
      }
    }
    if (removedServiceName) {
      this.updateResourceNames();
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.watchers.keys());
  }

  private validateResponse(message: Cluster__Output): boolean {
    if (message.type !== 'EDS') {
      return false;
    }
    if (!message.eds_cluster_config?.eds_config?.ads) {
      return false;
    }
    if (message.lb_policy !== 'ROUND_ROBIN') {
      return false;
    }
    if (message.lrs_server) {
      if (!message.lrs_server.self) {
        return false;
      }
    }
    return true;
  }

  /**
   * Given a list of clusterNames (which may actually be the cluster name),
   * for each watcher watching a name not on the list, call that watcher's
   * onResourceDoesNotExist method.
   * @param allClusterNames
   */
  private handleMissingNames(allClusterNames: Set<string>): string[] {
    const missingNames: string[] = [];
    for (const [clusterName, watcherList] of this.watchers.entries()) {
      if (!allClusterNames.has(clusterName)) {
        trace('Reporting CDS resource does not exist for clusterName ' + clusterName);
        missingNames.push(clusterName);
        for (const watcher of watcherList) {
          watcher.onResourceDoesNotExist();
        }
      }
    }
    return missingNames;
  }

  handleResponses(responses: ResourcePair<Cluster__Output>[], isV2: boolean): HandleResponseResult {
    const validResponses: Cluster__Output[] = [];
    const result: HandleResponseResult = {
      accepted: [],
      rejected: [],
      missing: []
    }
    for (const {resource, raw} of responses) {
      if (this.validateResponse(resource)) {
        validResponses.push(resource);
        result.accepted.push({
          name: resource.name, 
          raw: raw});
      } else {
        trace('CDS validation failed for message ' + JSON.stringify(resource));
        result.rejected.push({
          name: resource.name, 
          raw: raw,
          error: `Cluster validation failed for resource ${resource.name}`
        });
      }
    }
    this.latestResponses = validResponses;
    this.latestIsV2 = isV2;
    const allClusterNames: Set<string> = new Set<string>();
    for (const message of validResponses) {
      allClusterNames.add(message.name);
      const watchers = this.watchers.get(message.name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message, isV2);
      }
    }
    trace('Received CDS updates for cluster names [' + Array.from(allClusterNames) + ']');
    result.missing = this.handleMissingNames(allClusterNames);
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