// Original file: deps/envoy-api/envoy/type/matcher/v3/value.proto

import type { DoubleMatcher as _envoy_type_matcher_v3_DoubleMatcher, DoubleMatcher__Output as _envoy_type_matcher_v3_DoubleMatcher__Output } from '../../../../envoy/type/matcher/v3/DoubleMatcher';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';
import type { ListMatcher as _envoy_type_matcher_v3_ListMatcher, ListMatcher__Output as _envoy_type_matcher_v3_ListMatcher__Output } from '../../../../envoy/type/matcher/v3/ListMatcher';

/**
 * NullMatch is an empty message to specify a null value.
 */
export interface _envoy_type_matcher_v3_ValueMatcher_NullMatch {
}

/**
 * NullMatch is an empty message to specify a null value.
 */
export interface _envoy_type_matcher_v3_ValueMatcher_NullMatch__Output {
}

/**
 * Specifies the way to match a ProtobufWkt::Value. Primitive values and ListValue are supported.
 * StructValue is not supported and is always not matched.
 * [#next-free-field: 7]
 */
export interface ValueMatcher {
  /**
   * If specified, a match occurs if and only if the target value is a NullValue.
   */
  'null_match'?: (_envoy_type_matcher_v3_ValueMatcher_NullMatch | null);
  /**
   * If specified, a match occurs if and only if the target value is a double value and is
   * matched to this field.
   */
  'double_match'?: (_envoy_type_matcher_v3_DoubleMatcher | null);
  /**
   * If specified, a match occurs if and only if the target value is a string value and is
   * matched to this field.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * If specified, a match occurs if and only if the target value is a bool value and is equal
   * to this field.
   */
  'bool_match'?: (boolean);
  /**
   * If specified, value match will be performed based on whether the path is referring to a
   * valid primitive value in the metadata. If the path is referring to a non-primitive value,
   * the result is always not matched.
   */
  'present_match'?: (boolean);
  /**
   * If specified, a match occurs if and only if the target value is a list value and
   * is matched to this field.
   */
  'list_match'?: (_envoy_type_matcher_v3_ListMatcher | null);
  /**
   * Specifies how to match a value.
   */
  'match_pattern'?: "null_match"|"double_match"|"string_match"|"bool_match"|"present_match"|"list_match";
}

/**
 * Specifies the way to match a ProtobufWkt::Value. Primitive values and ListValue are supported.
 * StructValue is not supported and is always not matched.
 * [#next-free-field: 7]
 */
export interface ValueMatcher__Output {
  /**
   * If specified, a match occurs if and only if the target value is a NullValue.
   */
  'null_match'?: (_envoy_type_matcher_v3_ValueMatcher_NullMatch__Output | null);
  /**
   * If specified, a match occurs if and only if the target value is a double value and is
   * matched to this field.
   */
  'double_match'?: (_envoy_type_matcher_v3_DoubleMatcher__Output | null);
  /**
   * If specified, a match occurs if and only if the target value is a string value and is
   * matched to this field.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * If specified, a match occurs if and only if the target value is a bool value and is equal
   * to this field.
   */
  'bool_match'?: (boolean);
  /**
   * If specified, value match will be performed based on whether the path is referring to a
   * valid primitive value in the metadata. If the path is referring to a non-primitive value,
   * the result is always not matched.
   */
  'present_match'?: (boolean);
  /**
   * If specified, a match occurs if and only if the target value is a list value and
   * is matched to this field.
   */
  'list_match'?: (_envoy_type_matcher_v3_ListMatcher__Output | null);
  /**
   * Specifies how to match a value.
   */
  'match_pattern': "null_match"|"double_match"|"string_match"|"bool_match"|"present_match"|"list_match";
}
