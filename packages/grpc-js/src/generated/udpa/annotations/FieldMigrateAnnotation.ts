// Original file: deps/udpa/udpa/annotations/migrate.proto


export interface FieldMigrateAnnotation {
  /**
   * Rename the field in next version.
   */
  'rename'?: (string);
  /**
   * Add the field to a named oneof in next version. If this already exists, the
   * field will join its siblings under the oneof, otherwise a new oneof will be
   * created with the given name.
   */
  'oneof_promotion'?: (string);
}

export interface FieldMigrateAnnotation__Output {
  /**
   * Rename the field in next version.
   */
  'rename': (string);
  /**
   * Add the field to a named oneof in next version. If this already exists, the
   * field will join its siblings under the oneof, otherwise a new oneof will be
   * created with the given name.
   */
  'oneof_promotion': (string);
}
