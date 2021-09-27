// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';

/**
 * An extensible structure containing the address Envoy should bind to when
 * establishing upstream connections.
 */
export interface UpstreamBindConfig {
  /**
   * The address Envoy should bind to when establishing upstream connections.
   */
  'source_address'?: (_envoy_config_core_v3_Address | null);
}

/**
 * An extensible structure containing the address Envoy should bind to when
 * establishing upstream connections.
 */
export interface UpstreamBindConfig__Output {
  /**
   * The address Envoy should bind to when establishing upstream connections.
   */
  'source_address': (_envoy_config_core_v3_Address__Output | null);
}
