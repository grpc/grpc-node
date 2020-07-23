// Original file: deps/envoy-api/envoy/api/v2/auth/secret.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';

export interface GenericSecret {
  /**
   * Secret of generic type and is available to filters.
   */
  'secret'?: (_envoy_api_v2_core_DataSource);
}

export interface GenericSecret__Output {
  /**
   * Secret of generic type and is available to filters.
   */
  'secret'?: (_envoy_api_v2_core_DataSource__Output);
}
