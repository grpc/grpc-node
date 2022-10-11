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

import { experimental, logVerbosity } from "@grpc/grpc-js";
import { Listener__Output } from '../generated/envoy/config/listener/v3/Listener';
import { RdsState } from "./rds-state";
import { BaseXdsStreamState, XdsStreamState } from "./xds-stream-state";
import { decodeSingleResource, HTTP_CONNECTION_MANGER_TYPE_URL_V2, HTTP_CONNECTION_MANGER_TYPE_URL_V3 } from '../resources';
import { getTopLevelFilterUrl, validateTopLevelFilter } from '../http-filter';
import { EXPERIMENTAL_FAULT_INJECTION } from '../environment';

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

const ROUTER_FILTER_URL = 'type.googleapis.com/envoy.extensions.filters.http.router.v3.Router';

export class LdsState extends BaseXdsStreamState<Listener__Output> implements XdsStreamState<Listener__Output> {
  protected getResourceName(resource: Listener__Output): string {
    return resource.name;
  }
  protected getProtocolName(): string {
    return 'LDS';
  }
  protected isStateOfTheWorld(): boolean {
    return true;
  }

  constructor(private rdsState: RdsState, updateResourceNames: () => void) {
    super(updateResourceNames);
  }

  public validateResponse(message: Listener__Output, isV2: boolean): boolean {
    if (
      !(
        message.api_listener?.api_listener &&
        (message.api_listener.api_listener.type_url === HTTP_CONNECTION_MANGER_TYPE_URL_V2 ||
          message.api_listener.api_listener.type_url === HTTP_CONNECTION_MANGER_TYPE_URL_V3)
      )
    ) {
      return false;
    }
    const httpConnectionManager = decodeSingleResource(HTTP_CONNECTION_MANGER_TYPE_URL_V3, message.api_listener!.api_listener.value);
    if (!isV2 && EXPERIMENTAL_FAULT_INJECTION) {
      const filterNames = new Set<string>();
      for (const [index, httpFilter] of httpConnectionManager.http_filters.entries()) {
        if (filterNames.has(httpFilter.name)) {
          trace('LDS response validation failed: duplicate HTTP filter name ' + httpFilter.name);
          return false;
        }
        filterNames.add(httpFilter.name);
        if (!validateTopLevelFilter(httpFilter)) {
          trace('LDS response validation failed: ' + httpFilter.name + ' filter validation failed');
          return false;
        }
        /* Validate that the last filter, and only the last filter, is the
         * router filter. */
        const filterUrl = getTopLevelFilterUrl(httpFilter.typed_config!)
        if (index < httpConnectionManager.http_filters.length - 1) {
          if (filterUrl === ROUTER_FILTER_URL) {
            trace('LDS response validation failed: router filter is before end of list');
            return false;
          }
        } else {
          if (filterUrl !== ROUTER_FILTER_URL) {
            trace('LDS response validation failed: final filter is ' + filterUrl);
            return false;
          }
        }
      }
    }
    switch (httpConnectionManager.route_specifier) {
      case 'rds':
        return !!httpConnectionManager.rds?.config_source?.ads;
      case 'route_config':
        return this.rdsState.validateResponse(httpConnectionManager.route_config!, isV2);
    }
    return false;
  }
}