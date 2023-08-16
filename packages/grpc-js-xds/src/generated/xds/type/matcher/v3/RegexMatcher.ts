// Original file: deps/xds/xds/type/matcher/v3/regex.proto


/**
 * Google's `RE2 <https://github.com/google/re2>`_ regex engine. The regex
 * string must adhere to the documented `syntax
 * <https://github.com/google/re2/wiki/Syntax>`_. The engine is designed to
 * complete execution in linear time as well as limit the amount of memory
 * used.
 * 
 * Envoy supports program size checking via runtime. The runtime keys
 * `re2.max_program_size.error_level` and `re2.max_program_size.warn_level`
 * can be set to integers as the maximum program size or complexity that a
 * compiled regex can have before an exception is thrown or a warning is
 * logged, respectively. `re2.max_program_size.error_level` defaults to 100,
 * and `re2.max_program_size.warn_level` has no default if unset (will not
 * check/log a warning).
 * 
 * Envoy emits two stats for tracking the program size of regexes: the
 * histogram `re2.program_size`, which records the program size, and the
 * counter `re2.exceeded_warn_level`, which is incremented each time the
 * program size exceeds the warn level threshold.
 */
export interface _xds_type_matcher_v3_RegexMatcher_GoogleRE2 {
}

/**
 * Google's `RE2 <https://github.com/google/re2>`_ regex engine. The regex
 * string must adhere to the documented `syntax
 * <https://github.com/google/re2/wiki/Syntax>`_. The engine is designed to
 * complete execution in linear time as well as limit the amount of memory
 * used.
 * 
 * Envoy supports program size checking via runtime. The runtime keys
 * `re2.max_program_size.error_level` and `re2.max_program_size.warn_level`
 * can be set to integers as the maximum program size or complexity that a
 * compiled regex can have before an exception is thrown or a warning is
 * logged, respectively. `re2.max_program_size.error_level` defaults to 100,
 * and `re2.max_program_size.warn_level` has no default if unset (will not
 * check/log a warning).
 * 
 * Envoy emits two stats for tracking the program size of regexes: the
 * histogram `re2.program_size`, which records the program size, and the
 * counter `re2.exceeded_warn_level`, which is incremented each time the
 * program size exceeds the warn level threshold.
 */
export interface _xds_type_matcher_v3_RegexMatcher_GoogleRE2__Output {
}

/**
 * A regex matcher designed for safety when used with untrusted input.
 */
export interface RegexMatcher {
  /**
   * Google's RE2 regex engine.
   */
  'google_re2'?: (_xds_type_matcher_v3_RegexMatcher_GoogleRE2 | null);
  /**
   * The regex match string. The string must be supported by the configured
   * engine.
   */
  'regex'?: (string);
  'engine_type'?: "google_re2";
}

/**
 * A regex matcher designed for safety when used with untrusted input.
 */
export interface RegexMatcher__Output {
  /**
   * Google's RE2 regex engine.
   */
  'google_re2'?: (_xds_type_matcher_v3_RegexMatcher_GoogleRE2__Output | null);
  /**
   * The regex match string. The string must be supported by the configured
   * engine.
   */
  'regex': (string);
  'engine_type': "google_re2";
}
