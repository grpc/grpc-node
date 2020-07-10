// Original file: deps/udpa/udpa/annotations/migrate.proto


export interface MigrateAnnotation {
  /**
   * Rename the message/enum/enum value in next version.
   */
  'rename'?: (string);
}

export interface MigrateAnnotation__Output {
  /**
   * Rename the message/enum/enum value in next version.
   */
  'rename': (string);
}
