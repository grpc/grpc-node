// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from '../../../../envoy/type/matcher/RegexMatcher';
import { Int64Range as _envoy_type_Int64Range, Int64Range__Output as _envoy_type_Int64Range__Output } from '../../../../envoy/type/Int64Range';
import { Long } from '@grpc/proto-loader';

export interface HeaderMatcher {
  'name'?: (string);
  'exact_match'?: (string);
  'regex_match'?: (string);
  'safe_regex_match'?: (_envoy_type_matcher_RegexMatcher);
  'range_match'?: (_envoy_type_Int64Range);
  'present_match'?: (boolean);
  'prefix_match'?: (string);
  'suffix_match'?: (string);
  'invert_match'?: (boolean);
  'header_match_specifier'?: "exact_match"|"regex_match"|"safe_regex_match"|"range_match"|"present_match"|"prefix_match"|"suffix_match";
}

export interface HeaderMatcher__Output {
  'name': (string);
  'exact_match'?: (string);
  'regex_match'?: (string);
  'safe_regex_match'?: (_envoy_type_matcher_RegexMatcher__Output);
  'range_match'?: (_envoy_type_Int64Range__Output);
  'present_match'?: (boolean);
  'prefix_match'?: (string);
  'suffix_match'?: (string);
  'invert_match': (boolean);
  'header_match_specifier': "exact_match"|"regex_match"|"safe_regex_match"|"range_match"|"present_match"|"prefix_match"|"suffix_match";
}
