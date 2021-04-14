// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { AccessLogFilter as _envoy_config_accesslog_v3_AccessLogFilter, AccessLogFilter__Output as _envoy_config_accesslog_v3_AccessLogFilter__Output } from '../../../../envoy/config/accesslog/v3/AccessLogFilter';

/**
 * Performs a logical “or” operation on the result of each individual filter.
 * Filters are evaluated sequentially and if one of them returns true, the
 * filter returns true immediately.
 */
export interface OrFilter {
  'filters'?: (_envoy_config_accesslog_v3_AccessLogFilter)[];
}

/**
 * Performs a logical “or” operation on the result of each individual filter.
 * Filters are evaluated sequentially and if one of them returns true, the
 * filter returns true immediately.
 */
export interface OrFilter__Output {
  'filters': (_envoy_config_accesslog_v3_AccessLogFilter__Output)[];
}
