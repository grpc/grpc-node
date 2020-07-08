// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { Long } from '@grpc/proto-loader';

export interface _google_protobuf_UninterpretedOption_NamePart {
  'name_part'?: (string);
  'is_extension'?: (boolean);
}

export interface _google_protobuf_UninterpretedOption_NamePart__Output {
  'name_part': (string);
  'is_extension': (boolean);
}

export interface UninterpretedOption {
  'name'?: (_google_protobuf_UninterpretedOption_NamePart)[];
  'identifier_value'?: (string);
  'positive_int_value'?: (number | string | Long);
  'negative_int_value'?: (number | string | Long);
  'double_value'?: (number | string);
  'string_value'?: (Buffer | Uint8Array | string);
  'aggregate_value'?: (string);
}

export interface UninterpretedOption__Output {
  'name': (_google_protobuf_UninterpretedOption_NamePart__Output)[];
  'identifier_value': (string);
  'positive_int_value': (string);
  'negative_int_value': (string);
  'double_value': (number | string);
  'string_value': (Buffer);
  'aggregate_value': (string);
}
