// Original file: null

import type { IFieldDescriptorProto as I_google_protobuf_FieldDescriptorProto, OFieldDescriptorProto as O_google_protobuf_FieldDescriptorProto } from '../../google/protobuf/FieldDescriptorProto';
import type { IDescriptorProto as I_google_protobuf_DescriptorProto, ODescriptorProto as O_google_protobuf_DescriptorProto } from '../../google/protobuf/DescriptorProto';
import type { IEnumDescriptorProto as I_google_protobuf_EnumDescriptorProto, OEnumDescriptorProto as O_google_protobuf_EnumDescriptorProto } from '../../google/protobuf/EnumDescriptorProto';
import type { IMessageOptions as I_google_protobuf_MessageOptions, OMessageOptions as O_google_protobuf_MessageOptions } from '../../google/protobuf/MessageOptions';
import type { IOneofDescriptorProto as I_google_protobuf_OneofDescriptorProto, OOneofDescriptorProto as O_google_protobuf_OneofDescriptorProto } from '../../google/protobuf/OneofDescriptorProto';

export interface I_google_protobuf_DescriptorProto_ExtensionRange {
  'start'?: (number);
  'end'?: (number);
}

export interface O_google_protobuf_DescriptorProto_ExtensionRange {
  'start': (number);
  'end': (number);
}

export interface I_google_protobuf_DescriptorProto_ReservedRange {
  'start'?: (number);
  'end'?: (number);
}

export interface O_google_protobuf_DescriptorProto_ReservedRange {
  'start': (number);
  'end': (number);
}

export interface IDescriptorProto {
  'name'?: (string);
  'field'?: (I_google_protobuf_FieldDescriptorProto)[];
  'nestedType'?: (I_google_protobuf_DescriptorProto)[];
  'enumType'?: (I_google_protobuf_EnumDescriptorProto)[];
  'extensionRange'?: (I_google_protobuf_DescriptorProto_ExtensionRange)[];
  'extension'?: (I_google_protobuf_FieldDescriptorProto)[];
  'options'?: (I_google_protobuf_MessageOptions | null);
  'oneofDecl'?: (I_google_protobuf_OneofDescriptorProto)[];
  'reservedRange'?: (I_google_protobuf_DescriptorProto_ReservedRange)[];
  'reservedName'?: (string)[];
}

export interface ODescriptorProto {
  'name': (string);
  'field': (O_google_protobuf_FieldDescriptorProto)[];
  'nestedType': (O_google_protobuf_DescriptorProto)[];
  'enumType': (O_google_protobuf_EnumDescriptorProto)[];
  'extensionRange': (O_google_protobuf_DescriptorProto_ExtensionRange)[];
  'extension': (O_google_protobuf_FieldDescriptorProto)[];
  'options': (O_google_protobuf_MessageOptions | null);
  'oneofDecl': (O_google_protobuf_OneofDescriptorProto)[];
  'reservedRange': (O_google_protobuf_DescriptorProto_ReservedRange)[];
  'reservedName': (string)[];
}
