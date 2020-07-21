// Original file: null

import { MethodDescriptorProto as _google_protobuf_MethodDescriptorProto, MethodDescriptorProto__Output as _google_protobuf_MethodDescriptorProto__Output } from '../../google/protobuf/MethodDescriptorProto';
import { ServiceOptions as _google_protobuf_ServiceOptions, ServiceOptions__Output as _google_protobuf_ServiceOptions__Output } from '../../google/protobuf/ServiceOptions';

export interface ServiceDescriptorProto {
  'name'?: (string);
  'method'?: (_google_protobuf_MethodDescriptorProto)[];
  'options'?: (_google_protobuf_ServiceOptions);
}

export interface ServiceDescriptorProto__Output {
  'name': (string);
  'method': (_google_protobuf_MethodDescriptorProto__Output)[];
  'options'?: (_google_protobuf_ServiceOptions__Output);
}
