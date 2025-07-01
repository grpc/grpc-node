// Original file: null

import type { FeatureSet as _google_protobuf_FeatureSet, FeatureSet__Output as _google_protobuf_FeatureSet__Output } from '../../google/protobuf/FeatureSet';
import type { _google_protobuf_FieldOptions_FeatureSupport, _google_protobuf_FieldOptions_FeatureSupport__Output } from '../../google/protobuf/FieldOptions';
import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';

export interface EnumValueOptions {
  'deprecated'?: (boolean);
  'features'?: (_google_protobuf_FeatureSet | null);
  'debugRedact'?: (boolean);
  'featureSupport'?: (_google_protobuf_FieldOptions_FeatureSupport | null);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.envoy.annotations.disallowed_by_default_enum'?: (boolean);
  '.udpa.annotations.enum_value_migrate'?: (_udpa_annotations_MigrateAnnotation | null);
  '.envoy.annotations.deprecated_at_minor_version_enum'?: (string);
}

export interface EnumValueOptions__Output {
  'deprecated': (boolean);
  'features': (_google_protobuf_FeatureSet__Output | null);
  'debugRedact': (boolean);
  'featureSupport': (_google_protobuf_FieldOptions_FeatureSupport__Output | null);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.envoy.annotations.disallowed_by_default_enum': (boolean);
  '.udpa.annotations.enum_value_migrate': (_udpa_annotations_MigrateAnnotation__Output | null);
  '.envoy.annotations.deprecated_at_minor_version_enum': (string);
}
