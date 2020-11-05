// Original file: deps/envoy-api/envoy/api/v2/core/base.proto


/**
 * Runtime derived double with a default when not specified.
 */
export interface RuntimeDouble {
  /**
   * Default value if runtime value is not available.
   */
  'default_value'?: (number | string);
  /**
   * Runtime key to get value for comparison. This value is used if defined.
   */
  'runtime_key'?: (string);
}

/**
 * Runtime derived double with a default when not specified.
 */
export interface RuntimeDouble__Output {
  /**
   * Default value if runtime value is not available.
   */
  'default_value': (number | string);
  /**
   * Runtime key to get value for comparison. This value is used if defined.
   */
  'runtime_key': (string);
}
