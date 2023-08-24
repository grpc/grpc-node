// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * A simple wrapper for an HTTP filter config. This is intended to be used as a wrapper for the
 * map value in
 * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`,
 * :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>`,
 * or :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`
 * to add additional flags to the filter.
 */
export interface FilterConfig {
  /**
   * The filter config.
   */
  'config'?: (_google_protobuf_Any | null);
  /**
   * If true, the filter is optional, meaning that if the client does
   * not support the specified filter, it may ignore the map entry rather
   * than rejecting the config.
   */
  'is_optional'?: (boolean);
  /**
   * If true, the filter is disabled in the route or virtual host and the ``config`` field is ignored.
   * 
   * .. note::
   * 
   * This field will take effect when the request arrive and filter chain is created for the request.
   * If initial route is selected for the request and a filter is disabled in the initial route, then
   * the filter will not be added to the filter chain.
   * And if the request is mutated later and re-match to another route, the disabled filter by the
   * initial route will not be added back to the filter chain because the filter chain is already
   * created and it is too late to change the chain.
   * 
   * This field only make sense for the downstream HTTP filters for now.
   * 
   * [#not-implemented-hide:]
   */
  'disabled'?: (boolean);
}

/**
 * A simple wrapper for an HTTP filter config. This is intended to be used as a wrapper for the
 * map value in
 * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`,
 * :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>`,
 * or :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`
 * to add additional flags to the filter.
 */
export interface FilterConfig__Output {
  /**
   * The filter config.
   */
  'config': (_google_protobuf_Any__Output | null);
  /**
   * If true, the filter is optional, meaning that if the client does
   * not support the specified filter, it may ignore the map entry rather
   * than rejecting the config.
   */
  'is_optional': (boolean);
  /**
   * If true, the filter is disabled in the route or virtual host and the ``config`` field is ignored.
   * 
   * .. note::
   * 
   * This field will take effect when the request arrive and filter chain is created for the request.
   * If initial route is selected for the request and a filter is disabled in the initial route, then
   * the filter will not be added to the filter chain.
   * And if the request is mutated later and re-match to another route, the disabled filter by the
   * initial route will not be added back to the filter chain because the filter chain is already
   * created and it is too late to change the chain.
   * 
   * This field only make sense for the downstream HTTP filters for now.
   * 
   * [#not-implemented-hide:]
   */
  'disabled': (boolean);
}
