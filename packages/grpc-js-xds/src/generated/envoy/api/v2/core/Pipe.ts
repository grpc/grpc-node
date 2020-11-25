// Original file: deps/envoy-api/envoy/api/v2/core/address.proto


export interface Pipe {
  /**
   * Unix Domain Socket path. On Linux, paths starting with '@' will use the
   * abstract namespace. The starting '@' is replaced by a null byte by Envoy.
   * Paths starting with '@' will result in an error in environments other than
   * Linux.
   */
  'path'?: (string);
  /**
   * The mode for the Pipe. Not applicable for abstract sockets.
   */
  'mode'?: (number);
}

export interface Pipe__Output {
  /**
   * Unix Domain Socket path. On Linux, paths starting with '@' will use the
   * abstract namespace. The starting '@' is replaced by a null byte by Envoy.
   * Paths starting with '@' will result in an error in environments other than
   * Linux.
   */
  'path': (string);
  /**
   * The mode for the Pipe. Not applicable for abstract sockets.
   */
  'mode': (number);
}
