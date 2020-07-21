// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';
import { WaitResponse as _google_showcase_v1beta1_WaitResponse, WaitResponse__Output as _google_showcase_v1beta1_WaitResponse__Output } from '../../../google/showcase/v1beta1/WaitResponse';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';

export interface WaitRequest {
  'end_time'?: (_google_protobuf_Timestamp);
  'error'?: (_google_rpc_Status);
  'success'?: (_google_showcase_v1beta1_WaitResponse);
  'ttl'?: (_google_protobuf_Duration);
  'end'?: "end_time"|"ttl";
  'response'?: "error"|"success";
}

export interface WaitRequest__Output {
  'end_time'?: (_google_protobuf_Timestamp__Output);
  'error'?: (_google_rpc_Status__Output);
  'success'?: (_google_showcase_v1beta1_WaitResponse__Output);
  'ttl'?: (_google_protobuf_Duration__Output);
  'end': "end_time"|"ttl";
  'response': "error"|"success";
}
