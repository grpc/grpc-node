// Original file: deps/googleapis/google/rpc/status.proto

import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../google/protobuf/Any';

export interface Status {
  'code'?: (number);
  'message'?: (string);
  'details'?: (_google_protobuf_Any)[];
}

export interface Status__Output {
  'code': (number);
  'message': (string);
  'details': (_google_protobuf_Any__Output)[];
}
