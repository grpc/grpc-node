// Original file: deps/envoy-api/envoy/api/v2/auth/secret.proto

import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from '../../../../envoy/api/v2/core/ConfigSource';

export interface SdsSecretConfig {
  /**
   * Name (FQDN, UUID, SPKI, SHA256, etc.) by which the secret can be uniquely referred to.
   * When both name and config are specified, then secret can be fetched and/or reloaded via
   * SDS. When only name is specified, then secret will be loaded from static resources.
   */
  'name'?: (string);
  'sds_config'?: (_envoy_api_v2_core_ConfigSource);
}

export interface SdsSecretConfig__Output {
  /**
   * Name (FQDN, UUID, SPKI, SHA256, etc.) by which the secret can be uniquely referred to.
   * When both name and config are specified, then secret can be fetched and/or reloaded via
   * SDS. When only name is specified, then secret will be loaded from static resources.
   */
  'name': (string);
  'sds_config'?: (_envoy_api_v2_core_ConfigSource__Output);
}
