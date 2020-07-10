// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { RequestMethod as _envoy_api_v2_core_RequestMethod } from '../../../../envoy/api/v2/core/RequestMethod';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';

export interface VirtualCluster {
  'pattern'?: (string);
  'name'?: (string);
  'method'?: (_envoy_api_v2_core_RequestMethod | keyof typeof _envoy_api_v2_core_RequestMethod);
  'headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
}

export interface VirtualCluster__Output {
  'pattern': (string);
  'name': (string);
  'method': (keyof typeof _envoy_api_v2_core_RequestMethod);
  'headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
}
