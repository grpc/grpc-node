// Original file: null

import type { IEnumValueDescriptorProto as I_google_protobuf_EnumValueDescriptorProto, OEnumValueDescriptorProto as O_google_protobuf_EnumValueDescriptorProto } from '../../google/protobuf/EnumValueDescriptorProto.ts';
import type { IEnumOptions as I_google_protobuf_EnumOptions, OEnumOptions as O_google_protobuf_EnumOptions } from '../../google/protobuf/EnumOptions.ts';

export interface IEnumDescriptorProto {
  'name'?: (string);
  'value'?: (I_google_protobuf_EnumValueDescriptorProto)[];
  'options'?: (I_google_protobuf_EnumOptions | null);
}

export interface OEnumDescriptorProto {
  'name': (string);
  'value': (O_google_protobuf_EnumValueDescriptorProto)[];
  'options': (O_google_protobuf_EnumOptions | null);
}
