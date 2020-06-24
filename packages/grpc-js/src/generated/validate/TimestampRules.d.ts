// Original file: deps/protoc-gen-validate/validate/validate.proto

import { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../google/protobuf/Timestamp';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../google/protobuf/Duration';

export interface TimestampRules {
  'required'?: (boolean);
  'const'?: (_google_protobuf_Timestamp);
  'lt'?: (_google_protobuf_Timestamp);
  'lte'?: (_google_protobuf_Timestamp);
  'gt'?: (_google_protobuf_Timestamp);
  'gte'?: (_google_protobuf_Timestamp);
  'lt_now'?: (boolean);
  'gt_now'?: (boolean);
  'within'?: (_google_protobuf_Duration);
}

export interface TimestampRules__Output {
  'required': (boolean);
  'const': (_google_protobuf_Timestamp__Output);
  'lt': (_google_protobuf_Timestamp__Output);
  'lte': (_google_protobuf_Timestamp__Output);
  'gt': (_google_protobuf_Timestamp__Output);
  'gte': (_google_protobuf_Timestamp__Output);
  'lt_now': (boolean);
  'gt_now': (boolean);
  'within': (_google_protobuf_Duration__Output);
}
