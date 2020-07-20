// Original file: null

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';

export interface EnumOptions {
  'allowAlias'?: (boolean);
  'deprecated'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.udpa.annotations.enum_migrate'?: (_udpa_annotations_MigrateAnnotation);
}

export interface EnumOptions__Output {
  'allowAlias': (boolean);
  'deprecated': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.udpa.annotations.enum_migrate'?: (_udpa_annotations_MigrateAnnotation__Output);
}
