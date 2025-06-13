// Original file: proto/health/v1/health.proto

import type { HealthCheckResponse as _grpc_health_v1_HealthCheckResponse, HealthCheckResponse__Output as _grpc_health_v1_HealthCheckResponse__Output } from '../../../grpc/health/v1/HealthCheckResponse';

export interface HealthListResponse {
  /**
   * statuses contains all the services and their respective status.
   */
  'statuses'?: ({[key: string]: _grpc_health_v1_HealthCheckResponse});
}

export interface HealthListResponse__Output {
  /**
   * statuses contains all the services and their respective status.
   */
  'statuses': ({[key: string]: _grpc_health_v1_HealthCheckResponse__Output});
}
