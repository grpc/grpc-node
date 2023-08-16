// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { StatusCodeFilter as _envoy_config_accesslog_v3_StatusCodeFilter, StatusCodeFilter__Output as _envoy_config_accesslog_v3_StatusCodeFilter__Output } from '../../../../envoy/config/accesslog/v3/StatusCodeFilter';
import type { DurationFilter as _envoy_config_accesslog_v3_DurationFilter, DurationFilter__Output as _envoy_config_accesslog_v3_DurationFilter__Output } from '../../../../envoy/config/accesslog/v3/DurationFilter';
import type { NotHealthCheckFilter as _envoy_config_accesslog_v3_NotHealthCheckFilter, NotHealthCheckFilter__Output as _envoy_config_accesslog_v3_NotHealthCheckFilter__Output } from '../../../../envoy/config/accesslog/v3/NotHealthCheckFilter';
import type { TraceableFilter as _envoy_config_accesslog_v3_TraceableFilter, TraceableFilter__Output as _envoy_config_accesslog_v3_TraceableFilter__Output } from '../../../../envoy/config/accesslog/v3/TraceableFilter';
import type { RuntimeFilter as _envoy_config_accesslog_v3_RuntimeFilter, RuntimeFilter__Output as _envoy_config_accesslog_v3_RuntimeFilter__Output } from '../../../../envoy/config/accesslog/v3/RuntimeFilter';
import type { AndFilter as _envoy_config_accesslog_v3_AndFilter, AndFilter__Output as _envoy_config_accesslog_v3_AndFilter__Output } from '../../../../envoy/config/accesslog/v3/AndFilter';
import type { OrFilter as _envoy_config_accesslog_v3_OrFilter, OrFilter__Output as _envoy_config_accesslog_v3_OrFilter__Output } from '../../../../envoy/config/accesslog/v3/OrFilter';
import type { HeaderFilter as _envoy_config_accesslog_v3_HeaderFilter, HeaderFilter__Output as _envoy_config_accesslog_v3_HeaderFilter__Output } from '../../../../envoy/config/accesslog/v3/HeaderFilter';
import type { ResponseFlagFilter as _envoy_config_accesslog_v3_ResponseFlagFilter, ResponseFlagFilter__Output as _envoy_config_accesslog_v3_ResponseFlagFilter__Output } from '../../../../envoy/config/accesslog/v3/ResponseFlagFilter';
import type { GrpcStatusFilter as _envoy_config_accesslog_v3_GrpcStatusFilter, GrpcStatusFilter__Output as _envoy_config_accesslog_v3_GrpcStatusFilter__Output } from '../../../../envoy/config/accesslog/v3/GrpcStatusFilter';
import type { ExtensionFilter as _envoy_config_accesslog_v3_ExtensionFilter, ExtensionFilter__Output as _envoy_config_accesslog_v3_ExtensionFilter__Output } from '../../../../envoy/config/accesslog/v3/ExtensionFilter';
import type { MetadataFilter as _envoy_config_accesslog_v3_MetadataFilter, MetadataFilter__Output as _envoy_config_accesslog_v3_MetadataFilter__Output } from '../../../../envoy/config/accesslog/v3/MetadataFilter';
import type { LogTypeFilter as _envoy_config_accesslog_v3_LogTypeFilter, LogTypeFilter__Output as _envoy_config_accesslog_v3_LogTypeFilter__Output } from '../../../../envoy/config/accesslog/v3/LogTypeFilter';

/**
 * [#next-free-field: 14]
 */
export interface AccessLogFilter {
  /**
   * Status code filter.
   */
  'status_code_filter'?: (_envoy_config_accesslog_v3_StatusCodeFilter | null);
  /**
   * Duration filter.
   */
  'duration_filter'?: (_envoy_config_accesslog_v3_DurationFilter | null);
  /**
   * Not health check filter.
   */
  'not_health_check_filter'?: (_envoy_config_accesslog_v3_NotHealthCheckFilter | null);
  /**
   * Traceable filter.
   */
  'traceable_filter'?: (_envoy_config_accesslog_v3_TraceableFilter | null);
  /**
   * Runtime filter.
   */
  'runtime_filter'?: (_envoy_config_accesslog_v3_RuntimeFilter | null);
  /**
   * And filter.
   */
  'and_filter'?: (_envoy_config_accesslog_v3_AndFilter | null);
  /**
   * Or filter.
   */
  'or_filter'?: (_envoy_config_accesslog_v3_OrFilter | null);
  /**
   * Header filter.
   */
  'header_filter'?: (_envoy_config_accesslog_v3_HeaderFilter | null);
  /**
   * Response flag filter.
   */
  'response_flag_filter'?: (_envoy_config_accesslog_v3_ResponseFlagFilter | null);
  /**
   * gRPC status filter.
   */
  'grpc_status_filter'?: (_envoy_config_accesslog_v3_GrpcStatusFilter | null);
  /**
   * Extension filter.
   * [#extension-category: envoy.access_loggers.extension_filters]
   */
  'extension_filter'?: (_envoy_config_accesslog_v3_ExtensionFilter | null);
  /**
   * Metadata Filter
   */
  'metadata_filter'?: (_envoy_config_accesslog_v3_MetadataFilter | null);
  /**
   * Log Type Filter
   */
  'log_type_filter'?: (_envoy_config_accesslog_v3_LogTypeFilter | null);
  'filter_specifier'?: "status_code_filter"|"duration_filter"|"not_health_check_filter"|"traceable_filter"|"runtime_filter"|"and_filter"|"or_filter"|"header_filter"|"response_flag_filter"|"grpc_status_filter"|"extension_filter"|"metadata_filter"|"log_type_filter";
}

/**
 * [#next-free-field: 14]
 */
export interface AccessLogFilter__Output {
  /**
   * Status code filter.
   */
  'status_code_filter'?: (_envoy_config_accesslog_v3_StatusCodeFilter__Output | null);
  /**
   * Duration filter.
   */
  'duration_filter'?: (_envoy_config_accesslog_v3_DurationFilter__Output | null);
  /**
   * Not health check filter.
   */
  'not_health_check_filter'?: (_envoy_config_accesslog_v3_NotHealthCheckFilter__Output | null);
  /**
   * Traceable filter.
   */
  'traceable_filter'?: (_envoy_config_accesslog_v3_TraceableFilter__Output | null);
  /**
   * Runtime filter.
   */
  'runtime_filter'?: (_envoy_config_accesslog_v3_RuntimeFilter__Output | null);
  /**
   * And filter.
   */
  'and_filter'?: (_envoy_config_accesslog_v3_AndFilter__Output | null);
  /**
   * Or filter.
   */
  'or_filter'?: (_envoy_config_accesslog_v3_OrFilter__Output | null);
  /**
   * Header filter.
   */
  'header_filter'?: (_envoy_config_accesslog_v3_HeaderFilter__Output | null);
  /**
   * Response flag filter.
   */
  'response_flag_filter'?: (_envoy_config_accesslog_v3_ResponseFlagFilter__Output | null);
  /**
   * gRPC status filter.
   */
  'grpc_status_filter'?: (_envoy_config_accesslog_v3_GrpcStatusFilter__Output | null);
  /**
   * Extension filter.
   * [#extension-category: envoy.access_loggers.extension_filters]
   */
  'extension_filter'?: (_envoy_config_accesslog_v3_ExtensionFilter__Output | null);
  /**
   * Metadata Filter
   */
  'metadata_filter'?: (_envoy_config_accesslog_v3_MetadataFilter__Output | null);
  /**
   * Log Type Filter
   */
  'log_type_filter'?: (_envoy_config_accesslog_v3_LogTypeFilter__Output | null);
  'filter_specifier': "status_code_filter"|"duration_filter"|"not_health_check_filter"|"traceable_filter"|"runtime_filter"|"and_filter"|"or_filter"|"header_filter"|"response_flag_filter"|"grpc_status_filter"|"extension_filter"|"metadata_filter"|"log_type_filter";
}
