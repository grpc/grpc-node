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
import { registerLbPolicy } from "../lb-policy-registry";
import { WrrLocality__Output } from "../generated/envoy/extensions/load_balancing_policies/wrr_locality/v3/WrrLocality";

const WRR_LOCALITY_TYPE_URL = 'envoy.extensions.load_balancing_policies.wrr_locality.v3.WrrLocality';

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality.proto'], {
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
}

function decodePickFirstConfig(message: Any__Output): WrrLocality__Output {
  const name = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const type = resourceRoot.lookup(name);
  if (type) {
    const decodedMessage = (type as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as WrrLocality__Output;
  } else {
    throw new Error(`WRR Locality parsing error: unexpected type URL ${message.type_url}`);
  }
}

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig | null {
  if (protoPolicy.typed_config?.type_url !== WRR_LOCALITY_TYPE_URL) {
    throw new Error(`WRR Locality LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  const wrrLocalityMessage = decodePickFirstConfig(protoPolicy.typed_config);
  if (!wrrLocalityMessage.endpoint_picking_policy) {
    throw new Error('WRR Locality LB policy parsing error: no endpoint_picking_policy set');
  }
  return {
    wrr_locality: {
      shuffleAddressList: selectChildPolicy(wrrLocalityMessage.endpoint_picking_policy)
    }
  };
}

export function setup() {
  registerLbPolicy(WRR_LOCALITY_TYPE_URL, convertToLoadBalancingPolicy);
}
