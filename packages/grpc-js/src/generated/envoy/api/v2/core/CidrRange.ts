// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface CidrRange {
  'address_prefix'?: (string);
  'prefix_len'?: (_google_protobuf_UInt32Value);
}

export interface CidrRange__Output {
  'address_prefix': (string);
  'prefix_len': (_google_protobuf_UInt32Value__Output);
}
