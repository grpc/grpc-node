// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { AccessLogFilter as _envoy_config_accesslog_v3_AccessLogFilter, AccessLogFilter__Output as _envoy_config_accesslog_v3_AccessLogFilter__Output } from '../../../../envoy/config/accesslog/v3/AccessLogFilter';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface AccessLog {
  /**
   * The name of the access log extension configuration.
   */
  'name'?: (string);
  /**
   * Filter which is used to determine if the access log needs to be written.
   */
  'filter'?: (_envoy_config_accesslog_v3_AccessLogFilter | null);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Custom configuration that must be set according to the access logger extension being instantiated.
   * [#extension-category: envoy.access_loggers]
   */
  'config_type'?: "typed_config";
}

export interface AccessLog__Output {
  /**
   * The name of the access log extension configuration.
   */
  'name': (string);
  /**
   * Filter which is used to determine if the access log needs to be written.
   */
  'filter': (_envoy_config_accesslog_v3_AccessLogFilter__Output | null);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Custom configuration that must be set according to the access logger extension being instantiated.
   * [#extension-category: envoy.access_loggers]
   */
  'config_type': "typed_config";
}
