// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/common/v3/common.proto

import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../../envoy/type/v3/Percent';
import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../../../google/protobuf/UInt64Value';
import type { Long } from '@grpc/proto-loader';

/**
 * Configuration for :ref:`locality weighted load balancing
 * <arch_overview_load_balancing_locality_weighted_lb>`
 */
export interface _envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig {
}

/**
 * Configuration for :ref:`locality weighted load balancing
 * <arch_overview_load_balancing_locality_weighted_lb>`
 */
export interface _envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig__Output {
}

/**
 * Configuration for :ref:`zone aware routing
 * <arch_overview_load_balancing_zone_aware_routing>`.
 */
export interface _envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_ZoneAwareLbConfig {
  /**
   * Configures percentage of requests that will be considered for zone aware routing
   * if zone aware routing is configured. If not specified, the default is 100%.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'routing_enabled'?: (_envoy_type_v3_Percent | null);
  /**
   * Configures minimum upstream cluster size required for zone aware routing
   * If upstream cluster size is less than specified, zone aware routing is not performed
   * even if zone aware routing is configured. If not specified, the default is 6.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'min_cluster_size'?: (_google_protobuf_UInt64Value | null);
  /**
   * If set to true, Envoy will not consider any hosts when the cluster is in :ref:`panic
   * mode<arch_overview_load_balancing_panic_threshold>`. Instead, the cluster will fail all
   * requests as if all hosts are unhealthy. This can help avoid potentially overwhelming a
   * failing service.
   */
  'fail_traffic_on_panic'?: (boolean);
}

/**
 * Configuration for :ref:`zone aware routing
 * <arch_overview_load_balancing_zone_aware_routing>`.
 */
export interface _envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_ZoneAwareLbConfig__Output {
  /**
   * Configures percentage of requests that will be considered for zone aware routing
   * if zone aware routing is configured. If not specified, the default is 100%.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'routing_enabled': (_envoy_type_v3_Percent__Output | null);
  /**
   * Configures minimum upstream cluster size required for zone aware routing
   * If upstream cluster size is less than specified, zone aware routing is not performed
   * even if zone aware routing is configured. If not specified, the default is 6.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'min_cluster_size': (_google_protobuf_UInt64Value__Output | null);
  /**
   * If set to true, Envoy will not consider any hosts when the cluster is in :ref:`panic
   * mode<arch_overview_load_balancing_panic_threshold>`. Instead, the cluster will fail all
   * requests as if all hosts are unhealthy. This can help avoid potentially overwhelming a
   * failing service.
   */
  'fail_traffic_on_panic': (boolean);
}

export interface LocalityLbConfig {
  /**
   * Configuration for local zone aware load balancing.
   */
  'zone_aware_lb_config'?: (_envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_ZoneAwareLbConfig | null);
  /**
   * Enable locality weighted load balancing.
   */
  'locality_weighted_lb_config'?: (_envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig | null);
  'locality_config_specifier'?: "zone_aware_lb_config"|"locality_weighted_lb_config";
}

export interface LocalityLbConfig__Output {
  /**
   * Configuration for local zone aware load balancing.
   */
  'zone_aware_lb_config'?: (_envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_ZoneAwareLbConfig__Output | null);
  /**
   * Enable locality weighted load balancing.
   */
  'locality_weighted_lb_config'?: (_envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig__Output | null);
  'locality_config_specifier': "zone_aware_lb_config"|"locality_weighted_lb_config";
}
