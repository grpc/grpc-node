// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto


/**
 * Filters requests that received responses with an Envoy response flag set.
 * A list of the response flags can be found
 * in the access log formatter :ref:`documentation<config_access_log_format_response_flags>`.
 */
export interface ResponseFlagFilter {
  /**
   * Only responses with the any of the flags listed in this field will be logged.
   * This field is optional. If it is not specified, then any response flag will pass
   * the filter check.
   */
  'flags'?: (string)[];
}

/**
 * Filters requests that received responses with an Envoy response flag set.
 * A list of the response flags can be found
 * in the access log formatter :ref:`documentation<config_access_log_format_response_flags>`.
 */
export interface ResponseFlagFilter__Output {
  /**
   * Only responses with the any of the flags listed in this field will be logged.
   * This field is optional. If it is not specified, then any response flag will pass
   * the filter check.
   */
  'flags': (string)[];
}
