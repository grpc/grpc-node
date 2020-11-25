// Original file: null

import { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from '../../google/protobuf/DescriptorProto';
import { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from '../../google/protobuf/EnumDescriptorProto';
import { ServiceDescriptorProto as _google_protobuf_ServiceDescriptorProto, ServiceDescriptorProto__Output as _google_protobuf_ServiceDescriptorProto__Output } from '../../google/protobuf/ServiceDescriptorProto';
import { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from '../../google/protobuf/FieldDescriptorProto';
import { FileOptions as _google_protobuf_FileOptions, FileOptions__Output as _google_protobuf_FileOptions__Output } from '../../google/protobuf/FileOptions';
import { SourceCodeInfo as _google_protobuf_SourceCodeInfo, SourceCodeInfo__Output as _google_protobuf_SourceCodeInfo__Output } from '../../google/protobuf/SourceCodeInfo';

export interface FileDescriptorProto {
  'name'?: (string);
  'package'?: (string);
  'dependency'?: (string)[];
  'messageType'?: (_google_protobuf_DescriptorProto)[];
  'enumType'?: (_google_protobuf_EnumDescriptorProto)[];
  'service'?: (_google_protobuf_ServiceDescriptorProto)[];
  'extension'?: (_google_protobuf_FieldDescriptorProto)[];
  'options'?: (_google_protobuf_FileOptions);
  'sourceCodeInfo'?: (_google_protobuf_SourceCodeInfo);
  'publicDependency'?: (number)[];
  'weakDependency'?: (number)[];
  'syntax'?: (string);
}

export interface FileDescriptorProto__Output {
  'name': (string);
  'package': (string);
  'dependency': (string)[];
  'messageType': (_google_protobuf_DescriptorProto__Output)[];
  'enumType': (_google_protobuf_EnumDescriptorProto__Output)[];
  'service': (_google_protobuf_ServiceDescriptorProto__Output)[];
  'extension': (_google_protobuf_FieldDescriptorProto__Output)[];
  'options'?: (_google_protobuf_FileOptions__Output);
  'sourceCodeInfo'?: (_google_protobuf_SourceCodeInfo__Output);
  'publicDependency': (number)[];
  'weakDependency': (number)[];
  'syntax': (string);
}
