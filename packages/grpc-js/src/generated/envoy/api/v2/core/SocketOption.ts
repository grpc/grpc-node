// Original file: deps/envoy-api/envoy/api/v2/core/socket_option.proto

import { Long } from '@grpc/proto-loader';

// Original file: deps/envoy-api/envoy/api/v2/core/socket_option.proto

export enum _envoy_api_v2_core_SocketOption_SocketState {
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
  'state'?: (_envoy_api_v2_core_SocketOption_SocketState | keyof typeof _envoy_api_v2_core_SocketOption_SocketState);
  'value'?: "int_value"|"buf_value";
}

/**
 * Generic socket option message. This would be used to set socket options that
 * might not exist in upstream kernels or precompiled Envoy binaries.
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
  'state': (keyof typeof _envoy_api_v2_core_SocketOption_SocketState);
  'value': "int_value"|"buf_value";
}
