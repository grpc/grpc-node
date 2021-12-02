// Original file: deps/envoy-api/envoy/config/core/v3/backoff.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * Configuration defining a jittered exponential back off strategy.
 */
export interface BackoffStrategy {
  /**
   * The base interval to be used for the next back off computation. It should
   * be greater than zero and less than or equal to :ref:`max_interval
   * <envoy_v3_api_field_config.core.v3.BackoffStrategy.max_interval>`.
   */
  'base_interval'?: (_google_protobuf_Duration | null);
  /**
   * Specifies the maximum interval between retries. This parameter is optional,
   * but must be greater than or equal to the :ref:`base_interval
   * <envoy_v3_api_field_config.core.v3.BackoffStrategy.base_interval>` if set. The default
   * is 10 times the :ref:`base_interval
   * <envoy_v3_api_field_config.core.v3.BackoffStrategy.base_interval>`.
   */
  'max_interval'?: (_google_protobuf_Duration | null);
}

/**
 * Configuration defining a jittered exponential back off strategy.
 */
export interface BackoffStrategy__Output {
  /**
   * The base interval to be used for the next back off computation. It should
   * be greater than zero and less than or equal to :ref:`max_interval
   * <envoy_v3_api_field_config.core.v3.BackoffStrategy.max_interval>`.
   */
  'base_interval': (_google_protobuf_Duration__Output | null);
  /**
   * Specifies the maximum interval between retries. This parameter is optional,
   * but must be greater than or equal to the :ref:`base_interval
   * <envoy_v3_api_field_config.core.v3.BackoffStrategy.base_interval>` if set. The default
   * is 10 times the :ref:`base_interval
   * <envoy_v3_api_field_config.core.v3.BackoffStrategy.base_interval>`.
   */
  'max_interval': (_google_protobuf_Duration__Output | null);
}
