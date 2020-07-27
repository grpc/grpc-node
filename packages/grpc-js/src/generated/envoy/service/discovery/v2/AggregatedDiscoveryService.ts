// Original file: deps/envoy-api/envoy/service/discovery/v2/ads.proto

import * as grpc from '../../../../../index'
import { DeltaDiscoveryRequest as _envoy_api_v2_DeltaDiscoveryRequest, DeltaDiscoveryRequest__Output as _envoy_api_v2_DeltaDiscoveryRequest__Output } from '../../../../envoy/api/v2/DeltaDiscoveryRequest';
import { DeltaDiscoveryResponse as _envoy_api_v2_DeltaDiscoveryResponse, DeltaDiscoveryResponse__Output as _envoy_api_v2_DeltaDiscoveryResponse__Output } from '../../../../envoy/api/v2/DeltaDiscoveryResponse';
import { DiscoveryRequest as _envoy_api_v2_DiscoveryRequest, DiscoveryRequest__Output as _envoy_api_v2_DiscoveryRequest__Output } from '../../../../envoy/api/v2/DiscoveryRequest';
import { DiscoveryResponse as _envoy_api_v2_DiscoveryResponse, DiscoveryResponse__Output as _envoy_api_v2_DiscoveryResponse__Output } from '../../../../envoy/api/v2/DiscoveryResponse';

/**
 * See https://github.com/lyft/envoy-api#apis for a description of the role of
 * ADS and how it is intended to be used by a management server. ADS requests
 * have the same structure as their singleton xDS counterparts, but can
 * multiplex many resource types on a single stream. The type_url in the
 * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
 * the multiplexed singleton APIs at the Envoy instance and management server.
 */
export interface AggregatedDiscoveryServiceClient extends grpc.Client {
  DeltaAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DeltaDiscoveryRequest, _envoy_api_v2_DeltaDiscoveryResponse__Output>;
  DeltaAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DeltaDiscoveryRequest, _envoy_api_v2_DeltaDiscoveryResponse__Output>;
  deltaAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DeltaDiscoveryRequest, _envoy_api_v2_DeltaDiscoveryResponse__Output>;
  deltaAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DeltaDiscoveryRequest, _envoy_api_v2_DeltaDiscoveryResponse__Output>;
  
  /**
   * This is a gRPC-only API.
   */
  StreamAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DiscoveryRequest, _envoy_api_v2_DiscoveryResponse__Output>;
  StreamAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DiscoveryRequest, _envoy_api_v2_DiscoveryResponse__Output>;
  /**
   * This is a gRPC-only API.
   */
  streamAggregatedResources(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DiscoveryRequest, _envoy_api_v2_DiscoveryResponse__Output>;
  streamAggregatedResources(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_api_v2_DiscoveryRequest, _envoy_api_v2_DiscoveryResponse__Output>;
  
}

/**
 * See https://github.com/lyft/envoy-api#apis for a description of the role of
 * ADS and how it is intended to be used by a management server. ADS requests
 * have the same structure as their singleton xDS counterparts, but can
 * multiplex many resource types on a single stream. The type_url in the
 * DiscoveryRequest/DiscoveryResponse provides sufficient information to recover
 * the multiplexed singleton APIs at the Envoy instance and management server.
 */
export interface AggregatedDiscoveryServiceHandlers {
  DeltaAggregatedResources(call: grpc.ServerDuplexStream<_envoy_api_v2_DeltaDiscoveryRequest, _envoy_api_v2_DeltaDiscoveryResponse__Output>): void;
  
  /**
   * This is a gRPC-only API.
   */
  StreamAggregatedResources(call: grpc.ServerDuplexStream<_envoy_api_v2_DiscoveryRequest, _envoy_api_v2_DiscoveryResponse__Output>): void;
  
}
