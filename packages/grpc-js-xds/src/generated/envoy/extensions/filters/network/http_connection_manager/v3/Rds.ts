// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../../../envoy/config/core/v3/ConfigSource';

export interface Rds {
  /**
   * Configuration source specifier for RDS.
   */
  'config_source'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * The name of the route configuration. This name will be passed to the RDS
   * API. This allows an Envoy configuration with multiple HTTP listeners (and
   * associated HTTP connection manager filters) to use different route
   * configurations.
   */
  'route_config_name'?: (string);
}

export interface Rds__Output {
  /**
   * Configuration source specifier for RDS.
   */
  'config_source': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * The name of the route configuration. This name will be passed to the RDS
   * API. This allows an Envoy configuration with multiple HTTP listeners (and
   * associated HTTP connection manager filters) to use different route
   * configurations.
   */
  'route_config_name': (string);
}
