// Original file: deps/envoy-api/envoy/api/v2/discovery.proto

import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';

export interface Resource {
  'name'?: (string);
  'aliases'?: (string)[];
  'version'?: (string);
  'resource'?: (_google_protobuf_Any);
}

export interface Resource__Output {
  'name': (string);
  'aliases': (string)[];
  'version': (string);
  'resource': (_google_protobuf_Any__Output);
}
