// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { AccessLogFilter as _envoy_config_filter_accesslog_v2_AccessLogFilter, AccessLogFilter__Output as _envoy_config_filter_accesslog_v2_AccessLogFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/AccessLogFilter';

/**
 * Performs a logical “or” operation on the result of each individual filter.
 * Filters are evaluated sequentially and if one of them returns true, the
 * filter returns true immediately.
 */
export interface OrFilter {
  'filters'?: (_envoy_config_filter_accesslog_v2_AccessLogFilter)[];
}

/**
 * Performs a logical “or” operation on the result of each individual filter.
 * Filters are evaluated sequentially and if one of them returns true, the
 * filter returns true immediately.
 */
export interface OrFilter__Output {
  'filters': (_envoy_config_filter_accesslog_v2_AccessLogFilter__Output)[];
}
