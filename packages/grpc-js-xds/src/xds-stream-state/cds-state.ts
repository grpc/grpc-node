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
import { Cluster__Output } from "../generated/envoy/api/v2/Cluster";
import { EdsState } from "./eds-state";
import { Watcher, XdsStreamState } from "./xds-stream-state";

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
    for (const message of this.latestResponses) {
      if (message.name === clusterName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          trace('Reporting existing CDS update for new watcher for clusterName ' + clusterName);
          watcher.onValidUpdate(message);
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
  private handleMissingNames(allClusterNames: Set<string>) {
    for (const [clusterName, watcherList] of this.watchers.entries()) {
      if (!allClusterNames.has(clusterName)) {
        trace('Reporting CDS resource does not exist for clusterName ' + clusterName);
        for (const watcher of watcherList) {
          watcher.onResourceDoesNotExist();
        }
      }
    }
  }

  handleResponses(responses: Cluster__Output[]): string | null {
    for (const message of responses) {
      if (!this.validateResponse(message)) {
        trace('CDS validation failed for message ' + JSON.stringify(message));
        return 'CDS Error: Cluster validation failed';
      }
    }
    this.latestResponses = responses;
    const allEdsServiceNames: Set<string> = new Set<string>();
    const allClusterNames: Set<string> = new Set<string>();
    for (const message of responses) {
      allClusterNames.add(message.name);
      const edsServiceName = message.eds_cluster_config?.service_name ?? '';
      allEdsServiceNames.add(
        edsServiceName === '' ? message.name : edsServiceName
      );
      const watchers = this.watchers.get(message.name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message);
      }
    }
    trace('Received CDS updates for cluster names ' + Array.from(allClusterNames));
    this.handleMissingNames(allClusterNames);
    this.edsState.handleMissingNames(allEdsServiceNames);
    return null;
  }

  reportStreamError(status: StatusObject): void {
    for (const watcherList of this.watchers.values()) {
      for (const watcher of watcherList) {
        watcher.onTransientError(status);
      }
    }
  }
}