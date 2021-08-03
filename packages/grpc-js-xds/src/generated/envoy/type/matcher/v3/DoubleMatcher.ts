// Original file: deps/envoy-api/envoy/type/matcher/v3/number.proto

import type { DoubleRange as _envoy_type_v3_DoubleRange, DoubleRange__Output as _envoy_type_v3_DoubleRange__Output } from '../../../../envoy/type/v3/DoubleRange';

/**
 * Specifies the way to match a double value.
 */
export interface DoubleMatcher {
  /**
   * If specified, the input double value must be in the range specified here.
   * Note: The range is using half-open interval semantics [start, end).
   */
  'range'?: (_envoy_type_v3_DoubleRange | null);
  /**
   * If specified, the input double value must be equal to the value specified here.
   */
  'exact'?: (number | string);
  'match_pattern'?: "range"|"exact";
}

/**
 * Specifies the way to match a double value.
 */
export interface DoubleMatcher__Output {
  /**
   * If specified, the input double value must be in the range specified here.
   * Note: The range is using half-open interval semantics [start, end).
   */
  'range'?: (_envoy_type_v3_DoubleRange__Output | null);
  /**
   * If specified, the input double value must be equal to the value specified here.
   */
  'exact'?: (number);
  'match_pattern': "range"|"exact";
}
