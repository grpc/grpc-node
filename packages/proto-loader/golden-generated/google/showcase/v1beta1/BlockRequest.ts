// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';
import type { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';
import type { BlockResponse as _google_showcase_v1beta1_BlockResponse, BlockResponse__Output as _google_showcase_v1beta1_BlockResponse__Output } from '../../../google/showcase/v1beta1/BlockResponse';

/**
 * The request for Block method.
 */
export interface BlockRequest {
  /**
   * The amount of time to block before returning a response.
   */
  'response_delay'?: (_google_protobuf_Duration | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (_google_rpc_Status | null);
  /**
   * The response to be returned that will signify successful method call.
   */
  'success'?: (_google_showcase_v1beta1_BlockResponse | null);
  'response'?: "error"|"success";
}

/**
 * The request for Block method.
 */
export interface BlockRequest__Output {
  /**
   * The amount of time to block before returning a response.
   */
  'response_delay': (_google_protobuf_Duration__Output | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (_google_rpc_Status__Output | null);
  /**
   * The response to be returned that will signify successful method call.
   */
  'success'?: (_google_showcase_v1beta1_BlockResponse__Output | null);
  'response': "error"|"success";
}
