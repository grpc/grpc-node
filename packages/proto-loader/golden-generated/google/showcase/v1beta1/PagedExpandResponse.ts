// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type { IEchoResponse as I_google_showcase_v1beta1_EchoResponse, OEchoResponse as O_google_showcase_v1beta1_EchoResponse } from '../../../google/showcase/v1beta1/EchoResponse';

/**
 * The response for the PagedExpand method.
 */
export interface IPagedExpandResponse {
  /**
   * The words that were expanded.
   */
  'responses'?: (I_google_showcase_v1beta1_EchoResponse)[];
  /**
   * The next page token.
   */
  'next_page_token'?: (string);
}

/**
 * The response for the PagedExpand method.
 */
export interface OPagedExpandResponse {
  /**
   * The words that were expanded.
   */
  'responses': (O_google_showcase_v1beta1_EchoResponse)[];
  /**
   * The next page token.
   */
  'next_page_token': (string);
}
