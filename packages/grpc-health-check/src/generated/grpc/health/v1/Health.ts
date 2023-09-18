// Original file: proto/health/v1/health.proto

import type { MethodDefinition } from '@grpc/proto-loader'
import type { HealthCheckRequest as _grpc_health_v1_HealthCheckRequest, HealthCheckRequest__Output as _grpc_health_v1_HealthCheckRequest__Output } from '../../../grpc/health/v1/HealthCheckRequest';
import type { HealthCheckResponse as _grpc_health_v1_HealthCheckResponse, HealthCheckResponse__Output as _grpc_health_v1_HealthCheckResponse__Output } from '../../../grpc/health/v1/HealthCheckResponse';

export interface HealthDefinition {
  Check: MethodDefinition<_grpc_health_v1_HealthCheckRequest, _grpc_health_v1_HealthCheckResponse, _grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse__Output>
  Watch: MethodDefinition<_grpc_health_v1_HealthCheckRequest, _grpc_health_v1_HealthCheckResponse, _grpc_health_v1_HealthCheckRequest__Output, _grpc_health_v1_HealthCheckResponse__Output>
}
