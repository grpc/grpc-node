// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { TagSpecifier as _envoy_config_metrics_v3_TagSpecifier, TagSpecifier__Output as _envoy_config_metrics_v3_TagSpecifier__Output } from '../../../../envoy/config/metrics/v3/TagSpecifier';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { StatsMatcher as _envoy_config_metrics_v3_StatsMatcher, StatsMatcher__Output as _envoy_config_metrics_v3_StatsMatcher__Output } from '../../../../envoy/config/metrics/v3/StatsMatcher';
import type { HistogramBucketSettings as _envoy_config_metrics_v3_HistogramBucketSettings, HistogramBucketSettings__Output as _envoy_config_metrics_v3_HistogramBucketSettings__Output } from '../../../../envoy/config/metrics/v3/HistogramBucketSettings';

/**
 * Statistics configuration such as tagging.
 */
export interface StatsConfig {
  /**
   * Each stat name is iteratively processed through these tag specifiers.
   * When a tag is matched, the first capture group is removed from the name so
   * later :ref:`TagSpecifiers <envoy_v3_api_msg_config.metrics.v3.TagSpecifier>` cannot match that
   * same portion of the match.
   */
  'stats_tags'?: (_envoy_config_metrics_v3_TagSpecifier)[];
  /**
   * Use all default tag regexes specified in Envoy. These can be combined with
   * custom tags specified in :ref:`stats_tags
   * <envoy_v3_api_field_config.metrics.v3.StatsConfig.stats_tags>`. They will be processed before
   * the custom tags.
   * 
   * .. note::
   * 
   * If any default tags are specified twice, the config will be considered
   * invalid.
   * 
   * See :repo:`well_known_names.h <source/common/config/well_known_names.h>` for a list of the
   * default tags in Envoy.
   * 
   * If not provided, the value is assumed to be true.
   */
  'use_all_default_tags'?: (_google_protobuf_BoolValue | null);
  /**
   * Inclusion/exclusion matcher for stat name creation. If not provided, all stats are instantiated
   * as normal. Preventing the instantiation of certain families of stats can improve memory
   * performance for Envoys running especially large configs.
   * 
   * .. warning::
   * Excluding stats may affect Envoy's behavior in undocumented ways. See
   * `issue #8771 <https://github.com/envoyproxy/envoy/issues/8771>`_ for more information.
   * If any unexpected behavior changes are observed, please open a new issue immediately.
   */
  'stats_matcher'?: (_envoy_config_metrics_v3_StatsMatcher | null);
  /**
   * Defines rules for setting the histogram buckets. Rules are evaluated in order, and the first
   * match is applied. If no match is found (or if no rules are set), the following default buckets
   * are used:
   * 
   * .. code-block:: json
   * 
   * [
   * 0.5,
   * 1,
   * 5,
   * 10,
   * 25,
   * 50,
   * 100,
   * 250,
   * 500,
   * 1000,
   * 2500,
   * 5000,
   * 10000,
   * 30000,
   * 60000,
   * 300000,
   * 600000,
   * 1800000,
   * 3600000
   * ]
   */
  'histogram_bucket_settings'?: (_envoy_config_metrics_v3_HistogramBucketSettings)[];
}

/**
 * Statistics configuration such as tagging.
 */
export interface StatsConfig__Output {
  /**
   * Each stat name is iteratively processed through these tag specifiers.
   * When a tag is matched, the first capture group is removed from the name so
   * later :ref:`TagSpecifiers <envoy_v3_api_msg_config.metrics.v3.TagSpecifier>` cannot match that
   * same portion of the match.
   */
  'stats_tags': (_envoy_config_metrics_v3_TagSpecifier__Output)[];
  /**
   * Use all default tag regexes specified in Envoy. These can be combined with
   * custom tags specified in :ref:`stats_tags
   * <envoy_v3_api_field_config.metrics.v3.StatsConfig.stats_tags>`. They will be processed before
   * the custom tags.
   * 
   * .. note::
   * 
   * If any default tags are specified twice, the config will be considered
   * invalid.
   * 
   * See :repo:`well_known_names.h <source/common/config/well_known_names.h>` for a list of the
   * default tags in Envoy.
   * 
   * If not provided, the value is assumed to be true.
   */
  'use_all_default_tags': (_google_protobuf_BoolValue__Output | null);
  /**
   * Inclusion/exclusion matcher for stat name creation. If not provided, all stats are instantiated
   * as normal. Preventing the instantiation of certain families of stats can improve memory
   * performance for Envoys running especially large configs.
   * 
   * .. warning::
   * Excluding stats may affect Envoy's behavior in undocumented ways. See
   * `issue #8771 <https://github.com/envoyproxy/envoy/issues/8771>`_ for more information.
   * If any unexpected behavior changes are observed, please open a new issue immediately.
   */
  'stats_matcher': (_envoy_config_metrics_v3_StatsMatcher__Output | null);
  /**
   * Defines rules for setting the histogram buckets. Rules are evaluated in order, and the first
   * match is applied. If no match is found (or if no rules are set), the following default buckets
   * are used:
   * 
   * .. code-block:: json
   * 
   * [
   * 0.5,
   * 1,
   * 5,
   * 10,
   * 25,
   * 50,
   * 100,
   * 250,
   * 500,
   * 1000,
   * 2500,
   * 5000,
   * 10000,
   * 30000,
   * 60000,
   * 300000,
   * 600000,
   * 1800000,
   * 3600000
   * ]
   */
  'histogram_bucket_settings': (_envoy_config_metrics_v3_HistogramBucketSettings__Output)[];
}
