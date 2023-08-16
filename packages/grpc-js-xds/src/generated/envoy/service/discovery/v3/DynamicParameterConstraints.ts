// Original file: deps/envoy-api/envoy/service/discovery/v3/discovery.proto

import type { DynamicParameterConstraints as _envoy_service_discovery_v3_DynamicParameterConstraints, DynamicParameterConstraints__Output as _envoy_service_discovery_v3_DynamicParameterConstraints__Output } from '../../../../envoy/service/discovery/v3/DynamicParameterConstraints';

export interface _envoy_service_discovery_v3_DynamicParameterConstraints_ConstraintList {
  'constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints)[];
}

export interface _envoy_service_discovery_v3_DynamicParameterConstraints_ConstraintList__Output {
  'constraints': (_envoy_service_discovery_v3_DynamicParameterConstraints__Output)[];
}

export interface _envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint_Exists {
}

export interface _envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint_Exists__Output {
}

/**
 * A single constraint for a given key.
 */
export interface _envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint {
  /**
   * The key to match against.
   */
  'key'?: (string);
  /**
   * Matches this exact value.
   */
  'value'?: (string);
  /**
   * Key is present (matches any value except for the key being absent).
   * This allows setting a default constraint for clients that do
   * not send a key at all, while there may be other clients that need
   * special configuration based on that key.
   */
  'exists'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint_Exists | null);
  'constraint_type'?: "value"|"exists";
}

/**
 * A single constraint for a given key.
 */
export interface _envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint__Output {
  /**
   * The key to match against.
   */
  'key': (string);
  /**
   * Matches this exact value.
   */
  'value'?: (string);
  /**
   * Key is present (matches any value except for the key being absent).
   * This allows setting a default constraint for clients that do
   * not send a key at all, while there may be other clients that need
   * special configuration based on that key.
   */
  'exists'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint_Exists__Output | null);
  'constraint_type': "value"|"exists";
}

/**
 * A set of dynamic parameter constraints associated with a variant of an individual xDS resource.
 * These constraints determine whether the resource matches a subscription based on the set of
 * dynamic parameters in the subscription, as specified in the
 * :ref:`ResourceLocator.dynamic_parameters<envoy_v3_api_field_service.discovery.v3.ResourceLocator.dynamic_parameters>`
 * field. This allows xDS implementations (clients, servers, and caching proxies) to determine
 * which variant of a resource is appropriate for a given client.
 */
export interface DynamicParameterConstraints {
  /**
   * A single constraint to evaluate.
   */
  'constraint'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint | null);
  /**
   * A list of constraints that match if any one constraint in the list
   * matches.
   */
  'or_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_ConstraintList | null);
  /**
   * A list of constraints that must all match.
   */
  'and_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_ConstraintList | null);
  /**
   * The inverse (NOT) of a set of constraints.
   */
  'not_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints | null);
  'type'?: "constraint"|"or_constraints"|"and_constraints"|"not_constraints";
}

/**
 * A set of dynamic parameter constraints associated with a variant of an individual xDS resource.
 * These constraints determine whether the resource matches a subscription based on the set of
 * dynamic parameters in the subscription, as specified in the
 * :ref:`ResourceLocator.dynamic_parameters<envoy_v3_api_field_service.discovery.v3.ResourceLocator.dynamic_parameters>`
 * field. This allows xDS implementations (clients, servers, and caching proxies) to determine
 * which variant of a resource is appropriate for a given client.
 */
export interface DynamicParameterConstraints__Output {
  /**
   * A single constraint to evaluate.
   */
  'constraint'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_SingleConstraint__Output | null);
  /**
   * A list of constraints that match if any one constraint in the list
   * matches.
   */
  'or_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_ConstraintList__Output | null);
  /**
   * A list of constraints that must all match.
   */
  'and_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints_ConstraintList__Output | null);
  /**
   * The inverse (NOT) of a set of constraints.
   */
  'not_constraints'?: (_envoy_service_discovery_v3_DynamicParameterConstraints__Output | null);
  'type': "constraint"|"or_constraints"|"and_constraints"|"not_constraints";
}
