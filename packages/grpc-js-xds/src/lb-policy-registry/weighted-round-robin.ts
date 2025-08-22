/*
 * Copyright 2025 gRPC authors.
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

import { LoadBalancingConfig } from "@grpc/grpc-js";
import { LoadBalancingPolicy__Output } from "../generated/envoy/config/cluster/v3/LoadBalancingPolicy";
import { TypedExtensionConfig__Output } from "../generated/envoy/config/core/v3/TypedExtensionConfig";
import { loadProtosWithOptionsSync } from "@grpc/proto-loader/build/src/util";
import { Any__Output } from "../generated/google/protobuf/Any";
import { ClientSideWeightedRoundRobin__Output } from "../generated/envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/ClientSideWeightedRoundRobin";
import { EXPERIMENTAL_WRR_LB } from "../environment";
import { registerLbPolicy } from "../lb-policy-registry";

const WEIGHTED_ROUND_ROBIN_TYPE_URL = 'type.googleapis.com/envoy.extensions.load_balancing_policies.client_side_weighted_round_robin.v3.ClientSideWeightedRoundRobin';

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/load_balancing_policies/client_side_weighted_round_robin/v3/client_side_weighted_round_robin.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build/lb-policy-registry
      __dirname + '/../../../deps/envoy-api/',
      __dirname + '/../../../deps/xds/',
      __dirname + '/../../../deps/protoc-gen-validate'
    ],
  }
);

const toObjectOptions = {
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};

function decodeWeightedRoundRobinConfig(message: Any__Output): ClientSideWeightedRoundRobin__Output {
  const name = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const type = resourceRoot.lookup(name);
  if (type) {
    const decodedMessage = (type as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as ClientSideWeightedRoundRobin__Output;
  } else {
    throw new Error(`TypedStruct parsing error: unexpected type URL ${message.type_url}`);
  }
}

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig | null {
  if (protoPolicy.typed_config?.type_url !== WEIGHTED_ROUND_ROBIN_TYPE_URL) {
    throw new Error(`Pick first LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  const wrrMessage = decodeWeightedRoundRobinConfig(protoPolicy.typed_config);
  return {
    weighted_round_robin: {
      enable_oob_load_report: wrrMessage.enable_oob_load_report?.value,
      oob_load_reporting_period: wrrMessage.oob_reporting_period,
      blackout_period: wrrMessage.blackout_period,
      weight_expiration_period: wrrMessage.weight_expiration_period,
      weight_update_period: wrrMessage.weight_update_period,
      error_utilization_penalty: wrrMessage.error_utilization_penalty?.value
    }
  }
}

export function setup() {
  if (EXPERIMENTAL_WRR_LB) {
    registerLbPolicy(WEIGHTED_ROUND_ROBIN_TYPE_URL, convertToLoadBalancingPolicy);
  }
}
