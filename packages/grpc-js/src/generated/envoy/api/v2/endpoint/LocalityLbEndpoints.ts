// Original file: deps/envoy-api/envoy/api/v2/endpoint/endpoint_components.proto

import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from '../../../../envoy/api/v2/core/Locality';
import { LbEndpoint as _envoy_api_v2_endpoint_LbEndpoint, LbEndpoint__Output as _envoy_api_v2_endpoint_LbEndpoint__Output } from '../../../../envoy/api/v2/endpoint/LbEndpoint';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface LocalityLbEndpoints {
  'locality'?: (_envoy_api_v2_core_Locality);
  'lb_endpoints'?: (_envoy_api_v2_endpoint_LbEndpoint)[];
  'load_balancing_weight'?: (_google_protobuf_UInt32Value);
  'priority'?: (number);
  'proximity'?: (_google_protobuf_UInt32Value);
}

export interface LocalityLbEndpoints__Output {
  'locality': (_envoy_api_v2_core_Locality__Output);
  'lb_endpoints': (_envoy_api_v2_endpoint_LbEndpoint__Output)[];
  'load_balancing_weight': (_google_protobuf_UInt32Value__Output);
  'priority': (number);
  'proximity': (_google_protobuf_UInt32Value__Output);
}
