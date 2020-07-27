// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';

/**
 * Query parameter matching treats the query string of a request's :path header
 * as an ampersand-separated list of keys and/or key=value elements.
 * [#next-free-field: 7]
 */
export interface QueryParameterMatcher {
  /**
   * Specifies the name of a key that must be present in the requested
   * *path*'s query string.
   */
  'name'?: (string);
  /**
   * Specifies the value of the key. If the value is absent, a request
   * that contains the key in its query string will match, whether the
   * key appears with a value (e.g., "?debug=true") or not (e.g., "?debug")
   * 
   * ..attention::
   * This field is deprecated. Use an `exact` match inside the `string_match` field.
   */
  'value'?: (string);
  /**
   * Specifies whether the query parameter value is a regular expression.
   * Defaults to false. The entire query parameter value (i.e., the part to
   * the right of the equals sign in "key=value") must match the regex.
   * E.g., the regex ``\d+$`` will match *123* but not *a123* or *123a*.
   * 
   * ..attention::
   * This field is deprecated. Use a `safe_regex` match inside the `string_match` field.
   */
  'regex'?: (_google_protobuf_BoolValue);
  /**
   * Specifies whether a query parameter value should match against a string.
   */
  'string_match'?: (_envoy_type_matcher_StringMatcher);
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
   * *path*'s query string.
   */
  'name': (string);
  /**
   * Specifies the value of the key. If the value is absent, a request
   * that contains the key in its query string will match, whether the
   * key appears with a value (e.g., "?debug=true") or not (e.g., "?debug")
   * 
   * ..attention::
   * This field is deprecated. Use an `exact` match inside the `string_match` field.
   */
  'value': (string);
  /**
   * Specifies whether the query parameter value is a regular expression.
   * Defaults to false. The entire query parameter value (i.e., the part to
   * the right of the equals sign in "key=value") must match the regex.
   * E.g., the regex ``\d+$`` will match *123* but not *a123* or *123a*.
   * 
   * ..attention::
   * This field is deprecated. Use a `safe_regex` match inside the `string_match` field.
   */
  'regex'?: (_google_protobuf_BoolValue__Output);
  /**
   * Specifies whether a query parameter value should match against a string.
   */
  'string_match'?: (_envoy_type_matcher_StringMatcher__Output);
  /**
   * Specifies whether a query parameter should be present.
   */
  'present_match'?: (boolean);
  'query_parameter_match_specifier': "string_match"|"present_match";
}
