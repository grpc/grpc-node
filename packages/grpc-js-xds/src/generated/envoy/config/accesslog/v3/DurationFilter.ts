// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { ComparisonFilter as _envoy_config_accesslog_v3_ComparisonFilter, ComparisonFilter__Output as _envoy_config_accesslog_v3_ComparisonFilter__Output } from '../../../../envoy/config/accesslog/v3/ComparisonFilter';

/**
 * Filters based on the duration of the request or stream, in milliseconds.
 * For end of stream access logs, the total duration of the stream will be used.
 * For :ref:`periodic access logs<arch_overview_access_log_periodic>`,
 * the duration of the stream at the time of log recording will be used.
 */
export interface DurationFilter {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_accesslog_v3_ComparisonFilter | null);
}

/**
 * Filters based on the duration of the request or stream, in milliseconds.
 * For end of stream access logs, the total duration of the stream will be used.
 * For :ref:`periodic access logs<arch_overview_access_log_periodic>`,
 * the duration of the stream at the time of log recording will be used.
 */
export interface DurationFilter__Output {
  /**
   * Comparison.
   */
  'comparison': (_envoy_config_accesslog_v3_ComparisonFilter__Output | null);
}
