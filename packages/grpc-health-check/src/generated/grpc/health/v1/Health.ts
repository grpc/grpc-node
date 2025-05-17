// Original file: proto/health/v1/health.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { HealthCheckRequest as _grpc_health_v1_HealthCheckRequest, HealthCheckRequest__Output as _grpc_health_v1_HealthCheckRequest__Output } from '../../../grpc/health/v1/HealthCheckRequest';
import type { HealthCheckResponse as _grpc_health_v1_HealthCheckResponse, HealthCheckResponse__Output as _grpc_health_v1_HealthCheckResponse__Output } from '../../../grpc/health/v1/HealthCheckResponse';
import type { HealthListRequest as _grpc_health_v1_HealthListRequest, HealthListRequest__Output as _grpc_health_v1_HealthListRequest__Output } from '../../../grpc/health/v1/HealthListRequest';
import type { HealthListResponse as _grpc_health_v1_HealthListResponse, HealthListResponse__Output as _grpc_health_v1_HealthListResponse__Output } from '../../../grpc/health/v1/HealthListResponse';

export interface HealthDefinition {
  Check: MethodDefinition<_grpc_health_v1_HealthCheckRequest, _grpc_health_v1_HealthCheckResponse, _grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse__Output>
  List: MethodDefinition<_grpc_health_v1_HealthListRequest, _grpc_health_v1_HealthListResponse, _grpc_health_v1_HealthListRequest__Output, _grpc_health_v1_HealthListResponse__Output>
  Watch: MethodDefinition<_grpc_health_v1_HealthCheckRequest, _grpc_health_v1_HealthCheckResponse, _grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse__Output>
}
