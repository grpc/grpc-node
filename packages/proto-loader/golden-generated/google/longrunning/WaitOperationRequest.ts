// Original file: deps/googleapis/google/longrunning/operations.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../google/protobuf/Duration';

/**
 * The request message for [Operations.WaitOperation][google.longrunning.Operations.WaitOperation].
 */
export interface WaitOperationRequest {
  /**
   * The name of the operation resource to wait on.
   */
  'name'?: (string);
  /**
   * The maximum duration to wait before timing out. If left blank, the wait
   * will be at most the time permitted by the underlying HTTP/RPC protocol.
   * If RPC context deadline is also specified, the shorter one will be used.
   */
  'timeout'?: (_google_protobuf_Duration);
}

/**
 * The request message for [Operations.WaitOperation][google.longrunning.Operations.WaitOperation].
 */
export interface WaitOperationRequest__Output {
  /**
   * The name of the operation resource to wait on.
   */
  'name': (string);
  /**
   * The maximum duration to wait before timing out. If left blank, the wait
   * will be at most the time permitted by the underlying HTTP/RPC protocol.
   * If RPC context deadline is also specified, the shorter one will be used.
   */
  'timeout'?: (_google_protobuf_Duration__Output);
}
