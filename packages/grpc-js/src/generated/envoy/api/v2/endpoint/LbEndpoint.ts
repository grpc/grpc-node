// Original file: deps/envoy-api/envoy/api/v2/endpoint/endpoint_components.proto

import { Endpoint as _envoy_api_v2_endpoint_Endpoint, Endpoint__Output as _envoy_api_v2_endpoint_Endpoint__Output } from '../../../../envoy/api/v2/endpoint/Endpoint';
import { HealthStatus as _envoy_api_v2_core_HealthStatus } from '../../../../envoy/api/v2/core/HealthStatus';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface LbEndpoint {
  'endpoint'?: (_envoy_api_v2_endpoint_Endpoint);
  'health_status'?: (_envoy_api_v2_core_HealthStatus | keyof typeof _envoy_api_v2_core_HealthStatus);
  'metadata'?: (_envoy_api_v2_core_Metadata);
  'load_balancing_weight'?: (_google_protobuf_UInt32Value);
  'endpoint_name'?: (string);
  'host_identifier'?: "endpoint"|"endpoint_name";
}

export interface LbEndpoint__Output {
  'endpoint'?: (_envoy_api_v2_endpoint_Endpoint__Output);
  'health_status': (keyof typeof _envoy_api_v2_core_HealthStatus);
  'metadata': (_envoy_api_v2_core_Metadata__Output);
  'load_balancing_weight': (_google_protobuf_UInt32Value__Output);
  'endpoint_name'?: (string);
  'host_identifier': "endpoint"|"endpoint_name";
}
