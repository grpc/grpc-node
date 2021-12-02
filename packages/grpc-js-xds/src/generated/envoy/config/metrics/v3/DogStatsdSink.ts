// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../../google/protobuf/UInt64Value';
import type { Long } from '@grpc/proto-loader';

/**
 * Stats configuration proto schema for built-in *envoy.stat_sinks.dog_statsd* sink.
 * The sink emits stats with `DogStatsD <https://docs.datadoghq.com/guides/dogstatsd/>`_
 * compatible tags. Tags are configurable via :ref:`StatsConfig
 * <envoy_v3_api_msg_config.metrics.v3.StatsConfig>`.
 * [#extension: envoy.stat_sinks.dog_statsd]
 */
export interface DogStatsdSink {
  /**
   * The UDP address of a running DogStatsD compliant listener. If specified,
   * statistics will be flushed to this address.
   */
  'address'?: (_envoy_config_core_v3_Address | null);
  /**
   * Optional custom metric name prefix. See :ref:`StatsdSink's prefix field
   * <envoy_v3_api_field_config.metrics.v3.StatsdSink.prefix>` for more details.
   */
  'prefix'?: (string);
  /**
   * Optional max datagram size to use when sending UDP messages. By default Envoy
   * will emit one metric per datagram. By specifying a max-size larger than a single
   * metric, Envoy will emit multiple, new-line separated metrics. The max datagram
   * size should not exceed your network's MTU.
   * 
   * Note that this value may not be respected if smaller than a single metric.
   */
  'max_bytes_per_datagram'?: (_google_protobuf_UInt64Value | null);
  'dog_statsd_specifier'?: "address";
}

/**
 * Stats configuration proto schema for built-in *envoy.stat_sinks.dog_statsd* sink.
 * The sink emits stats with `DogStatsD <https://docs.datadoghq.com/guides/dogstatsd/>`_
 * compatible tags. Tags are configurable via :ref:`StatsConfig
 * <envoy_v3_api_msg_config.metrics.v3.StatsConfig>`.
 * [#extension: envoy.stat_sinks.dog_statsd]
 */
export interface DogStatsdSink__Output {
  /**
   * The UDP address of a running DogStatsD compliant listener. If specified,
   * statistics will be flushed to this address.
   */
  'address'?: (_envoy_config_core_v3_Address__Output | null);
  /**
   * Optional custom metric name prefix. See :ref:`StatsdSink's prefix field
   * <envoy_v3_api_field_config.metrics.v3.StatsdSink.prefix>` for more details.
   */
  'prefix': (string);
  /**
   * Optional max datagram size to use when sending UDP messages. By default Envoy
   * will emit one metric per datagram. By specifying a max-size larger than a single
   * metric, Envoy will emit multiple, new-line separated metrics. The max datagram
   * size should not exceed your network's MTU.
   * 
   * Note that this value may not be respected if smaller than a single metric.
   */
  'max_bytes_per_datagram': (_google_protobuf_UInt64Value__Output | null);
  'dog_statsd_specifier': "address";
}
