// Original file: deps/envoy-api/envoy/api/v2/core/health_check.proto

/**
 * Endpoint health status.
 */
export enum HealthStatus {
  /**
   * The health status is not known. This is interpreted by Envoy as *HEALTHY*.
   */
  UNKNOWN = 0,
  /**
   * Healthy.
   */
  HEALTHY = 1,
  /**
   * Unhealthy.
   */
  UNHEALTHY = 2,
  /**
   * Connection draining in progress. E.g.,
   * `<https://aws.amazon.com/blogs/aws/elb-connection-draining-remove-instances-from-service-with-care/>`_
   * or
   * `<https://cloud.google.com/compute/docs/load-balancing/enabling-connection-draining>`_.
   * This is interpreted by Envoy as *UNHEALTHY*.
   */
  DRAINING = 3,
  /**
   * Health check timed out. This is part of HDS and is interpreted by Envoy as
   * *UNHEALTHY*.
   */
  TIMEOUT = 4,
  /**
   * Degraded.
   */
  DEGRADED = 5,
}
