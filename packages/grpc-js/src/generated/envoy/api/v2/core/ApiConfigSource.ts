// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { GrpcService as _envoy_api_v2_core_GrpcService, GrpcService__Output as _envoy_api_v2_core_GrpcService__Output } from '../../../../envoy/api/v2/core/GrpcService';
import { RateLimitSettings as _envoy_api_v2_core_RateLimitSettings, RateLimitSettings__Output as _envoy_api_v2_core_RateLimitSettings__Output } from '../../../../envoy/api/v2/core/RateLimitSettings';
import { ApiVersion as _envoy_api_v2_core_ApiVersion } from '../../../../envoy/api/v2/core/ApiVersion';

// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

/**
 * APIs may be fetched via either REST or gRPC.
 */
export enum _envoy_api_v2_core_ApiConfigSource_ApiType {
  /**
   * Ideally this would be 'reserved 0' but one can't reserve the default
   * value. Instead we throw an exception if this is ever used.
   */
  UNSUPPORTED_REST_LEGACY = 0,
  /**
   * REST-JSON v2 API. The `canonical JSON encoding
   * <https://developers.google.com/protocol-buffers/docs/proto3#json>`_ for
   * the v2 protos is used.
   */
  REST = 1,
  /**
   * gRPC v2 API.
   */
  GRPC = 2,
  /**
   * Using the delta xDS gRPC service, i.e. DeltaDiscovery{Request,Response}
   * rather than Discovery{Request,Response}. Rather than sending Envoy the entire state
   * with every update, the xDS server only sends what has changed since the last update.
   */
  DELTA_GRPC = 3,
}

/**
 * API configuration source. This identifies the API type and cluster that Envoy
 * will use to fetch an xDS API.
 * [#next-free-field: 9]
 */
export interface ApiConfigSource {
  /**
   * API type (gRPC, REST, delta gRPC)
   */
  'api_type'?: (_envoy_api_v2_core_ApiConfigSource_ApiType | keyof typeof _envoy_api_v2_core_ApiConfigSource_ApiType);
  /**
   * Cluster names should be used only with REST. If > 1
   * cluster is defined, clusters will be cycled through if any kind of failure
   * occurs.
   * 
   * .. note::
   * 
   * The cluster with name ``cluster_name`` must be statically defined and its
   * type must not be ``EDS``.
   */
  'cluster_names'?: (string)[];
  /**
   * For REST APIs, the delay between successive polls.
   */
  'refresh_delay'?: (_google_protobuf_Duration);
  /**
   * Multiple gRPC services be provided for GRPC. If > 1 cluster is defined,
   * services will be cycled through if any kind of failure occurs.
   */
  'grpc_services'?: (_envoy_api_v2_core_GrpcService)[];
  /**
   * For REST APIs, the request timeout. If not set, a default value of 1s will be used.
   */
  'request_timeout'?: (_google_protobuf_Duration);
  /**
   * For GRPC APIs, the rate limit settings. If present, discovery requests made by Envoy will be
   * rate limited.
   */
  'rate_limit_settings'?: (_envoy_api_v2_core_RateLimitSettings);
  /**
   * Skip the node identifier in subsequent discovery requests for streaming gRPC config types.
   */
  'set_node_on_first_message_only'?: (boolean);
  /**
   * API version for xDS transport protocol. This describes the xDS gRPC/REST
   * endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.
   */
  'transport_api_version'?: (_envoy_api_v2_core_ApiVersion | keyof typeof _envoy_api_v2_core_ApiVersion);
}

/**
 * API configuration source. This identifies the API type and cluster that Envoy
 * will use to fetch an xDS API.
 * [#next-free-field: 9]
 */
export interface ApiConfigSource__Output {
  /**
   * API type (gRPC, REST, delta gRPC)
   */
  'api_type': (keyof typeof _envoy_api_v2_core_ApiConfigSource_ApiType);
  /**
   * Cluster names should be used only with REST. If > 1
   * cluster is defined, clusters will be cycled through if any kind of failure
   * occurs.
   * 
   * .. note::
   * 
   * The cluster with name ``cluster_name`` must be statically defined and its
   * type must not be ``EDS``.
   */
  'cluster_names': (string)[];
  /**
   * For REST APIs, the delay between successive polls.
   */
  'refresh_delay'?: (_google_protobuf_Duration__Output);
  /**
   * Multiple gRPC services be provided for GRPC. If > 1 cluster is defined,
   * services will be cycled through if any kind of failure occurs.
   */
  'grpc_services': (_envoy_api_v2_core_GrpcService__Output)[];
  /**
   * For REST APIs, the request timeout. If not set, a default value of 1s will be used.
   */
  'request_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * For GRPC APIs, the rate limit settings. If present, discovery requests made by Envoy will be
   * rate limited.
   */
  'rate_limit_settings'?: (_envoy_api_v2_core_RateLimitSettings__Output);
  /**
   * Skip the node identifier in subsequent discovery requests for streaming gRPC config types.
   */
  'set_node_on_first_message_only': (boolean);
  /**
   * API version for xDS transport protocol. This describes the xDS gRPC/REST
   * endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.
   */
  'transport_api_version': (keyof typeof _envoy_api_v2_core_ApiVersion);
}
