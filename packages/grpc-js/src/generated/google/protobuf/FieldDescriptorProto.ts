// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { FieldOptions as _google_protobuf_FieldOptions, FieldOptions__Output as _google_protobuf_FieldOptions__Output } from '../../google/protobuf/FieldOptions';

// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

export enum _google_protobuf_FieldDescriptorProto_Type {
  TYPE_DOUBLE = 1,
  TYPE_FLOAT = 2,
  TYPE_INT64 = 3,
  TYPE_UINT64 = 4,
  TYPE_INT32 = 5,
  TYPE_FIXED64 = 6,
  TYPE_FIXED32 = 7,
  TYPE_BOOL = 8,
  TYPE_STRING = 9,
  TYPE_GROUP = 10,
  TYPE_MESSAGE = 11,
  TYPE_BYTES = 12,
  TYPE_UINT32 = 13,
  TYPE_ENUM = 14,
  TYPE_SFIXED32 = 15,
  TYPE_SFIXED64 = 16,
  TYPE_SINT32 = 17,
  TYPE_SINT64 = 18,
}

// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

export enum _google_protobuf_FieldDescriptorProto_Label {
  LABEL_OPTIONAL = 1,
  LABEL_REQUIRED = 2,
  LABEL_REPEATED = 3,
}

export interface FieldDescriptorProto {
  'name'?: (string);
  'number'?: (number);
  'label'?: (_google_protobuf_FieldDescriptorProto_Label | keyof typeof _google_protobuf_FieldDescriptorProto_Label);
  'type'?: (_google_protobuf_FieldDescriptorProto_Type | keyof typeof _google_protobuf_FieldDescriptorProto_Type);
  'type_name'?: (string);
  'extendee'?: (string);
  'default_value'?: (string);
  'oneof_index'?: (number);
  'json_name'?: (string);
  'options'?: (_google_protobuf_FieldOptions);
}

export interface FieldDescriptorProto__Output {
  'name': (string);
  'number': (number);
  'label': (keyof typeof _google_protobuf_FieldDescriptorProto_Label);
  'type': (keyof typeof _google_protobuf_FieldDescriptorProto_Type);
  'type_name': (string);
  'extendee': (string);
  'default_value': (string);
  'oneof_index': (number);
  'json_name': (string);
  'options': (_google_protobuf_FieldOptions__Output);
}
