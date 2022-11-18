// Original file: null

import type { IFieldOptions as I_google_protobuf_FieldOptions, OFieldOptions as O_google_protobuf_FieldOptions } from '../../google/protobuf/FieldOptions';

// Original file: null

export const _google_protobuf_FieldDescriptorProto_Label = {
  LABEL_OPTIONAL: 'LABEL_OPTIONAL',
  LABEL_REQUIRED: 'LABEL_REQUIRED',
  LABEL_REPEATED: 'LABEL_REPEATED',
} as const;

export type I_google_protobuf_FieldDescriptorProto_Label =
  | 'LABEL_OPTIONAL'
  | 1
  | 'LABEL_REQUIRED'
  | 2
  | 'LABEL_REPEATED'
  | 3

export type O_google_protobuf_FieldDescriptorProto_Label = typeof _google_protobuf_FieldDescriptorProto_Label[keyof typeof _google_protobuf_FieldDescriptorProto_Label]

// Original file: null

export const _google_protobuf_FieldDescriptorProto_Type = {
  TYPE_DOUBLE: 'TYPE_DOUBLE',
  TYPE_FLOAT: 'TYPE_FLOAT',
  TYPE_INT64: 'TYPE_INT64',
  TYPE_UINT64: 'TYPE_UINT64',
  TYPE_INT32: 'TYPE_INT32',
  TYPE_FIXED64: 'TYPE_FIXED64',
  TYPE_FIXED32: 'TYPE_FIXED32',
  TYPE_BOOL: 'TYPE_BOOL',
  TYPE_STRING: 'TYPE_STRING',
  TYPE_GROUP: 'TYPE_GROUP',
  TYPE_MESSAGE: 'TYPE_MESSAGE',
  TYPE_BYTES: 'TYPE_BYTES',
  TYPE_UINT32: 'TYPE_UINT32',
  TYPE_ENUM: 'TYPE_ENUM',
  TYPE_SFIXED32: 'TYPE_SFIXED32',
  TYPE_SFIXED64: 'TYPE_SFIXED64',
  TYPE_SINT32: 'TYPE_SINT32',
  TYPE_SINT64: 'TYPE_SINT64',
} as const;

export type I_google_protobuf_FieldDescriptorProto_Type =
  | 'TYPE_DOUBLE'
  | 1
  | 'TYPE_FLOAT'
  | 2
  | 'TYPE_INT64'
  | 3
  | 'TYPE_UINT64'
  | 4
  | 'TYPE_INT32'
  | 5
  | 'TYPE_FIXED64'
  | 6
  | 'TYPE_FIXED32'
  | 7
  | 'TYPE_BOOL'
  | 8
  | 'TYPE_STRING'
  | 9
  | 'TYPE_GROUP'
  | 10
  | 'TYPE_MESSAGE'
  | 11
  | 'TYPE_BYTES'
  | 12
  | 'TYPE_UINT32'
  | 13
  | 'TYPE_ENUM'
  | 14
  | 'TYPE_SFIXED32'
  | 15
  | 'TYPE_SFIXED64'
  | 16
  | 'TYPE_SINT32'
  | 17
  | 'TYPE_SINT64'
  | 18

export type O_google_protobuf_FieldDescriptorProto_Type = typeof _google_protobuf_FieldDescriptorProto_Type[keyof typeof _google_protobuf_FieldDescriptorProto_Type]

export interface IFieldDescriptorProto {
  'name'?: (string);
  'extendee'?: (string);
  'number'?: (number);
  'label'?: (I_google_protobuf_FieldDescriptorProto_Label);
  'type'?: (I_google_protobuf_FieldDescriptorProto_Type);
  'typeName'?: (string);
  'defaultValue'?: (string);
  'options'?: (I_google_protobuf_FieldOptions | null);
  'oneofIndex'?: (number);
  'jsonName'?: (string);
}

export interface OFieldDescriptorProto {
  'name': (string);
  'extendee': (string);
  'number': (number);
  'label': (O_google_protobuf_FieldDescriptorProto_Label);
  'type': (O_google_protobuf_FieldDescriptorProto_Type);
  'typeName': (string);
  'defaultValue': (string);
  'options': (O_google_protobuf_FieldOptions | null);
  'oneofIndex': (number);
  'jsonName': (string);
}
