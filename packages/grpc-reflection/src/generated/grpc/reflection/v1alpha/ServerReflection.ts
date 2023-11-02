// Original file: proto/grpc/reflection/v1alpha/reflection.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { ServerReflectionRequest as _grpc_reflection_v1alpha_ServerReflectionRequest, ServerReflectionRequest__Output as _grpc_reflection_v1alpha_ServerReflectionRequest__Output } from '../../../grpc/reflection/v1alpha/ServerReflectionRequest';
import type { ServerReflectionResponse as _grpc_reflection_v1alpha_ServerReflectionResponse, ServerReflectionResponse__Output as _grpc_reflection_v1alpha_ServerReflectionResponse__Output } from '../../../grpc/reflection/v1alpha/ServerReflectionResponse';

export interface ServerReflectionDefinition {
  ServerReflectionInfo: MethodDefinition<_grpc_reflection_v1alpha_ServerReflectionRequest, _grpc_reflection_v1alpha_ServerReflectionResponse, _grpc_reflection_v1alpha_ServerReflectionRequest__Output, _grpc_reflection_v1alpha_ServerReflectionResponse__Output>
}
