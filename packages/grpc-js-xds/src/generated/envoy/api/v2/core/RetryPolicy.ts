// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { BackoffStrategy as _envoy_api_v2_core_BackoffStrategy, BackoffStrategy__Output as _envoy_api_v2_core_BackoffStrategy__Output } from '../../../../envoy/api/v2/core/BackoffStrategy';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * The message specifies the retry policy of remote data source when fetching fails.
 */
export interface RetryPolicy {
  /**
   * Specifies parameters that control :ref:`retry backoff strategy <envoy_api_msg_core.BackoffStrategy>`.
   * This parameter is optional, in which case the default base interval is 1000 milliseconds. The
   * default maximum interval is 10 times the base interval.
   */
  'retry_back_off'?: (_envoy_api_v2_core_BackoffStrategy);
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1.
   */
  'num_retries'?: (_google_protobuf_UInt32Value);
}

/**
 * The message specifies the retry policy of remote data source when fetching fails.
 */
export interface RetryPolicy__Output {
  /**
   * Specifies parameters that control :ref:`retry backoff strategy <envoy_api_msg_core.BackoffStrategy>`.
   * This parameter is optional, in which case the default base interval is 1000 milliseconds. The
   * default maximum interval is 10 times the base interval.
   */
  'retry_back_off'?: (_envoy_api_v2_core_BackoffStrategy__Output);
  /**
   * Specifies the allowed number of retries. This parameter is optional and
   * defaults to 1.
   */
  'num_retries'?: (_google_protobuf_UInt32Value__Output);
}
