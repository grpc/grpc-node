// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { AccessLogFilter as _envoy_config_accesslog_v3_AccessLogFilter, AccessLogFilter__Output as _envoy_config_accesslog_v3_AccessLogFilter__Output } from '../../../../envoy/config/accesslog/v3/AccessLogFilter';

/**
 * Performs a logical “and” operation on the result of each filter in filters.
 * Filters are evaluated sequentially and if one of them returns false, the
 * filter returns false immediately.
 */
export interface AndFilter {
  'filters'?: (_envoy_config_accesslog_v3_AccessLogFilter)[];
}

/**
 * Performs a logical “and” operation on the result of each filter in filters.
 * Filters are evaluated sequentially and if one of them returns false, the
 * filter returns false immediately.
 */
export interface AndFilter__Output {
  'filters': (_envoy_config_accesslog_v3_AccessLogFilter__Output)[];
}
