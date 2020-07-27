// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { ComparisonFilter as _envoy_config_filter_accesslog_v2_ComparisonFilter, ComparisonFilter__Output as _envoy_config_filter_accesslog_v2_ComparisonFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/ComparisonFilter';

/**
 * Filters on HTTP response/status code.
 */
export interface StatusCodeFilter {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_filter_accesslog_v2_ComparisonFilter);
}

/**
 * Filters on HTTP response/status code.
 */
export interface StatusCodeFilter__Output {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_filter_accesslog_v2_ComparisonFilter__Output);
}
