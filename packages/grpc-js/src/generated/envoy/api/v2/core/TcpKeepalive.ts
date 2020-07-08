// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface TcpKeepalive {
  'keepalive_probes'?: (_google_protobuf_UInt32Value);
  'keepalive_time'?: (_google_protobuf_UInt32Value);
  'keepalive_interval'?: (_google_protobuf_UInt32Value);
}

export interface TcpKeepalive__Output {
  'keepalive_probes': (_google_protobuf_UInt32Value__Output);
  'keepalive_time': (_google_protobuf_UInt32Value__Output);
  'keepalive_interval': (_google_protobuf_UInt32Value__Output);
}
