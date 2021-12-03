// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * A simple wrapper for an HTTP filter config. This is intended to be used as a wrapper for the
 * map value in
 * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`,
 * :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>`,
 * or :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`
 * to add additional flags to the filter.
 * [#not-implemented-hide:]
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
}

/**
 * A simple wrapper for an HTTP filter config. This is intended to be used as a wrapper for the
 * map value in
 * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`,
 * :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>`,
 * or :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`
 * to add additional flags to the filter.
 * [#not-implemented-hide:]
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
}
