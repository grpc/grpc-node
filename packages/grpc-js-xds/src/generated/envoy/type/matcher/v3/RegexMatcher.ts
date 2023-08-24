// Original file: deps/envoy-api/envoy/type/matcher/v3/regex.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * Google's `RE2 <https://github.com/google/re2>`_ regex engine. The regex string must adhere to
 * the documented `syntax <https://github.com/google/re2/wiki/Syntax>`_. The engine is designed
 * to complete execution in linear time as well as limit the amount of memory used.
 * 
 * Envoy supports program size checking via runtime. The runtime keys ``re2.max_program_size.error_level``
 * and ``re2.max_program_size.warn_level`` can be set to integers as the maximum program size or
 * complexity that a compiled regex can have before an exception is thrown or a warning is
 * logged, respectively. ``re2.max_program_size.error_level`` defaults to 100, and
 * ``re2.max_program_size.warn_level`` has no default if unset (will not check/log a warning).
 * 
 * Envoy emits two stats for tracking the program size of regexes: the histogram ``re2.program_size``,
 * which records the program size, and the counter ``re2.exceeded_warn_level``, which is incremented
 * each time the program size exceeds the warn level threshold.
 */
export interface _envoy_type_matcher_v3_RegexMatcher_GoogleRE2 {
  /**
   * This field controls the RE2 "program size" which is a rough estimate of how complex a
   * compiled regex is to evaluate. A regex that has a program size greater than the configured
   * value will fail to compile. In this case, the configured max program size can be increased
   * or the regex can be simplified. If not specified, the default is 100.
   * 
   * This field is deprecated; regexp validation should be performed on the management server
   * instead of being done by each individual client.
   * 
   * .. note::
   * 
   * Although this field is deprecated, the program size will still be checked against the
   * global ``re2.max_program_size.error_level`` runtime value.
   */
  'max_program_size'?: (_google_protobuf_UInt32Value | null);
}

/**
 * Google's `RE2 <https://github.com/google/re2>`_ regex engine. The regex string must adhere to
 * the documented `syntax <https://github.com/google/re2/wiki/Syntax>`_. The engine is designed
 * to complete execution in linear time as well as limit the amount of memory used.
 * 
 * Envoy supports program size checking via runtime. The runtime keys ``re2.max_program_size.error_level``
 * and ``re2.max_program_size.warn_level`` can be set to integers as the maximum program size or
 * complexity that a compiled regex can have before an exception is thrown or a warning is
 * logged, respectively. ``re2.max_program_size.error_level`` defaults to 100, and
 * ``re2.max_program_size.warn_level`` has no default if unset (will not check/log a warning).
 * 
 * Envoy emits two stats for tracking the program size of regexes: the histogram ``re2.program_size``,
 * which records the program size, and the counter ``re2.exceeded_warn_level``, which is incremented
 * each time the program size exceeds the warn level threshold.
 */
export interface _envoy_type_matcher_v3_RegexMatcher_GoogleRE2__Output {
  /**
   * This field controls the RE2 "program size" which is a rough estimate of how complex a
   * compiled regex is to evaluate. A regex that has a program size greater than the configured
   * value will fail to compile. In this case, the configured max program size can be increased
   * or the regex can be simplified. If not specified, the default is 100.
   * 
   * This field is deprecated; regexp validation should be performed on the management server
   * instead of being done by each individual client.
   * 
   * .. note::
   * 
   * Although this field is deprecated, the program size will still be checked against the
   * global ``re2.max_program_size.error_level`` runtime value.
   */
  'max_program_size': (_google_protobuf_UInt32Value__Output | null);
}

/**
 * A regex matcher designed for safety when used with untrusted input.
 */
export interface RegexMatcher {
  /**
   * Google's RE2 regex engine.
   */
  'google_re2'?: (_envoy_type_matcher_v3_RegexMatcher_GoogleRE2 | null);
  /**
   * The regex match string. The string must be supported by the configured engine. The regex is matched
   * against the full string, not as a partial match.
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
  'google_re2'?: (_envoy_type_matcher_v3_RegexMatcher_GoogleRE2__Output | null);
  /**
   * The regex match string. The string must be supported by the configured engine. The regex is matched
   * against the full string, not as a partial match.
   */
  'regex': (string);
  'engine_type': "google_re2";
}
