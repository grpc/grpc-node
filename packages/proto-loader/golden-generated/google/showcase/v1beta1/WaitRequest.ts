// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';
import type { WaitResponse as _google_showcase_v1beta1_WaitResponse, WaitResponse__Output as _google_showcase_v1beta1_WaitResponse__Output } from '../../../google/showcase/v1beta1/WaitResponse';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';

/**
 * The request for Wait method.
 */
export interface WaitRequest {
  /**
   * The time that this operation will complete.
   */
  'end_time'?: (_google_protobuf_Timestamp | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (_google_rpc_Status | null);
  /**
   * The response to be returned on operation completion.
   */
  'success'?: (_google_showcase_v1beta1_WaitResponse | null);
  /**
   * The duration of this operation.
   */
  'ttl'?: (_google_protobuf_Duration | null);
  'end'?: "end_time"|"ttl";
  'response'?: "error"|"success";
}

/**
 * The request for Wait method.
 */
export interface WaitRequest__Output {
  /**
   * The time that this operation will complete.
   */
  'end_time'?: (_google_protobuf_Timestamp__Output | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (_google_rpc_Status__Output | null);
  /**
   * The response to be returned on operation completion.
   */
  'success'?: (_google_showcase_v1beta1_WaitResponse__Output | null);
  /**
   * The duration of this operation.
   */
  'ttl'?: (_google_protobuf_Duration__Output | null);
  'end': "end_time"|"ttl";
  'response': "error"|"success";
}
