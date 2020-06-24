// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { FileMigrateAnnotation as _udpa_annotations_FileMigrateAnnotation, FileMigrateAnnotation__Output as _udpa_annotations_FileMigrateAnnotation__Output } from '../../udpa/annotations/FileMigrateAnnotation';
import { StatusAnnotation as _udpa_annotations_StatusAnnotation, StatusAnnotation__Output as _udpa_annotations_StatusAnnotation__Output } from '../../udpa/annotations/StatusAnnotation';

// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

export enum _google_protobuf_FileOptions_OptimizeMode {
  SPEED = 1,
  CODE_SIZE = 2,
  LITE_RUNTIME = 3,
}

export interface FileOptions {
  'java_package'?: (string);
  'java_outer_classname'?: (string);
  'java_multiple_files'?: (boolean);
  'java_generate_equals_and_hash'?: (boolean);
  'java_string_check_utf8'?: (boolean);
  'optimize_for'?: (_google_protobuf_FileOptions_OptimizeMode | keyof typeof _google_protobuf_FileOptions_OptimizeMode);
  'go_package'?: (string);
  'cc_generic_services'?: (boolean);
  'java_generic_services'?: (boolean);
  'py_generic_services'?: (boolean);
  'deprecated'?: (boolean);
  'cc_enable_arenas'?: (boolean);
  'objc_class_prefix'?: (string);
  'csharp_namespace'?: (string);
  'uninterpreted_option'?: (_google_protobuf_UninterpretedOption)[];
  '.udpa.annotations.file_migrate'?: (_udpa_annotations_FileMigrateAnnotation);
  '.udpa.annotations.file_status'?: (_udpa_annotations_StatusAnnotation);
}

export interface FileOptions__Output {
  'java_package': (string);
  'java_outer_classname': (string);
  'java_multiple_files': (boolean);
  'java_generate_equals_and_hash': (boolean);
  'java_string_check_utf8': (boolean);
  'optimize_for': (keyof typeof _google_protobuf_FileOptions_OptimizeMode);
  'go_package': (string);
  'cc_generic_services': (boolean);
  'java_generic_services': (boolean);
  'py_generic_services': (boolean);
  'deprecated': (boolean);
  'cc_enable_arenas': (boolean);
  'objc_class_prefix': (string);
  'csharp_namespace': (string);
  'uninterpreted_option': (_google_protobuf_UninterpretedOption__Output)[];
  '.udpa.annotations.file_migrate': (_udpa_annotations_FileMigrateAnnotation__Output);
  '.udpa.annotations.file_status': (_udpa_annotations_StatusAnnotation__Output);
}
