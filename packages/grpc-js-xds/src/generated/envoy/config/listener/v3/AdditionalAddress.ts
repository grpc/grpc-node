// Original file: deps/envoy-api/envoy/config/listener/v3/listener.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { SocketOptionsOverride as _envoy_config_core_v3_SocketOptionsOverride, SocketOptionsOverride__Output as _envoy_config_core_v3_SocketOptionsOverride__Output } from '../../../../envoy/config/core/v3/SocketOptionsOverride';

/**
 * The additional address the listener is listening on.
 */
export interface AdditionalAddress {
  'address'?: (_envoy_config_core_v3_Address | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries. If specified, this will override the
   * :ref:`socket_options <envoy_v3_api_field_config.listener.v3.Listener.socket_options>`
   * in the listener. If specified with no
   * :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`
   * or an empty list of :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`,
   * it means no socket option will apply.
   */
  'socket_options'?: (_envoy_config_core_v3_SocketOptionsOverride | null);
}

/**
 * The additional address the listener is listening on.
 */
export interface AdditionalAddress__Output {
  'address': (_envoy_config_core_v3_Address__Output | null);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries. If specified, this will override the
   * :ref:`socket_options <envoy_v3_api_field_config.listener.v3.Listener.socket_options>`
   * in the listener. If specified with no
   * :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`
   * or an empty list of :ref:`socket_options <envoy_v3_api_field_config.core.v3.SocketOptionsOverride.socket_options>`,
   * it means no socket option will apply.
   */
  'socket_options': (_envoy_config_core_v3_SocketOptionsOverride__Output | null);
}
