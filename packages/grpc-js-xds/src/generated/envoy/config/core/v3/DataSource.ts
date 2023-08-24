// Original file: deps/envoy-api/envoy/config/core/v3/base.proto


/**
 * Data source consisting of a file, an inline value, or an environment variable.
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
  /**
   * Environment variable data source.
   */
  'environment_variable'?: (string);
  'specifier'?: "filename"|"inline_bytes"|"inline_string"|"environment_variable";
}

/**
 * Data source consisting of a file, an inline value, or an environment variable.
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
  /**
   * Environment variable data source.
   */
  'environment_variable'?: (string);
  'specifier': "filename"|"inline_bytes"|"inline_string"|"environment_variable";
}
