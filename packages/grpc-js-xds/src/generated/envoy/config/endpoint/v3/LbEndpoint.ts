// Original file: deps/envoy-api/envoy/config/endpoint/v3/endpoint_components.proto

import type { Endpoint as _envoy_config_endpoint_v3_Endpoint, Endpoint__Output as _envoy_config_endpoint_v3_Endpoint__Output } from '../../../../envoy/config/endpoint/v3/Endpoint';
import type { HealthStatus as _envoy_config_core_v3_HealthStatus } from '../../../../envoy/config/core/v3/HealthStatus';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * An Endpoint that Envoy can route traffic to.
 * [#next-free-field: 6]
 */
export interface LbEndpoint {
  'endpoint'?: (_envoy_config_endpoint_v3_Endpoint | null);
  /**
   * Optional health status when known and supplied by EDS server.
   */
  'health_status'?: (_envoy_config_core_v3_HealthStatus | keyof typeof _envoy_config_core_v3_HealthStatus);
  /**
   * The endpoint metadata specifies values that may be used by the load
   * balancer to select endpoints in a cluster for a given request. The filter
   * name should be specified as ``envoy.lb``. An example boolean key-value pair
   * is ``canary``, providing the optional canary status of the upstream host.
   * This may be matched against in a route's
   * :ref:`RouteAction <envoy_v3_api_msg_config.route.v3.RouteAction>` metadata_match field
   * to subset the endpoints considered in cluster load balancing.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * The optional load balancing weight of the upstream host; at least 1.
   * Envoy uses the load balancing weight in some of the built in load
   * balancers. The load balancing weight for an endpoint is divided by the sum
   * of the weights of all endpoints in the endpoint's locality to produce a
   * percentage of traffic for the endpoint. This percentage is then further
   * weighted by the endpoint's locality's load balancing weight from
   * LocalityLbEndpoints. If unspecified, will be treated as 1. The sum
   * of the weights of all endpoints in the endpoint's locality must not
   * exceed uint32_t maximal value (4294967295).
   */
  'load_balancing_weight'?: (_google_protobuf_UInt32Value | null);
  /**
   * [#not-implemented-hide:]
   */
  'endpoint_name'?: (string);
  /**
   * Upstream host identifier or a named reference.
   */
  'host_identifier'?: "endpoint"|"endpoint_name";
}

/**
 * An Endpoint that Envoy can route traffic to.
 * [#next-free-field: 6]
 */
export interface LbEndpoint__Output {
  'endpoint'?: (_envoy_config_endpoint_v3_Endpoint__Output | null);
  /**
   * Optional health status when known and supplied by EDS server.
   */
  'health_status': (keyof typeof _envoy_config_core_v3_HealthStatus);
  /**
   * The endpoint metadata specifies values that may be used by the load
   * balancer to select endpoints in a cluster for a given request. The filter
   * name should be specified as ``envoy.lb``. An example boolean key-value pair
   * is ``canary``, providing the optional canary status of the upstream host.
   * This may be matched against in a route's
   * :ref:`RouteAction <envoy_v3_api_msg_config.route.v3.RouteAction>` metadata_match field
   * to subset the endpoints considered in cluster load balancing.
   */
  'metadata': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * The optional load balancing weight of the upstream host; at least 1.
   * Envoy uses the load balancing weight in some of the built in load
   * balancers. The load balancing weight for an endpoint is divided by the sum
   * of the weights of all endpoints in the endpoint's locality to produce a
   * percentage of traffic for the endpoint. This percentage is then further
   * weighted by the endpoint's locality's load balancing weight from
   * LocalityLbEndpoints. If unspecified, will be treated as 1. The sum
   * of the weights of all endpoints in the endpoint's locality must not
   * exceed uint32_t maximal value (4294967295).
   */
  'load_balancing_weight': (_google_protobuf_UInt32Value__Output | null);
  /**
   * [#not-implemented-hide:]
   */
  'endpoint_name'?: (string);
  /**
   * Upstream host identifier or a named reference.
   */
  'host_identifier': "endpoint"|"endpoint_name";
}
