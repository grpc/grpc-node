// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';

/**
 * The request message for the Expand method.
 */
export interface ExpandRequest {
  /**
   * The content that will be split into words and returned on the stream.
   */
  'content'?: (string);
  /**
   * The error that is thrown after all words are sent on the stream.
   */
  'error'?: (_google_rpc_Status | null);
}

/**
 * The request message for the Expand method.
 */
export interface ExpandRequest__Output {
  /**
   * The content that will be split into words and returned on the stream.
   */
  'content': (string);
  /**
   * The error that is thrown after all words are sent on the stream.
   */
  'error': (_google_rpc_Status__Output | null);
}
