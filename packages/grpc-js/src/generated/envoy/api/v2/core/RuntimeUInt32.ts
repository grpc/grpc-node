// Original file: deps/envoy-api/envoy/api/v2/core/base.proto


/**
 * Runtime derived uint32 with a default when not specified.
 */
export interface RuntimeUInt32 {
  /**
   * Default value if runtime value is not available.
   */
  'default_value'?: (number);
  /**
   * Runtime key to get value for comparison. This value is used if defined.
   */
  'runtime_key'?: (string);
}

/**
 * Runtime derived uint32 with a default when not specified.
 */
export interface RuntimeUInt32__Output {
  /**
   * Default value if runtime value is not available.
   */
  'default_value': (number);
  /**
   * Runtime key to get value for comparison. This value is used if defined.
   */
  'runtime_key': (string);
}
