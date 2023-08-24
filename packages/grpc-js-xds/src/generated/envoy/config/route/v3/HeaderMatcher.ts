// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { Int64Range as _envoy_type_v3_Int64Range, Int64Range__Output as _envoy_type_v3_Int64Range__Output } from '../../../../envoy/type/v3/Int64Range';
import type { RegexMatcher as _envoy_type_matcher_v3_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_v3_RegexMatcher__Output } from '../../../../envoy/type/matcher/v3/RegexMatcher';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';
import type { Long } from '@grpc/proto-loader';

/**
 * .. attention::
 * 
 * Internally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1 ``Host``
 * header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead.
 * 
 * .. attention::
 * 
 * To route on HTTP method, use the special HTTP/2 ``:method`` header. This works for both
 * HTTP/1 and HTTP/2 as Envoy normalizes headers. E.g.,
 * 
 * .. code-block:: json
 * 
 * {
 * "name": ":method",
 * "string_match": {
 * "exact": "POST"
 * }
 * }
 * 
 * .. attention::
 * In the absence of any header match specifier, match will default to :ref:`present_match
 * <envoy_v3_api_field_config.route.v3.HeaderMatcher.present_match>`. i.e, a request that has the :ref:`name
 * <envoy_v3_api_field_config.route.v3.HeaderMatcher.name>` header will match, regardless of the header's
 * value.
 * 
 * [#next-major-version: HeaderMatcher should be refactored to use StringMatcher.]
 * [#next-free-field: 15]
 */
export interface HeaderMatcher {
  /**
   * Specifies the name of the header in the request.
   */
  'name'?: (string);
  /**
   * If specified, header match will be performed based on the value of the header.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   */
  'exact_match'?: (string);
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
   * * For range [-10,0), route will match for header value -1, but not for 0, ``somestring``, 10.9,
   * ``-1somestring``
   */
  'range_match'?: (_envoy_type_v3_Int64Range | null);
  /**
   * If specified as true, header match will be performed based on whether the header is in the
   * request. If specified as false, header match will be performed based on whether the header is absent.
   */
  'present_match'?: (boolean);
  /**
   * If specified, the match result will be inverted before checking. Defaults to false.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` does not match the value ``1234``, so it will match when inverted.
   * * The range [-10,0) will match the value -1, so it will not match when inverted.
   */
  'invert_match'?: (boolean);
  /**
   * If specified, header match will be performed based on the prefix of the header value.
   * Note: empty prefix is not allowed, please use present_match instead.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   * 
   * Examples:
   * 
   * * The prefix ``abcd`` matches the value ``abcdxyz``, but not for ``abcxyz``.
   */
  'prefix_match'?: (string);
  /**
   * If specified, header match will be performed based on the suffix of the header value.
   * Note: empty suffix is not allowed, please use present_match instead.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   * 
   * Examples:
   * 
   * * The suffix ``abcd`` matches the value ``xyzabcd``, but not for ``xyzbcd``.
   */
  'suffix_match'?: (string);
  /**
   * If specified, this regex string is a regular expression rule which implies the entire request
   * header value must match the regex. The rule will not match if only a subsequence of the
   * request header value matches the regex.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   */
  'safe_regex_match'?: (_envoy_type_matcher_v3_RegexMatcher | null);
  /**
   * If specified, header match will be performed based on whether the header value contains
   * the given value or not.
   * Note: empty contains match is not allowed, please use present_match instead.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   * 
   * Examples:
   * 
   * * The value ``abcd`` matches the value ``xyzabcdpqr``, but not for ``xyzbcdpqr``.
   */
  'contains_match'?: (string);
  /**
   * If specified, header match will be performed based on the string match of the header value.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * If specified, for any header match rule, if the header match rule specified header
   * does not exist, this header value will be treated as empty. Defaults to false.
   * 
   * Examples:
   * 
   * * The header match rule specified header "header1" to range match of [0, 10],
   * :ref:`invert_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.invert_match>`
   * is set to true and :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to true; The "header1" header is not present. The match rule will
   * treat the "header1" as an empty header. The empty header does not match the range,
   * so it will match when inverted.
   * * The header match rule specified header "header2" to range match of [0, 10],
   * :ref:`invert_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.invert_match>`
   * is set to true and :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to false; The "header2" header is not present and the header
   * matcher rule for "header2" will be ignored so it will not match.
   * * The header match rule specified header "header3" to a string regex match
   * ``^$`` which means an empty string, and
   * :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to true; The "header3" header is not present.
   * The match rule will treat the "header3" header as an empty header so it will match.
   * * The header match rule specified header "header4" to a string regex match
   * ``^$`` which means an empty string, and
   * :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to false; The "header4" header is not present.
   * The match rule for "header4" will be ignored so it will not match.
   */
  'treat_missing_header_as_empty'?: (boolean);
  /**
   * Specifies how the header match will be performed to route the request.
   */
  'header_match_specifier'?: "exact_match"|"safe_regex_match"|"range_match"|"present_match"|"prefix_match"|"suffix_match"|"contains_match"|"string_match";
}

/**
 * .. attention::
 * 
 * Internally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1 ``Host``
 * header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead.
 * 
 * .. attention::
 * 
 * To route on HTTP method, use the special HTTP/2 ``:method`` header. This works for both
 * HTTP/1 and HTTP/2 as Envoy normalizes headers. E.g.,
 * 
 * .. code-block:: json
 * 
 * {
 * "name": ":method",
 * "string_match": {
 * "exact": "POST"
 * }
 * }
 * 
 * .. attention::
 * In the absence of any header match specifier, match will default to :ref:`present_match
 * <envoy_v3_api_field_config.route.v3.HeaderMatcher.present_match>`. i.e, a request that has the :ref:`name
 * <envoy_v3_api_field_config.route.v3.HeaderMatcher.name>` header will match, regardless of the header's
 * value.
 * 
 * [#next-major-version: HeaderMatcher should be refactored to use StringMatcher.]
 * [#next-free-field: 15]
 */
export interface HeaderMatcher__Output {
  /**
   * Specifies the name of the header in the request.
   */
  'name': (string);
  /**
   * If specified, header match will be performed based on the value of the header.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   */
  'exact_match'?: (string);
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
   * * For range [-10,0), route will match for header value -1, but not for 0, ``somestring``, 10.9,
   * ``-1somestring``
   */
  'range_match'?: (_envoy_type_v3_Int64Range__Output | null);
  /**
   * If specified as true, header match will be performed based on whether the header is in the
   * request. If specified as false, header match will be performed based on whether the header is absent.
   */
  'present_match'?: (boolean);
  /**
   * If specified, the match result will be inverted before checking. Defaults to false.
   * 
   * Examples:
   * 
   * * The regex ``\d{3}`` does not match the value ``1234``, so it will match when inverted.
   * * The range [-10,0) will match the value -1, so it will not match when inverted.
   */
  'invert_match': (boolean);
  /**
   * If specified, header match will be performed based on the prefix of the header value.
   * Note: empty prefix is not allowed, please use present_match instead.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   * 
   * Examples:
   * 
   * * The prefix ``abcd`` matches the value ``abcdxyz``, but not for ``abcxyz``.
   */
  'prefix_match'?: (string);
  /**
   * If specified, header match will be performed based on the suffix of the header value.
   * Note: empty suffix is not allowed, please use present_match instead.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   * 
   * Examples:
   * 
   * * The suffix ``abcd`` matches the value ``xyzabcd``, but not for ``xyzbcd``.
   */
  'suffix_match'?: (string);
  /**
   * If specified, this regex string is a regular expression rule which implies the entire request
   * header value must match the regex. The rule will not match if only a subsequence of the
   * request header value matches the regex.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   */
  'safe_regex_match'?: (_envoy_type_matcher_v3_RegexMatcher__Output | null);
  /**
   * If specified, header match will be performed based on whether the header value contains
   * the given value or not.
   * Note: empty contains match is not allowed, please use present_match instead.
   * This field is deprecated. Please use :ref:`string_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.string_match>`.
   * 
   * Examples:
   * 
   * * The value ``abcd`` matches the value ``xyzabcdpqr``, but not for ``xyzbcdpqr``.
   */
  'contains_match'?: (string);
  /**
   * If specified, header match will be performed based on the string match of the header value.
   */
  'string_match'?: (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * If specified, for any header match rule, if the header match rule specified header
   * does not exist, this header value will be treated as empty. Defaults to false.
   * 
   * Examples:
   * 
   * * The header match rule specified header "header1" to range match of [0, 10],
   * :ref:`invert_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.invert_match>`
   * is set to true and :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to true; The "header1" header is not present. The match rule will
   * treat the "header1" as an empty header. The empty header does not match the range,
   * so it will match when inverted.
   * * The header match rule specified header "header2" to range match of [0, 10],
   * :ref:`invert_match <envoy_v3_api_field_config.route.v3.HeaderMatcher.invert_match>`
   * is set to true and :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to false; The "header2" header is not present and the header
   * matcher rule for "header2" will be ignored so it will not match.
   * * The header match rule specified header "header3" to a string regex match
   * ``^$`` which means an empty string, and
   * :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to true; The "header3" header is not present.
   * The match rule will treat the "header3" header as an empty header so it will match.
   * * The header match rule specified header "header4" to a string regex match
   * ``^$`` which means an empty string, and
   * :ref:`treat_missing_header_as_empty <envoy_v3_api_field_config.route.v3.HeaderMatcher.treat_missing_header_as_empty>`
   * is set to false; The "header4" header is not present.
   * The match rule for "header4" will be ignored so it will not match.
   */
  'treat_missing_header_as_empty': (boolean);
  /**
   * Specifies how the header match will be performed to route the request.
   */
  'header_match_specifier': "exact_match"|"safe_regex_match"|"range_match"|"present_match"|"prefix_match"|"suffix_match"|"contains_match"|"string_match";
}
