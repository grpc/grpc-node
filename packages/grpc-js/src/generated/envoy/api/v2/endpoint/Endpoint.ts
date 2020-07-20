// Original file: deps/envoy-api/envoy/api/v2/endpoint/endpoint_components.proto

import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../../envoy/api/v2/core/Address';

/**
 * The optional health check configuration.
 */
export interface _envoy_api_v2_endpoint_Endpoint_HealthCheckConfig {
  /**
   * Optional alternative health check port value.
   * 
   * By default the health check address port of an upstream host is the same
   * as the host's serving address port. This provides an alternative health
   * check port. Setting this with a non-zero value allows an upstream host
   * to have different health check address port.
   */
  'port_value'?: (number);
  /**
   * By default, the host header for L7 health checks is controlled by cluster level configuration
   * (see: :ref:`host <envoy_api_field_core.HealthCheck.HttpHealthCheck.host>` and
   * :ref:`authority <envoy_api_field_core.HealthCheck.GrpcHealthCheck.authority>`). Setting this
   * to a non-empty value allows overriding the cluster level configuration for a specific
   * endpoint.
   */
  'hostname'?: (string);
}

/**
 * The optional health check configuration.
 */
export interface _envoy_api_v2_endpoint_Endpoint_HealthCheckConfig__Output {
  /**
   * Optional alternative health check port value.
   * 
   * By default the health check address port of an upstream host is the same
   * as the host's serving address port. This provides an alternative health
   * check port. Setting this with a non-zero value allows an upstream host
   * to have different health check address port.
   */
  'port_value': (number);
  /**
   * By default, the host header for L7 health checks is controlled by cluster level configuration
   * (see: :ref:`host <envoy_api_field_core.HealthCheck.HttpHealthCheck.host>` and
   * :ref:`authority <envoy_api_field_core.HealthCheck.GrpcHealthCheck.authority>`). Setting this
   * to a non-empty value allows overriding the cluster level configuration for a specific
   * endpoint.
   */
  'hostname': (string);
}

/**
 * Upstream host identifier.
 */
export interface Endpoint {
  /**
   * The upstream host address.
   * 
   * .. attention::
   * 
   * The form of host address depends on the given cluster type. For STATIC or EDS,
   * it is expected to be a direct IP address (or something resolvable by the
   * specified :ref:`resolver <envoy_api_field_core.SocketAddress.resolver_name>`
   * in the Address). For LOGICAL or STRICT DNS, it is expected to be hostname,
   * and will be resolved via DNS.
   */
  'address'?: (_envoy_api_v2_core_Address);
  /**
   * The optional health check configuration is used as configuration for the
   * health checker to contact the health checked host.
   * 
   * .. attention::
   * 
   * This takes into effect only for upstream clusters with
   * :ref:`active health checking <arch_overview_health_checking>` enabled.
   */
  'health_check_config'?: (_envoy_api_v2_endpoint_Endpoint_HealthCheckConfig);
  /**
   * The hostname associated with this endpoint. This hostname is not used for routing or address
   * resolution. If provided, it will be associated with the endpoint, and can be used for features
   * that require a hostname, like
   * :ref:`auto_host_rewrite <envoy_api_field_route.RouteAction.auto_host_rewrite>`.
   */
  'hostname'?: (string);
}

/**
 * Upstream host identifier.
 */
export interface Endpoint__Output {
  /**
   * The upstream host address.
   * 
   * .. attention::
   * 
   * The form of host address depends on the given cluster type. For STATIC or EDS,
   * it is expected to be a direct IP address (or something resolvable by the
   * specified :ref:`resolver <envoy_api_field_core.SocketAddress.resolver_name>`
   * in the Address). For LOGICAL or STRICT DNS, it is expected to be hostname,
   * and will be resolved via DNS.
   */
  'address'?: (_envoy_api_v2_core_Address__Output);
  /**
   * The optional health check configuration is used as configuration for the
   * health checker to contact the health checked host.
   * 
   * .. attention::
   * 
   * This takes into effect only for upstream clusters with
   * :ref:`active health checking <arch_overview_health_checking>` enabled.
   */
  'health_check_config'?: (_envoy_api_v2_endpoint_Endpoint_HealthCheckConfig__Output);
  /**
   * The hostname associated with this endpoint. This hostname is not used for routing or address
   * resolution. If provided, it will be associated with the endpoint, and can be used for features
   * that require a hostname, like
   * :ref:`auto_host_rewrite <envoy_api_field_route.RouteAction.auto_host_rewrite>`.
   */
  'hostname': (string);
}
