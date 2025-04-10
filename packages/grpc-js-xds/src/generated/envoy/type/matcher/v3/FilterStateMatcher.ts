// Original file: deps/envoy-api/envoy/type/matcher/v3/filter_state.proto

import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';

/**
 * FilterStateMatcher provides a general interface for matching the filter state objects.
 */
export interface FilterStateMatcher {
  /**
   * The filter state key to retrieve the object.
   */
  'key'?: (string);
  /**
   * Matches the filter state object as a string value.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher | null);
  'matcher'?: "string_match";
}

/**
 * FilterStateMatcher provides a general interface for matching the filter state objects.
 */
export interface FilterStateMatcher__Output {
  /**
   * The filter state key to retrieve the object.
   */
  'key': (string);
  /**
   * Matches the filter state object as a string value.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher__Output | null);
  'matcher'?: "string_match";
}
