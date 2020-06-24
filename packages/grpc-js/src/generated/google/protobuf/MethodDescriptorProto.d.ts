// Original file: node_modules/protobufjs/google/protobuf/descriptor.proto

import { MethodOptions as _google_protobuf_MethodOptions, MethodOptions__Output as _google_protobuf_MethodOptions__Output } from '../../google/protobuf/MethodOptions';

export interface MethodDescriptorProto {
  'name'?: (string);
  'input_type'?: (string);
  'output_type'?: (string);
  'options'?: (_google_protobuf_MethodOptions);
  'client_streaming'?: (boolean);
  'server_streaming'?: (boolean);
}

export interface MethodDescriptorProto__Output {
  'name': (string);
  'input_type': (string);
  'output_type': (string);
  'options': (_google_protobuf_MethodOptions__Output);
  'client_streaming': (boolean);
  'server_streaming': (boolean);
}
