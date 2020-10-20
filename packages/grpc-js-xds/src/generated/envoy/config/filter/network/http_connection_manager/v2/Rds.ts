// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from '../../../../../../envoy/api/v2/core/ConfigSource';

export interface Rds {
  /**
   * Configuration source specifier for RDS.
   */
  'config_source'?: (_envoy_api_v2_core_ConfigSource);
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
  'config_source'?: (_envoy_api_v2_core_ConfigSource__Output);
  /**
   * The name of the route configuration. This name will be passed to the RDS
   * API. This allows an Envoy configuration with multiple HTTP listeners (and
   * associated HTTP connection manager filters) to use different route
   * configurations.
   */
  'route_config_name': (string);
}
