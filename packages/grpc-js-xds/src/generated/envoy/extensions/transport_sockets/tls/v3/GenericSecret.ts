// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/secret.proto

import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../../envoy/config/core/v3/DataSource';

export interface GenericSecret {
  /**
   * Secret of generic type and is available to filters.
   */
  'secret'?: (_envoy_config_core_v3_DataSource | null);
}

export interface GenericSecret__Output {
  /**
   * Secret of generic type and is available to filters.
   */
  'secret': (_envoy_config_core_v3_DataSource__Output | null);
}
