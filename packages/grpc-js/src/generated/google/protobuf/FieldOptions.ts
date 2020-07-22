// Original file: null

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from '../../validate/FieldRules';
import { FieldMigrateAnnotation as _udpa_annotations_FieldMigrateAnnotation, FieldMigrateAnnotation__Output as _udpa_annotations_FieldMigrateAnnotation__Output } from '../../udpa/annotations/FieldMigrateAnnotation';

// Original file: null

export enum _google_protobuf_FieldOptions_CType {
  STRING = 0,
  CORD = 1,
  STRING_PIECE = 2,
}

// Original file: null

export enum _google_protobuf_FieldOptions_JSType {
  JS_NORMAL = 0,
  JS_STRING = 1,
  JS_NUMBER = 2,
}

export interface FieldOptions {
  'ctype'?: (_google_protobuf_FieldOptions_CType | keyof typeof _google_protobuf_FieldOptions_CType);
  'packed'?: (boolean);
  'deprecated'?: (boolean);
  'lazy'?: (boolean);
  'jstype'?: (_google_protobuf_FieldOptions_JSType | keyof typeof _google_protobuf_FieldOptions_JSType);
  'weak'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.validate.rules'?: (_validate_FieldRules);
  '.udpa.annotations.sensitive'?: (boolean);
  '.udpa.annotations.field_migrate'?: (_udpa_annotations_FieldMigrateAnnotation);
  '.envoy.annotations.disallowed_by_default'?: (boolean);
}

export interface FieldOptions__Output {
  'ctype': (keyof typeof _google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (keyof typeof _google_protobuf_FieldOptions_JSType);
  'weak': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.validate.rules'?: (_validate_FieldRules__Output);
  '.udpa.annotations.sensitive': (boolean);
  '.udpa.annotations.field_migrate'?: (_udpa_annotations_FieldMigrateAnnotation__Output);
  '.envoy.annotations.disallowed_by_default': (boolean);
}
