// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { DynamicParameterConstraints as _envoy_service_discovery_v3_DynamicParameterConstraints, DynamicParameterConstraints__Output as _envoy_service_discovery_v3_DynamicParameterConstraints__Output } from '../../../../envoy/service/discovery/v3/DynamicParameterConstraints';

/**
 * Specifies a concrete resource name.
 */
export interface ResourceName {
  /**
   * The name of the resource.
   */
  'name'?: (string);
  /**
   * Dynamic parameter constraints associated with this resource. To be used by client-side caches
   * (including xDS proxies) when matching subscribed resource locators.
   */
  'dynamic_parameter_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints | null);
}

/**
 * Specifies a concrete resource name.
 */
export interface ResourceName__Output {
  /**
   * The name of the resource.
   */
  'name': (string);
  /**
   * Dynamic parameter constraints associated with this resource. To be used by client-side caches
   * (including xDS proxies) when matching subscribed resource locators.
   */
  'dynamic_parameter_constraints': (_envoy_service_discovery_v3_DynamicParameterConstraints__Output | null);
}
