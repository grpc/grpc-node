// Original file: proto/grpc/testing/echo_messages.proto


/**
 * Message to be echoed back serialized in trailer.
 */
export interface DebugInfo {
  'stack_entries'?: (string)[];
  'detail'?: (string);
}

/**
 * Message to be echoed back serialized in trailer.
 */
export interface DebugInfo__Output {
  'stack_entries': (string)[];
  'detail': (string);
}
