// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';

export interface _envoy_api_v2_LoadBalancingPolicy_Policy {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
}

export interface _envoy_api_v2_LoadBalancingPolicy_Policy__Output {
  'name': (string);
  'config': (_google_protobuf_Struct__Output);
  'typed_config': (_google_protobuf_Any__Output);
}

export interface LoadBalancingPolicy {
  'policies'?: (_envoy_api_v2_LoadBalancingPolicy_Policy)[];
}

export interface LoadBalancingPolicy__Output {
  'policies': (_envoy_api_v2_LoadBalancingPolicy_Policy__Output)[];
}
