// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../envoy/api/v2/core/Address';

/**
 * An extensible structure containing the address Envoy should bind to when
 * establishing upstream connections.
 */
export interface UpstreamBindConfig {
  /**
   * The address Envoy should bind to when establishing upstream connections.
   */
  'source_address'?: (_envoy_api_v2_core_Address);
}

/**
 * An extensible structure containing the address Envoy should bind to when
 * establishing upstream connections.
 */
export interface UpstreamBindConfig__Output {
  /**
   * The address Envoy should bind to when establishing upstream connections.
   */
  'source_address'?: (_envoy_api_v2_core_Address__Output);
}
