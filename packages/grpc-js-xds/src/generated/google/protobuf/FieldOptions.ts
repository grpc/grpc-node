// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { FieldRules as _validate_FieldRules, FieldRules__Output as _validate_FieldRules__Output } from '../../validate/FieldRules';
import type { FieldSecurityAnnotation as _udpa_annotations_FieldSecurityAnnotation, FieldSecurityAnnotation__Output as _udpa_annotations_FieldSecurityAnnotation__Output } from '../../udpa/annotations/FieldSecurityAnnotation';
import type { FieldMigrateAnnotation as _udpa_annotations_FieldMigrateAnnotation, FieldMigrateAnnotation__Output as _udpa_annotations_FieldMigrateAnnotation__Output } from '../../udpa/annotations/FieldMigrateAnnotation';
import type { FieldStatusAnnotation as _xds_annotations_v3_FieldStatusAnnotation, FieldStatusAnnotation__Output as _xds_annotations_v3_FieldStatusAnnotation__Output } from '../../xds/annotations/v3/FieldStatusAnnotation';

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
  '.validate.rules'?: (_validate_FieldRules | null);
  '.udpa.annotations.security'?: (_udpa_annotations_FieldSecurityAnnotation | null);
  '.udpa.annotations.sensitive'?: (boolean);
  '.envoy.annotations.deprecated_at_minor_version'?: (string);
  '.udpa.annotations.field_migrate'?: (_udpa_annotations_FieldMigrateAnnotation | null);
  '.envoy.annotations.disallowed_by_default'?: (boolean);
  '.xds.annotations.v3.field_status'?: (_xds_annotations_v3_FieldStatusAnnotation | null);
}

export interface FieldOptions__Output {
  'ctype': (keyof typeof _google_protobuf_FieldOptions_CType);
  'packed': (boolean);
  'deprecated': (boolean);
  'lazy': (boolean);
  'jstype': (keyof typeof _google_protobuf_FieldOptions_JSType);
  'weak': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.validate.rules': (_validate_FieldRules__Output | null);
  '.udpa.annotations.security': (_udpa_annotations_FieldSecurityAnnotation__Output | null);
  '.udpa.annotations.sensitive': (boolean);
  '.envoy.annotations.deprecated_at_minor_version': (string);
  '.udpa.annotations.field_migrate': (_udpa_annotations_FieldMigrateAnnotation__Output | null);
  '.envoy.annotations.disallowed_by_default': (boolean);
  '.xds.annotations.v3.field_status': (_xds_annotations_v3_FieldStatusAnnotation__Output | null);
}
