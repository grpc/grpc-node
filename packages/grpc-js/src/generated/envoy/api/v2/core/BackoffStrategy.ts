// Original file: deps/envoy-api/envoy/api/v2/core/backoff.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

export interface BackoffStrategy {
  'base_interval'?: (_google_protobuf_Duration);
  'max_interval'?: (_google_protobuf_Duration);
}

export interface BackoffStrategy__Output {
  'base_interval': (_google_protobuf_Duration__Output);
  'max_interval': (_google_protobuf_Duration__Output);
}
