// Original file: null

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';

export interface MessageOptions {
  'messageSetWireFormat'?: (boolean);
  'noStandardDescriptorAccessor'?: (boolean);
  'deprecated'?: (boolean);
  'mapEntry'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.validate.disabled'?: (boolean);
  '.udpa.annotations.message_migrate'?: (_udpa_annotations_MigrateAnnotation);
}

export interface MessageOptions__Output {
  'messageSetWireFormat': (boolean);
  'noStandardDescriptorAccessor': (boolean);
  'deprecated': (boolean);
  'mapEntry': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.validate.disabled': (boolean);
  '.udpa.annotations.message_migrate'?: (_udpa_annotations_MigrateAnnotation__Output);
}
