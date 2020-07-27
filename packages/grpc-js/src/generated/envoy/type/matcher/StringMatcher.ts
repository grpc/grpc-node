// Original file: deps/envoy-api/envoy/type/matcher/string.proto

import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from '../../../envoy/type/matcher/RegexMatcher';

/**
 * Specifies the way to match a string.
 * [#next-free-field: 7]
 */
export interface StringMatcher {
  /**
   * The input string must match exactly the string specified here.
   * 
   * Examples:
   * 
   * * *abc* only matches the value *abc*.
   */
  'exact'?: (string);
  /**
   * The input string must have the prefix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * *abc* matches the value *abc.xyz*
   */
  'prefix'?: (string);
  /**
   * The input string must have the suffix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * *abc* matches the value *xyz.abc*
   */
  'suffix'?: (string);
  /**
   * The input string must match the regular expression specified here.
   * The regex grammar is defined `here
   * <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` matches the value *123*
   * * The regex ``\d{3}`` does not match the value *1234*
   * * The regex ``\d{3}`` does not match the value *123.456*
   * 
   * .. attention::
   * This field has been deprecated in favor of `safe_regex` as it is not safe for use with
   * untrusted input in all cases.
   */
  'regex'?: (string);
  /**
   * The input string must match the regular expression specified here.
   */
  'safe_regex'?: (_envoy_type_matcher_RegexMatcher);
  /**
   * If true, indicates the exact/prefix/suffix matching should be case insensitive. This has no
   * effect for the safe_regex match.
   * For example, the matcher *data* will match both input string *Data* and *data* if set to true.
   */
  'ignore_case'?: (boolean);
  'match_pattern'?: "exact"|"prefix"|"suffix"|"regex"|"safe_regex";
}

/**
 * Specifies the way to match a string.
 * [#next-free-field: 7]
 */
export interface StringMatcher__Output {
  /**
   * The input string must match exactly the string specified here.
   * 
   * Examples:
   * 
   * * *abc* only matches the value *abc*.
   */
  'exact'?: (string);
  /**
   * The input string must have the prefix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * *abc* matches the value *abc.xyz*
   */
  'prefix'?: (string);
  /**
   * The input string must have the suffix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * *abc* matches the value *xyz.abc*
   */
  'suffix'?: (string);
  /**
   * The input string must match the regular expression specified here.
   * The regex grammar is defined `here
   * <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` matches the value *123*
   * * The regex ``\d{3}`` does not match the value *1234*
   * * The regex ``\d{3}`` does not match the value *123.456*
   * 
   * .. attention::
   * This field has been deprecated in favor of `safe_regex` as it is not safe for use with
   * untrusted input in all cases.
   */
  'regex'?: (string);
  /**
   * The input string must match the regular expression specified here.
   */
  'safe_regex'?: (_envoy_type_matcher_RegexMatcher__Output);
  /**
   * If true, indicates the exact/prefix/suffix matching should be case insensitive. This has no
   * effect for the safe_regex match.
   * For example, the matcher *data* will match both input string *Data* and *data* if set to true.
   */
  'ignore_case': (boolean);
  'match_pattern': "exact"|"prefix"|"suffix"|"regex"|"safe_regex";
}
