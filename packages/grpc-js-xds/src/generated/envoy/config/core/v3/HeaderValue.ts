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
   * Header value is encoded as string. This does not work for non-utf8 characters.
   * Only one of ``value`` or ``raw_value`` can be set.
   */
  'value'?: (string);
  /**
   * Header value is encoded as bytes which can support non-utf8 characters.
   * Only one of ``value`` or ``raw_value`` can be set.
   */
  'raw_value'?: (Buffer | Uint8Array | string);
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
   * Header value is encoded as string. This does not work for non-utf8 characters.
   * Only one of ``value`` or ``raw_value`` can be set.
   */
  'value': (string);
  /**
   * Header value is encoded as bytes which can support non-utf8 characters.
   * Only one of ``value`` or ``raw_value`` can be set.
   */
  'raw_value': (Buffer);
}
