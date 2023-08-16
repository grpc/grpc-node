// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/wrr_locality/v3/wrr_locality.proto

import type { LoadBalancingPolicy as _envoy_config_cluster_v3_LoadBalancingPolicy, LoadBalancingPolicy__Output as _envoy_config_cluster_v3_LoadBalancingPolicy__Output } from '../../../../../envoy/config/cluster/v3/LoadBalancingPolicy';

/**
 * Configuration for the wrr_locality LB policy. See the :ref:`load balancing architecture overview
 * <arch_overview_load_balancing_types>` for more information.
 */
export interface WrrLocality {
  /**
   * The child LB policy to create for endpoint-picking within the chosen locality.
   */
  'endpoint_picking_policy'?: (_envoy_config_cluster_v3_LoadBalancingPolicy | null);
}

/**
 * Configuration for the wrr_locality LB policy. See the :ref:`load balancing architecture overview
 * <arch_overview_load_balancing_types>` for more information.
 */
export interface WrrLocality__Output {
  /**
   * The child LB policy to create for endpoint-picking within the chosen locality.
   */
  'endpoint_picking_policy': (_envoy_config_cluster_v3_LoadBalancingPolicy__Output | null);
}
