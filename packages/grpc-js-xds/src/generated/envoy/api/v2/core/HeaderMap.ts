// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from '../../../../envoy/api/v2/core/HeaderValue';

/**
 * Wrapper for a set of headers.
 */
export interface HeaderMap {
  'headers'?: (_envoy_api_v2_core_HeaderValue)[];
}

/**
 * Wrapper for a set of headers.
 */
export interface HeaderMap__Output {
  'headers': (_envoy_api_v2_core_HeaderValue__Output)[];
}
