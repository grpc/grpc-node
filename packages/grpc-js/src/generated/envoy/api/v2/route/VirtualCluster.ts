// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';
import { RequestMethod as _envoy_api_v2_core_RequestMethod } from '../../../../envoy/api/v2/core/RequestMethod';

export interface VirtualCluster {
  'pattern'?: (string);
  'headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
  'name'?: (string);
  'method'?: (_envoy_api_v2_core_RequestMethod | keyof typeof _envoy_api_v2_core_RequestMethod);
}

export interface VirtualCluster__Output {
  'pattern': (string);
  'headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
  'name': (string);
  'method': (keyof typeof _envoy_api_v2_core_RequestMethod);
}
