// Original file: deps/envoy-api/envoy/extensions/filters/common/fault/v3/fault.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../../../google/protobuf/Duration';
import type { FractionalPercent as _envoy_type_v3_FractionalPercent, FractionalPercent__Output as _envoy_type_v3_FractionalPercent__Output } from '../../../../../../envoy/type/v3/FractionalPercent';

// Original file: deps/envoy-api/envoy/extensions/filters/common/fault/v3/fault.proto

export enum _envoy_extensions_filters_common_fault_v3_FaultDelay_FaultDelayType {
  /**
   * Unused and deprecated.
   */
  FIXED = 0,
}

/**
 * Fault delays are controlled via an HTTP header (if applicable). See the
 * :ref:`HTTP fault filter <config_http_filters_fault_injection_http_header>` documentation for
 * more information.
 */
export interface _envoy_extensions_filters_common_fault_v3_FaultDelay_HeaderDelay {
}

/**
 * Fault delays are controlled via an HTTP header (if applicable). See the
 * :ref:`HTTP fault filter <config_http_filters_fault_injection_http_header>` documentation for
 * more information.
 */
export interface _envoy_extensions_filters_common_fault_v3_FaultDelay_HeaderDelay__Output {
}

/**
 * Delay specification is used to inject latency into the
 * HTTP/Mongo operation.
 * [#next-free-field: 6]
 */
export interface FaultDelay {
  /**
   * Add a fixed delay before forwarding the operation upstream. See
   * https://developers.google.com/protocol-buffers/docs/proto3#json for
   * the JSON/YAML Duration mapping. For HTTP/Mongo, the specified
   * delay will be injected before a new request/operation.
   * This is required if type is FIXED.
   */
  'fixed_delay'?: (_google_protobuf_Duration | null);
  /**
   * The percentage of operations/connections/requests on which the delay will be injected.
   */
  'percentage'?: (_envoy_type_v3_FractionalPercent | null);
  /**
   * Fault delays are controlled via an HTTP header (if applicable).
   */
  'header_delay'?: (_envoy_extensions_filters_common_fault_v3_FaultDelay_HeaderDelay | null);
  'fault_delay_secifier'?: "fixed_delay"|"header_delay";
}

/**
 * Delay specification is used to inject latency into the
 * HTTP/Mongo operation.
 * [#next-free-field: 6]
 */
export interface FaultDelay__Output {
  /**
   * Add a fixed delay before forwarding the operation upstream. See
   * https://developers.google.com/protocol-buffers/docs/proto3#json for
   * the JSON/YAML Duration mapping. For HTTP/Mongo, the specified
   * delay will be injected before a new request/operation.
   * This is required if type is FIXED.
   */
  'fixed_delay'?: (_google_protobuf_Duration__Output | null);
  /**
   * The percentage of operations/connections/requests on which the delay will be injected.
   */
  'percentage': (_envoy_type_v3_FractionalPercent__Output | null);
  /**
   * Fault delays are controlled via an HTTP header (if applicable).
   */
  'header_delay'?: (_envoy_extensions_filters_common_fault_v3_FaultDelay_HeaderDelay__Output | null);
  'fault_delay_secifier': "fixed_delay"|"header_delay";
}
