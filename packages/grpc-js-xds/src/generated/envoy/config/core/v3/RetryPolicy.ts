// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { BackoffStrategy as _envoy_config_core_v3_BackoffStrategy, BackoffStrategy__Output as _envoy_config_core_v3_BackoffStrategy__Output } from '../../../../envoy/config/core/v3/BackoffStrategy';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { Long } from '@grpc/proto-loader';

/**
 * See :ref:`RetryHostPredicate <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_host_predicate>`.
 */
export interface _envoy_config_core_v3_RetryPolicy_RetryHostPredicate {
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  'config_type'?: "typed_config";
}

/**
 * See :ref:`RetryHostPredicate <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_host_predicate>`.
 */
export interface _envoy_config_core_v3_RetryPolicy_RetryHostPredicate__Output {
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  'config_type'?: "typed_config";
}

/**
 * See :ref:`RetryPriority <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_priority>`.
 */
export interface _envoy_config_core_v3_RetryPolicy_RetryPriority {
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  'config_type'?: "typed_config";
}

/**
 * See :ref:`RetryPriority <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_priority>`.
 */
export interface _envoy_config_core_v3_RetryPolicy_RetryPriority__Output {
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  'config_type'?: "typed_config";
}

/**
 * The message specifies the retry policy of remote data source when fetching fails.
 * [#next-free-field: 7]
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
  /**
   * For details, see :ref:`retry_on <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_on>`.
   */
  'retry_on'?: (string);
  /**
   * For details, see :ref:`retry_priority <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_priority>`.
   */
  'retry_priority'?: (_envoy_config_core_v3_RetryPolicy_RetryPriority | null);
  /**
   * For details, see :ref:`RetryHostPredicate <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_host_predicate>`.
   */
  'retry_host_predicate'?: (_envoy_config_core_v3_RetryPolicy_RetryHostPredicate)[];
  /**
   * For details, see :ref:`host_selection_retry_max_attempts <envoy_v3_api_field_config.route.v3.RetryPolicy.host_selection_retry_max_attempts>`.
   */
  'host_selection_retry_max_attempts'?: (number | string | Long);
}

/**
 * The message specifies the retry policy of remote data source when fetching fails.
 * [#next-free-field: 7]
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
  /**
   * For details, see :ref:`retry_on <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_on>`.
   */
  'retry_on': (string);
  /**
   * For details, see :ref:`retry_priority <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_priority>`.
   */
  'retry_priority': (_envoy_config_core_v3_RetryPolicy_RetryPriority__Output | null);
  /**
   * For details, see :ref:`RetryHostPredicate <envoy_v3_api_field_config.route.v3.RetryPolicy.retry_host_predicate>`.
   */
  'retry_host_predicate': (_envoy_config_core_v3_RetryPolicy_RetryHostPredicate__Output)[];
  /**
   * For details, see :ref:`host_selection_retry_max_attempts <envoy_v3_api_field_config.route.v3.RetryPolicy.host_selection_retry_max_attempts>`.
   */
  'host_selection_retry_max_attempts': (string);
}
