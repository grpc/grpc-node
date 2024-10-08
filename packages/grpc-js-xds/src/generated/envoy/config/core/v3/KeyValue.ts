// Original file: deps/envoy-api/envoy/config/core/v3/base.proto


export interface KeyValue {
  /**
   * The key of the key/value pair.
   */
  'key'?: (string);
  /**
   * The value of the key/value pair.
   */
  'value'?: (Buffer | Uint8Array | string);
}

export interface KeyValue__Output {
  /**
   * The key of the key/value pair.
   */
  'key': (string);
  /**
   * The value of the key/value pair.
   */
  'value': (Buffer);
}
