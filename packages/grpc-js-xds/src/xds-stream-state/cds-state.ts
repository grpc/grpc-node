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

import { EXPERIMENTAL_OUTLIER_DETECTION } from "../environment";
import { Cluster__Output } from "../generated/envoy/config/cluster/v3/Cluster";
import { Duration__Output } from "../generated/google/protobuf/Duration";
import { UInt32Value__Output } from "../generated/google/protobuf/UInt32Value";
import { CLUSTER_CONFIG_TYPE_URL, decodeSingleResource } from "../resources";
import { BaseXdsStreamState, XdsStreamState } from "./xds-stream-state";

export class CdsState extends BaseXdsStreamState<Cluster__Output> implements XdsStreamState<Cluster__Output> {
  protected isStateOfTheWorld(): boolean {
    return true;
  }
  protected getResourceName(resource: Cluster__Output): string {
    return resource.name;
  }
  protected getProtocolName(): string {
    return 'CDS';
  }

  private validateNonnegativeDuration(duration: Duration__Output | null): boolean {
    if (!duration) {
      return true;
    }
    /* The maximum values here come from the official Protobuf documentation:
     * https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Duration
     */
    return Number(duration.seconds) >= 0 && 
           Number(duration.seconds) <= 315_576_000_000 &&
           duration.nanos >= 0 &&
           duration.nanos <= 999_999_999;
  }

  private validatePercentage(percentage: UInt32Value__Output | null): boolean {
    if (!percentage) {
      return true;
    }
    return percentage.value >=0 && percentage.value <= 100;
  }

  public validateResponse(message: Cluster__Output): boolean {
    if (message.cluster_discovery_type === 'cluster_type') {
      if (!(message.cluster_type?.typed_config && message.cluster_type.typed_config.type_url === CLUSTER_CONFIG_TYPE_URL)) {
        return false;
      }
      const clusterConfig = decodeSingleResource(CLUSTER_CONFIG_TYPE_URL, message.cluster_type.typed_config.value);
      if (clusterConfig.clusters.length === 0) {
        return false;
      }
    } else {
      if (message.type === 'EDS') {
        if (!message.eds_cluster_config?.eds_config?.ads) {
          return false;
        }
      } else if (message.type === 'LOGICAL_DNS') {
        if (!message.load_assignment) {
          return false;
        }
        if (message.load_assignment.endpoints.length !== 1) {
          return false;
        }
        if (message.load_assignment.endpoints[0].lb_endpoints.length !== 1) {
          return false;
        }
        const socketAddress = message.load_assignment.endpoints[0].lb_endpoints[0].endpoint?.address?.socket_address;
        if (!socketAddress) {
          return false;
        }
        if (socketAddress.address === '') {
          return false;
        }
        if (socketAddress.port_specifier !== 'port_value') {
          return false;
        }
      }
    }
    if (message.lb_policy !== 'ROUND_ROBIN') {
      return false;
    }
    if (message.lrs_server) {
      if (!message.lrs_server.self) {
        return false;
      }
    }
    if (EXPERIMENTAL_OUTLIER_DETECTION) {
      if (message.outlier_detection) {
        if (!this.validateNonnegativeDuration(message.outlier_detection.interval)) {
          return false;
        }
        if (!this.validateNonnegativeDuration(message.outlier_detection.base_ejection_time)) {
          return false;
        }
        if (!this.validateNonnegativeDuration(message.outlier_detection.max_ejection_time)) {
          return false;
        }
        if (!this.validatePercentage(message.outlier_detection.max_ejection_percent)) {
          return false;
        }
        if (!this.validatePercentage(message.outlier_detection.enforcing_success_rate)) {
          return false;
        }
        if (!this.validatePercentage(message.outlier_detection.failure_percentage_threshold)) {
          return false;
        }
        if (!this.validatePercentage(message.outlier_detection.enforcing_failure_percentage)) {
          return false;
        }
      }
    }
    return true;
  }
}