// Original file: deps/udpa/udpa/annotations/migrate.proto


export interface FieldMigrateAnnotation {
  'rename'?: (string);
  'oneof_promotion'?: (string);
}

export interface FieldMigrateAnnotation__Output {
  'rename': (string);
  'oneof_promotion': (string);
}
