// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto


/**
 * A message to control transformations to the :scheme header
 */
export interface SchemeHeaderTransformation {
  /**
   * Overwrite any Scheme header with the contents of this string.
   */
  'scheme_to_overwrite'?: (string);
  'transformation'?: "scheme_to_overwrite";
}

/**
 * A message to control transformations to the :scheme header
 */
export interface SchemeHeaderTransformation__Output {
  /**
   * Overwrite any Scheme header with the contents of this string.
   */
  'scheme_to_overwrite'?: (string);
  'transformation': "scheme_to_overwrite";
}
