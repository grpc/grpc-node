// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from '../../../../envoy/api/v2/core/RuntimeFractionalPercent';

export interface CorsPolicy {
  'allow_origin'?: (string)[];
  'allow_origin_regex'?: (string)[];
  'allow_origin_string_match'?: (_envoy_type_matcher_StringMatcher)[];
  'allow_methods'?: (string);
  'allow_headers'?: (string);
  'expose_headers'?: (string);
  'max_age'?: (string);
  'allow_credentials'?: (_google_protobuf_BoolValue);
  'enabled'?: (_google_protobuf_BoolValue);
  'filter_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent);
  'shadow_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent);
  'enabled_specifier'?: "enabled"|"filter_enabled";
}

export interface CorsPolicy__Output {
  'allow_origin': (string)[];
  'allow_origin_regex': (string)[];
  'allow_origin_string_match': (_envoy_type_matcher_StringMatcher__Output)[];
  'allow_methods': (string);
  'allow_headers': (string);
  'expose_headers': (string);
  'max_age': (string);
  'allow_credentials': (_google_protobuf_BoolValue__Output);
  'enabled'?: (_google_protobuf_BoolValue__Output);
  'filter_enabled'?: (_envoy_api_v2_core_RuntimeFractionalPercent__Output);
  'shadow_enabled': (_envoy_api_v2_core_RuntimeFractionalPercent__Output);
  'enabled_specifier': "enabled"|"filter_enabled";
}