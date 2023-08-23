/*
 * Copyright 2023 gRPC authors.
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

// https://github.com/grpc/proposal/blob/master/A52-xds-custom-lb-policies.md

import { LoadBalancingConfig } from "@grpc/grpc-js";
import { LoadBalancingPolicy__Output } from "../generated/envoy/config/cluster/v3/LoadBalancingPolicy";
import { TypedExtensionConfig__Output } from "../generated/envoy/config/core/v3/TypedExtensionConfig";
import { registerLbPolicy } from "../lb-policy-registry";

const ROUND_ROBIN_TYPE_URL = 'type.googleapis.com/envoy.extensions.load_balancing_policies.round_robin.v3.RoundRobin';

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig {
  if (protoPolicy.typed_config?.type_url !== ROUND_ROBIN_TYPE_URL) {
    throw new Error(`Round robin LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  return {
    round_robin: {}
  };
}

export function setup() {
  registerLbPolicy(ROUND_ROBIN_TYPE_URL, convertToLoadBalancingPolicy);
}
