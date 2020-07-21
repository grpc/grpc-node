// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';
import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';
import { BlockResponse as _google_showcase_v1beta1_BlockResponse, BlockResponse__Output as _google_showcase_v1beta1_BlockResponse__Output } from '../../../google/showcase/v1beta1/BlockResponse';

export interface BlockRequest {
  'response_delay'?: (_google_protobuf_Duration);
  'error'?: (_google_rpc_Status);
  'success'?: (_google_showcase_v1beta1_BlockResponse);
  'response'?: "error"|"success";
}

export interface BlockRequest__Output {
  'response_delay'?: (_google_protobuf_Duration__Output);
  'error'?: (_google_rpc_Status__Output);
  'success'?: (_google_showcase_v1beta1_BlockResponse__Output);
  'response': "error"|"success";
}
