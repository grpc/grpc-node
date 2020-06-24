// Original file: deps/envoy-api/envoy/api/v2/core/health_check.proto

export enum HealthStatus {
  UNKNOWN = 0,
  HEALTHY = 1,
  UNHEALTHY = 2,
  DRAINING = 3,
  TIMEOUT = 4,
  DEGRADED = 5,
}
