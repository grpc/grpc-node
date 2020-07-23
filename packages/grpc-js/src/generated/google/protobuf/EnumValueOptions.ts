// Original file: null

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';

export interface EnumValueOptions {
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.envoy.annotations.disallowed_by_default_enum'?: (boolean);
  '.udpa.annotations.enum_value_migrate'?: (_udpa_annotations_MigrateAnnotation);
}

export interface EnumValueOptions__Output {
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.envoy.annotations.disallowed_by_default_enum': (boolean);
  '.udpa.annotations.enum_value_migrate'?: (_udpa_annotations_MigrateAnnotation__Output);
}
