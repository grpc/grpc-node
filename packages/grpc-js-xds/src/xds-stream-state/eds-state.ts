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
import { Locality__Output } from "../generated/envoy/config/core/v3/Locality";
import { SocketAddress__Output } from "../generated/envoy/config/core/v3/SocketAddress";
import { ClusterLoadAssignment__Output } from "../generated/envoy/config/endpoint/v3/ClusterLoadAssignment";
import { Any__Output } from "../generated/google/protobuf/Any";
import { BaseXdsStreamState, HandleResponseResult, RejectedResourceEntry, ResourcePair, Watcher, XdsStreamState } from "./xds-stream-state";

const TRACER_NAME = 'xds_client';

const UINT32_MAX = 0xFFFFFFFF;

function trace(text: string): void {
  experimental.trace(logVerbosity.DEBUG, TRACER_NAME, text);
}

function localitiesEqual(a: Locality__Output, b: Locality__Output) {
  return a.region === b.region && a.sub_zone === b.sub_zone && a.zone === b.zone;
}

function addressesEqual(a: SocketAddress__Output, b: SocketAddress__Output) {
  return a.address === b.address && a.port_value === b.port_value;
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
    const seenLocalities: {locality: Locality__Output, priority: number}[] = [];
    const seenAddresses: SocketAddress__Output[] = [];
    const priorityTotalWeights: Map<number,  number> = new Map();
    for (const endpoint of message.endpoints) {
      if (!endpoint.locality) {
        return false;
      }
      for (const {locality, priority} of seenLocalities) {
        if (localitiesEqual(endpoint.locality, locality) && endpoint.priority === priority) {
          return false;
        }
      }
      seenLocalities.push({locality: endpoint.locality, priority: endpoint.priority});
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
        for (const address of seenAddresses) {
          if (addressesEqual(socketAddress, address)) {
            return false;
          }
        }
        seenAddresses.push(socketAddress);
      }
      priorityTotalWeights.set(endpoint.priority, (priorityTotalWeights.get(endpoint.priority) ?? 0) + (endpoint.load_balancing_weight?.value ?? 0));
    }
    for (const totalWeight of priorityTotalWeights.values()) {
      if (totalWeight > UINT32_MAX) {
        return false;
      }
    }
    for (const priority of priorityTotalWeights.keys()) {
      if (priority > 0 && !priorityTotalWeights.has(priority - 1)) {
        return false;
      }
    }
    return true;
  }
}