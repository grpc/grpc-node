// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { AccessLogCommon as _envoy_data_accesslog_v3_AccessLogCommon, AccessLogCommon__Output as _envoy_data_accesslog_v3_AccessLogCommon__Output } from '../../../../envoy/data/accesslog/v3/AccessLogCommon';
import type { ConnectionProperties as _envoy_data_accesslog_v3_ConnectionProperties, ConnectionProperties__Output as _envoy_data_accesslog_v3_ConnectionProperties__Output } from '../../../../envoy/data/accesslog/v3/ConnectionProperties';

export interface TCPAccessLogEntry {
  /**
   * Common properties shared by all Envoy access logs.
   */
  'common_properties'?: (_envoy_data_accesslog_v3_AccessLogCommon | null);
  /**
   * Properties of the TCP connection.
   */
  'connection_properties'?: (_envoy_data_accesslog_v3_ConnectionProperties | null);
}

export interface TCPAccessLogEntry__Output {
  /**
   * Common properties shared by all Envoy access logs.
   */
  'common_properties': (_envoy_data_accesslog_v3_AccessLogCommon__Output | null);
  /**
   * Properties of the TCP connection.
   */
  'connection_properties': (_envoy_data_accesslog_v3_ConnectionProperties__Output | null);
}
