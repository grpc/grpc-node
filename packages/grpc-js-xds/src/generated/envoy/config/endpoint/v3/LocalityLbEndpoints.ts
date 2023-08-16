// Original file: deps/envoy-api/envoy/config/endpoint/v3/endpoint_components.proto

import type { Locality as _envoy_config_core_v3_Locality, Locality__Output as _envoy_config_core_v3_Locality__Output } from '../../../../envoy/config/core/v3/Locality';
import type { LbEndpoint as _envoy_config_endpoint_v3_LbEndpoint, LbEndpoint__Output as _envoy_config_endpoint_v3_LbEndpoint__Output } from '../../../../envoy/config/endpoint/v3/LbEndpoint';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { LedsClusterLocalityConfig as _envoy_config_endpoint_v3_LedsClusterLocalityConfig, LedsClusterLocalityConfig__Output as _envoy_config_endpoint_v3_LedsClusterLocalityConfig__Output } from '../../../../envoy/config/endpoint/v3/LedsClusterLocalityConfig';

/**
 * [#not-implemented-hide:]
 * A list of endpoints of a specific locality.
 */
export interface _envoy_config_endpoint_v3_LocalityLbEndpoints_LbEndpointList {
  'lb_endpoints'?: (_envoy_config_endpoint_v3_LbEndpoint)[];
}

/**
 * [#not-implemented-hide:]
 * A list of endpoints of a specific locality.
 */
export interface _envoy_config_endpoint_v3_LocalityLbEndpoints_LbEndpointList__Output {
  'lb_endpoints': (_envoy_config_endpoint_v3_LbEndpoint__Output)[];
}

/**
 * A group of endpoints belonging to a Locality.
 * One can have multiple LocalityLbEndpoints for a locality, but only if
 * they have different priorities.
 * [#next-free-field: 9]
 */
export interface LocalityLbEndpoints {
  /**
   * Identifies location of where the upstream hosts run.
   */
  'locality'?: (_envoy_config_core_v3_Locality | null);
  /**
   * The group of endpoints belonging to the locality specified.
   * [#comment:TODO(adisuissa): Once LEDS is implemented this field needs to be
   * deprecated and replaced by ``load_balancer_endpoints``.]
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
  'load_balancing_weight'?: (_google_protobuf_UInt32Value | null);
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
  'proximity'?: (_google_protobuf_UInt32Value | null);
  /**
   * The group of endpoints belonging to the locality.
   * [#comment:TODO(adisuissa): Once LEDS is implemented the ``lb_endpoints`` field
   * needs to be deprecated.]
   */
  'load_balancer_endpoints'?: (_envoy_config_endpoint_v3_LocalityLbEndpoints_LbEndpointList | null);
  /**
   * LEDS Configuration for the current locality.
   */
  'leds_cluster_locality_config'?: (_envoy_config_endpoint_v3_LedsClusterLocalityConfig | null);
  /**
   * [#not-implemented-hide:]
   */
  'lb_config'?: "load_balancer_endpoints"|"leds_cluster_locality_config";
}

/**
 * A group of endpoints belonging to a Locality.
 * One can have multiple LocalityLbEndpoints for a locality, but only if
 * they have different priorities.
 * [#next-free-field: 9]
 */
export interface LocalityLbEndpoints__Output {
  /**
   * Identifies location of where the upstream hosts run.
   */
  'locality': (_envoy_config_core_v3_Locality__Output | null);
  /**
   * The group of endpoints belonging to the locality specified.
   * [#comment:TODO(adisuissa): Once LEDS is implemented this field needs to be
   * deprecated and replaced by ``load_balancer_endpoints``.]
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
  'load_balancing_weight': (_google_protobuf_UInt32Value__Output | null);
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
  'proximity': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The group of endpoints belonging to the locality.
   * [#comment:TODO(adisuissa): Once LEDS is implemented the ``lb_endpoints`` field
   * needs to be deprecated.]
   */
  'load_balancer_endpoints'?: (_envoy_config_endpoint_v3_LocalityLbEndpoints_LbEndpointList__Output | null);
  /**
   * LEDS Configuration for the current locality.
   */
  'leds_cluster_locality_config'?: (_envoy_config_endpoint_v3_LedsClusterLocalityConfig__Output | null);
  /**
   * [#not-implemented-hide:]
   */
  'lb_config': "load_balancer_endpoints"|"leds_cluster_locality_config";
}
