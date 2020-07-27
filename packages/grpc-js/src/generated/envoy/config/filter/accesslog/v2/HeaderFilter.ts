// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../../envoy/api/v2/route/HeaderMatcher';

/**
 * Filters requests based on the presence or value of a request header.
 */
export interface HeaderFilter {
  /**
   * Only requests with a header which matches the specified HeaderMatcher will pass the filter
   * check.
   */
  'header'?: (_envoy_api_v2_route_HeaderMatcher);
}

/**
 * Filters requests based on the presence or value of a request header.
 */
export interface HeaderFilter__Output {
  /**
   * Only requests with a header which matches the specified HeaderMatcher will pass the filter
   * check.
   */
  'header'?: (_envoy_api_v2_route_HeaderMatcher__Output);
}
