// Original file: deps/envoy-api/envoy/type/matcher/v3/value.proto

import type { ValueMatcher as _envoy_type_matcher_v3_ValueMatcher, ValueMatcher__Output as _envoy_type_matcher_v3_ValueMatcher__Output } from '../../../../envoy/type/matcher/v3/ValueMatcher';

/**
 * Specifies the way to match a list value.
 */
export interface ListMatcher {
  /**
   * If specified, at least one of the values in the list must match the value specified.
   */
  'one_of'?: (_envoy_type_matcher_v3_ValueMatcher | null);
  'match_pattern'?: "one_of";
}

/**
 * Specifies the way to match a list value.
 */
export interface ListMatcher__Output {
  /**
   * If specified, at least one of the values in the list must match the value specified.
   */
  'one_of'?: (_envoy_type_matcher_v3_ValueMatcher__Output | null);
  'match_pattern': "one_of";
}
