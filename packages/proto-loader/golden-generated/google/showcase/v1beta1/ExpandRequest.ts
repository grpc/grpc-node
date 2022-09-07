// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { IStatus as I_google_rpc_Status, OStatus as O_google_rpc_Status } from '../../../google/rpc/Status';

/**
 * The request message for the Expand method.
 */
export interface IExpandRequest {
  /**
   * The content that will be split into words and returned on the stream.
   */
  'content'?: (string);
  /**
   * The error that is thrown after all words are sent on the stream.
   */
  'error'?: (I_google_rpc_Status | null);
}

/**
 * The request message for the Expand method.
 */
export interface OExpandRequest {
  /**
   * The content that will be split into words and returned on the stream.
   */
  'content': (string);
  /**
   * The error that is thrown after all words are sent on the stream.
   */
  'error': (O_google_rpc_Status | null);
}
