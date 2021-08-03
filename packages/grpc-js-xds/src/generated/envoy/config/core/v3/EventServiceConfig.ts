// Original file: deps/envoy-api/envoy/config/core/v3/event_service_config.proto

import type { GrpcService as _envoy_config_core_v3_GrpcService, GrpcService__Output as _envoy_config_core_v3_GrpcService__Output } from '../../../../envoy/config/core/v3/GrpcService';

/**
 * [#not-implemented-hide:]
 * Configuration of the event reporting service endpoint.
 */
export interface EventServiceConfig {
  /**
   * Specifies the gRPC service that hosts the event reporting service.
   */
  'grpc_service'?: (_envoy_config_core_v3_GrpcService | null);
  'config_source_specifier'?: "grpc_service";
}

/**
 * [#not-implemented-hide:]
 * Configuration of the event reporting service endpoint.
 */
export interface EventServiceConfig__Output {
  /**
   * Specifies the gRPC service that hosts the event reporting service.
   */
  'grpc_service'?: (_envoy_config_core_v3_GrpcService__Output | null);
  'config_source_specifier': "grpc_service";
}
