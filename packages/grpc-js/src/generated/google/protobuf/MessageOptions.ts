// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';

export interface MessageOptions {
  'message_set_wire_format'?: (boolean);
  'no_standard_descriptor_accessor'?: (boolean);
  'deprecated'?: (boolean);
  'map_entry'?: (boolean);
  'uninterpreted_option'?: (_google_protobuf_UninterpretedOption)[];
  '.udpa.annotations.message_migrate'?: (_udpa_annotations_MigrateAnnotation);
  '.validate.disabled'?: (boolean);
}

export interface MessageOptions__Output {
  'message_set_wire_format': (boolean);
  'no_standard_descriptor_accessor': (boolean);
  'deprecated': (boolean);
  'map_entry': (boolean);
  'uninterpreted_option': (_google_protobuf_UninterpretedOption__Output)[];
  '.udpa.annotations.message_migrate': (_udpa_annotations_MigrateAnnotation__Output);
  '.validate.disabled': (boolean);
}
