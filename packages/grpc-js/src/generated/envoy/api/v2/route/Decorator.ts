// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

export interface Decorator {
  'operation'?: (string);
  'propagate'?: (_google_protobuf_BoolValue);
}

export interface Decorator__Output {
  'operation': (string);
  'propagate': (_google_protobuf_BoolValue__Output);
}
