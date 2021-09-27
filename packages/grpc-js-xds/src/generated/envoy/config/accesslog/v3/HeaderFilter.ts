// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { HeaderMatcher as _envoy_config_route_v3_HeaderMatcher, HeaderMatcher__Output as _envoy_config_route_v3_HeaderMatcher__Output } from '../../../../envoy/config/route/v3/HeaderMatcher';

/**
 * Filters requests based on the presence or value of a request header.
 */
export interface HeaderFilter {
  /**
   * Only requests with a header which matches the specified HeaderMatcher will
   * pass the filter check.
   */
  'header'?: (_envoy_config_route_v3_HeaderMatcher | null);
}

/**
 * Filters requests based on the presence or value of a request header.
 */
export interface HeaderFilter__Output {
  /**
   * Only requests with a header which matches the specified HeaderMatcher will
   * pass the filter check.
   */
  'header': (_envoy_config_route_v3_HeaderMatcher__Output | null);
}
