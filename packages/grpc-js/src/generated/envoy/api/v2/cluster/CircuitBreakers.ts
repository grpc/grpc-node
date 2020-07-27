// Original file: deps/envoy-api/envoy/api/v2/cluster/circuit_breaker.proto

import { RoutingPriority as _envoy_api_v2_core_RoutingPriority } from '../../../../envoy/api/v2/core/RoutingPriority';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from '../../../../envoy/type/Percent';

export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget {
  /**
   * Specifies the limit on concurrent retries as a percentage of the sum of active requests and
   * active pending requests. For example, if there are 100 active requests and the
   * budget_percent is set to 25, there may be 25 active retries.
   * 
   * This parameter is optional. Defaults to 20%.
   */
  'budget_percent'?: (_envoy_type_Percent);
  /**
   * Specifies the minimum retry concurrency allowed for the retry budget. The limit on the
   * number of active retries may never go below this number.
   * 
   * This parameter is optional. Defaults to 3.
   */
  'min_retry_concurrency'?: (_google_protobuf_UInt32Value);
}

export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget__Output {
  /**
   * Specifies the limit on concurrent retries as a percentage of the sum of active requests and
   * active pending requests. For example, if there are 100 active requests and the
   * budget_percent is set to 25, there may be 25 active retries.
   * 
   * This parameter is optional. Defaults to 20%.
   */
  'budget_percent'?: (_envoy_type_Percent__Output);
  /**
   * Specifies the minimum retry concurrency allowed for the retry budget. The limit on the
   * number of active retries may never go below this number.
   * 
   * This parameter is optional. Defaults to 3.
   */
  'min_retry_concurrency'?: (_google_protobuf_UInt32Value__Output);
}

/**
 * A Thresholds defines CircuitBreaker settings for a
 * :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`.
 * [#next-free-field: 9]
 */
export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds {
  /**
   * The :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`
   * the specified CircuitBreaker settings apply to.
   */
  'priority'?: (_envoy_api_v2_core_RoutingPriority | keyof typeof _envoy_api_v2_core_RoutingPriority);
  /**
   * The maximum number of connections that Envoy will make to the upstream
   * cluster. If not specified, the default is 1024.
   */
  'max_connections'?: (_google_protobuf_UInt32Value);
  /**
   * The maximum number of pending requests that Envoy will allow to the
   * upstream cluster. If not specified, the default is 1024.
   */
  'max_pending_requests'?: (_google_protobuf_UInt32Value);
  /**
   * The maximum number of parallel requests that Envoy will make to the
   * upstream cluster. If not specified, the default is 1024.
   */
  'max_requests'?: (_google_protobuf_UInt32Value);
  /**
   * The maximum number of parallel retries that Envoy will allow to the
   * upstream cluster. If not specified, the default is 3.
   */
  'max_retries'?: (_google_protobuf_UInt32Value);
  /**
   * Specifies a limit on concurrent retries in relation to the number of active requests. This
   * parameter is optional.
   * 
   * .. note::
   * 
   * If this field is set, the retry budget will override any configured retry circuit
   * breaker.
   */
  'retry_budget'?: (_envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget);
  /**
   * If track_remaining is true, then stats will be published that expose
   * the number of resources remaining until the circuit breakers open. If
   * not specified, the default is false.
   * 
   * .. note::
   * 
   * If a retry budget is used in lieu of the max_retries circuit breaker,
   * the remaining retry resources remaining will not be tracked.
   */
  'track_remaining'?: (boolean);
  /**
   * The maximum number of connection pools per cluster that Envoy will concurrently support at
   * once. If not specified, the default is unlimited. Set this for clusters which create a
   * large number of connection pools. See
   * :ref:`Circuit Breaking <arch_overview_circuit_break_cluster_maximum_connection_pools>` for
   * more details.
   */
  'max_connection_pools'?: (_google_protobuf_UInt32Value);
}

/**
 * A Thresholds defines CircuitBreaker settings for a
 * :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`.
 * [#next-free-field: 9]
 */
export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds__Output {
  /**
   * The :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`
   * the specified CircuitBreaker settings apply to.
   */
  'priority': (keyof typeof _envoy_api_v2_core_RoutingPriority);
  /**
   * The maximum number of connections that Envoy will make to the upstream
   * cluster. If not specified, the default is 1024.
   */
  'max_connections'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The maximum number of pending requests that Envoy will allow to the
   * upstream cluster. If not specified, the default is 1024.
   */
  'max_pending_requests'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The maximum number of parallel requests that Envoy will make to the
   * upstream cluster. If not specified, the default is 1024.
   */
  'max_requests'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The maximum number of parallel retries that Envoy will allow to the
   * upstream cluster. If not specified, the default is 3.
   */
  'max_retries'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Specifies a limit on concurrent retries in relation to the number of active requests. This
   * parameter is optional.
   * 
   * .. note::
   * 
   * If this field is set, the retry budget will override any configured retry circuit
   * breaker.
   */
  'retry_budget'?: (_envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget__Output);
  /**
   * If track_remaining is true, then stats will be published that expose
   * the number of resources remaining until the circuit breakers open. If
   * not specified, the default is false.
   * 
   * .. note::
   * 
   * If a retry budget is used in lieu of the max_retries circuit breaker,
   * the remaining retry resources remaining will not be tracked.
   */
  'track_remaining': (boolean);
  /**
   * The maximum number of connection pools per cluster that Envoy will concurrently support at
   * once. If not specified, the default is unlimited. Set this for clusters which create a
   * large number of connection pools. See
   * :ref:`Circuit Breaking <arch_overview_circuit_break_cluster_maximum_connection_pools>` for
   * more details.
   */
  'max_connection_pools'?: (_google_protobuf_UInt32Value__Output);
}

/**
 * :ref:`Circuit breaking<arch_overview_circuit_break>` settings can be
 * specified individually for each defined priority.
 */
export interface CircuitBreakers {
  /**
   * If multiple :ref:`Thresholds<envoy_api_msg_cluster.CircuitBreakers.Thresholds>`
   * are defined with the same :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`,
   * the first one in the list is used. If no Thresholds is defined for a given
   * :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`, the default values
   * are used.
   */
  'thresholds'?: (_envoy_api_v2_cluster_CircuitBreakers_Thresholds)[];
}

/**
 * :ref:`Circuit breaking<arch_overview_circuit_break>` settings can be
 * specified individually for each defined priority.
 */
export interface CircuitBreakers__Output {
  /**
   * If multiple :ref:`Thresholds<envoy_api_msg_cluster.CircuitBreakers.Thresholds>`
   * are defined with the same :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`,
   * the first one in the list is used. If no Thresholds is defined for a given
   * :ref:`RoutingPriority<envoy_api_enum_core.RoutingPriority>`, the default values
   * are used.
   */
  'thresholds': (_envoy_api_v2_cluster_CircuitBreakers_Thresholds__Output)[];
}
