// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { IDuration as I_google_protobuf_Duration, ODuration as O_google_protobuf_Duration } from '../../../google/protobuf/Duration';
import type { IStatus as I_google_rpc_Status, OStatus as O_google_rpc_Status } from '../../../google/rpc/Status';
import type { IBlockResponse as I_google_showcase_v1beta1_BlockResponse, OBlockResponse as O_google_showcase_v1beta1_BlockResponse } from '../../../google/showcase/v1beta1/BlockResponse';

/**
 * The request for Block method.
 */
export interface IBlockRequest {
  /**
   * The amount of time to block before returning a response.
   */
  'response_delay'?: (I_google_protobuf_Duration | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (I_google_rpc_Status | null);
  /**
   * The response to be returned that will signify successful method call.
   */
  'success'?: (I_google_showcase_v1beta1_BlockResponse | null);
  'response'?: "error"|"success";
}

/**
 * The request for Block method.
 */
export interface OBlockRequest {
  /**
   * The amount of time to block before returning a response.
   */
  'response_delay': (O_google_protobuf_Duration | null);
  /**
   * The error that will be returned by the server. If this code is specified
   * to be the OK rpc code, an empty response will be returned.
   */
  'error'?: (O_google_rpc_Status | null);
  /**
   * The response to be returned that will signify successful method call.
   */
  'success'?: (O_google_showcase_v1beta1_BlockResponse | null);
  'response': "error"|"success";
}
