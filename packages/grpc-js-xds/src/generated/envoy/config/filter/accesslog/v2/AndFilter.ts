// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { AccessLogFilter as _envoy_config_filter_accesslog_v2_AccessLogFilter, AccessLogFilter__Output as _envoy_config_filter_accesslog_v2_AccessLogFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/AccessLogFilter';

/**
 * Performs a logical “and” operation on the result of each filter in filters.
 * Filters are evaluated sequentially and if one of them returns false, the
 * filter returns false immediately.
 */
export interface AndFilter {
  'filters'?: (_envoy_config_filter_accesslog_v2_AccessLogFilter)[];
}

/**
 * Performs a logical “and” operation on the result of each filter in filters.
 * Filters are evaluated sequentially and if one of them returns false, the
 * filter returns false immediately.
 */
export interface AndFilter__Output {
  'filters': (_envoy_config_filter_accesslog_v2_AccessLogFilter__Output)[];
}
