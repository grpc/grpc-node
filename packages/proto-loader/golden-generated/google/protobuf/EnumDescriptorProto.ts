// Original file: null

import type { EnumValueDescriptorProto as _google_protobuf_EnumValueDescriptorProto, EnumValueDescriptorProto__Output as _google_protobuf_EnumValueDescriptorProto__Output } from '../../google/protobuf/EnumValueDescriptorProto';
import type { EnumOptions as _google_protobuf_EnumOptions, EnumOptions__Output as _google_protobuf_EnumOptions__Output } from '../../google/protobuf/EnumOptions';

export interface EnumDescriptorProto {
  'name'?: (string);
  'value'?: (_google_protobuf_EnumValueDescriptorProto)[];
  'options'?: (_google_protobuf_EnumOptions | null);
}

export interface EnumDescriptorProto__Output {
  'name': (string);
  'value': (_google_protobuf_EnumValueDescriptorProto__Output)[];
  'options': (_google_protobuf_EnumOptions__Output | null);
}
