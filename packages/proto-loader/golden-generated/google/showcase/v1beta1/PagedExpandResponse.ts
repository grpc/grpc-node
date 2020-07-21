// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import { EchoResponse as _google_showcase_v1beta1_EchoResponse, EchoResponse__Output as _google_showcase_v1beta1_EchoResponse__Output } from '../../../google/showcase/v1beta1/EchoResponse';

/**
 * The response for the PagedExpand method.
 */
export interface PagedExpandResponse {
  /**
   * The words that were expanded.
   */
  'responses'?: (_google_showcase_v1beta1_EchoResponse)[];
  /**
   * The next page token.
   */
  'next_page_token'?: (string);
}

/**
 * The response for the PagedExpand method.
 */
export interface PagedExpandResponse__Output {
  /**
   * The words that were expanded.
   */
  'responses': (_google_showcase_v1beta1_EchoResponse__Output)[];
  /**
   * The next page token.
   */
  'next_page_token': (string);
}
