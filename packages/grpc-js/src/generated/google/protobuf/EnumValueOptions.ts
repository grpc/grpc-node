// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';

export interface EnumValueOptions {
  'deprecated'?: (boolean);
  'uninterpreted_option'?: (_google_protobuf_UninterpretedOption)[];
  '.udpa.annotations.enum_value_migrate'?: (_udpa_annotations_MigrateAnnotation);
  '.envoy.annotations.disallowed_by_default_enum'?: (boolean);
}

export interface EnumValueOptions__Output {
  'deprecated': (boolean);
  'uninterpreted_option': (_google_protobuf_UninterpretedOption__Output)[];
  '.udpa.annotations.enum_value_migrate': (_udpa_annotations_MigrateAnnotation__Output);
  '.envoy.annotations.disallowed_by_default_enum': (boolean);
}
