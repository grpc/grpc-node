// Original file: deps/udpa/udpa/annotations/migrate.proto


export interface FileMigrateAnnotation {
  /**
   * Move all types in the file to another package, this implies changing proto
   * file path.
   */
  'move_to_package'?: (string);
}

export interface FileMigrateAnnotation__Output {
  /**
   * Move all types in the file to another package, this implies changing proto
   * file path.
   */
  'move_to_package': (string);
}
