// Original file: deps/xds/udpa/annotations/security.proto


/**
 * These annotations indicate metadata for the purpose of understanding the
 * security significance of fields.
 */
export interface FieldSecurityAnnotation {
  /**
   * Field should be set in the presence of untrusted downstreams.
   */
  'configure_for_untrusted_downstream'?: (boolean);
  /**
   * Field should be set in the presence of untrusted upstreams.
   */
  'configure_for_untrusted_upstream'?: (boolean);
}

/**
 * These annotations indicate metadata for the purpose of understanding the
 * security significance of fields.
 */
export interface FieldSecurityAnnotation__Output {
  /**
   * Field should be set in the presence of untrusted downstreams.
   */
  'configure_for_untrusted_downstream': (boolean);
  /**
   * Field should be set in the presence of untrusted upstreams.
   */
  'configure_for_untrusted_upstream': (boolean);
}
