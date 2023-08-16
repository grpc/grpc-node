// Original file: deps/envoy-api/envoy/service/discovery/v3/ads.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { DeltaDiscoveryRequest as _envoy_service_discovery_v3_DeltaDiscoveryRequest, DeltaDiscoveryRequest__Output as _envoy_service_discovery_v3_DeltaDiscoveryRequest__Output } from '../../../../envoy/service/discovery/v3/DeltaDiscoveryRequest';
import type { DeltaDiscoveryResponse as _envoy_service_discovery_v3_DeltaDiscoveryResponse, DeltaDiscoveryResponse__Output as _envoy_service_discovery_v3_DeltaDiscoveryResponse__Output } from '../../../../envoy/service/discovery/v3/DeltaDiscoveryResponse';
import type { DiscoveryRequest as _envoy_service_discovery_v3_DiscoveryRequest, DiscoveryRequest__Output as _envoy_service_discovery_v3_DiscoveryRequest__Output } from '../../../../envoy/service/discovery/v3/DiscoveryRequest';
import type { DiscoveryResponse as _envoy_service_discovery_v3_DiscoveryResponse, DiscoveryResponse__Output as _envoy_service_discovery_v3_DiscoveryResponse__Output } from '../../../../envoy/service/discovery/v3/DiscoveryResponse';

/**
 * See https://github.com/envoyproxy/envoy-api#apis for a description of the role of
 * ADS and how it is intended to be used by a management server. ADS requests
 * have the same structure as their singleton xDS counterparts, but can
 * multiplex many resource types on a single stream. The type_url in the
 * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
 * the multiplexed singleton APIs at the Envoy instance and management server.
 */
export interface AggregatedDiscoveryServiceClient extends grpc.Client {
  DeltaAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DeltaDiscoveryRequest, _envoy_service_discovery_v3_DeltaDiscoveryResponse__Output>;
  DeltaAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DeltaDiscoveryRequest, _envoy_service_discovery_v3_DeltaDiscoveryResponse__Output>;
  deltaAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DeltaDiscoveryRequest, _envoy_service_discovery_v3_DeltaDiscoveryResponse__Output>;
  deltaAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DeltaDiscoveryRequest, _envoy_service_discovery_v3_DeltaDiscoveryResponse__Output>;
  
  /**
   * This is a gRPC-only API.
   */
  StreamAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DiscoveryRequest, _envoy_service_discovery_v3_DiscoveryResponse__Output>;
  StreamAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DiscoveryRequest, _envoy_service_discovery_v3_DiscoveryResponse__Output>;
  /**
   * This is a gRPC-only API.
   */
  streamAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DiscoveryRequest, _envoy_service_discovery_v3_DiscoveryResponse__Output>;
  streamAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_discovery_v3_DiscoveryRequest, _envoy_service_discovery_v3_DiscoveryResponse__Output>;
  
}

/**
 * See https://github.com/envoyproxy/envoy-api#apis for a description of the role of
 * ADS and how it is intended to be used by a management server. ADS requests
 * have the same structure as their singleton xDS counterparts, but can
 * multiplex many resource types on a single stream. The type_url in the
 * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
 * the multiplexed singleton APIs at the Envoy instance and management server.
 */
export interface AggregatedDiscoveryServiceHandlers extends grpc.UntypedServiceImplementation {
  DeltaAggregatedResources: grpc.handleBidiStreamingCall<_envoy_service_discovery_v3_DeltaDiscoveryRequest__Output, _envoy_service_discovery_v3_DeltaDiscoveryResponse>;
  
  /**
   * This is a gRPC-only API.
   */
  StreamAggregatedResources: grpc.handleBidiStreamingCall<_envoy_service_discovery_v3_DiscoveryRequest__Output, _envoy_service_discovery_v3_DiscoveryResponse>;
  
}

export interface AggregatedDiscoveryServiceDefinition extends grpc.ServiceDefinition {
  DeltaAggregatedResources: MethodDefinition<_envoy_service_discovery_v3_DeltaDiscoveryRequest, _envoy_service_discovery_v3_DeltaDiscoveryResponse, _envoy_service_discovery_v3_DeltaDiscoveryRequest__Output, _envoy_service_discovery_v3_DeltaDiscoveryResponse__Output>
  StreamAggregatedResources: MethodDefinition<_envoy_service_discovery_v3_DiscoveryRequest, _envoy_service_discovery_v3_DiscoveryResponse, _envoy_service_discovery_v3_DiscoveryRequest__Output, _envoy_service_discovery_v3_DiscoveryResponse__Output>
}
