// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../../envoy/type/FractionalPercent';
import { CustomTag as _envoy_type_tracing_v2_CustomTag, CustomTag__Output as _envoy_type_tracing_v2_CustomTag__Output } from '../../../../envoy/type/tracing/v2/CustomTag';

export interface Tracing {
  'client_sampling'?: (_envoy_type_FractionalPercent);
  'random_sampling'?: (_envoy_type_FractionalPercent);
  'overall_sampling'?: (_envoy_type_FractionalPercent);
  'custom_tags'?: (_envoy_type_tracing_v2_CustomTag)[];
}

export interface Tracing__Output {
  'client_sampling': (_envoy_type_FractionalPercent__Output);
  'random_sampling': (_envoy_type_FractionalPercent__Output);
  'overall_sampling': (_envoy_type_FractionalPercent__Output);
  'custom_tags': (_envoy_type_tracing_v2_CustomTag__Output)[];
}
