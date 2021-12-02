// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Configuration for pluggable stats sinks.
 */
export interface StatsSink {
  /**
   * The name of the stats sink to instantiate. The name must match a supported
   * stats sink.
   * See the :ref:`extensions listed in typed_config below <extension_category_envoy.stats_sinks>` for the default list of available stats sink.
   * Sinks optionally support tagged/multiple dimensional metrics.
   */
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Stats sink specific configuration which depends on the sink being instantiated. See
   * :ref:`StatsdSink <envoy_v3_api_msg_config.metrics.v3.StatsdSink>` for an example.
   * [#extension-category: envoy.stats_sinks]
   */
  'config_type'?: "typed_config";
}

/**
 * Configuration for pluggable stats sinks.
 */
export interface StatsSink__Output {
  /**
   * The name of the stats sink to instantiate. The name must match a supported
   * stats sink.
   * See the :ref:`extensions listed in typed_config below <extension_category_envoy.stats_sinks>` for the default list of available stats sink.
   * Sinks optionally support tagged/multiple dimensional metrics.
   */
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Stats sink specific configuration which depends on the sink being instantiated. See
   * :ref:`StatsdSink <envoy_v3_api_msg_config.metrics.v3.StatsdSink>` for an example.
   * [#extension-category: envoy.stats_sinks]
   */
  'config_type': "typed_config";
}
