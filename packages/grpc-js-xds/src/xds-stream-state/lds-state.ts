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

import * as protoLoader from '@grpc/proto-loader';
import { experimental, logVerbosity, StatusObject } from "@grpc/grpc-js";
import { Listener__Output } from "../generated/envoy/api/v2/Listener";
import { RdsState } from "./rds-state";
import { Watcher, XdsStreamState } from "./xds-stream-state";
import { HttpConnectionManager__Output } from '../generated/envoy/config/filter/network/http_connection_manager/v2/HttpConnectionManager';

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const HTTP_CONNECTION_MANGER_TYPE_URL =
  'type.googleapis.com/envoy.config.filter.network.http_connection_manager.v2.HttpConnectionManager';

export class LdsState implements XdsStreamState<Listener__Output> {
  versionInfo = '';
  nonce = '';

  private watchers: Map<string, Watcher<Listener__Output>[]> = new Map<string, Watcher<Listener__Output>[]>();
  private latestResponses: Listener__Output[] = [];

  constructor(private rdsState: RdsState, private updateResourceNames: () => void) {}

  addWatcher(targetName: string, watcher: Watcher<Listener__Output>) {
    trace('Adding RDS watcher for targetName ' + targetName);
    let watchersEntry = this.watchers.get(targetName);
    let addedServiceName = false;
    if (watchersEntry === undefined) {
      addedServiceName = true;
      watchersEntry = [];
      this.watchers.set(targetName, watchersEntry);
    }
    watchersEntry.push(watcher);

    /* If we have already received an update for the requested edsServiceName,
     * immediately pass that update along to the watcher */
    for (const message of this.latestResponses) {
      if (message.name === targetName) {
        /* These updates normally occur asynchronously, so we ensure that
         * the same happens here */
        process.nextTick(() => {
          trace('Reporting existing RDS update for new watcher for targetName ' + targetName);
          watcher.onValidUpdate(message);
        });
      }
    }
    if (addedServiceName) {
      this.updateResourceNames();
    }
  }

  removeWatcher(targetName: string, watcher: Watcher<Listener__Output>): void {
    trace('Removing RDS watcher for targetName ' + targetName);
    const watchersEntry = this.watchers.get(targetName);
    let removedServiceName = false;
    if (watchersEntry !== undefined) {
      const entryIndex = watchersEntry.indexOf(watcher);
      if (entryIndex >= 0) {
        watchersEntry.splice(entryIndex, 1);
      }
      if (watchersEntry.length === 0) {
        removedServiceName = true;
        this.watchers.delete(targetName);
      }
    }
    if (removedServiceName) {
      this.updateResourceNames();
    }
  }

  getResourceNames(): string[] {
    return Array.from(this.watchers.keys());
  }

  private validateResponse(message: Listener__Output): boolean {
    if (
      !(
        message.api_listener?.api_listener &&
        protoLoader.isAnyExtension(message.api_listener.api_listener) &&
        message.api_listener?.api_listener['@type'] ===
          HTTP_CONNECTION_MANGER_TYPE_URL
      )
    ) {
      return false;
    }
    const httpConnectionManager = message.api_listener
      ?.api_listener as protoLoader.AnyExtension &
      HttpConnectionManager__Output;
    switch (httpConnectionManager.route_specifier) {
      case 'rds':
        return !!httpConnectionManager.rds?.config_source?.ads;
      case 'route_config':
        return this.rdsState.validateResponse(httpConnectionManager.route_config!);
    }
    return false;
  }

  private handleMissingNames(allTargetNames: Set<string>) {
    for (const [targetName, watcherList] of this.watchers.entries()) {
      if (!allTargetNames.has(targetName)) {
        for (const watcher of watcherList) {
          watcher.onResourceDoesNotExist();
        }
      }
    }
  }

  handleResponses(responses: Listener__Output[]): string | null {
    for (const message of responses) {
      if (!this.validateResponse(message)) {
        trace('LDS validation failed for message ' + JSON.stringify(message));
        return 'LDS Error: Route validation failed';
      }
    }
    this.latestResponses = responses;
    const allTargetNames = new Set<string>();
    for (const message of responses) {
      allTargetNames.add(message.name);
      const watchers = this.watchers.get(message.name) ?? [];
      for (const watcher of watchers) {
        watcher.onValidUpdate(message);
      }
    }
    trace('Received RDS response with route config names ' + Array.from(allTargetNames));
    this.handleMissingNames(allTargetNames);
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