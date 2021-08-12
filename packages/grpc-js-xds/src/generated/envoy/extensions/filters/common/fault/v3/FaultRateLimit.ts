// Original file: deps/envoy-api/envoy/extensions/filters/common/fault/v3/fault.proto

import type { FractionalPercent as _envoy_type_v3_FractionalPercent, FractionalPercent__Output as _envoy_type_v3_FractionalPercent__Output } from '../../../../../../envoy/type/v3/FractionalPercent';
import type { Long } from '@grpc/proto-loader';

/**
 * Describes a fixed/constant rate limit.
 */
export interface _envoy_extensions_filters_common_fault_v3_FaultRateLimit_FixedLimit {
  /**
   * The limit supplied in KiB/s.
   */
  'limit_kbps'?: (number | string | Long);
}

/**
 * Describes a fixed/constant rate limit.
 */
export interface _envoy_extensions_filters_common_fault_v3_FaultRateLimit_FixedLimit__Output {
  /**
   * The limit supplied in KiB/s.
   */
  'limit_kbps': (string);
}

/**
 * Rate limits are controlled via an HTTP header (if applicable). See the
 * :ref:`HTTP fault filter <config_http_filters_fault_injection_http_header>` documentation for
 * more information.
 */
export interface _envoy_extensions_filters_common_fault_v3_FaultRateLimit_HeaderLimit {
}

/**
 * Rate limits are controlled via an HTTP header (if applicable). See the
 * :ref:`HTTP fault filter <config_http_filters_fault_injection_http_header>` documentation for
 * more information.
 */
export interface _envoy_extensions_filters_common_fault_v3_FaultRateLimit_HeaderLimit__Output {
}

/**
 * Describes a rate limit to be applied.
 */
export interface FaultRateLimit {
  /**
   * A fixed rate limit.
   */
  'fixed_limit'?: (_envoy_extensions_filters_common_fault_v3_FaultRateLimit_FixedLimit | null);
  /**
   * The percentage of operations/connections/requests on which the rate limit will be injected.
   */
  'percentage'?: (_envoy_type_v3_FractionalPercent | null);
  /**
   * Rate limits are controlled via an HTTP header (if applicable).
   */
  'header_limit'?: (_envoy_extensions_filters_common_fault_v3_FaultRateLimit_HeaderLimit | null);
  'limit_type'?: "fixed_limit"|"header_limit";
}

/**
 * Describes a rate limit to be applied.
 */
export interface FaultRateLimit__Output {
  /**
   * A fixed rate limit.
   */
  'fixed_limit'?: (_envoy_extensions_filters_common_fault_v3_FaultRateLimit_FixedLimit__Output | null);
  /**
   * The percentage of operations/connections/requests on which the rate limit will be injected.
   */
  'percentage': (_envoy_type_v3_FractionalPercent__Output | null);
  /**
   * Rate limits are controlled via an HTTP header (if applicable).
   */
  'header_limit'?: (_envoy_extensions_filters_common_fault_v3_FaultRateLimit_HeaderLimit__Output | null);
  'limit_type': "fixed_limit"|"header_limit";
}
