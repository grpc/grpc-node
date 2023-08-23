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

import { LoadBalancingConfig, experimental } from "@grpc/grpc-js";
import { LoadBalancingPolicy__Output } from "../generated/envoy/config/cluster/v3/LoadBalancingPolicy";
import { TypedExtensionConfig__Output } from "../generated/envoy/config/core/v3/TypedExtensionConfig";
import { registerLbPolicy } from "../lb-policy-registry";
import { loadProtosWithOptionsSync } from "@grpc/proto-loader/build/src/util";
import { Any__Output } from "../generated/google/protobuf/Any";
import { Struct__Output } from "../generated/google/protobuf/Struct";
import { Value__Output } from "../generated/google/protobuf/Value";
import { TypedStruct__Output } from "../generated/xds/type/v3/TypedStruct";

const XDS_TYPED_STRUCT_TYPE_URL = 'type.googleapis.com/xds.type.v3.TypedStruct';
const UDPA_TYPED_STRUCT_TYPE_URL = 'type.googleapis.com/udpa.type.v1.TypedStruct';

const resourceRoot = loadProtosWithOptionsSync([
  'xds/type/v3/typed_struct.proto',
  'udpa/type/v1/typed_struct.proto'], {
    keepCase: true,
    includeDirs: [
      // Paths are relative to src/build/lb-policy-registry
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

/* xds.type.v3.TypedStruct and udpa.type.v1.TypedStruct have identical interfaces */
function decodeTypedStruct(message: Any__Output): TypedStruct__Output {
  const name = message.type_url.substring(message.type_url.lastIndexOf('/') + 1);
  const type = resourceRoot.lookup(name);
  if (type) {
    const decodedMessage = (type as any).decode(message.value);
    return decodedMessage.$type.toObject(decodedMessage, toObjectOptions) as TypedStruct__Output;
  } else {
    throw new Error(`TypedStruct parsing error: unexpected type URL ${message.type_url}`);
  }
}

type FlatValue = boolean | null | number | string | FlatValue[] | FlatStruct;
interface FlatStruct {
  [key: string]: FlatValue;
}

function flattenValue(value: Value__Output): FlatValue {
  switch (value.kind) {
    case 'boolValue':
      return value.boolValue!;
    case 'listValue':
      return value.listValue!.values.map(flattenValue);
    case 'nullValue':
      return null;
    case 'numberValue':
      return value.numberValue!;
    case 'stringValue':
      return value.stringValue!;
    case 'structValue':
      return flattenStruct(value.structValue!);
    default:
      throw new Error(`Struct parsing error: unexpected value kind ${value.kind}`);
  }
}

function flattenStruct(struct: Struct__Output): FlatStruct {
  const result: FlatStruct = {};
  for (const [key, value] of Object.entries(struct.fields)) {
    result[key] = flattenValue(value);
  }
  return result;
}

function convertToLoadBalancingPolicy(protoPolicy: TypedExtensionConfig__Output, selectChildPolicy: (childPolicy: LoadBalancingPolicy__Output) => LoadBalancingConfig): LoadBalancingConfig | null {
  if (protoPolicy.typed_config?.type_url !== XDS_TYPED_STRUCT_TYPE_URL && protoPolicy.typed_config?.type_url !== UDPA_TYPED_STRUCT_TYPE_URL) {
    throw new Error(`Typed struct LB policy parsing error: unexpected type URL ${protoPolicy.typed_config?.type_url}`);
  }
  const typedStruct = decodeTypedStruct(protoPolicy.typed_config);
  if (!typedStruct.value) {
    throw new Error(`Typed struct LB parsing error: unexpected value ${typedStruct.value}`);
  }
  const policyName = typedStruct.type_url.substring(typedStruct.type_url.lastIndexOf('/') + 1);
  if (!experimental.isLoadBalancerNameRegistered(policyName)) {
    return null;
  }
  return {
    [policyName]: flattenStruct(typedStruct.value)
  };
}

export function setup() {
  registerLbPolicy(XDS_TYPED_STRUCT_TYPE_URL, convertToLoadBalancingPolicy);
  registerLbPolicy(UDPA_TYPED_STRUCT_TYPE_URL, convertToLoadBalancingPolicy);
}
