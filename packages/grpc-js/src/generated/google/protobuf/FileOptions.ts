// Original file: null

import { UninterpretedOption as _google_protobuf_UninterpretedOption, UninterpretedOption__Output as _google_protobuf_UninterpretedOption__Output } from '../../google/protobuf/UninterpretedOption';
import { FileMigrateAnnotation as _udpa_annotations_FileMigrateAnnotation, FileMigrateAnnotation__Output as _udpa_annotations_FileMigrateAnnotation__Output } from '../../udpa/annotations/FileMigrateAnnotation';
import { StatusAnnotation as _udpa_annotations_StatusAnnotation, StatusAnnotation__Output as _udpa_annotations_StatusAnnotation__Output } from '../../udpa/annotations/StatusAnnotation';

// Original file: null

export enum _google_protobuf_FileOptions_OptimizeMode {
  SPEED = 1,
  CODE_SIZE = 2,
  LITE_RUNTIME = 3,
}

export interface FileOptions {
  'javaPackage'?: (string);
  'javaOuterClassname'?: (string);
  'optimizeFor'?: (_google_protobuf_FileOptions_OptimizeMode | keyof typeof _google_protobuf_FileOptions_OptimizeMode);
  'javaMultipleFiles'?: (boolean);
  'goPackage'?: (string);
  'ccGenericServices'?: (boolean);
  'javaGenericServices'?: (boolean);
  'pyGenericServices'?: (boolean);
  'javaGenerateEqualsAndHash'?: (boolean);
  'deprecated'?: (boolean);
  'javaStringCheckUtf8'?: (boolean);
  'ccEnableArenas'?: (boolean);
  'objcClassPrefix'?: (string);
  'csharpNamespace'?: (string);
  'uninterpretedOption'?: (_google_protobuf_UninterpretedOption)[];
  '.udpa.annotations.file_migrate'?: (_udpa_annotations_FileMigrateAnnotation);
  '.udpa.annotations.file_status'?: (_udpa_annotations_StatusAnnotation);
}

export interface FileOptions__Output {
  'javaPackage': (string);
  'javaOuterClassname': (string);
  'optimizeFor': (keyof typeof _google_protobuf_FileOptions_OptimizeMode);
  'javaMultipleFiles': (boolean);
  'goPackage': (string);
  'ccGenericServices': (boolean);
  'javaGenericServices': (boolean);
  'pyGenericServices': (boolean);
  'javaGenerateEqualsAndHash': (boolean);
  'deprecated': (boolean);
  'javaStringCheckUtf8': (boolean);
  'ccEnableArenas': (boolean);
  'objcClassPrefix': (string);
  'csharpNamespace': (string);
  'uninterpretedOption': (_google_protobuf_UninterpretedOption__Output)[];
  '.udpa.annotations.file_migrate'?: (_udpa_annotations_FileMigrateAnnotation__Output);
  '.udpa.annotations.file_status'?: (_udpa_annotations_StatusAnnotation__Output);
}
