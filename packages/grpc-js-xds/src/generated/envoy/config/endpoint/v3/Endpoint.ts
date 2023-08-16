// Original file: deps/envoy-api/envoy/config/endpoint/v3/endpoint_components.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';

/**
 * The optional health check configuration.
 */
export interface _envoy_config_endpoint_v3_Endpoint_HealthCheckConfig {
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
   * (see: :ref:`host <envoy_v3_api_field_config.core.v3.HealthCheck.HttpHealthCheck.host>` and
   * :ref:`authority <envoy_v3_api_field_config.core.v3.HealthCheck.GrpcHealthCheck.authority>`). Setting this
   * to a non-empty value allows overriding the cluster level configuration for a specific
   * endpoint.
   */
  'hostname'?: (string);
  /**
   * Optional alternative health check host address.
   * 
   * .. attention::
   * 
   * The form of the health check host address is expected to be a direct IP address.
   */
  'address'?: (_envoy_config_core_v3_Address | null);
  /**
   * Optional flag to control if perform active health check for this endpoint.
   * Active health check is enabled by default if there is a health checker.
   */
  'disable_active_health_check'?: (boolean);
}

/**
 * The optional health check configuration.
 */
export interface _envoy_config_endpoint_v3_Endpoint_HealthCheckConfig__Output {
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
   * (see: :ref:`host <envoy_v3_api_field_config.core.v3.HealthCheck.HttpHealthCheck.host>` and
   * :ref:`authority <envoy_v3_api_field_config.core.v3.HealthCheck.GrpcHealthCheck.authority>`). Setting this
   * to a non-empty value allows overriding the cluster level configuration for a specific
   * endpoint.
   */
  'hostname': (string);
  /**
   * Optional alternative health check host address.
   * 
   * .. attention::
   * 
   * The form of the health check host address is expected to be a direct IP address.
   */
  'address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * Optional flag to control if perform active health check for this endpoint.
   * Active health check is enabled by default if there is a health checker.
   */
  'disable_active_health_check': (boolean);
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
   * specified :ref:`resolver <envoy_v3_api_field_config.core.v3.SocketAddress.resolver_name>`
   * in the Address). For LOGICAL or STRICT DNS, it is expected to be hostname,
   * and will be resolved via DNS.
   */
  'address'?: (_envoy_config_core_v3_Address | null);
  /**
   * The optional health check configuration is used as configuration for the
   * health checker to contact the health checked host.
   * 
   * .. attention::
   * 
   * This takes into effect only for upstream clusters with
   * :ref:`active health checking <arch_overview_health_checking>` enabled.
   */
  'health_check_config'?: (_envoy_config_endpoint_v3_Endpoint_HealthCheckConfig | null);
  /**
   * The hostname associated with this endpoint. This hostname is not used for routing or address
   * resolution. If provided, it will be associated with the endpoint, and can be used for features
   * that require a hostname, like
   * :ref:`auto_host_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.auto_host_rewrite>`.
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
   * specified :ref:`resolver <envoy_v3_api_field_config.core.v3.SocketAddress.resolver_name>`
   * in the Address). For LOGICAL or STRICT DNS, it is expected to be hostname,
   * and will be resolved via DNS.
   */
  'address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * The optional health check configuration is used as configuration for the
   * health checker to contact the health checked host.
   * 
   * .. attention::
   * 
   * This takes into effect only for upstream clusters with
   * :ref:`active health checking <arch_overview_health_checking>` enabled.
   */
  'health_check_config': (_envoy_config_endpoint_v3_Endpoint_HealthCheckConfig__Output | null);
  /**
   * The hostname associated with this endpoint. This hostname is not used for routing or address
   * resolution. If provided, it will be associated with the endpoint, and can be used for features
   * that require a hostname, like
   * :ref:`auto_host_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.auto_host_rewrite>`.
   */
  'hostname': (string);
}
