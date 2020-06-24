// Original file: deps/envoy-api/envoy/type/range.proto

import { Long } from '@grpc/proto-loader';

export interface Int64Range {
  'start'?: (number | string | Long);
  'end'?: (number | string | Long);
}

export interface Int64Range__Output {
  'start': (string);
  'end': (string);
}
