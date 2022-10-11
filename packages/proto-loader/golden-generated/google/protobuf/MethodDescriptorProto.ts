// Original file: null

import type { IMethodOptions as I_google_protobuf_MethodOptions, OMethodOptions as O_google_protobuf_MethodOptions } from '../../google/protobuf/MethodOptions';

export interface IMethodDescriptorProto {
  'name'?: (string);
  'inputType'?: (string);
  'outputType'?: (string);
  'options'?: (I_google_protobuf_MethodOptions | null);
  'clientStreaming'?: (boolean);
  'serverStreaming'?: (boolean);
}

export interface OMethodDescriptorProto {
  'name': (string);
  'inputType': (string);
  'outputType': (string);
  'options': (O_google_protobuf_MethodOptions | null);
  'clientStreaming': (boolean);
  'serverStreaming': (boolean);
}
