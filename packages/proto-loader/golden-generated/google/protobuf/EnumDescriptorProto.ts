// Original file: null

import type { IEnumValueDescriptorProto as I_google_protobuf_EnumValueDescriptorProto, OEnumValueDescriptorProto as O_google_protobuf_EnumValueDescriptorProto } from '../../google/protobuf/EnumValueDescriptorProto';
import type { IEnumOptions as I_google_protobuf_EnumOptions, OEnumOptions as O_google_protobuf_EnumOptions } from '../../google/protobuf/EnumOptions';
import type { ISymbolVisibility as I_google_protobuf_SymbolVisibility, OSymbolVisibility as O_google_protobuf_SymbolVisibility } from '../../google/protobuf/SymbolVisibility';

export interface I_google_protobuf_EnumDescriptorProto_EnumReservedRange {
  'start'?: (number);
  'end'?: (number);
}

export interface O_google_protobuf_EnumDescriptorProto_EnumReservedRange {
  'start': (number);
  'end': (number);
}

export interface IEnumDescriptorProto {
  'name'?: (string);
  'value'?: (I_google_protobuf_EnumValueDescriptorProto)[];
  'options'?: (I_google_protobuf_EnumOptions | null);
  'reservedRange'?: (I_google_protobuf_EnumDescriptorProto_EnumReservedRange)[];
  'reservedName'?: (string)[];
  'visibility'?: (I_google_protobuf_SymbolVisibility);
}

export interface OEnumDescriptorProto {
  'name': (string);
  'value': (O_google_protobuf_EnumValueDescriptorProto)[];
  'options': (O_google_protobuf_EnumOptions | null);
  'reservedRange': (O_google_protobuf_EnumDescriptorProto_EnumReservedRange)[];
  'reservedName': (string)[];
  'visibility': (O_google_protobuf_SymbolVisibility);
}
