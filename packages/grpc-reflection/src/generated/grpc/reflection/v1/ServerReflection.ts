// Original file: proto/grpc/reflection/v1/reflection.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { ServerReflectionRequest as _grpc_reflection_v1_ServerReflectionRequest, ServerReflectionRequest__Output as _grpc_reflection_v1_ServerReflectionRequest__Output } from '../../../grpc/reflection/v1/ServerReflectionRequest';
import type { ServerReflectionResponse as _grpc_reflection_v1_ServerReflectionResponse, ServerReflectionResponse__Output as _grpc_reflection_v1_ServerReflectionResponse__Output } from '../../../grpc/reflection/v1/ServerReflectionResponse';

export interface ServerReflectionDefinition {
  ServerReflectionInfo: MethodDefinition<_grpc_reflection_v1_ServerReflectionRequest, _grpc_reflection_v1_ServerReflectionResponse, _grpc_reflection_v1_ServerReflectionRequest__Output, _grpc_reflection_v1_ServerReflectionResponse__Output>
}
