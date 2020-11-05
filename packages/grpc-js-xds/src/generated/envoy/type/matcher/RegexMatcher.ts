// Original file: deps/envoy-api/envoy/type/matcher/regex.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';

/**
 * Google's `RE2 <https://github.com/google/re2>`_ regex engine. The regex string must adhere to
 * the documented `syntax <https://github.com/google/re2/wiki/Syntax>`_. The engine is designed
 * to complete execution in linear time as well as limit the amount of memory used.
 */
export interface _envoy_type_matcher_RegexMatcher_GoogleRE2 {
  /**
   * This field controls the RE2 "program size" which is a rough estimate of how complex a
   * compiled regex is to evaluate. A regex that has a program size greater than the configured
   * value will fail to compile. In this case, the configured max program size can be increased
   * or the regex can be simplified. If not specified, the default is 100.
   * 
   * This field is deprecated; regexp validation should be performed on the management server
   * instead of being done by each individual client.
   */
  'max_program_size'?: (_google_protobuf_UInt32Value);
}

/**
 * Google's `RE2 <https://github.com/google/re2>`_ regex engine. The regex string must adhere to
 * the documented `syntax <https://github.com/google/re2/wiki/Syntax>`_. The engine is designed
 * to complete execution in linear time as well as limit the amount of memory used.
 */
export interface _envoy_type_matcher_RegexMatcher_GoogleRE2__Output {
  /**
   * This field controls the RE2 "program size" which is a rough estimate of how complex a
   * compiled regex is to evaluate. A regex that has a program size greater than the configured
   * value will fail to compile. In this case, the configured max program size can be increased
   * or the regex can be simplified. If not specified, the default is 100.
   * 
   * This field is deprecated; regexp validation should be performed on the management server
   * instead of being done by each individual client.
   */
  'max_program_size'?: (_google_protobuf_UInt32Value__Output);
}

/**
 * A regex matcher designed for safety when used with untrusted input.
 */
export interface RegexMatcher {
  /**
   * Google's RE2 regex engine.
   */
  'google_re2'?: (_envoy_type_matcher_RegexMatcher_GoogleRE2);
  /**
   * The regex match string. The string must be supported by the configured engine.
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
  'google_re2'?: (_envoy_type_matcher_RegexMatcher_GoogleRE2__Output);
  /**
   * The regex match string. The string must be supported by the configured engine.
   */
  'regex': (string);
  'engine_type': "google_re2";
}
