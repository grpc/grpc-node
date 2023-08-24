// Original file: deps/envoy-api/envoy/config/core/v3/address.proto

import type { SocketAddress as _envoy_config_core_v3_SocketAddress, SocketAddress__Output as _envoy_config_core_v3_SocketAddress__Output } from '../../../../envoy/config/core/v3/SocketAddress';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { SocketOption as _envoy_config_core_v3_SocketOption, SocketOption__Output as _envoy_config_core_v3_SocketOption__Output } from '../../../../envoy/config/core/v3/SocketOption';
import type { ExtraSourceAddress as _envoy_config_core_v3_ExtraSourceAddress, ExtraSourceAddress__Output as _envoy_config_core_v3_ExtraSourceAddress__Output } from '../../../../envoy/config/core/v3/ExtraSourceAddress';

/**
 * [#next-free-field: 6]
 */
export interface BindConfig {
  /**
   * The address to bind to when creating a socket.
   */
  'source_address'?: (_envoy_config_core_v3_SocketAddress | null);
  /**
   * Whether to set the ``IP_FREEBIND`` option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_v3_api_field_config.core.v3.BindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option ``IP_FREEBIND`` is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  'freebind'?: (_google_protobuf_BoolValue | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options'?: (_envoy_config_core_v3_SocketOption)[];
  /**
   * Deprecated by
   * :ref:`extra_source_addresses <envoy_v3_api_field_config.core.v3.BindConfig.extra_source_addresses>`
   */
  'additional_source_addresses'?: (_envoy_config_core_v3_SocketAddress)[];
  /**
   * Extra source addresses appended to the address specified in the `source_address`
   * field. This enables to specify multiple source addresses. Currently, only one extra
   * address can be supported, and the extra address should have a different IP version
   * with the address in the `source_address` field. The address which has the same IP
   * version with the target host's address IP version will be used as bind address. If more
   * than one extra address specified, only the first address matched IP version will be
   * returned. If there is no same IP version address found, the address in the `source_address`
   * will be returned.
   */
  'extra_source_addresses'?: (_envoy_config_core_v3_ExtraSourceAddress)[];
}

/**
 * [#next-free-field: 6]
 */
export interface BindConfig__Output {
  /**
   * The address to bind to when creating a socket.
   */
  'source_address': (_envoy_config_core_v3_SocketAddress__Output | null);
  /**
   * Whether to set the ``IP_FREEBIND`` option when creating the socket. When this
   * flag is set to true, allows the :ref:`source_address
   * <envoy_v3_api_field_config.core.v3.BindConfig.source_address>` to be an IP address
   * that is not configured on the system running Envoy. When this flag is set
   * to false, the option ``IP_FREEBIND`` is disabled on the socket. When this
   * flag is not set (default), the socket is not modified, i.e. the option is
   * neither enabled nor disabled.
   */
  'freebind': (_google_protobuf_BoolValue__Output | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options': (_envoy_config_core_v3_SocketOption__Output)[];
  /**
   * Deprecated by
   * :ref:`extra_source_addresses <envoy_v3_api_field_config.core.v3.BindConfig.extra_source_addresses>`
   */
  'additional_source_addresses': (_envoy_config_core_v3_SocketAddress__Output)[];
  /**
   * Extra source addresses appended to the address specified in the `source_address`
   * field. This enables to specify multiple source addresses. Currently, only one extra
   * address can be supported, and the extra address should have a different IP version
   * with the address in the `source_address` field. The address which has the same IP
   * version with the target host's address IP version will be used as bind address. If more
   * than one extra address specified, only the first address matched IP version will be
   * returned. If there is no same IP version address found, the address in the `source_address`
   * will be returned.
   */
  'extra_source_addresses': (_envoy_config_core_v3_ExtraSourceAddress__Output)[];
}
