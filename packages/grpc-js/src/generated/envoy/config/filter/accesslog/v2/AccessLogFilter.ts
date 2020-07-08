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

export interface AccessLogFilter {
  'status_code_filter'?: (_envoy_config_filter_accesslog_v2_StatusCodeFilter);
  'duration_filter'?: (_envoy_config_filter_accesslog_v2_DurationFilter);
  'not_health_check_filter'?: (_envoy_config_filter_accesslog_v2_NotHealthCheckFilter);
  'traceable_filter'?: (_envoy_config_filter_accesslog_v2_TraceableFilter);
  'runtime_filter'?: (_envoy_config_filter_accesslog_v2_RuntimeFilter);
  'and_filter'?: (_envoy_config_filter_accesslog_v2_AndFilter);
  'or_filter'?: (_envoy_config_filter_accesslog_v2_OrFilter);
  'header_filter'?: (_envoy_config_filter_accesslog_v2_HeaderFilter);
  'response_flag_filter'?: (_envoy_config_filter_accesslog_v2_ResponseFlagFilter);
  'grpc_status_filter'?: (_envoy_config_filter_accesslog_v2_GrpcStatusFilter);
  'extension_filter'?: (_envoy_config_filter_accesslog_v2_ExtensionFilter);
  'filter_specifier'?: "status_code_filter"|"duration_filter"|"not_health_check_filter"|"traceable_filter"|"runtime_filter"|"and_filter"|"or_filter"|"header_filter"|"response_flag_filter"|"grpc_status_filter"|"extension_filter";
}

export interface AccessLogFilter__Output {
  'status_code_filter'?: (_envoy_config_filter_accesslog_v2_StatusCodeFilter__Output);
  'duration_filter'?: (_envoy_config_filter_accesslog_v2_DurationFilter__Output);
  'not_health_check_filter'?: (_envoy_config_filter_accesslog_v2_NotHealthCheckFilter__Output);
  'traceable_filter'?: (_envoy_config_filter_accesslog_v2_TraceableFilter__Output);
  'runtime_filter'?: (_envoy_config_filter_accesslog_v2_RuntimeFilter__Output);
  'and_filter'?: (_envoy_config_filter_accesslog_v2_AndFilter__Output);
  'or_filter'?: (_envoy_config_filter_accesslog_v2_OrFilter__Output);
  'header_filter'?: (_envoy_config_filter_accesslog_v2_HeaderFilter__Output);
  'response_flag_filter'?: (_envoy_config_filter_accesslog_v2_ResponseFlagFilter__Output);
  'grpc_status_filter'?: (_envoy_config_filter_accesslog_v2_GrpcStatusFilter__Output);
  'extension_filter'?: (_envoy_config_filter_accesslog_v2_ExtensionFilter__Output);
  'filter_specifier': "status_code_filter"|"duration_filter"|"not_health_check_filter"|"traceable_filter"|"runtime_filter"|"and_filter"|"or_filter"|"header_filter"|"response_flag_filter"|"grpc_status_filter"|"extension_filter";
}
