// Original file: proto/grpc/testing/messages.proto


/**
 * For reconnect interop test only.
 * Client tells server what reconnection parameters it used.
 */
export interface ReconnectParams {
  'max_reconnect_backoff_ms'?: (number);
}

/**
 * For reconnect interop test only.
 * Client tells server what reconnection parameters it used.
 */
export interface ReconnectParams__Output {
  'max_reconnect_backoff_ms': (number);
}
