// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../../../envoy/config/core/v3/ConfigSource';

export interface ScopedRds {
  /**
   * Configuration source specifier for scoped RDS.
   */
  'scoped_rds_config_source'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * xdstp:// resource locator for scoped RDS collection.
   * [#not-implemented-hide:]
   */
  'srds_resources_locator'?: (string);
}

export interface ScopedRds__Output {
  /**
   * Configuration source specifier for scoped RDS.
   */
  'scoped_rds_config_source': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * xdstp:// resource locator for scoped RDS collection.
   * [#not-implemented-hide:]
   */
  'srds_resources_locator': (string);
}
