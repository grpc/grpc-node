// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { Severity as _google_showcase_v1beta1_Severity } from '../../../google/showcase/v1beta1/Severity';

/**
 * The response message for the Echo methods.
 */
export interface IEchoResponse {
  /**
   * The content specified in the request.
   */
  'content'?: (string);
  /**
   * The severity specified in the request.
   */
  'severity'?: (_google_showcase_v1beta1_Severity | keyof typeof _google_showcase_v1beta1_Severity);
}

/**
 * The response message for the Echo methods.
 */
export interface OEchoResponse {
  /**
   * The content specified in the request.
   */
  'content': (string);
  /**
   * The severity specified in the request.
   */
  'severity': (keyof typeof _google_showcase_v1beta1_Severity);
}
