// Original file: deps/xds/xds/type/matcher/v3/string.proto

import type { RegexMatcher as _xds_type_matcher_v3_RegexMatcher, RegexMatcher__Output as _xds_type_matcher_v3_RegexMatcher__Output } from '../../../../xds/type/matcher/v3/RegexMatcher';

/**
 * Specifies the way to match a string.
 * [#next-free-field: 8]
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
   */
  'safe_regex'?: (_xds_type_matcher_v3_RegexMatcher | null);
  /**
   * If true, indicates the exact/prefix/suffix matching should be case insensitive. This has no
   * effect for the safe_regex match.
   * For example, the matcher *data* will match both input string *Data* and *data* if set to true.
   */
  'ignore_case'?: (boolean);
  /**
   * The input string must have the substring specified here.
   * Note: empty contains match is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * *abc* matches the value *xyz.abc.def*
   */
  'contains'?: (string);
  'match_pattern'?: "exact"|"prefix"|"suffix"|"safe_regex"|"contains";
}

/**
 * Specifies the way to match a string.
 * [#next-free-field: 8]
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
   */
  'safe_regex'?: (_xds_type_matcher_v3_RegexMatcher__Output | null);
  /**
   * If true, indicates the exact/prefix/suffix matching should be case insensitive. This has no
   * effect for the safe_regex match.
   * For example, the matcher *data* will match both input string *Data* and *data* if set to true.
   */
  'ignore_case': (boolean);
  /**
   * The input string must have the substring specified here.
   * Note: empty contains match is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * *abc* matches the value *xyz.abc.def*
   */
  'contains'?: (string);
  'match_pattern': "exact"|"prefix"|"suffix"|"safe_regex"|"contains";
}
