// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { SocketAddress as _envoy_api_v2_core_SocketAddress, SocketAddress__Output as _envoy_api_v2_core_SocketAddress__Output } from '../../../../envoy/api/v2/core/SocketAddress';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { SocketOption as _envoy_api_v2_core_SocketOption, SocketOption__Output as _envoy_api_v2_core_SocketOption__Output } from '../../../../envoy/api/v2/core/SocketOption';

export interface BindConfig {
  'source_address'?: (_envoy_api_v2_core_SocketAddress);
  'freebind'?: (_google_protobuf_BoolValue);
  'socket_options'?: (_envoy_api_v2_core_SocketOption)[];
}

export interface BindConfig__Output {
  'source_address': (_envoy_api_v2_core_SocketAddress__Output);
  'freebind': (_google_protobuf_BoolValue__Output);
  'socket_options': (_envoy_api_v2_core_SocketOption__Output)[];
}
