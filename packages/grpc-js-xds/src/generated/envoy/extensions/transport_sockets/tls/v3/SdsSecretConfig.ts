// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/secret.proto

import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../../envoy/config/core/v3/ConfigSource';

export interface SdsSecretConfig {
  /**
   * Name by which the secret can be uniquely referred to. When both name and config are specified,
   * then secret can be fetched and/or reloaded via SDS. When only name is specified, then secret
   * will be loaded from static resources.
   */
  'name'?: (string);
  'sds_config'?: (_envoy_config_core_v3_ConfigSource | null);
}

export interface SdsSecretConfig__Output {
  /**
   * Name by which the secret can be uniquely referred to. When both name and config are specified,
   * then secret can be fetched and/or reloaded via SDS. When only name is specified, then secret
   * will be loaded from static resources.
   */
  'name': (string);
  'sds_config': (_envoy_config_core_v3_ConfigSource__Output | null);
}
