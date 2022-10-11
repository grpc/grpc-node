// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { ITimestamp as I_google_protobuf_Timestamp, OTimestamp as O_google_protobuf_Timestamp } from '../../../google/protobuf/Timestamp';
import type { IStatus as I_google_rpc_Status, OStatus as O_google_rpc_Status } from '../../../google/rpc/Status';
import type { IWaitResponse as I_google_showcase_v1beta1_WaitResponse, OWaitResponse as O_google_showcase_v1beta1_WaitResponse } from '../../../google/showcase/v1beta1/WaitResponse';
import type { IDuration as I_google_protobuf_Duration, ODuration as O_google_protobuf_Duration } from '../../../google/protobuf/Duration';

/**
 * The request for Wait method.
 */
export interface IWaitRequest {
  /**
   * The time that this operation will complete.
   */
  'end_time'?: (I_google_protobuf_Timestamp | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (I_google_rpc_Status | null);
  /**
   * The response to be returned on operation completion.
   */
  'success'?: (I_google_showcase_v1beta1_WaitResponse | null);
  /**
   * The duration of this operation.
   */
  'ttl'?: (I_google_protobuf_Duration | null);
  'end'?: "end_time"|"ttl";
  'response'?: "error"|"success";
}

/**
 * The request for Wait method.
 */
export interface OWaitRequest {
  /**
   * The time that this operation will complete.
   */
  'end_time'?: (O_google_protobuf_Timestamp | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (O_google_rpc_Status | null);
  /**
   * The response to be returned on operation completion.
   */
  'success'?: (O_google_showcase_v1beta1_WaitResponse | null);
  /**
   * The duration of this operation.
   */
  'ttl'?: (O_google_protobuf_Duration | null);
  'end': "end_time"|"ttl";
  'response': "error"|"success";
}
