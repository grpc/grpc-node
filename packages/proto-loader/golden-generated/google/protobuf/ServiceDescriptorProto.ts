// Original file: null

import type { IMethodDescriptorProto as I_google_protobuf_MethodDescriptorProto, OMethodDescriptorProto as O_google_protobuf_MethodDescriptorProto } from '../../google/protobuf/MethodDescriptorProto';
import type { IServiceOptions as I_google_protobuf_ServiceOptions, OServiceOptions as O_google_protobuf_ServiceOptions } from '../../google/protobuf/ServiceOptions';

export interface IServiceDescriptorProto {
  'name'?: (string);
  'method'?: (I_google_protobuf_MethodDescriptorProto)[];
  'options'?: (I_google_protobuf_ServiceOptions | null);
}

export interface OServiceDescriptorProto {
  'name': (string);
  'method': (O_google_protobuf_MethodDescriptorProto)[];
  'options': (O_google_protobuf_ServiceOptions | null);
}
