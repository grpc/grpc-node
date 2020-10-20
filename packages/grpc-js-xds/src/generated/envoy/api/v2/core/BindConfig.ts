// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { SocketAddress as _envoy_api_v2_core_SocketAddress, SocketAddress__Output as _envoy_api_v2_core_SocketAddress__Output } from '../../../../envoy/api/v2/core/SocketAddress';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { SocketOption as _envoy_api_v2_core_SocketOption, SocketOption__Output as _envoy_api_v2_core_SocketOption__Output } from '../../../../envoy/api/v2/core/SocketOption';

export interface BindConfig {
  /**
   * The address to bind to when creating a socket.
   */
  'source_address'?: (_envoy_api_v2_core_SocketAddress);
  /**
   * Whether to set the *IP_FREEBIND* option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_api_field_UpstreamBindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option *IP_FREEBIND* is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  'freebind'?: (_google_protobuf_BoolValue);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options'?: (_envoy_api_v2_core_SocketOption)[];
}

export interface BindConfig__Output {
  /**
   * The address to bind to when creating a socket.
   */
  'source_address'?: (_envoy_api_v2_core_SocketAddress__Output);
  /**
   * Whether to set the *IP_FREEBIND* option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_api_field_UpstreamBindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option *IP_FREEBIND* is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  'freebind'?: (_google_protobuf_BoolValue__Output);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options': (_envoy_api_v2_core_SocketOption__Output)[];
}
