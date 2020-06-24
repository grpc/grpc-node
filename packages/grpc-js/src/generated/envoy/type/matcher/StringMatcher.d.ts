// Original file: deps/envoy-api/envoy/type/matcher/string.proto

import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from '../../../envoy/type/matcher/RegexMatcher';

export interface StringMatcher {
  'exact'?: (string);
  'prefix'?: (string);
  'suffix'?: (string);
  'regex'?: (string);
  'safe_regex'?: (_envoy_type_matcher_RegexMatcher);
  'ignore_case'?: (boolean);
  'match_pattern'?: "exact"|"prefix"|"suffix"|"regex"|"safe_regex";
}

export interface StringMatcher__Output {
  'exact'?: (string);
  'prefix'?: (string);
  'suffix'?: (string);
  'regex'?: (string);
  'safe_regex'?: (_envoy_type_matcher_RegexMatcher__Output);
  'ignore_case': (boolean);
  'match_pattern': "exact"|"prefix"|"suffix"|"regex"|"safe_regex";
}
