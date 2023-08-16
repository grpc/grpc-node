// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { AccessLogType as _envoy_data_accesslog_v3_AccessLogType } from '../../../../envoy/data/accesslog/v3/AccessLogType';

/**
 * Filters based on access log type.
 */
export interface LogTypeFilter {
  /**
   * Logs only records which their type is one of the types defined in this field.
   */
  'types'?: (_envoy_data_accesslog_v3_AccessLogType | keyof typeof _envoy_data_accesslog_v3_AccessLogType)[];
  /**
   * If this field is set to true, the filter will instead block all records
   * with a access log type in types field, and allow all other records.
   */
  'exclude'?: (boolean);
}

/**
 * Filters based on access log type.
 */
export interface LogTypeFilter__Output {
  /**
   * Logs only records which their type is one of the types defined in this field.
   */
  'types': (keyof typeof _envoy_data_accesslog_v3_AccessLogType)[];
  /**
   * If this field is set to true, the filter will instead block all records
   * with a access log type in types field, and allow all other records.
   */
  'exclude': (boolean);
}
