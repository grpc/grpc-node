// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { ComparisonFilter as _envoy_config_filter_accesslog_v2_ComparisonFilter, ComparisonFilter__Output as _envoy_config_filter_accesslog_v2_ComparisonFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/ComparisonFilter';

/**
 * Filters on total request duration in milliseconds.
 */
export interface DurationFilter {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_filter_accesslog_v2_ComparisonFilter);
}

/**
 * Filters on total request duration in milliseconds.
 */
export interface DurationFilter__Output {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_filter_accesslog_v2_ComparisonFilter__Output);
}
