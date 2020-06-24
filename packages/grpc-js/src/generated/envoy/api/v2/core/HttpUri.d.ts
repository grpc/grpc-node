// Original file: deps/envoy-api/envoy/api/v2/core/http_uri.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

export interface HttpUri {
  'uri'?: (string);
  'cluster'?: (string);
  'timeout'?: (_google_protobuf_Duration);
  'http_upstream_type'?: "cluster";
}

export interface HttpUri__Output {
  'uri': (string);
  'cluster'?: (string);
  'timeout': (_google_protobuf_Duration__Output);
  'http_upstream_type': "cluster";
}
