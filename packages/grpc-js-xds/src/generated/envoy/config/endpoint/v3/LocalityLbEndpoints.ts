// Original file: deps/envoy-api/envoy/config/endpoint/v3/endpoint_components.proto

import type { Locality as _envoy_config_core_v3_Locality, Locality__Output as _envoy_config_core_v3_Locality__Output } from '../../../../envoy/config/core/v3/Locality';
import type { LbEndpoint as _envoy_config_endpoint_v3_LbEndpoint, LbEndpoint__Output as _envoy_config_endpoint_v3_LbEndpoint__Output } from '../../../../envoy/config/endpoint/v3/LbEndpoint';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * A group of endpoints belonging to a Locality.
 * One can have multiple LocalityLbEndpoints for a locality, but this is
 * generally only done if the different groups need to have different load
 * balancing weights or different priorities.
 * [#next-free-field: 7]
 */
export interface LocalityLbEndpoints {
  /**
   * Identifies location of where the upstream hosts run.
   */
  'locality'?: (_envoy_config_core_v3_Locality);
  /**
   * The group of endpoints belonging to the locality specified.
   */
  'lb_endpoints'?: (_envoy_config_endpoint_v3_LbEndpoint)[];
  /**
   * Optional: Per priority/region/zone/sub_zone weight; at least 1. The load
   * balancing weight for a locality is divided by the sum of the weights of all
   * localities  at the same priority level to produce the effective percentage
   * of traffic for the locality. The sum of the weights of all localities at
   * the same priority level must not exceed uint32_t maximal value (4294967295).
   * 
   * Locality weights are only considered when :ref:`locality weighted load
   * balancing <arch_overview_load_balancing_locality_weighted_lb>` is
   * configured. These weights are ignored otherwise. If no weights are
   * specified when locality weighted load balancing is enabled, the locality is
   * assigned no load.
   */
  'load_balancing_weight'?: (_google_protobuf_UInt32Value);
  /**
   * Optional: the priority for this LocalityLbEndpoints. If unspecified this will
   * default to the highest priority (0).
   * 
   * Under usual circumstances, Envoy will only select endpoints for the highest
   * priority (0). In the event all endpoints for a particular priority are
   * unavailable/unhealthy, Envoy will fail over to selecting endpoints for the
   * next highest priority group.
   * 
   * Priorities should range from 0 (highest) to N (lowest) without skipping.
   */
  'priority'?: (number);
  /**
   * Optional: Per locality proximity value which indicates how close this
   * locality is from the source locality. This value only provides ordering
   * information (lower the value, closer it is to the source locality).
   * This will be consumed by load balancing schemes that need proximity order
   * to determine where to route the requests.
   * [#not-implemented-hide:]
   */
  'proximity'?: (_google_protobuf_UInt32Value);
}

/**
 * A group of endpoints belonging to a Locality.
 * One can have multiple LocalityLbEndpoints for a locality, but this is
 * generally only done if the different groups need to have different load
 * balancing weights or different priorities.
 * [#next-free-field: 7]
 */
export interface LocalityLbEndpoints__Output {
  /**
   * Identifies location of where the upstream hosts run.
   */
  'locality'?: (_envoy_config_core_v3_Locality__Output);
  /**
   * The group of endpoints belonging to the locality specified.
   */
  'lb_endpoints': (_envoy_config_endpoint_v3_LbEndpoint__Output)[];
  /**
   * Optional: Per priority/region/zone/sub_zone weight; at least 1. The load
   * balancing weight for a locality is divided by the sum of the weights of all
   * localities  at the same priority level to produce the effective percentage
   * of traffic for the locality. The sum of the weights of all localities at
   * the same priority level must not exceed uint32_t maximal value (4294967295).
   * 
   * Locality weights are only considered when :ref:`locality weighted load
   * balancing <arch_overview_load_balancing_locality_weighted_lb>` is
   * configured. These weights are ignored otherwise. If no weights are
   * specified when locality weighted load balancing is enabled, the locality is
   * assigned no load.
   */
  'load_balancing_weight'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Optional: the priority for this LocalityLbEndpoints. If unspecified this will
   * default to the highest priority (0).
   * 
   * Under usual circumstances, Envoy will only select endpoints for the highest
   * priority (0). In the event all endpoints for a particular priority are
   * unavailable/unhealthy, Envoy will fail over to selecting endpoints for the
   * next highest priority group.
   * 
   * Priorities should range from 0 (highest) to N (lowest) without skipping.
   */
  'priority': (number);
  /**
   * Optional: Per locality proximity value which indicates how close this
   * locality is from the source locality. This value only provides ordering
   * information (lower the value, closer it is to the source locality).
   * This will be consumed by load balancing schemes that need proximity order
   * to determine where to route the requests.
   * [#not-implemented-hide:]
   */
  'proximity'?: (_google_protobuf_UInt32Value__Output);
}
