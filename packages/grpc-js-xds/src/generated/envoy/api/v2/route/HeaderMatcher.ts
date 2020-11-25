// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { Int64Range as _envoy_type_Int64Range, Int64Range__Output as _envoy_type_Int64Range__Output } from '../../../../envoy/type/Int64Range';
import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from '../../../../envoy/type/matcher/RegexMatcher';
import { Long } from '@grpc/proto-loader';

/**
 * .. attention::
 * 
 * Internally, Envoy always uses the HTTP/2 *:authority* header to represent the HTTP/1 *Host*
 * header. Thus, if attempting to match on *Host*, match on *:authority* instead.
 * 
 * .. attention::
 * 
 * To route on HTTP method, use the special HTTP/2 *:method* header. This works for both
 * HTTP/1 and HTTP/2 as Envoy normalizes headers. E.g.,
 * 
 * .. code-block:: json
 * 
 * {
 * "name": ":method",
 * "exact_match": "POST"
 * }
 * 
 * .. attention::
 * In the absence of any header match specifier, match will default to :ref:`present_match
 * <envoy_api_field_route.HeaderMatcher.present_match>`. i.e, a request that has the :ref:`name
 * <envoy_api_field_route.HeaderMatcher.name>` header will match, regardless of the header's
 * value.
 * 
 * [#next-major-version: HeaderMatcher should be refactored to use StringMatcher.]
 * [#next-free-field: 12]
 */
export interface HeaderMatcher {
  /**
   * Specifies the name of the header in the request.
   */
  'name'?: (string);
  /**
   * If specified, header match will be performed based on the value of the header.
   */
  'exact_match'?: (string);
  /**
   * If specified, this regex string is a regular expression rule which implies the entire request
   * header value must match the regex. The rule will not match if only a subsequence of the
   * request header value matches the regex. The regex grammar used in the value field is defined
   * `here <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` matches the value *123*
   * * The regex ``\d{3}`` does not match the value *1234*
   * * The regex ``\d{3}`` does not match the value *123.456*
   * 
   * .. attention::
   * This field has been deprecated in favor of `safe_regex_match` as it is not safe for use
   * with untrusted input in all cases.
   */
  'regex_match'?: (string);
  /**
   * If specified, header match will be performed based on range.
   * The rule will match if the request header value is within this range.
   * The entire request header value must represent an integer in base 10 notation: consisting of
   * an optional plus or minus sign followed by a sequence of digits. The rule will not match if
   * the header value does not represent an integer. Match will fail for empty values, floating
   * point numbers or if only a subsequence of the header value is an integer.
   * 
   * Examples:
   * 
   * * For range [-10,0), route will match for header value -1, but not for 0, "somestring", 10.9,
   * "-1somestring"
   */
  'range_match'?: (_envoy_type_Int64Range);
  /**
   * If specified, header match will be performed based on whether the header is in the
   * request.
   */
  'present_match'?: (boolean);
  /**
   * If specified, the match result will be inverted before checking. Defaults to false.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` does not match the value *1234*, so it will match when inverted.
   * * The range [-10,0) will match the value -1, so it will not match when inverted.
   */
  'invert_match'?: (boolean);
  /**
   * If specified, header match will be performed based on the prefix of the header value.
   * Note: empty prefix is not allowed, please use present_match instead.
   * 
   * Examples:
   * 
   * * The prefix *abcd* matches the value *abcdxyz*, but not for *abcxyz*.
   */
  'prefix_match'?: (string);
  /**
   * If specified, header match will be performed based on the suffix of the header value.
   * Note: empty suffix is not allowed, please use present_match instead.
   * 
   * Examples:
   * 
   * * The suffix *abcd* matches the value *xyzabcd*, but not for *xyzbcd*.
   */
  'suffix_match'?: (string);
  /**
   * If specified, this regex string is a regular expression rule which implies the entire request
   * header value must match the regex. The rule will not match if only a subsequence of the
   * request header value matches the regex.
   */
  'safe_regex_match'?: (_envoy_type_matcher_RegexMatcher);
  /**
   * Specifies how the header match will be performed to route the request.
   */
  'header_match_specifier'?: "exact_match"|"regex_match"|"safe_regex_match"|"range_match"|"present_match"|"prefix_match"|"suffix_match";
}

/**
 * .. attention::
 * 
 * Internally, Envoy always uses the HTTP/2 *:authority* header to represent the HTTP/1 *Host*
 * header. Thus, if attempting to match on *Host*, match on *:authority* instead.
 * 
 * .. attention::
 * 
 * To route on HTTP method, use the special HTTP/2 *:method* header. This works for both
 * HTTP/1 and HTTP/2 as Envoy normalizes headers. E.g.,
 * 
 * .. code-block:: json
 * 
 * {
 * "name": ":method",
 * "exact_match": "POST"
 * }
 * 
 * .. attention::
 * In the absence of any header match specifier, match will default to :ref:`present_match
 * <envoy_api_field_route.HeaderMatcher.present_match>`. i.e, a request that has the :ref:`name
 * <envoy_api_field_route.HeaderMatcher.name>` header will match, regardless of the header's
 * value.
 * 
 * [#next-major-version: HeaderMatcher should be refactored to use StringMatcher.]
 * [#next-free-field: 12]
 */
export interface HeaderMatcher__Output {
  /**
   * Specifies the name of the header in the request.
   */
  'name': (string);
  /**
   * If specified, header match will be performed based on the value of the header.
   */
  'exact_match'?: (string);
  /**
   * If specified, this regex string is a regular expression rule which implies the entire request
   * header value must match the regex. The rule will not match if only a subsequence of the
   * request header value matches the regex. The regex grammar used in the value field is defined
   * `here <https://en.cppreference.com/w/cpp/regex/ecmascript>`_.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` matches the value *123*
   * * The regex ``\d{3}`` does not match the value *1234*
   * * The regex ``\d{3}`` does not match the value *123.456*
   * 
   * .. attention::
   * This field has been deprecated in favor of `safe_regex_match` as it is not safe for use
   * with untrusted input in all cases.
   */
  'regex_match'?: (string);
  /**
   * If specified, header match will be performed based on range.
   * The rule will match if the request header value is within this range.
   * The entire request header value must represent an integer in base 10 notation: consisting of
   * an optional plus or minus sign followed by a sequence of digits. The rule will not match if
   * the header value does not represent an integer. Match will fail for empty values, floating
   * point numbers or if only a subsequence of the header value is an integer.
   * 
   * Examples:
   * 
   * * For range [-10,0), route will match for header value -1, but not for 0, "somestring", 10.9,
   * "-1somestring"
   */
  'range_match'?: (_envoy_type_Int64Range__Output);
  /**
   * If specified, header match will be performed based on whether the header is in the
   * request.
   */
  'present_match'?: (boolean);
  /**
   * If specified, the match result will be inverted before checking. Defaults to false.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` does not match the value *1234*, so it will match when inverted.
   * * The range [-10,0) will match the value -1, so it will not match when inverted.
   */
  'invert_match': (boolean);
  /**
   * If specified, header match will be performed based on the prefix of the header value.
   * Note: empty prefix is not allowed, please use present_match instead.
   * 
   * Examples:
   * 
   * * The prefix *abcd* matches the value *abcdxyz*, but not for *abcxyz*.
   */
  'prefix_match'?: (string);
  /**
   * If specified, header match will be performed based on the suffix of the header value.
   * Note: empty suffix is not allowed, please use present_match instead.
   * 
   * Examples:
   * 
   * * The suffix *abcd* matches the value *xyzabcd*, but not for *xyzbcd*.
   */
  'suffix_match'?: (string);
  /**
   * If specified, this regex string is a regular expression rule which implies the entire request
   * header value must match the regex. The rule will not match if only a subsequence of the
   * request header value matches the regex.
   */
  'safe_regex_match'?: (_envoy_type_matcher_RegexMatcher__Output);
  /**
   * Specifies how the header match will be performed to route the request.
   */
  'header_match_specifier': "exact_match"|"regex_match"|"safe_regex_match"|"range_match"|"present_match"|"prefix_match"|"suffix_match";
}
