// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { IStatus as I_google_rpc_Status, OStatus as O_google_rpc_Status } from '../../../google/rpc/Status';
import type { ISeverity as I_google_showcase_v1beta1_Severity, OSeverity as O_google_showcase_v1beta1_Severity } from '../../../google/showcase/v1beta1/Severity';

/**
 * The request message used for the Echo, Collect and Chat methods.
 * If content or opt are set in this message then the request will succeed.
 * If status is set in this message
 * then the status will be returned as an error.
 */
export interface IEchoRequest {
  /**
   * The content to be echoed by the server.
   */
  'content'?: (string);
  /**
   * The error to be thrown by the server.
   */
  'error'?: (I_google_rpc_Status | null);
  /**
   * The severity to be echoed by the server.
   */
  'severity'?: (I_google_showcase_v1beta1_Severity);
  'response'?: "content"|"error";
}

/**
 * The request message used for the Echo, Collect and Chat methods.
 * If content or opt are set in this message then the request will succeed.
 * If status is set in this message
 * then the status will be returned as an error.
 */
export interface OEchoRequest {
  /**
   * The content to be echoed by the server.
   */
  'content'?: (string);
  /**
   * The error to be thrown by the server.
   */
  'error'?: (O_google_rpc_Status | null);
  /**
   * The severity to be echoed by the server.
   */
  'severity': (O_google_showcase_v1beta1_Severity);
  'response': "content"|"error";
}
