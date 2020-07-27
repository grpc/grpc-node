// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { StatusCodeFilter as _envoy_config_filter_accesslog_v2_StatusCodeFilter, StatusCodeFilter__Output as _envoy_config_filter_accesslog_v2_StatusCodeFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/StatusCodeFilter';
import { DurationFilter as _envoy_config_filter_accesslog_v2_DurationFilter, DurationFilter__Output as _envoy_config_filter_accesslog_v2_DurationFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/DurationFilter';
import { NotHealthCheckFilter as _envoy_config_filter_accesslog_v2_NotHealthCheckFilter, NotHealthCheckFilter__Output as _envoy_config_filter_accesslog_v2_NotHealthCheckFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/NotHealthCheckFilter';
import { TraceableFilter as _envoy_config_filter_accesslog_v2_TraceableFilter, TraceableFilter__Output as _envoy_config_filter_accesslog_v2_TraceableFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/TraceableFilter';
import { RuntimeFilter as _envoy_config_filter_accesslog_v2_RuntimeFilter, RuntimeFilter__Output as _envoy_config_filter_accesslog_v2_RuntimeFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/RuntimeFilter';
import { AndFilter as _envoy_config_filter_accesslog_v2_AndFilter, AndFilter__Output as _envoy_config_filter_accesslog_v2_AndFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/AndFilter';
import { OrFilter as _envoy_config_filter_accesslog_v2_OrFilter, OrFilter__Output as _envoy_config_filter_accesslog_v2_OrFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/OrFilter';
import { HeaderFilter as _envoy_config_filter_accesslog_v2_HeaderFilter, HeaderFilter__Output as _envoy_config_filter_accesslog_v2_HeaderFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/HeaderFilter';
import { ResponseFlagFilter as _envoy_config_filter_accesslog_v2_ResponseFlagFilter, ResponseFlagFilter__Output as _envoy_config_filter_accesslog_v2_ResponseFlagFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/ResponseFlagFilter';
import { GrpcStatusFilter as _envoy_config_filter_accesslog_v2_GrpcStatusFilter, GrpcStatusFilter__Output as _envoy_config_filter_accesslog_v2_GrpcStatusFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/GrpcStatusFilter';
import { ExtensionFilter as _envoy_config_filter_accesslog_v2_ExtensionFilter, ExtensionFilter__Output as _envoy_config_filter_accesslog_v2_ExtensionFilter__Output } from '../../../../../envoy/config/filter/accesslog/v2/ExtensionFilter';

/**
 * [#next-free-field: 12]
 */
export interface AccessLogFilter {
  /**
   * Status code filter.
   */
  'status_code_filter'?: (_envoy_config_filter_accesslog_v2_StatusCodeFilter);
  /**
   * Duration filter.
   */
  'duration_filter'?: (_envoy_config_filter_accesslog_v2_DurationFilter);
  /**
   * Not health check filter.
   */
  'not_health_check_filter'?: (_envoy_config_filter_accesslog_v2_NotHealthCheckFilter);
  /**
   * Traceable filter.
   */
  'traceable_filter'?: (_envoy_config_filter_accesslog_v2_TraceableFilter);
  /**
   * Runtime filter.
   */
  'runtime_filter'?: (_envoy_config_filter_accesslog_v2_RuntimeFilter);
  /**
   * And filter.
   */
  'and_filter'?: (_envoy_config_filter_accesslog_v2_AndFilter);
  /**
   * Or filter.
   */
  'or_filter'?: (_envoy_config_filter_accesslog_v2_OrFilter);
  /**
   * Header filter.
   */
  'header_filter'?: (_envoy_config_filter_accesslog_v2_HeaderFilter);
  /**
   * Response flag filter.
   */
  'response_flag_filter'?: (_envoy_config_filter_accesslog_v2_ResponseFlagFilter);
  /**
   * gRPC status filter.
   */
  'grpc_status_filter'?: (_envoy_config_filter_accesslog_v2_GrpcStatusFilter);
  /**
   * Extension filter.
   */
  'extension_filter'?: (_envoy_config_filter_accesslog_v2_ExtensionFilter);
  'filter_specifier'?: "status_code_filter"|"duration_filter"|"not_health_check_filter"|"traceable_filter"|"runtime_filter"|"and_filter"|"or_filter"|"header_filter"|"response_flag_filter"|"grpc_status_filter"|"extension_filter";
}

/**
 * [#next-free-field: 12]
 */
export interface AccessLogFilter__Output {
  /**
   * Status code filter.
   */
  'status_code_filter'?: (_envoy_config_filter_accesslog_v2_StatusCodeFilter__Output);
  /**
   * Duration filter.
   */
  'duration_filter'?: (_envoy_config_filter_accesslog_v2_DurationFilter__Output);
  /**
   * Not health check filter.
   */
  'not_health_check_filter'?: (_envoy_config_filter_accesslog_v2_NotHealthCheckFilter__Output);
  /**
   * Traceable filter.
   */
  'traceable_filter'?: (_envoy_config_filter_accesslog_v2_TraceableFilter__Output);
  /**
   * Runtime filter.
   */
  'runtime_filter'?: (_envoy_config_filter_accesslog_v2_RuntimeFilter__Output);
  /**
   * And filter.
   */
  'and_filter'?: (_envoy_config_filter_accesslog_v2_AndFilter__Output);
  /**
   * Or filter.
   */
  'or_filter'?: (_envoy_config_filter_accesslog_v2_OrFilter__Output);
  /**
   * Header filter.
   */
  'header_filter'?: (_envoy_config_filter_accesslog_v2_HeaderFilter__Output);
  /**
   * Response flag filter.
   */
  'response_flag_filter'?: (_envoy_config_filter_accesslog_v2_ResponseFlagFilter__Output);
  /**
   * gRPC status filter.
   */
  'grpc_status_filter'?: (_envoy_config_filter_accesslog_v2_GrpcStatusFilter__Output);
  /**
   * Extension filter.
   */
  'extension_filter'?: (_envoy_config_filter_accesslog_v2_ExtensionFilter__Output);
  'filter_specifier': "status_code_filter"|"duration_filter"|"not_health_check_filter"|"traceable_filter"|"runtime_filter"|"and_filter"|"or_filter"|"header_filter"|"response_flag_filter"|"grpc_status_filter"|"extension_filter";
}
