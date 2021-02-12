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
import { XdsStreamState } from "./xds-stream-state";
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

  constructor(private targetName: string, private rdsState: RdsState) {}

  getResourceNames(): string[] {
    return [this.targetName];
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
        return true;
    }
    return false;
  }

  handleResponses(responses: Listener__Output[]): string | null {
    trace('Received LDS update with names ' + responses.map(message => message.name));
    for (const message of responses) {
      if (message.name === this.targetName) {
        if (this.validateResponse(message)) {
          // The validation step ensures that this is correct
          const httpConnectionManager = message.api_listener!
            .api_listener as protoLoader.AnyExtension &
            HttpConnectionManager__Output;
          switch (httpConnectionManager.route_specifier) {
            case 'rds':
              trace('Received LDS update with RDS route config name ' + httpConnectionManager.rds!.route_config_name);
              this.rdsState.setRouteConfigName(
                httpConnectionManager.rds!.route_config_name
              );
              break;
            case 'route_config':
              trace('Received LDS update with route configuration');
              this.rdsState.setRouteConfigName(null);
              this.rdsState.handleSingleMessage(
                httpConnectionManager.route_config!
              );
              break;
            default:
            // The validation rules should prevent this
          }
        } else {
          trace('LRS validation error for message ' + JSON.stringify(message));
          return 'LRS Error: Listener validation failed';
        }
      }
    }
    return null;
  }

  reportStreamError(status: StatusObject): void {
    // Nothing to do here
  }
}