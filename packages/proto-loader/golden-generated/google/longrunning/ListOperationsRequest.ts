// Original file: deps/googleapis/google/longrunning/operations.proto


/**
 * The request message for [Operations.ListOperations][google.longrunning.Operations.ListOperations].
 */
export interface IListOperationsRequest {
  /**
   * The standard list filter.
   */
  'filter'?: (string);
  /**
   * The standard list page size.
   */
  'page_size'?: (number);
  /**
   * The standard list page token.
   */
  'page_token'?: (string);
  /**
   * The name of the operation's parent resource.
   */
  'name'?: (string);
}

/**
 * The request message for [Operations.ListOperations][google.longrunning.Operations.ListOperations].
 */
export interface OListOperationsRequest {
  /**
   * The standard list filter.
   */
  'filter': (string);
  /**
   * The standard list page size.
   */
  'page_size': (number);
  /**
   * The standard list page token.
   */
  'page_token': (string);
  /**
   * The name of the operation's parent resource.
   */
  'name': (string);
}
