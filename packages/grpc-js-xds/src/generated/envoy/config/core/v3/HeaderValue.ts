// Original file: deps/envoy-api/envoy/config/core/v3/base.proto


/**
 * Header name/value pair.
 */
export interface HeaderValue {
  /**
   * Header name.
   */
  'key'?: (string);
  /**
   * Header value.
   * 
   * The same :ref:`format specifier <config_access_log_format>` as used for
   * :ref:`HTTP access logging <config_access_log>` applies here, however
   * unknown header values are replaced with the empty string instead of ``-``.
   */
  'value'?: (string);
}

/**
 * Header name/value pair.
 */
export interface HeaderValue__Output {
  /**
   * Header name.
   */
  'key': (string);
  /**
   * Header value.
   * 
   * The same :ref:`format specifier <config_access_log_format>` as used for
   * :ref:`HTTP access logging <config_access_log>` applies here, however
   * unknown header values are replaced with the empty string instead of ``-``.
   */
  'value': (string);
}
