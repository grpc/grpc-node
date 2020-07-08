// Original file: deps/protoc-gen-validate/validate/validate.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../google/protobuf/Duration';

export interface DurationRules {
  'required'?: (boolean);
  'const'?: (_google_protobuf_Duration);
  'lt'?: (_google_protobuf_Duration);
  'lte'?: (_google_protobuf_Duration);
  'gt'?: (_google_protobuf_Duration);
  'gte'?: (_google_protobuf_Duration);
  'in'?: (_google_protobuf_Duration)[];
  'not_in'?: (_google_protobuf_Duration)[];
}

export interface DurationRules__Output {
  'required': (boolean);
  'const': (_google_protobuf_Duration__Output);
  'lt': (_google_protobuf_Duration__Output);
  'lte': (_google_protobuf_Duration__Output);
  'gt': (_google_protobuf_Duration__Output);
  'gte': (_google_protobuf_Duration__Output);
  'in': (_google_protobuf_Duration__Output)[];
  'not_in': (_google_protobuf_Duration__Output)[];
}
