// Original file: deps/envoy-api/envoy/config/core/v3/health_check.proto

import type { HealthStatus as _envoy_config_core_v3_HealthStatus, HealthStatus__Output as _envoy_config_core_v3_HealthStatus__Output } from '../../../../envoy/config/core/v3/HealthStatus';

export interface HealthStatusSet {
  /**
   * An order-independent set of health status.
   */
  'statuses'?: (_envoy_config_core_v3_HealthStatus)[];
}

export interface HealthStatusSet__Output {
  /**
   * An order-independent set of health status.
   */
  'statuses': (_envoy_config_core_v3_HealthStatus__Output)[];
}
