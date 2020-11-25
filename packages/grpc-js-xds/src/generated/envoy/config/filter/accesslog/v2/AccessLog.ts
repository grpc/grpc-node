// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { AccessLogFilter as _envoy_config_filter_accesslog_v2_AccessLogFilter, AccessLogFilter__Output as _envoy_config_filter_accesslog_v2_AccessLogFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/AccessLogFilter';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../google/protobuf/Any';

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
  'filter'?: (_envoy_config_filter_accesslog_v2_AccessLogFilter);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Custom configuration that depends on the access log being instantiated. Built-in
   * configurations include:
   * 
   * #. "envoy.access_loggers.file": :ref:`FileAccessLog
   * <envoy_api_msg_config.accesslog.v2.FileAccessLog>`
   * #. "envoy.access_loggers.http_grpc": :ref:`HttpGrpcAccessLogConfig
   * <envoy_api_msg_config.accesslog.v2.HttpGrpcAccessLogConfig>`
   * #. "envoy.access_loggers.tcp_grpc": :ref:`TcpGrpcAccessLogConfig
   * <envoy_api_msg_config.accesslog.v2.TcpGrpcAccessLogConfig>`
   */
  'config_type'?: "config"|"typed_config";
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
  'filter'?: (_envoy_config_filter_accesslog_v2_AccessLogFilter__Output);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Custom configuration that depends on the access log being instantiated. Built-in
   * configurations include:
   * 
   * #. "envoy.access_loggers.file": :ref:`FileAccessLog
   * <envoy_api_msg_config.accesslog.v2.FileAccessLog>`
   * #. "envoy.access_loggers.http_grpc": :ref:`HttpGrpcAccessLogConfig
   * <envoy_api_msg_config.accesslog.v2.HttpGrpcAccessLogConfig>`
   * #. "envoy.access_loggers.tcp_grpc": :ref:`TcpGrpcAccessLogConfig
   * <envoy_api_msg_config.accesslog.v2.TcpGrpcAccessLogConfig>`
   */
  'config_type': "config"|"typed_config";
}
