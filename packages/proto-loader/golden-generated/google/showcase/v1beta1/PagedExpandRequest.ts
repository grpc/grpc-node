// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto


/**
 * The request for the PagedExpand method.
 */
export interface IPagedExpandRequest {
  /**
   * The string to expand.
   */
  'content'?: (string);
  /**
   * The amount of words to returned in each page.
   */
  'page_size'?: (number);
  /**
   * The position of the page to be returned.
   */
  'page_token'?: (string);
}

/**
 * The request for the PagedExpand method.
 */
export interface OPagedExpandRequest {
  /**
   * The string to expand.
   */
  'content': (string);
  /**
   * The amount of words to returned in each page.
   */
  'page_size': (number);
  /**
   * The position of the page to be returned.
   */
  'page_token': (string);
}
