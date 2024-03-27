// Original file: deps/googleapis/google/longrunning/operations.proto

import type { IOperation as I_google_longrunning_Operation, OOperation as O_google_longrunning_Operation } from '../../google/longrunning/Operation';

/**
 * The response message for [Operations.ListOperations][google.longrunning.Operations.ListOperations].
 */
export interface IListOperationsResponse {
  /**
   * A list of operations that matches the specified filter in the request.
   */
  'operations'?: (I_google_longrunning_Operation)[];
  /**
   * The standard List next-page token.
   */
  'next_page_token'?: (string);
}

/**
 * The response message for [Operations.ListOperations][google.longrunning.Operations.ListOperations].
 */
export interface OListOperationsResponse {
  /**
   * A list of operations that matches the specified filter in the request.
   */
  'operations': (O_google_longrunning_Operation)[];
  /**
   * The standard List next-page token.
   */
  'next_page_token': (string);
}
