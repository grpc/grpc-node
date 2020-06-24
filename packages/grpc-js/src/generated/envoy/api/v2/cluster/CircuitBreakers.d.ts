// Original file: deps/envoy-api/envoy/api/v2/cluster/circuit_breaker.proto

import { RoutingPriority as _envoy_api_v2_core_RoutingPriority } from '../../../../envoy/api/v2/core/RoutingPriority';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from '../../../../envoy/type/Percent';

export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds {
  'priority'?: (_envoy_api_v2_core_RoutingPriority | keyof typeof _envoy_api_v2_core_RoutingPriority);
  'max_connections'?: (_google_protobuf_UInt32Value);
  'max_pending_requests'?: (_google_protobuf_UInt32Value);
  'max_requests'?: (_google_protobuf_UInt32Value);
  'max_retries'?: (_google_protobuf_UInt32Value);
  'retry_budget'?: (_envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget);
  'track_remaining'?: (boolean);
  'max_connection_pools'?: (_google_protobuf_UInt32Value);
}

export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds__Output {
  'priority': (keyof typeof _envoy_api_v2_core_RoutingPriority);
  'max_connections': (_google_protobuf_UInt32Value__Output);
  'max_pending_requests': (_google_protobuf_UInt32Value__Output);
  'max_requests': (_google_protobuf_UInt32Value__Output);
  'max_retries': (_google_protobuf_UInt32Value__Output);
  'retry_budget': (_envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget__Output);
  'track_remaining': (boolean);
  'max_connection_pools': (_google_protobuf_UInt32Value__Output);
}

export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget {
  'budget_percent'?: (_envoy_type_Percent);
  'min_retry_concurrency'?: (_google_protobuf_UInt32Value);
}

export interface _envoy_api_v2_cluster_CircuitBreakers_Thresholds_RetryBudget__Output {
  'budget_percent': (_envoy_type_Percent__Output);
  'min_retry_concurrency': (_google_protobuf_UInt32Value__Output);
}

export interface CircuitBreakers {
  'thresholds'?: (_envoy_api_v2_cluster_CircuitBreakers_Thresholds)[];
}

export interface CircuitBreakers__Output {
  'thresholds': (_envoy_api_v2_cluster_CircuitBreakers_Thresholds__Output)[];
}
