// Original file: deps/envoy-api/envoy/type/matcher/v3/value.proto

import type { ValueMatcher as _envoy_type_matcher_v3_ValueMatcher, ValueMatcher__Output as _envoy_type_matcher_v3_ValueMatcher__Output } from '../../../../envoy/type/matcher/v3/ValueMatcher';

/**
 * Specifies a list of alternatives for the match.
 */
export interface OrMatcher {
  'value_matchers'?: (_envoy_type_matcher_v3_ValueMatcher)[];
}

/**
 * Specifies a list of alternatives for the match.
 */
export interface OrMatcher__Output {
  'value_matchers': (_envoy_type_matcher_v3_ValueMatcher__Output)[];
}
