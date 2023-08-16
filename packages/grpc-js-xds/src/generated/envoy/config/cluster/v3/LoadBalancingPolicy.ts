// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

export interface _envoy_config_cluster_v3_LoadBalancingPolicy_Policy {
  /**
   * [#extension-category: envoy.load_balancing_policies]
   */
  'typed_extension_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
}

export interface _envoy_config_cluster_v3_LoadBalancingPolicy_Policy__Output {
  /**
   * [#extension-category: envoy.load_balancing_policies]
   */
  'typed_extension_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
}

/**
 * Extensible load balancing policy configuration.
 * 
 * Every LB policy defined via this mechanism will be identified via a unique name using reverse
 * DNS notation. If the policy needs configuration parameters, it must define a message for its
 * own configuration, which will be stored in the config field. The name of the policy will tell
 * clients which type of message they should expect to see in the config field.
 * 
 * Note that there are cases where it is useful to be able to independently select LB policies
 * for choosing a locality and for choosing an endpoint within that locality. For example, a
 * given deployment may always use the same policy to choose the locality, but for choosing the
 * endpoint within the locality, some clusters may use weighted-round-robin, while others may
 * use some sort of session-based balancing.
 * 
 * This can be accomplished via hierarchical LB policies, where the parent LB policy creates a
 * child LB policy for each locality. For each request, the parent chooses the locality and then
 * delegates to the child policy for that locality to choose the endpoint within the locality.
 * 
 * To facilitate this, the config message for the top-level LB policy may include a field of
 * type LoadBalancingPolicy that specifies the child policy.
 */
export interface LoadBalancingPolicy {
  /**
   * Each client will iterate over the list in order and stop at the first policy that it
   * supports. This provides a mechanism for starting to use new LB policies that are not yet
   * supported by all clients.
   */
  'policies'?: (_envoy_config_cluster_v3_LoadBalancingPolicy_Policy)[];
}

/**
 * Extensible load balancing policy configuration.
 * 
 * Every LB policy defined via this mechanism will be identified via a unique name using reverse
 * DNS notation. If the policy needs configuration parameters, it must define a message for its
 * own configuration, which will be stored in the config field. The name of the policy will tell
 * clients which type of message they should expect to see in the config field.
 * 
 * Note that there are cases where it is useful to be able to independently select LB policies
 * for choosing a locality and for choosing an endpoint within that locality. For example, a
 * given deployment may always use the same policy to choose the locality, but for choosing the
 * endpoint within the locality, some clusters may use weighted-round-robin, while others may
 * use some sort of session-based balancing.
 * 
 * This can be accomplished via hierarchical LB policies, where the parent LB policy creates a
 * child LB policy for each locality. For each request, the parent chooses the locality and then
 * delegates to the child policy for that locality to choose the endpoint within the locality.
 * 
 * To facilitate this, the config message for the top-level LB policy may include a field of
 * type LoadBalancingPolicy that specifies the child policy.
 */
export interface LoadBalancingPolicy__Output {
  /**
   * Each client will iterate over the list in order and stop at the first policy that it
   * supports. This provides a mechanism for starting to use new LB policies that are not yet
   * supported by all clients.
   */
  'policies': (_envoy_config_cluster_v3_LoadBalancingPolicy_Policy__Output)[];
}
