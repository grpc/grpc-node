// Original file: deps/envoy-api/envoy/config/core/v3/address.proto

import type { SocketAddress as _envoy_config_core_v3_SocketAddress, SocketAddress__Output as _envoy_config_core_v3_SocketAddress__Output } from '../../../../envoy/config/core/v3/SocketAddress';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { SocketOption as _envoy_config_core_v3_SocketOption, SocketOption__Output as _envoy_config_core_v3_SocketOption__Output } from '../../../../envoy/config/core/v3/SocketOption';

export interface BindConfig {
  /**
   * The address to bind to when creating a socket.
   */
  'source_address'?: (_envoy_config_core_v3_SocketAddress | null);
  /**
   * Whether to set the *IP_FREEBIND* option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_v3_api_field_config.cluster.v3.UpstreamBindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option *IP_FREEBIND* is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  'freebind'?: (_google_protobuf_BoolValue | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options'?: (_envoy_config_core_v3_SocketOption)[];
}

export interface BindConfig__Output {
  /**
   * The address to bind to when creating a socket.
   */
  'source_address': (_envoy_config_core_v3_SocketAddress__Output | null);
  /**
   * Whether to set the *IP_FREEBIND* option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_v3_api_field_config.cluster.v3.UpstreamBindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option *IP_FREEBIND* is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  'freebind': (_google_protobuf_BoolValue__Output | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options': (_envoy_config_core_v3_SocketOption__Output)[];
}
