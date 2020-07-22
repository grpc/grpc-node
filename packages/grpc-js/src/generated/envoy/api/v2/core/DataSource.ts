// Original file: deps/envoy-api/envoy/api/v2/core/base.proto


/**
 * Data source consisting of either a file or an inline value.
 */
export interface DataSource {
  /**
   * Local filesystem data source.
   */
  'filename'?: (string);
  /**
   * Bytes inlined in the configuration.
   */
  'inline_bytes'?: (Buffer | Uint8Array | string);
  /**
   * String inlined in the configuration.
   */
  'inline_string'?: (string);
  'specifier'?: "filename"|"inline_bytes"|"inline_string";
}

/**
 * Data source consisting of either a file or an inline value.
 */
export interface DataSource__Output {
  /**
   * Local filesystem data source.
   */
  'filename'?: (string);
  /**
   * Bytes inlined in the configuration.
   */
  'inline_bytes'?: (Buffer);
  /**
   * String inlined in the configuration.
   */
  'inline_string'?: (string);
  'specifier': "filename"|"inline_bytes"|"inline_string";
}
