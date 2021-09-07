// Original file: deps/envoy-api/envoy/extensions/filters/http/fault/v3/fault.proto

import type { FractionalPercent as _envoy_type_v3_FractionalPercent, FractionalPercent__Output as _envoy_type_v3_FractionalPercent__Output } from '../../../../../../envoy/type/v3/FractionalPercent';

/**
 * Fault aborts are controlled via an HTTP header (if applicable). See the
 * :ref:`HTTP fault filter <config_http_filters_fault_injection_http_header>` documentation for
 * more information.
 */
export interface _envoy_extensions_filters_http_fault_v3_FaultAbort_HeaderAbort {
}

/**
 * Fault aborts are controlled via an HTTP header (if applicable). See the
 * :ref:`HTTP fault filter <config_http_filters_fault_injection_http_header>` documentation for
 * more information.
 */
export interface _envoy_extensions_filters_http_fault_v3_FaultAbort_HeaderAbort__Output {
}

/**
 * [#next-free-field: 6]
 */
export interface FaultAbort {
  /**
   * HTTP status code to use to abort the HTTP request.
   */
  'http_status'?: (number);
  /**
   * The percentage of requests/operations/connections that will be aborted with the error code
   * provided.
   */
  'percentage'?: (_envoy_type_v3_FractionalPercent | null);
  /**
   * Fault aborts are controlled via an HTTP header (if applicable).
   */
  'header_abort'?: (_envoy_extensions_filters_http_fault_v3_FaultAbort_HeaderAbort | null);
  /**
   * gRPC status code to use to abort the gRPC request.
   */
  'grpc_status'?: (number);
  'error_type'?: "http_status"|"grpc_status"|"header_abort";
}

/**
 * [#next-free-field: 6]
 */
export interface FaultAbort__Output {
  /**
   * HTTP status code to use to abort the HTTP request.
   */
  'http_status'?: (number);
  /**
   * The percentage of requests/operations/connections that will be aborted with the error code
   * provided.
   */
  'percentage': (_envoy_type_v3_FractionalPercent__Output | null);
  /**
   * Fault aborts are controlled via an HTTP header (if applicable).
   */
  'header_abort'?: (_envoy_extensions_filters_http_fault_v3_FaultAbort_HeaderAbort__Output | null);
  /**
   * gRPC status code to use to abort the gRPC request.
   */
  'grpc_status'?: (number);
  'error_type': "http_status"|"grpc_status"|"header_abort";
}
