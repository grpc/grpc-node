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

// https://github.com/grpc/proposal/blob/master/A62-pick-first.md#pick_first-via-xds-1

import { LoadBalancingConfig } from "@grpc/grpc-js";
import { LoadBalancingPolicy__Output } from "../generated/envoy/config/cluster/v3/LoadBalancingPolicy";
import { TypedExtensionConfig__Output } from "../generated/envoy/config/core/v3/TypedExtensionConfig";
import { loadProtosWithOptionsSync } from "@grpc/proto-loader/build/src/util";
import { Any__Output } from "../generated/google/protobuf/Any";
import { PickFirst__Output } from "../generated/envoy/extensions/load_balancing_policies/pick_first/v3/PickFirst";
import { EXPERIMENTAL_PICK_FIRST } from "../environment";
import { registerLbPolicy } from "../lb-policy-registry";

const PICK_FIRST_TYPE_URL = 'type.googleapis.com/envoy.extensions.load_balancing_policies.pick_first.v3.PickFirst';

const resourceRoot = loadProtosWithOptionsSync([
  'envoy/extensions/load_balancing_policies/pick_first/v3/pick_first.proto'], {
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

function decodePickFirstConfig(message: Any__Output): PickFirst__Output {
  const name = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const type = resourceRoot.lookup(name);
  if (type) {
    const decodedMessage = (type as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as PickFirst__Output;
  } else {
    throw new Error(`TypedStruct parsing error: unexpected type URL ${message.type_url}`);
  }
}

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig | null {
  if (protoPolicy.typed_config?.type_url !== PICK_FIRST_TYPE_URL) {
    throw new Error(`Pick first LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  const pickFirstMessage = decodePickFirstConfig(protoPolicy.typed_config);
  return {
    pick_first: {
      shuffleAddressList: pickFirstMessage.shuffle_address_list
    }
  };
}

export function setup() {
  if (EXPERIMENTAL_PICK_FIRST) {
    registerLbPolicy(PICK_FIRST_TYPE_URL, convertToLoadBalancingPolicy);
  }
}
