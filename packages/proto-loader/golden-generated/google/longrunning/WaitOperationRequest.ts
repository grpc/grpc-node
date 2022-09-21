// Original file: deps/googleapis/google/longrunning/operations.proto

import type { IDuration as I_google_protobuf_Duration, ODuration as O_google_protobuf_Duration } from '../../google/protobuf/Duration';

/**
 * The request message for [Operations.WaitOperation][google.longrunning.Operations.WaitOperation].
 */
export interface IWaitOperationRequest {
  /**
   * The name of the operation resource to wait on.
   */
  'name'?: (string);
  /**
   * The maximum duration to wait before timing out. If left blank, the wait
   * will be at most the time permitted by the underlying HTTP/RPC protocol.
   * If RPC context deadline is also specified, the shorter one will be used.
   */
  'timeout'?: (I_google_protobuf_Duration | null);
}

/**
 * The request message for [Operations.WaitOperation][google.longrunning.Operations.WaitOperation].
 */
export interface OWaitOperationRequest {
  /**
   * The name of the operation resource to wait on.
   */
  'name': (string);
  /**
   * The maximum duration to wait before timing out. If left blank, the wait
   * will be at most the time permitted by the underlying HTTP/RPC protocol.
   * If RPC context deadline is also specified, the shorter one will be used.
   */
  'timeout': (O_google_protobuf_Duration | null);
}
