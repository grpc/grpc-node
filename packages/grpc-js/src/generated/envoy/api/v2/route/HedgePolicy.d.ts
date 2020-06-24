// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../../envoy/type/FractionalPercent';

export interface HedgePolicy {
  'initial_requests'?: (_google_protobuf_UInt32Value);
  'additional_request_chance'?: (_envoy_type_FractionalPercent);
  'hedge_on_per_try_timeout'?: (boolean);
}

export interface HedgePolicy__Output {
  'initial_requests': (_google_protobuf_UInt32Value__Output);
  'additional_request_chance': (_envoy_type_FractionalPercent__Output);
  'hedge_on_per_try_timeout': (boolean);
}
