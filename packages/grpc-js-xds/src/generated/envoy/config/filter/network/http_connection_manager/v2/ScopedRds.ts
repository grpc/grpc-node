// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from '../../../../../../envoy/api/v2/core/ConfigSource';

export interface ScopedRds {
  /**
   * Configuration source specifier for scoped RDS.
   */
  'scoped_rds_config_source'?: (_envoy_api_v2_core_ConfigSource);
}

export interface ScopedRds__Output {
  /**
   * Configuration source specifier for scoped RDS.
   */
  'scoped_rds_config_source'?: (_envoy_api_v2_core_ConfigSource__Output);
}
