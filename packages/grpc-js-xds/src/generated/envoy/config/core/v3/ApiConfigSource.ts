// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { GrpcService as _envoy_config_core_v3_GrpcService, GrpcService__Output as _envoy_config_core_v3_GrpcService__Output } from '../../../../envoy/config/core/v3/GrpcService';
import type { RateLimitSettings as _envoy_config_core_v3_RateLimitSettings, RateLimitSettings__Output as _envoy_config_core_v3_RateLimitSettings__Output } from '../../../../envoy/config/core/v3/RateLimitSettings';
import type { ApiVersion as _envoy_config_core_v3_ApiVersion } from '../../../../envoy/config/core/v3/ApiVersion';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

/**
 * APIs may be fetched via either REST or gRPC.
 */
export enum _envoy_config_core_v3_ApiConfigSource_ApiType {
  /**
   * Ideally this would be 'reserved 0' but one can't reserve the default
   * value. Instead we throw an exception if this is ever used.
   */
  DEPRECATED_AND_UNAVAILABLE_DO_NOT_USE = 0,
  /**
   * REST-JSON v2 API. The `canonical JSON encoding
   * <https://developers.google.com/protocol-buffers/docs/proto3#json>`_ for
   * the v2 protos is used.
   */
  REST = 1,
  /**
   * SotW gRPC service.
   */
  GRPC = 2,
  /**
   * Using the delta xDS gRPC service, i.e. DeltaDiscovery{Request,Response}
   * rather than Discovery{Request,Response}. Rather than sending Envoy the entire state
   * with every update, the xDS server only sends what has changed since the last update.
   */
  DELTA_GRPC = 3,
  /**
   * SotW xDS gRPC with ADS. All resources which resolve to this configuration source will be
   * multiplexed on a single connection to an ADS endpoint.
   * [#not-implemented-hide:]
   */
  AGGREGATED_GRPC = 5,
  /**
   * Delta xDS gRPC with ADS. All resources which resolve to this configuration source will be
   * multiplexed on a single connection to an ADS endpoint.
   * [#not-implemented-hide:]
   */
  AGGREGATED_DELTA_GRPC = 6,
}

/**
 * API configuration source. This identifies the API type and cluster that Envoy
 * will use to fetch an xDS API.
 * [#next-free-field: 10]
 */
export interface ApiConfigSource {
  /**
   * API type (gRPC, REST, delta gRPC)
   */
  'api_type'?: (_envoy_config_core_v3_ApiConfigSource_ApiType | keyof typeof _envoy_config_core_v3_ApiConfigSource_ApiType);
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
  'refresh_delay'?: (_google_protobuf_Duration | null);
  /**
   * Multiple gRPC services be provided for GRPC. If > 1 cluster is defined,
   * services will be cycled through if any kind of failure occurs.
   */
  'grpc_services'?: (_envoy_config_core_v3_GrpcService)[];
  /**
   * For REST APIs, the request timeout. If not set, a default value of 1s will be used.
   */
  'request_timeout'?: (_google_protobuf_Duration | null);
  /**
   * For GRPC APIs, the rate limit settings. If present, discovery requests made by Envoy will be
   * rate limited.
   */
  'rate_limit_settings'?: (_envoy_config_core_v3_RateLimitSettings | null);
  /**
   * Skip the node identifier in subsequent discovery requests for streaming gRPC config types.
   */
  'set_node_on_first_message_only'?: (boolean);
  /**
   * API version for xDS transport protocol. This describes the xDS gRPC/REST
   * endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.
   */
  'transport_api_version'?: (_envoy_config_core_v3_ApiVersion | keyof typeof _envoy_config_core_v3_ApiVersion);
  /**
   * A list of config validators that will be executed when a new update is
   * received from the ApiConfigSource. Note that each validator handles a
   * specific xDS service type, and only the validators corresponding to the
   * type url (in ``:ref: DiscoveryResponse`` or ``:ref: DeltaDiscoveryResponse``)
   * will be invoked.
   * If the validator returns false or throws an exception, the config will be rejected by
   * the client, and a NACK will be sent.
   * [#extension-category: envoy.config.validators]
   */
  'config_validators'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
}

/**
 * API configuration source. This identifies the API type and cluster that Envoy
 * will use to fetch an xDS API.
 * [#next-free-field: 10]
 */
export interface ApiConfigSource__Output {
  /**
   * API type (gRPC, REST, delta gRPC)
   */
  'api_type': (keyof typeof _envoy_config_core_v3_ApiConfigSource_ApiType);
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
  'refresh_delay': (_google_protobuf_Duration__Output | null);
  /**
   * Multiple gRPC services be provided for GRPC. If > 1 cluster is defined,
   * services will be cycled through if any kind of failure occurs.
   */
  'grpc_services': (_envoy_config_core_v3_GrpcService__Output)[];
  /**
   * For REST APIs, the request timeout. If not set, a default value of 1s will be used.
   */
  'request_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * For GRPC APIs, the rate limit settings. If present, discovery requests made by Envoy will be
   * rate limited.
   */
  'rate_limit_settings': (_envoy_config_core_v3_RateLimitSettings__Output | null);
  /**
   * Skip the node identifier in subsequent discovery requests for streaming gRPC config types.
   */
  'set_node_on_first_message_only': (boolean);
  /**
   * API version for xDS transport protocol. This describes the xDS gRPC/REST
   * endpoint and version of [Delta]DiscoveryRequest/Response used on the wire.
   */
  'transport_api_version': (keyof typeof _envoy_config_core_v3_ApiVersion);
  /**
   * A list of config validators that will be executed when a new update is
   * received from the ApiConfigSource. Note that each validator handles a
   * specific xDS service type, and only the validators corresponding to the
   * type url (in ``:ref: DiscoveryResponse`` or ``:ref: DeltaDiscoveryResponse``)
   * will be invoked.
   * If the validator returns false or throws an exception, the config will be rejected by
   * the client, and a NACK will be sent.
   * [#extension-category: envoy.config.validators]
   */
  'config_validators': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
}
