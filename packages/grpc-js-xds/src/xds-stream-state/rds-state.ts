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
import { RouteConfiguration__Output } from "../generated/envoy/api/v2/RouteConfiguration";
import { CdsLoadBalancingConfig } from "../load-balancer-cds";
import { Watcher, XdsStreamState } from "./xds-stream-state";
import ServiceConfig = experimental.ServiceConfig;

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export class RdsState implements XdsStreamState<RouteConfiguration__Output> {
  versionInfo = '';
  nonce = '';

  private routeConfigName: string | null = null;

  constructor(
    private targetName: string,
    private watcher: Watcher<ServiceConfig>,
    private updateResouceNames: () => void
  ) {}

  getResourceNames(): string[] {
    return this.routeConfigName ? [this.routeConfigName] : [];
  }

  handleSingleMessage(message: RouteConfiguration__Output) {
    for (const virtualHost of message.virtual_hosts) {
      if (virtualHost.domains.indexOf(this.targetName) >= 0) {
        const route = virtualHost.routes[virtualHost.routes.length - 1];
        if (route.match?.prefix === '' && route.route?.cluster) {
          trace('Reporting RDS update for host ' + this.targetName + ' with cluster ' + route.route.cluster);
          this.watcher.onValidUpdate({
            methodConfig: [],
            loadBalancingConfig: [
              new CdsLoadBalancingConfig(route.route.cluster)
            ],
          });
          return;
        } else {
          trace('Discarded matching route with prefix ' + route.match?.prefix + ' and cluster ' + route.route?.cluster);
        }
      }
    }
    trace('Reporting RDS resource does not exist from domain lists ' + message.virtual_hosts.map(virtualHost => virtualHost.domains));
    /* If none of the routes match the one we are looking for, bubble up an
     * error. */
    this.watcher.onResourceDoesNotExist();
  }

  handleResponses(responses: RouteConfiguration__Output[]): string | null {
    trace('Received RDS response with route config names ' + responses.map(message => message.name));
    if (this.routeConfigName !== null) {
      for (const message of responses) {
        if (message.name === this.routeConfigName) {
          this.handleSingleMessage(message);
          return null;
        }
      }
    }
    return null;
  }

  setRouteConfigName(name: string | null) {
    const oldName = this.routeConfigName;
    this.routeConfigName = name;
    if (name !== oldName) {
      this.updateResouceNames();
    }
  }

  reportStreamError(status: StatusObject): void {
    this.watcher.onTransientError(status);
  }
}