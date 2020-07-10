// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { GrpcService as _envoy_api_v2_core_GrpcService, GrpcService__Output as _envoy_api_v2_core_GrpcService__Output } from '../../../../envoy/api/v2/core/GrpcService';
import { RateLimitSettings as _envoy_api_v2_core_RateLimitSettings, RateLimitSettings__Output as _envoy_api_v2_core_RateLimitSettings__Output } from '../../../../envoy/api/v2/core/RateLimitSettings';
import { ApiVersion as _envoy_api_v2_core_ApiVersion } from '../../../../envoy/api/v2/core/ApiVersion';

// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

export enum _envoy_api_v2_core_ApiConfigSource_ApiType {
  UNSUPPORTED_REST_LEGACY = 0,
  REST = 1,
  GRPC = 2,
  DELTA_GRPC = 3,
}

export interface ApiConfigSource {
  'api_type'?: (_envoy_api_v2_core_ApiConfigSource_ApiType | keyof typeof _envoy_api_v2_core_ApiConfigSource_ApiType);
  'cluster_names'?: (string)[];
  'refresh_delay'?: (_google_protobuf_Duration);
  'grpc_services'?: (_envoy_api_v2_core_GrpcService)[];
  'request_timeout'?: (_google_protobuf_Duration);
  'rate_limit_settings'?: (_envoy_api_v2_core_RateLimitSettings);
  'set_node_on_first_message_only'?: (boolean);
  'transport_api_version'?: (_envoy_api_v2_core_ApiVersion | keyof typeof _envoy_api_v2_core_ApiVersion);
}

export interface ApiConfigSource__Output {
  'api_type': (keyof typeof _envoy_api_v2_core_ApiConfigSource_ApiType);
  'cluster_names': (string)[];
  'refresh_delay': (_google_protobuf_Duration__Output);
  'grpc_services': (_envoy_api_v2_core_GrpcService__Output)[];
  'request_timeout': (_google_protobuf_Duration__Output);
  'rate_limit_settings': (_envoy_api_v2_core_RateLimitSettings__Output);
  'set_node_on_first_message_only': (boolean);
  'transport_api_version': (keyof typeof _envoy_api_v2_core_ApiVersion);
}
