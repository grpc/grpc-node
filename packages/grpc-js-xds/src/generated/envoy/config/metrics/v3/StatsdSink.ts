// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';

/**
 * Stats configuration proto schema for built-in *envoy.stat_sinks.statsd* sink. This sink does not support
 * tagged metrics.
 * [#extension: envoy.stat_sinks.statsd]
 */
export interface StatsdSink {
  /**
   * The UDP address of a running `statsd <https://github.com/etsy/statsd>`_
   * compliant listener. If specified, statistics will be flushed to this
   * address.
   */
  'address'?: (_envoy_config_core_v3_Address | null);
  /**
   * The name of a cluster that is running a TCP `statsd
   * <https://github.com/etsy/statsd>`_ compliant listener. If specified,
   * Envoy will connect to this cluster to flush statistics.
   */
  'tcp_cluster_name'?: (string);
  /**
   * Optional custom prefix for StatsdSink. If
   * specified, this will override the default prefix.
   * For example:
   * 
   * .. code-block:: json
   * 
   * {
   * "prefix" : "envoy-prod"
   * }
   * 
   * will change emitted stats to
   * 
   * .. code-block:: cpp
   * 
   * envoy-prod.test_counter:1|c
   * envoy-prod.test_timer:5|ms
   * 
   * Note that the default prefix, "envoy", will be used if a prefix is not
   * specified.
   * 
   * Stats with default prefix:
   * 
   * .. code-block:: cpp
   * 
   * envoy.test_counter:1|c
   * envoy.test_timer:5|ms
   */
  'prefix'?: (string);
  'statsd_specifier'?: "address"|"tcp_cluster_name";
}

/**
 * Stats configuration proto schema for built-in *envoy.stat_sinks.statsd* sink. This sink does not support
 * tagged metrics.
 * [#extension: envoy.stat_sinks.statsd]
 */
export interface StatsdSink__Output {
  /**
   * The UDP address of a running `statsd <https://github.com/etsy/statsd>`_
   * compliant listener. If specified, statistics will be flushed to this
   * address.
   */
  'address'?: (_envoy_config_core_v3_Address__Output | null);
  /**
   * The name of a cluster that is running a TCP `statsd
   * <https://github.com/etsy/statsd>`_ compliant listener. If specified,
   * Envoy will connect to this cluster to flush statistics.
   */
  'tcp_cluster_name'?: (string);
  /**
   * Optional custom prefix for StatsdSink. If
   * specified, this will override the default prefix.
   * For example:
   * 
   * .. code-block:: json
   * 
   * {
   * "prefix" : "envoy-prod"
   * }
   * 
   * will change emitted stats to
   * 
   * .. code-block:: cpp
   * 
   * envoy-prod.test_counter:1|c
   * envoy-prod.test_timer:5|ms
   * 
   * Note that the default prefix, "envoy", will be used if a prefix is not
   * specified.
   * 
   * Stats with default prefix:
   * 
   * .. code-block:: cpp
   * 
   * envoy.test_counter:1|c
   * envoy.test_timer:5|ms
   */
  'prefix': (string);
  'statsd_specifier': "address"|"tcp_cluster_name";
}
