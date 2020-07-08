// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from '../../../../google/protobuf/DoubleValue';

export interface RateLimitSettings {
  'max_tokens'?: (_google_protobuf_UInt32Value);
  'fill_rate'?: (_google_protobuf_DoubleValue);
}

export interface RateLimitSettings__Output {
  'max_tokens': (_google_protobuf_UInt32Value__Output);
  'fill_rate': (_google_protobuf_DoubleValue__Output);
}
