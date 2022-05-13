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
import { BaseXdsStreamState, HandleResponseResult, RejectedResourceEntry, ResourcePair, Watcher, XdsStreamState } from "./xds-stream-state";

const TRACER_NAME = 'xds_client';

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

export class EdsState extends BaseXdsStreamState<ClusterLoadAssignment__Output> implements XdsStreamState<ClusterLoadAssignment__Output> {
  protected getResourceName(resource: ClusterLoadAssignment__Output): string {
    return resource.cluster_name;
  }
  protected getProtocolName(): string {
    return 'EDS';
  }
  protected isStateOfTheWorld(): boolean {
    return false;
  }

  /**
   * Validate the ClusterLoadAssignment object by these rules:
   * https://github.com/grpc/proposal/blob/master/A27-xds-global-load-balancing.md#clusterloadassignment-proto
   * @param message
   */
  public validateResponse(message: ClusterLoadAssignment__Output) {
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
}