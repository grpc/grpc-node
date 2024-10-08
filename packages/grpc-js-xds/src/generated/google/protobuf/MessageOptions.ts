// Original file: null

import type { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import type { VersioningAnnotation as _udpa_annotations_VersioningAnnotation, VersioningAnnotation__Output as _udpa_annotations_VersioningAnnotation__Output } from '../../udpa/annotations/VersioningAnnotation';
import type { MigrateAnnotation as _udpa_annotations_MigrateAnnotation, MigrateAnnotation__Output as _udpa_annotations_MigrateAnnotation__Output } from '../../udpa/annotations/MigrateAnnotation';
import type { MessageStatusAnnotation as _xds_annotations_v3_MessageStatusAnnotation, MessageStatusAnnotation__Output as _xds_annotations_v3_MessageStatusAnnotation__Output } from '../../xds/annotations/v3/MessageStatusAnnotation';

export interface MessageOptions {
  'messageSetWireFormat'?: (boolean);
  'noStandardDescriptorAccessor'?: (boolean);
  'deprecated'?: (boolean);
  'mapEntry'?: (boolean);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.validate.disabled'?: (boolean);
  '.udpa.annotations.versioning'?: (_udpa_annotations_VersioningAnnotation | null);
  '.udpa.annotations.message_migrate'?: (_udpa_annotations_MigrateAnnotation | null);
  '.xds.annotations.v3.message_status'?: (_xds_annotations_v3_MessageStatusAnnotation | null);
}

export interface MessageOptions__Output {
  'messageSetWireFormat': (boolean);
  'noStandardDescriptorAccessor': (boolean);
  'deprecated': (boolean);
  'mapEntry': (boolean);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.validate.disabled': (boolean);
  '.udpa.annotations.versioning': (_udpa_annotations_VersioningAnnotation__Output | null);
  '.udpa.annotations.message_migrate': (_udpa_annotations_MigrateAnnotation__Output | null);
  '.xds.annotations.v3.message_status': (_xds_annotations_v3_MessageStatusAnnotation__Output | null);
}
