// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from '../../../../envoy/api/v2/core/HeaderValue';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

export interface HeaderValueOption {
  'header'?: (_envoy_api_v2_core_HeaderValue);
  'append'?: (_google_protobuf_BoolValue);
}

export interface HeaderValueOption__Output {
  'header': (_envoy_api_v2_core_HeaderValue__Output);
  'append': (_google_protobuf_BoolValue__Output);
}
