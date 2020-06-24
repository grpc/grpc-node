// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { FractionalPercent as _envoy_type_FractionalPercent, FractionalPercent__Output as _envoy_type_FractionalPercent__Output } from '../../../../../envoy/type/FractionalPercent';

export interface RuntimeFilter {
  'runtime_key'?: (string);
  'percent_sampled'?: (_envoy_type_FractionalPercent);
  'use_independent_randomness'?: (boolean);
}

export interface RuntimeFilter__Output {
  'runtime_key': (string);
  'percent_sampled': (_envoy_type_FractionalPercent__Output);
  'use_independent_randomness': (boolean);
}
