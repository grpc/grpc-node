// Original file: deps/envoy-api/envoy/api/v2/core/event_service_config.proto

import { GrpcService as _envoy_api_v2_core_GrpcService, GrpcService__Output as _envoy_api_v2_core_GrpcService__Output } from '../../../../envoy/api/v2/core/GrpcService';

export interface EventServiceConfig {
  'grpc_service'?: (_envoy_api_v2_core_GrpcService);
  'config_source_specifier'?: "grpc_service";
}

export interface EventServiceConfig__Output {
  'grpc_service'?: (_envoy_api_v2_core_GrpcService__Output);
  'config_source_specifier': "grpc_service";
}
