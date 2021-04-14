// Original file: deps/envoy-api/envoy/config/core/v3/address.proto

import type { SocketAddress as _envoy_config_core_v3_SocketAddress, SocketAddress__Output as _envoy_config_core_v3_SocketAddress__Output } from '../../../../envoy/config/core/v3/SocketAddress';
import type { Pipe as _envoy_config_core_v3_Pipe, Pipe__Output as _envoy_config_core_v3_Pipe__Output } from '../../../../envoy/config/core/v3/Pipe';
import type { EnvoyInternalAddress as _envoy_config_core_v3_EnvoyInternalAddress, EnvoyInternalAddress__Output as _envoy_config_core_v3_EnvoyInternalAddress__Output } from '../../../../envoy/config/core/v3/EnvoyInternalAddress';

/**
 * Addresses specify either a logical or physical address and port, which are
 * used to tell Envoy where to bind/listen, connect to upstream and find
 * management servers.
 */
export interface Address {
  'socket_address'?: (_envoy_config_core_v3_SocketAddress);
  'pipe'?: (_envoy_config_core_v3_Pipe);
  /**
   * [#not-implemented-hide:]
   */
  'envoy_internal_address'?: (_envoy_config_core_v3_EnvoyInternalAddress);
  'address'?: "socket_address"|"pipe"|"envoy_internal_address";
}

/**
 * Addresses specify either a logical or physical address and port, which are
 * used to tell Envoy where to bind/listen, connect to upstream and find
 * management servers.
 */
export interface Address__Output {
  'socket_address'?: (_envoy_config_core_v3_SocketAddress__Output);
  'pipe'?: (_envoy_config_core_v3_Pipe__Output);
  /**
   * [#not-implemented-hide:]
   */
  'envoy_internal_address'?: (_envoy_config_core_v3_EnvoyInternalAddress__Output);
  'address': "socket_address"|"pipe"|"envoy_internal_address";
}
