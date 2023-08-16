// Original file: deps/envoy-api/envoy/config/core/v3/address.proto

import type { SocketAddress as _envoy_config_core_v3_SocketAddress, SocketAddress__Output as _envoy_config_core_v3_SocketAddress__Output } from '../../../../envoy/config/core/v3/SocketAddress';
import type { SocketOptionsOverride as _envoy_config_core_v3_SocketOptionsOverride, SocketOptionsOverride__Output as _envoy_config_core_v3_SocketOptionsOverride__Output } from '../../../../envoy/config/core/v3/SocketOptionsOverride';

export interface ExtraSourceAddress {
  /**
   * The additional address to bind.
   */
  'address'?: (_envoy_config_core_v3_SocketAddress | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries. If specified, this will override the
   * :ref:`socket_options <envoy_v3_api_field_config.core.v3.BindConfig.socket_options>`
   * in the BindConfig. If specified with no
   * :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`
   * or an empty list of :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`,
   * it means no socket option will apply.
   */
  'socket_options'?: (_envoy_config_core_v3_SocketOptionsOverride | null);
}

export interface ExtraSourceAddress__Output {
  /**
   * The additional address to bind.
   */
  'address': (_envoy_config_core_v3_SocketAddress__Output | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries. If specified, this will override the
   * :ref:`socket_options <envoy_v3_api_field_config.core.v3.BindConfig.socket_options>`
   * in the BindConfig. If specified with no
   * :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`
   * or an empty list of :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`,
   * it means no socket option will apply.
   */
  'socket_options': (_envoy_config_core_v3_SocketOptionsOverride__Output | null);
}
