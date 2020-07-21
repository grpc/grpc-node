// Original file: deps/googleapis/google/longrunning/operations.proto

import { Operation as _google_longrunning_Operation, Operation__Output as _google_longrunning_Operation__Output } from '../../google/longrunning/Operation';

/**
 * The response message for [Operations.ListOperations][google.longrunning.Operations.ListOperations].
 */
export interface ListOperationsResponse {
  /**
   * A list of operations that matches the specified filter in the request.
   */
  'operations'?: (_google_longrunning_Operation)[];
  /**
   * The standard List next-page token.
   */
  'next_page_token'?: (string);
}

/**
 * The response message for [Operations.ListOperations][google.longrunning.Operations.ListOperations].
 */
export interface ListOperationsResponse__Output {
  /**
   * A list of operations that matches the specified filter in the request.
   */
  'operations': (_google_longrunning_Operation__Output)[];
  /**
   * The standard List next-page token.
   */
  'next_page_token': (string);
}
