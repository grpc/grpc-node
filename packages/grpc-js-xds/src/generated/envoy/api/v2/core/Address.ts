// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { SocketAddress as _envoy_api_v2_core_SocketAddress, SocketAddress__Output as _envoy_api_v2_core_SocketAddress__Output } from '../../../../envoy/api/v2/core/SocketAddress';
import { Pipe as _envoy_api_v2_core_Pipe, Pipe__Output as _envoy_api_v2_core_Pipe__Output } from '../../../../envoy/api/v2/core/Pipe';

/**
 * Addresses specify either a logical or physical address and port, which are
 * used to tell Envoy where to bind/listen, connect to upstream and find
 * management servers.
 */
export interface Address {
  'socket_address'?: (_envoy_api_v2_core_SocketAddress);
  'pipe'?: (_envoy_api_v2_core_Pipe);
  'address'?: "socket_address"|"pipe";
}

/**
 * Addresses specify either a logical or physical address and port, which are
 * used to tell Envoy where to bind/listen, connect to upstream and find
 * management servers.
 */
export interface Address__Output {
  'socket_address'?: (_envoy_api_v2_core_SocketAddress__Output);
  'pipe'?: (_envoy_api_v2_core_Pipe__Output);
  'address': "socket_address"|"pipe";
}
