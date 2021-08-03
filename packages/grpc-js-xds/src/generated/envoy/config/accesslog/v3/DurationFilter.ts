// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { ComparisonFilter as _envoy_config_accesslog_v3_ComparisonFilter, ComparisonFilter__Output as _envoy_config_accesslog_v3_ComparisonFilter__Output } from '../../../../envoy/config/accesslog/v3/ComparisonFilter';

/**
 * Filters on total request duration in milliseconds.
 */
export interface DurationFilter {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_accesslog_v3_ComparisonFilter | null);
}

/**
 * Filters on total request duration in milliseconds.
 */
export interface DurationFilter__Output {
  /**
   * Comparison.
   */
  'comparison': (_envoy_config_accesslog_v3_ComparisonFilter__Output | null);
}
