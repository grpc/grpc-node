// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { FieldMigrateAnnotation as _udpa_annotations_FieldMigrateAnnotation, FieldMigrateAnnotation__Output as _udpa_annotations_FieldMigrateAnnotation__Output } from '../../udpa/annotations/FieldMigrateAnnotation';
import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from '../../validate/FieldRules';

// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

export enum _google_protobuf_FieldOptions_CType {
  STRING = 0,
  CORD = 1,
  STRING_PIECE = 2,
}

// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

export enum _google_protobuf_FieldOptions_JSType {
  JS_NORMAL = 0,
  JS_STRING = 1,
  JS_NUMBER = 2,
}

export interface FieldOptions {
  'ctype'?: (_google_protobuf_FieldOptions_CType | keyof typeof _google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'jstype'?: (_google_protobuf_FieldOptions_JSType | keyof typeof _google_protobuf_FieldOptions_JSType);
  'lazy'?: (boolean);
  'deprecated'?: (boolean);
  'weak'?: (boolean);
  'uninterpreted_option'?: (_google_protobuf_UninterpretedOption)[];
  '.udpa.annotations.field_migrate'?: (_udpa_annotations_FieldMigrateAnnotation);
  '.validate.rules'?: (_validate_FieldRules);
  '.envoy.annotations.disallowed_by_default'?: (boolean);
  '.udpa.annotations.sensitive'?: (boolean);
}

export interface FieldOptions__Output {
  'ctype': (keyof typeof _google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'jstype': (keyof typeof _google_protobuf_FieldOptions_JSType);
  'lazy': (boolean);
  'deprecated': (boolean);
  'weak': (boolean);
  'uninterpreted_option': (_google_protobuf_UninterpretedOption__Output)[];
  '.udpa.annotations.field_migrate': (_udpa_annotations_FieldMigrateAnnotation__Output);
  '.validate.rules': (_validate_FieldRules__Output);
  '.envoy.annotations.disallowed_by_default': (boolean);
  '.udpa.annotations.sensitive': (boolean);
}
