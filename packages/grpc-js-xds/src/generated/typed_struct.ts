import type * as grpc from '@grpc/grpc-js';
import type { EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';

import type { ListValue as _google_protobuf_ListValue, ListValue__Output as _google_protobuf_ListValue__Output } from './google/protobuf/ListValue';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from './google/protobuf/Struct';
import type { Value as _google_protobuf_Value, Value__Output as _google_protobuf_Value__Output } from './google/protobuf/Value';
import type { TypedStruct as _udpa_type_v1_TypedStruct, TypedStruct__Output as _udpa_type_v1_TypedStruct__Output } from './udpa/type/v1/TypedStruct';
import type { TypedStruct as _xds_type_v3_TypedStruct, TypedStruct__Output as _xds_type_v3_TypedStruct__Output } from './xds/type/v3/TypedStruct';

type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {
  new(...args: ConstructorParameters<Constructor>): Subtype;
};

export interface ProtoGrpcType {
  google: {
    protobuf: {
      ListValue: MessageTypeDefinition<_google_protobuf_ListValue, _google_protobuf_ListValue__Output>
      NullValue: EnumTypeDefinition
      Struct: MessageTypeDefinition<_google_protobuf_Struct, _google_protobuf_Struct__Output>
      Value: MessageTypeDefinition<_google_protobuf_Value, _google_protobuf_Value__Output>
    }
  }
  udpa: {
    type: {
      v1: {
        TypedStruct: MessageTypeDefinition<_udpa_type_v1_TypedStruct, _udpa_type_v1_TypedStruct__Output>
      }
    }
  }
  xds: {
    type: {
      v3: {
        TypedStruct: MessageTypeDefinition<_xds_type_v3_TypedStruct, _xds_type_v3_TypedStruct__Output>
      }
    }
  }
}

