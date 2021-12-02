// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { BackoffStrategy as _envoy_config_core_v3_BackoffStrategy, BackoffStrategy__Output as _envoy_config_core_v3_BackoffStrategy__Output } from '../../../../envoy/config/core/v3/BackoffStrategy';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * The message specifies the retry policy of remote data source when fetching fails.
 */
export interface RetryPolicy {
  /**
   * Specifies parameters that control :ref:`retry backoff strategy <envoy_v3_api_msg_config.core.v3.BackoffStrategy>`.
   * This parameter is optional, in which case the default base interval is 1000 milliseconds. The
   * default maximum interval is 10 times the base interval.
   */
  'retry_back_off'?: (_envoy_config_core_v3_BackoffStrategy | null);
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1.
   */
  'num_retries'?: (_google_protobuf_UInt32Value | null);
}

/**
 * The message specifies the retry policy of remote data source when fetching fails.
 */
export interface RetryPolicy__Output {
  /**
   * Specifies parameters that control :ref:`retry backoff strategy <envoy_v3_api_msg_config.core.v3.BackoffStrategy>`.
   * This parameter is optional, in which case the default base interval is 1000 milliseconds. The
   * default maximum interval is 10 times the base interval.
   */
  'retry_back_off': (_envoy_config_core_v3_BackoffStrategy__Output | null);
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1.
   */
  'num_retries': (_google_protobuf_UInt32Value__Output | null);
}
