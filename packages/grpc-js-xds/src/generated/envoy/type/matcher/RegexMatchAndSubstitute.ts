// Original file: deps/envoy-api/envoy/type/matcher/regex.proto

import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from '../../../envoy/type/matcher/RegexMatcher';

/**
 * Describes how to match a string and then produce a new string using a regular
 * expression and a substitution string.
 */
export interface RegexMatchAndSubstitute {
  /**
   * The regular expression used to find portions of a string (hereafter called
   * the "subject string") that should be replaced. When a new string is
   * produced during the substitution operation, the new string is initially
   * the same as the subject string, but then all matches in the subject string
   * are replaced by the substitution string. If replacing all matches isn't
   * desired, regular expression anchors can be used to ensure a single match,
   * so as to replace just one occurrence of a pattern. Capture groups can be
   * used in the pattern to extract portions of the subject string, and then
   * referenced in the substitution string.
   */
  'pattern'?: (_envoy_type_matcher_RegexMatcher);
  /**
   * The string that should be substituted into matching portions of the
   * subject string during a substitution operation to produce a new string.
   * Capture groups in the pattern can be referenced in the substitution
   * string. Note, however, that the syntax for referring to capture groups is
   * defined by the chosen regular expression engine. Google's `RE2
   * <https://github.com/google/re2>`_ regular expression engine uses a
   * backslash followed by the capture group number to denote a numbered
   * capture group. E.g., ``\1`` refers to capture group 1, and ``\2`` refers
   * to capture group 2.
   */
  'substitution'?: (string);
}

/**
 * Describes how to match a string and then produce a new string using a regular
 * expression and a substitution string.
 */
export interface RegexMatchAndSubstitute__Output {
  /**
   * The regular expression used to find portions of a string (hereafter called
   * the "subject string") that should be replaced. When a new string is
   * produced during the substitution operation, the new string is initially
   * the same as the subject string, but then all matches in the subject string
   * are replaced by the substitution string. If replacing all matches isn't
   * desired, regular expression anchors can be used to ensure a single match,
   * so as to replace just one occurrence of a pattern. Capture groups can be
   * used in the pattern to extract portions of the subject string, and then
   * referenced in the substitution string.
   */
  'pattern'?: (_envoy_type_matcher_RegexMatcher__Output);
  /**
   * The string that should be substituted into matching portions of the
   * subject string during a substitution operation to produce a new string.
   * Capture groups in the pattern can be referenced in the substitution
   * string. Note, however, that the syntax for referring to capture groups is
   * defined by the chosen regular expression engine. Google's `RE2
   * <https://github.com/google/re2>`_ regular expression engine uses a
   * backslash followed by the capture group number to denote a numbered
   * capture group. E.g., ``\1`` refers to capture group 1, and ``\2`` refers
   * to capture group 2.
   */
  'substitution': (string);
}
