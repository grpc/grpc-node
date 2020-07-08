// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { RegexMatcher as _envoy_type_matcher_RegexMatcher, RegexMatcher__Output as _envoy_type_matcher_RegexMatcher__Output } from '../../../../envoy/type/matcher/RegexMatcher';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from '../../../../envoy/api/v2/core/RuntimeFractionalPercent';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';
import { QueryParameterMatcher as _envoy_api_v2_route_QueryParameterMatcher, QueryParameterMatcher__Output as _envoy_api_v2_route_QueryParameterMatcher__Output } from '../../../../envoy/api/v2/route/QueryParameterMatcher';

export interface _envoy_api_v2_route_RouteMatch_GrpcRouteMatchOptions {
}

export interface _envoy_api_v2_route_RouteMatch_GrpcRouteMatchOptions__Output {
}

export interface _envoy_api_v2_route_RouteMatch_TlsContextMatchOptions {
  'presented'?: (_google_protobuf_BoolValue);
  'validated'?: (_google_protobuf_BoolValue);
}

export interface _envoy_api_v2_route_RouteMatch_TlsContextMatchOptions__Output {
  'presented': (_google_protobuf_BoolValue__Output);
  'validated': (_google_protobuf_BoolValue__Output);
}

export interface RouteMatch {
  'prefix'?: (string);
  'path'?: (string);
  'regex'?: (string);
  'safe_regex'?: (_envoy_type_matcher_RegexMatcher);
  'case_sensitive'?: (_google_protobuf_BoolValue);
  'runtime_fraction'?: (_envoy_api_v2_core_RuntimeFractionalPercent);
  'headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
  'query_parameters'?: (_envoy_api_v2_route_QueryParameterMatcher)[];
  'grpc'?: (_envoy_api_v2_route_RouteMatch_GrpcRouteMatchOptions);
  'tls_context'?: (_envoy_api_v2_route_RouteMatch_TlsContextMatchOptions);
  'path_specifier'?: "prefix"|"path"|"regex"|"safe_regex";
}

export interface RouteMatch__Output {
  'prefix'?: (string);
  'path'?: (string);
  'regex'?: (string);
  'safe_regex'?: (_envoy_type_matcher_RegexMatcher__Output);
  'case_sensitive': (_google_protobuf_BoolValue__Output);
  'runtime_fraction': (_envoy_api_v2_core_RuntimeFractionalPercent__Output);
  'headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
  'query_parameters': (_envoy_api_v2_route_QueryParameterMatcher__Output)[];
  'grpc': (_envoy_api_v2_route_RouteMatch_GrpcRouteMatchOptions__Output);
  'tls_context': (_envoy_api_v2_route_RouteMatch_TlsContextMatchOptions__Output);
  'path_specifier': "prefix"|"path"|"regex"|"safe_regex";
}
