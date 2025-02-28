// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto


/**
 * A message to control transformations to the :scheme header
 */
export interface SchemeHeaderTransformation {
  /**
   * Overwrite any Scheme header with the contents of this string.
   * If set, takes precedence over match_upstream.
   */
  'scheme_to_overwrite'?: (string);
  /**
   * Set the Scheme header to match the upstream transport protocol. For example, should a
   * request be sent to the upstream over TLS, the scheme header will be set to "https". Should the
   * request be sent over plaintext, the scheme header will be set to "http".
   * If scheme_to_overwrite is set, this field is not used.
   */
  'match_upstream'?: (boolean);
  'transformation'?: "scheme_to_overwrite";
}

/**
 * A message to control transformations to the :scheme header
 */
export interface SchemeHeaderTransformation__Output {
  /**
   * Overwrite any Scheme header with the contents of this string.
   * If set, takes precedence over match_upstream.
   */
  'scheme_to_overwrite'?: (string);
  /**
   * Set the Scheme header to match the upstream transport protocol. For example, should a
   * request be sent to the upstream over TLS, the scheme header will be set to "https". Should the
   * request be sent over plaintext, the scheme header will be set to "http".
   * If scheme_to_overwrite is set, this field is not used.
   */
  'match_upstream': (boolean);
  'transformation'?: "scheme_to_overwrite";
}
