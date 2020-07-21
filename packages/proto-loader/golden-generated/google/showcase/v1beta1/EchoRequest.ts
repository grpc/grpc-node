// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { Status as _google_rpc_Status, Status__Output as _google_rpc_Status__Output } from '../../../google/rpc/Status';
import { Severity as _google_showcase_v1beta1_Severity } from '../../../google/showcase/v1beta1/Severity';

/**
 * The request message used for the Echo, Collect and Chat methods.
 * If content or opt are set in this message then the request will succeed.
 * If status is set in this message
 * then the status will be returned as an error.
 */
export interface EchoRequest {
  /**
   * The content to be echoed by the server.
   */
  'content'?: (string);
  /**
   * The error to be thrown by the server.
   */
  'error'?: (_google_rpc_Status);
  /**
   * The severity to be echoed by the server.
   */
  'severity'?: (_google_showcase_v1beta1_Severity | keyof typeof _google_showcase_v1beta1_Severity);
  'response'?: "content"|"error";
}

/**
 * The request message used for the Echo, Collect and Chat methods.
 * If content or opt are set in this message then the request will succeed.
 * If status is set in this message
 * then the status will be returned as an error.
 */
export interface EchoRequest__Output {
  /**
   * The content to be echoed by the server.
   */
  'content'?: (string);
  /**
   * The error to be thrown by the server.
   */
  'error'?: (_google_rpc_Status__Output);
  /**
   * The severity to be echoed by the server.
   */
  'severity': (keyof typeof _google_showcase_v1beta1_Severity);
  'response': "content"|"error";
}
