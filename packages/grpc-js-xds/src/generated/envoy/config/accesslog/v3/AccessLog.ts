// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { AccessLogFilter as _envoy_config_accesslog_v3_AccessLogFilter, AccessLogFilter__Output as _envoy_config_accesslog_v3_AccessLogFilter__Output } from '../../../../envoy/config/accesslog/v3/AccessLogFilter';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface AccessLog {
  /**
   * The name of the access log implementation to instantiate. The name must
   * match a statically registered access log. Current built-in loggers include:
   * 
   * #. "envoy.access_loggers.file"
   * #. "envoy.access_loggers.http_grpc"
   * #. "envoy.access_loggers.tcp_grpc"
   */
  'name'?: (string);
  /**
   * Filter which is used to determine if the access log needs to be written.
   */
  'filter'?: (_envoy_config_accesslog_v3_AccessLogFilter);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Custom configuration that depends on the access log being instantiated.
   * Built-in configurations include:
   * 
   * #. "envoy.access_loggers.file": :ref:`FileAccessLog
   * <envoy_api_msg_extensions.access_loggers.file.v3.FileAccessLog>`
   * #. "envoy.access_loggers.http_grpc": :ref:`HttpGrpcAccessLogConfig
   * <envoy_api_msg_extensions.access_loggers.grpc.v3.HttpGrpcAccessLogConfig>`
   * #. "envoy.access_loggers.tcp_grpc": :ref:`TcpGrpcAccessLogConfig
   * <envoy_api_msg_extensions.access_loggers.grpc.v3.TcpGrpcAccessLogConfig>`
   */
  'config_type'?: "typed_config";
}

export interface AccessLog__Output {
  /**
   * The name of the access log implementation to instantiate. The name must
   * match a statically registered access log. Current built-in loggers include:
   * 
   * #. "envoy.access_loggers.file"
   * #. "envoy.access_loggers.http_grpc"
   * #. "envoy.access_loggers.tcp_grpc"
   */
  'name': (string);
  /**
   * Filter which is used to determine if the access log needs to be written.
   */
  'filter'?: (_envoy_config_accesslog_v3_AccessLogFilter__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Custom configuration that depends on the access log being instantiated.
   * Built-in configurations include:
   * 
   * #. "envoy.access_loggers.file": :ref:`FileAccessLog
   * <envoy_api_msg_extensions.access_loggers.file.v3.FileAccessLog>`
   * #. "envoy.access_loggers.http_grpc": :ref:`HttpGrpcAccessLogConfig
   * <envoy_api_msg_extensions.access_loggers.grpc.v3.HttpGrpcAccessLogConfig>`
   * #. "envoy.access_loggers.tcp_grpc": :ref:`TcpGrpcAccessLogConfig
   * <envoy_api_msg_extensions.access_loggers.grpc.v3.TcpGrpcAccessLogConfig>`
   */
  'config_type': "typed_config";
}
