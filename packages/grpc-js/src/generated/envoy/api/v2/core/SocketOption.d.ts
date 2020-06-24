// Original file: deps/envoy-api/envoy/api/v2/core/socket_option.proto

import { Long } from '@grpc/proto-loader';

// Original file: deps/envoy-api/envoy/api/v2/core/socket_option.proto

export enum _envoy_api_v2_core_SocketOption_SocketState {
  STATE_PREBIND = 0,
  STATE_BOUND = 1,
  STATE_LISTENING = 2,
}

export interface SocketOption {
  'description'?: (string);
  'level'?: (number | string | Long);
  'name'?: (number | string | Long);
  'int_value'?: (number | string | Long);
  'buf_value'?: (Buffer | Uint8Array | string);
  'state'?: (_envoy_api_v2_core_SocketOption_SocketState | keyof typeof _envoy_api_v2_core_SocketOption_SocketState);
  'value'?: "int_value"|"buf_value";
}

export interface SocketOption__Output {
  'description': (string);
  'level': (string);
  'name': (string);
  'int_value'?: (string);
  'buf_value'?: (Buffer);
  'state': (keyof typeof _envoy_api_v2_core_SocketOption_SocketState);
  'value': "int_value"|"buf_value";
}
