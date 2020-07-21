// Original file: deps/googleapis/google/longrunning/operations.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

export interface WaitOperationRequest {
  'name'?: (string);
  'timeout'?: (_google_protobuf_Duration);
}

export interface WaitOperationRequest__Output {
  'name': (string);
  'timeout'?: (_google_protobuf_Duration__Output);
}
