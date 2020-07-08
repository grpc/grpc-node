// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { FieldDescriptorProto as _google_protobuf_FieldDescriptorProto, FieldDescriptorProto__Output as _google_protobuf_FieldDescriptorProto__Output } from '../../google/protobuf/FieldDescriptorProto';
import { DescriptorProto as _google_protobuf_DescriptorProto, DescriptorProto__Output as _google_protobuf_DescriptorProto__Output } from '../../google/protobuf/DescriptorProto';
import { EnumDescriptorProto as _google_protobuf_EnumDescriptorProto, EnumDescriptorProto__Output as _google_protobuf_EnumDescriptorProto__Output } from '../../google/protobuf/EnumDescriptorProto';
import { OneofDescriptorProto as _google_protobuf_OneofDescriptorProto, OneofDescriptorProto__Output as _google_protobuf_OneofDescriptorProto__Output } from '../../google/protobuf/OneofDescriptorProto';
import { MessageOptions as _google_protobuf_MessageOptions, MessageOptions__Output as _google_protobuf_MessageOptions__Output } from '../../google/protobuf/MessageOptions';

export interface _google_protobuf_DescriptorProto_ExtensionRange {
  'start'?: (number);
  'end'?: (number);
}

export interface _google_protobuf_DescriptorProto_ExtensionRange__Output {
  'start': (number);
  'end': (number);
}

export interface _google_protobuf_DescriptorProto_ReservedRange {
  'start'?: (number);
  'end'?: (number);
}

export interface _google_protobuf_DescriptorProto_ReservedRange__Output {
  'start': (number);
  'end': (number);
}

export interface DescriptorProto {
  'name'?: (string);
  'field'?: (_google_protobuf_FieldDescriptorProto)[];
  'extension'?: (_google_protobuf_FieldDescriptorProto)[];
  'nested_type'?: (_google_protobuf_DescriptorProto)[];
  'enum_type'?: (_google_protobuf_EnumDescriptorProto)[];
  'extension_range'?: (_google_protobuf_DescriptorProto_ExtensionRange)[];
  'oneof_decl'?: (_google_protobuf_OneofDescriptorProto)[];
  'options'?: (_google_protobuf_MessageOptions);
  'reserved_range'?: (_google_protobuf_DescriptorProto_ReservedRange)[];
  'reserved_name'?: (string)[];
}

export interface DescriptorProto__Output {
  'name': (string);
  'field': (_google_protobuf_FieldDescriptorProto__Output)[];
  'extension': (_google_protobuf_FieldDescriptorProto__Output)[];
  'nested_type': (_google_protobuf_DescriptorProto__Output)[];
  'enum_type': (_google_protobuf_EnumDescriptorProto__Output)[];
  'extension_range': (_google_protobuf_DescriptorProto_ExtensionRange__Output)[];
  'oneof_decl': (_google_protobuf_OneofDescriptorProto__Output)[];
  'options': (_google_protobuf_MessageOptions__Output);
  'reserved_range': (_google_protobuf_DescriptorProto_ReservedRange__Output)[];
  'reserved_name': (string)[];
}
