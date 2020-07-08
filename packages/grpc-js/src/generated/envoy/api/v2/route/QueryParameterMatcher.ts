// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';

export interface QueryParameterMatcher {
  'name'?: (string);
  'value'?: (string);
  'regex'?: (_google_protobuf_BoolValue);
  'string_match'?: (_envoy_type_matcher_StringMatcher);
  'present_match'?: (boolean);
  'query_parameter_match_specifier'?: "string_match"|"present_match";
}

export interface QueryParameterMatcher__Output {
  'name': (string);
  'value': (string);
  'regex': (_google_protobuf_BoolValue__Output);
  'string_match'?: (_envoy_type_matcher_StringMatcher__Output);
  'present_match'?: (boolean);
  'query_parameter_match_specifier': "string_match"|"present_match";
}
