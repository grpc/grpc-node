// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';

/**
 * Query parameter matching treats the query string of a request's :path header
 * as an ampersand-separated list of keys and/or key=value elements.
 * [#next-free-field: 7]
 */
export interface QueryParameterMatcher {
  /**
   * Specifies the name of a key that must be present in the requested
   * ``path``'s query string.
   */
  'name'?: (string);
  /**
   * Specifies whether a query parameter value should match against a string.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * Specifies whether a query parameter should be present.
   */
  'present_match'?: (boolean);
  'query_parameter_match_specifier'?: "string_match"|"present_match";
}

/**
 * Query parameter matching treats the query string of a request's :path header
 * as an ampersand-separated list of keys and/or key=value elements.
 * [#next-free-field: 7]
 */
export interface QueryParameterMatcher__Output {
  /**
   * Specifies the name of a key that must be present in the requested
   * ``path``'s query string.
   */
  'name': (string);
  /**
   * Specifies whether a query parameter value should match against a string.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * Specifies whether a query parameter should be present.
   */
  'present_match'?: (boolean);
  'query_parameter_match_specifier': "string_match"|"present_match";
}
