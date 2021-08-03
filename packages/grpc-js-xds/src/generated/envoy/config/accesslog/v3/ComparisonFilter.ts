// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { RuntimeUInt32 as _envoy_config_core_v3_RuntimeUInt32, RuntimeUInt32__Output as _envoy_config_core_v3_RuntimeUInt32__Output } from '../../../../envoy/config/core/v3/RuntimeUInt32';

// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

export enum _envoy_config_accesslog_v3_ComparisonFilter_Op {
  /**
   * =
   */
  EQ = 0,
  /**
   * >=
   */
  GE = 1,
  /**
   * <=
   */
  LE = 2,
}

/**
 * Filter on an integer comparison.
 */
export interface ComparisonFilter {
  /**
   * Comparison operator.
   */
  'op'?: (_envoy_config_accesslog_v3_ComparisonFilter_Op | keyof typeof _envoy_config_accesslog_v3_ComparisonFilter_Op);
  /**
   * Value to compare against.
   */
  'value'?: (_envoy_config_core_v3_RuntimeUInt32 | null);
}

/**
 * Filter on an integer comparison.
 */
export interface ComparisonFilter__Output {
  /**
   * Comparison operator.
   */
  'op': (keyof typeof _envoy_config_accesslog_v3_ComparisonFilter_Op);
  /**
   * Value to compare against.
   */
  'value': (_envoy_config_core_v3_RuntimeUInt32__Output | null);
}
