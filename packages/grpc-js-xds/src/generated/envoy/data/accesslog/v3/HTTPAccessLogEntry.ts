// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { AccessLogCommon as _envoy_data_accesslog_v3_AccessLogCommon, AccessLogCommon__Output as _envoy_data_accesslog_v3_AccessLogCommon__Output } from '../../../../envoy/data/accesslog/v3/AccessLogCommon';
import type { HTTPRequestProperties as _envoy_data_accesslog_v3_HTTPRequestProperties, HTTPRequestProperties__Output as _envoy_data_accesslog_v3_HTTPRequestProperties__Output } from '../../../../envoy/data/accesslog/v3/HTTPRequestProperties';
import type { HTTPResponseProperties as _envoy_data_accesslog_v3_HTTPResponseProperties, HTTPResponseProperties__Output as _envoy_data_accesslog_v3_HTTPResponseProperties__Output } from '../../../../envoy/data/accesslog/v3/HTTPResponseProperties';

// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

/**
 * HTTP version
 */
export const _envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion = {
  PROTOCOL_UNSPECIFIED: 'PROTOCOL_UNSPECIFIED',
  HTTP10: 'HTTP10',
  HTTP11: 'HTTP11',
  HTTP2: 'HTTP2',
  HTTP3: 'HTTP3',
} as const;

/**
 * HTTP version
 */
export type _envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion =
  | 'PROTOCOL_UNSPECIFIED'
  | 0
  | 'HTTP10'
  | 1
  | 'HTTP11'
  | 2
  | 'HTTP2'
  | 3
  | 'HTTP3'
  | 4

/**
 * HTTP version
 */
export type _envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion__Output = typeof _envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion[keyof typeof _envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion]

export interface HTTPAccessLogEntry {
  /**
   * Common properties shared by all Envoy access logs.
   */
  'common_properties'?: (_envoy_data_accesslog_v3_AccessLogCommon | null);
  'protocol_version'?: (_envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion);
  /**
   * Description of the incoming HTTP request.
   */
  'request'?: (_envoy_data_accesslog_v3_HTTPRequestProperties | null);
  /**
   * Description of the outgoing HTTP response.
   */
  'response'?: (_envoy_data_accesslog_v3_HTTPResponseProperties | null);
}

export interface HTTPAccessLogEntry__Output {
  /**
   * Common properties shared by all Envoy access logs.
   */
  'common_properties': (_envoy_data_accesslog_v3_AccessLogCommon__Output | null);
  'protocol_version': (_envoy_data_accesslog_v3_HTTPAccessLogEntry_HTTPVersion__Output);
  /**
   * Description of the incoming HTTP request.
   */
  'request': (_envoy_data_accesslog_v3_HTTPRequestProperties__Output | null);
  /**
   * Description of the outgoing HTTP response.
   */
  'response': (_envoy_data_accesslog_v3_HTTPResponseProperties__Output | null);
}
