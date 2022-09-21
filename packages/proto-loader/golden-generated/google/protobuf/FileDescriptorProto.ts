// Original file: null

import type { IDescriptorProto as I_google_protobuf_DescriptorProto, ODescriptorProto as O_google_protobuf_DescriptorProto } from '../../google/protobuf/DescriptorProto';
import type { IEnumDescriptorProto as I_google_protobuf_EnumDescriptorProto, OEnumDescriptorProto as O_google_protobuf_EnumDescriptorProto } from '../../google/protobuf/EnumDescriptorProto';
import type { IServiceDescriptorProto as I_google_protobuf_ServiceDescriptorProto, OServiceDescriptorProto as O_google_protobuf_ServiceDescriptorProto } from '../../google/protobuf/ServiceDescriptorProto';
import type { IFieldDescriptorProto as I_google_protobuf_FieldDescriptorProto, OFieldDescriptorProto as O_google_protobuf_FieldDescriptorProto } from '../../google/protobuf/FieldDescriptorProto';
import type { IFileOptions as I_google_protobuf_FileOptions, OFileOptions as O_google_protobuf_FileOptions } from '../../google/protobuf/FileOptions';
import type { ISourceCodeInfo as I_google_protobuf_SourceCodeInfo, OSourceCodeInfo as O_google_protobuf_SourceCodeInfo } from '../../google/protobuf/SourceCodeInfo';

export interface IFileDescriptorProto {
  'name'?: (string);
  'package'?: (string);
  'dependency'?: (string)[];
  'messageType'?: (I_google_protobuf_DescriptorProto)[];
  'enumType'?: (I_google_protobuf_EnumDescriptorProto)[];
  'service'?: (I_google_protobuf_ServiceDescriptorProto)[];
  'extension'?: (I_google_protobuf_FieldDescriptorProto)[];
  'options'?: (I_google_protobuf_FileOptions | null);
  'sourceCodeInfo'?: (I_google_protobuf_SourceCodeInfo | null);
  'publicDependency'?: (number)[];
  'weakDependency'?: (number)[];
  'syntax'?: (string);
}

export interface OFileDescriptorProto {
  'name': (string);
  'package': (string);
  'dependency': (string)[];
  'messageType': (O_google_protobuf_DescriptorProto)[];
  'enumType': (O_google_protobuf_EnumDescriptorProto)[];
  'service': (O_google_protobuf_ServiceDescriptorProto)[];
  'extension': (O_google_protobuf_FieldDescriptorProto)[];
  'options': (O_google_protobuf_FileOptions | null);
  'sourceCodeInfo': (O_google_protobuf_SourceCodeInfo | null);
  'publicDependency': (number)[];
  'weakDependency': (number)[];
  'syntax': (string);
}
