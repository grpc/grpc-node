// Original file: proto/grpc/testing/messages.proto


/**
 * For reconnect interop test only.
 * Server tells client whether its reconnects are following the spec and the
 * reconnect backoffs it saw.
 */
export interface ReconnectInfo {
  'passed'?: (boolean);
  'backoff_ms'?: (number)[];
}

/**
 * For reconnect interop test only.
 * Server tells client whether its reconnects are following the spec and the
 * reconnect backoffs it saw.
 */
export interface ReconnectInfo__Output {
  'passed': (boolean);
  'backoff_ms': (number)[];
}
