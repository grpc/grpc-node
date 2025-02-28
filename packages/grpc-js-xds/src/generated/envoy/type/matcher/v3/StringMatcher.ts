// Original file: deps/envoy-api/envoy/type/matcher/v3/string.proto

import type { RegexMatcher as _envoy_type_matcher_v3_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_v3_RegexMatcher__Output } from '../../../../envoy/type/matcher/v3/RegexMatcher';
import type { TypedExtensionConfig as _xds_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _xds_core_v3_TypedExtensionConfig__Output } from '../../../../xds/core/v3/TypedExtensionConfig';

/**
 * Specifies the way to match a string.
 * [#next-free-field: 9]
 */
export interface StringMatcher {
  /**
   * The input string must match exactly the string specified here.
   * 
   * Examples:
   * 
   * * ``abc`` only matches the value ``abc``.
   */
  'exact'?: (string);
  /**
   * The input string must have the prefix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * ``abc`` matches the value ``abc.xyz``
   */
  'prefix'?: (string);
  /**
   * The input string must have the suffix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * ``abc`` matches the value ``xyz.abc``
   */
  'suffix'?: (string);
  /**
   * The input string must match the regular expression specified here.
   */
  'safe_regex'?: (_envoy_type_matcher_v3_RegexMatcher | null);
  /**
   * If true, indicates the exact/prefix/suffix/contains matching should be case insensitive. This
   * has no effect for the safe_regex match.
   * For example, the matcher ``data`` will match both input string ``Data`` and ``data`` if set to true.
   */
  'ignore_case'?: (boolean);
  /**
   * The input string must have the substring specified here.
   * Note: empty contains match is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * ``abc`` matches the value ``xyz.abc.def``
   */
  'contains'?: (string);
  /**
   * Use an extension as the matcher type.
   * [#extension-category: envoy.string_matcher]
   */
  'custom'?: (_xds_core_v3_TypedExtensionConfig | null);
  'match_pattern'?: "exact"|"prefix"|"suffix"|"safe_regex"|"contains"|"custom";
}

/**
 * Specifies the way to match a string.
 * [#next-free-field: 9]
 */
export interface StringMatcher__Output {
  /**
   * The input string must match exactly the string specified here.
   * 
   * Examples:
   * 
   * * ``abc`` only matches the value ``abc``.
   */
  'exact'?: (string);
  /**
   * The input string must have the prefix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * ``abc`` matches the value ``abc.xyz``
   */
  'prefix'?: (string);
  /**
   * The input string must have the suffix specified here.
   * Note: empty prefix is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * ``abc`` matches the value ``xyz.abc``
   */
  'suffix'?: (string);
  /**
   * The input string must match the regular expression specified here.
   */
  'safe_regex'?: (_envoy_type_matcher_v3_RegexMatcher__Output | null);
  /**
   * If true, indicates the exact/prefix/suffix/contains matching should be case insensitive. This
   * has no effect for the safe_regex match.
   * For example, the matcher ``data`` will match both input string ``Data`` and ``data`` if set to true.
   */
  'ignore_case': (boolean);
  /**
   * The input string must have the substring specified here.
   * Note: empty contains match is not allowed, please use regex instead.
   * 
   * Examples:
   * 
   * * ``abc`` matches the value ``xyz.abc.def``
   */
  'contains'?: (string);
  /**
   * Use an extension as the matcher type.
   * [#extension-category: envoy.string_matcher]
   */
  'custom'?: (_xds_core_v3_TypedExtensionConfig__Output | null);
  'match_pattern'?: "exact"|"prefix"|"suffix"|"safe_regex"|"contains"|"custom";
}
