// Original file: deps/envoy-api/envoy/config/core/v3/socket_option.proto

import type { Long } from '@grpc/proto-loader';

// Original file: deps/envoy-api/envoy/config/core/v3/socket_option.proto

export enum _envoy_config_core_v3_SocketOption_SocketState {
  /**
   * Socket options are applied after socket creation but before binding the socket to a port
   */
  STATE_PREBIND = 0,
  /**
   * Socket options are applied after binding the socket to a port but before calling listen()
   */
  STATE_BOUND = 1,
  /**
   * Socket options are applied after calling listen()
   */
  STATE_LISTENING = 2,
}

/**
 * Generic socket option message. This would be used to set socket options that
 * might not exist in upstream kernels or precompiled Envoy binaries.
 * 
 * For example:
 * 
 * .. code-block:: json
 * 
 * {
 * "description": "support tcp keep alive",
 * "state": 0,
 * "level": 1,
 * "name": 9,
 * "int_value": 1,
 * }
 * 
 * 1 means SOL_SOCKET and 9 means SO_KEEPALIVE on Linux.
 * With the above configuration, `TCP Keep-Alives <https://www.freesoft.org/CIE/RFC/1122/114.htm>`_
 * can be enabled in socket with Linux, which can be used in
 * :ref:`listener's<envoy_v3_api_field_config.listener.v3.Listener.socket_options>` or
 * :ref:`admin's <envoy_v3_api_field_config.bootstrap.v3.Admin.socket_options>` socket_options etc.
 * 
 * It should be noted that the name or level may have different values on different platforms.
 * [#next-free-field: 7]
 */
export interface SocketOption {
  /**
   * An optional name to give this socket option for debugging, etc.
   * Uniqueness is not required and no special meaning is assumed.
   */
  'description'?: (string);
  /**
   * Corresponding to the level value passed to setsockopt, such as IPPROTO_TCP
   */
  'level'?: (number | string | Long);
  /**
   * The numeric name as passed to setsockopt
   */
  'name'?: (number | string | Long);
  /**
   * Because many sockopts take an int value.
   */
  'int_value'?: (number | string | Long);
  /**
   * Otherwise it's a byte buffer.
   */
  'buf_value'?: (Buffer | Uint8Array | string);
  /**
   * The state in which the option will be applied. When used in BindConfig
   * STATE_PREBIND is currently the only valid value.
   */
  'state'?: (_envoy_config_core_v3_SocketOption_SocketState | keyof typeof _envoy_config_core_v3_SocketOption_SocketState);
  'value'?: "int_value"|"buf_value";
}

/**
 * Generic socket option message. This would be used to set socket options that
 * might not exist in upstream kernels or precompiled Envoy binaries.
 * 
 * For example:
 * 
 * .. code-block:: json
 * 
 * {
 * "description": "support tcp keep alive",
 * "state": 0,
 * "level": 1,
 * "name": 9,
 * "int_value": 1,
 * }
 * 
 * 1 means SOL_SOCKET and 9 means SO_KEEPALIVE on Linux.
 * With the above configuration, `TCP Keep-Alives <https://www.freesoft.org/CIE/RFC/1122/114.htm>`_
 * can be enabled in socket with Linux, which can be used in
 * :ref:`listener's<envoy_v3_api_field_config.listener.v3.Listener.socket_options>` or
 * :ref:`admin's <envoy_v3_api_field_config.bootstrap.v3.Admin.socket_options>` socket_options etc.
 * 
 * It should be noted that the name or level may have different values on different platforms.
 * [#next-free-field: 7]
 */
export interface SocketOption__Output {
  /**
   * An optional name to give this socket option for debugging, etc.
   * Uniqueness is not required and no special meaning is assumed.
   */
  'description': (string);
  /**
   * Corresponding to the level value passed to setsockopt, such as IPPROTO_TCP
   */
  'level': (string);
  /**
   * The numeric name as passed to setsockopt
   */
  'name': (string);
  /**
   * Because many sockopts take an int value.
   */
  'int_value'?: (string);
  /**
   * Otherwise it's a byte buffer.
   */
  'buf_value'?: (Buffer);
  /**
   * The state in which the option will be applied. When used in BindConfig
   * STATE_PREBIND is currently the only valid value.
   */
  'state': (keyof typeof _envoy_config_core_v3_SocketOption_SocketState);
  'value': "int_value"|"buf_value";
}
