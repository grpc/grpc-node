// Original file: deps/googleapis/google/longrunning/operations.proto

import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../google/protobuf/Any';
import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../google/rpc/Status';

export interface Operation {
  'name'?: (string);
  'metadata'?: (_google_protobuf_Any);
  'done'?: (boolean);
  'error'?: (_google_rpc_Status);
  'response'?: (_google_protobuf_Any);
  'result'?: "error"|"response";
}

export interface Operation__Output {
  'name': (string);
  'metadata'?: (_google_protobuf_Any__Output);
  'done': (boolean);
  'error'?: (_google_rpc_Status__Output);
  'response'?: (_google_protobuf_Any__Output);
  'result': "error"|"response";
}
