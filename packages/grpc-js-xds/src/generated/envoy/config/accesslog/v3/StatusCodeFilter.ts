// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { ComparisonFilter as _envoy_config_accesslog_v3_ComparisonFilter, ComparisonFilter__Output as _envoy_config_accesslog_v3_ComparisonFilter__Output } from '../../../../envoy/config/accesslog/v3/ComparisonFilter';

/**
 * Filters on HTTP response/status code.
 */
export interface StatusCodeFilter {
  /**
   * Comparison.
   */
  'comparison'?: (_envoy_config_accesslog_v3_ComparisonFilter | null);
}

/**
 * Filters on HTTP response/status code.
 */
export interface StatusCodeFilter__Output {
  /**
   * Comparison.
   */
  'comparison': (_envoy_config_accesslog_v3_ComparisonFilter__Output | null);
}
