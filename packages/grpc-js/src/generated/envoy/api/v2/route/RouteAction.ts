// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { WeightedCluster as _envoy_api_v2_route_WeightedCluster, WeightedCluster__Output as _envoy_api_v2_route_WeightedCluster__Output } from '../../../../envoy/api/v2/route/WeightedCluster';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { RetryPolicy as _envoy_api_v2_route_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_route_RetryPolicy__Output } from '../../../../envoy/api/v2/route/RetryPolicy';
import { RoutingPriority as _envoy_api_v2_core_RoutingPriority } from '../../../../envoy/api/v2/core/RoutingPriority';
import { RateLimit as _envoy_api_v2_route_RateLimit, RateLimit__Output as _envoy_api_v2_route_RateLimit__Output } from '../../../../envoy/api/v2/route/RateLimit';
import { CorsPolicy as _envoy_api_v2_route_CorsPolicy, CorsPolicy__Output as _envoy_api_v2_route_CorsPolicy__Output } from '../../../../envoy/api/v2/route/CorsPolicy';
import { HedgePolicy as _envoy_api_v2_route_HedgePolicy, HedgePolicy__Output as _envoy_api_v2_route_HedgePolicy__Output } from '../../../../envoy/api/v2/route/HedgePolicy';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { RegexMatchAndSubstitute as _envoy_type_matcher_RegexMatchAndSubstitute, RegexMatchAndSubstitute__Output as _envoy_type_matcher_RegexMatchAndSubstitute__Output } from '../../../../envoy/type/matcher/RegexMatchAndSubstitute';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { RuntimeFractionalPercent as _envoy_api_v2_core_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_api_v2_core_RuntimeFractionalPercent__Output } from '../../../../envoy/api/v2/core/RuntimeFractionalPercent';

// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

export enum _envoy_api_v2_route_RouteAction_ClusterNotFoundResponseCode {
  SERVICE_UNAVAILABLE = 0,
  NOT_FOUND = 1,
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy {
  'header'?: (_envoy_api_v2_route_RouteAction_HashPolicy_Header);
  'cookie'?: (_envoy_api_v2_route_RouteAction_HashPolicy_Cookie);
  'connection_properties'?: (_envoy_api_v2_route_RouteAction_HashPolicy_ConnectionProperties);
  'query_parameter'?: (_envoy_api_v2_route_RouteAction_HashPolicy_QueryParameter);
  'filter_state'?: (_envoy_api_v2_route_RouteAction_HashPolicy_FilterState);
  'terminal'?: (boolean);
  'policy_specifier'?: "header"|"cookie"|"connection_properties"|"query_parameter"|"filter_state";
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy__Output {
  'header'?: (_envoy_api_v2_route_RouteAction_HashPolicy_Header__Output);
  'cookie'?: (_envoy_api_v2_route_RouteAction_HashPolicy_Cookie__Output);
  'connection_properties'?: (_envoy_api_v2_route_RouteAction_HashPolicy_ConnectionProperties__Output);
  'query_parameter'?: (_envoy_api_v2_route_RouteAction_HashPolicy_QueryParameter__Output);
  'filter_state'?: (_envoy_api_v2_route_RouteAction_HashPolicy_FilterState__Output);
  'terminal': (boolean);
  'policy_specifier': "header"|"cookie"|"connection_properties"|"query_parameter"|"filter_state";
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_ConnectionProperties {
  'source_ip'?: (boolean);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_ConnectionProperties__Output {
  'source_ip': (boolean);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_Cookie {
  'name'?: (string);
  'ttl'?: (_google_protobuf_Duration);
  'path'?: (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_Cookie__Output {
  'name': (string);
  'ttl': (_google_protobuf_Duration__Output);
  'path': (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_FilterState {
  'key'?: (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_FilterState__Output {
  'key': (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_Header {
  'header_name'?: (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_Header__Output {
  'header_name': (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_QueryParameter {
  'name'?: (string);
}

export interface _envoy_api_v2_route_RouteAction_HashPolicy_QueryParameter__Output {
  'name': (string);
}

// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

export enum _envoy_api_v2_route_RouteAction_InternalRedirectAction {
  PASS_THROUGH_INTERNAL_REDIRECT = 0,
  HANDLE_INTERNAL_REDIRECT = 1,
}

export interface _envoy_api_v2_route_RouteAction_RequestMirrorPolicy {
  'cluster'?: (string);
  'runtime_key'?: (string);
  'runtime_fraction'?: (_envoy_api_v2_core_RuntimeFractionalPercent);
  'trace_sampled'?: (_google_protobuf_BoolValue);
}

export interface _envoy_api_v2_route_RouteAction_RequestMirrorPolicy__Output {
  'cluster': (string);
  'runtime_key': (string);
  'runtime_fraction': (_envoy_api_v2_core_RuntimeFractionalPercent__Output);
  'trace_sampled': (_google_protobuf_BoolValue__Output);
}

export interface _envoy_api_v2_route_RouteAction_UpgradeConfig {
  'upgrade_type'?: (string);
  'enabled'?: (_google_protobuf_BoolValue);
}

export interface _envoy_api_v2_route_RouteAction_UpgradeConfig__Output {
  'upgrade_type': (string);
  'enabled': (_google_protobuf_BoolValue__Output);
}

export interface RouteAction {
  'cluster'?: (string);
  'cluster_header'?: (string);
  'weighted_clusters'?: (_envoy_api_v2_route_WeightedCluster);
  'metadata_match'?: (_envoy_api_v2_core_Metadata);
  'prefix_rewrite'?: (string);
  'host_rewrite'?: (string);
  'auto_host_rewrite'?: (_google_protobuf_BoolValue);
  'timeout'?: (_google_protobuf_Duration);
  'retry_policy'?: (_envoy_api_v2_route_RetryPolicy);
  'request_mirror_policy'?: (_envoy_api_v2_route_RouteAction_RequestMirrorPolicy);
  'priority'?: (_envoy_api_v2_core_RoutingPriority | keyof typeof _envoy_api_v2_core_RoutingPriority);
  'rate_limits'?: (_envoy_api_v2_route_RateLimit)[];
  'include_vh_rate_limits'?: (_google_protobuf_BoolValue);
  'hash_policy'?: (_envoy_api_v2_route_RouteAction_HashPolicy)[];
  'cors'?: (_envoy_api_v2_route_CorsPolicy);
  'cluster_not_found_response_code'?: (_envoy_api_v2_route_RouteAction_ClusterNotFoundResponseCode | keyof typeof _envoy_api_v2_route_RouteAction_ClusterNotFoundResponseCode);
  'max_grpc_timeout'?: (_google_protobuf_Duration);
  'idle_timeout'?: (_google_protobuf_Duration);
  'upgrade_configs'?: (_envoy_api_v2_route_RouteAction_UpgradeConfig)[];
  'internal_redirect_action'?: (_envoy_api_v2_route_RouteAction_InternalRedirectAction | keyof typeof _envoy_api_v2_route_RouteAction_InternalRedirectAction);
  'hedge_policy'?: (_envoy_api_v2_route_HedgePolicy);
  'grpc_timeout_offset'?: (_google_protobuf_Duration);
  'auto_host_rewrite_header'?: (string);
  'request_mirror_policies'?: (_envoy_api_v2_route_RouteAction_RequestMirrorPolicy)[];
  'max_internal_redirects'?: (_google_protobuf_UInt32Value);
  'regex_rewrite'?: (_envoy_type_matcher_RegexMatchAndSubstitute);
  'retry_policy_typed_config'?: (_google_protobuf_Any);
  'cluster_specifier'?: "cluster"|"cluster_header"|"weighted_clusters";
  'host_rewrite_specifier'?: "host_rewrite"|"auto_host_rewrite"|"auto_host_rewrite_header";
}

export interface RouteAction__Output {
  'cluster'?: (string);
  'cluster_header'?: (string);
  'weighted_clusters'?: (_envoy_api_v2_route_WeightedCluster__Output);
  'metadata_match': (_envoy_api_v2_core_Metadata__Output);
  'prefix_rewrite': (string);
  'host_rewrite'?: (string);
  'auto_host_rewrite'?: (_google_protobuf_BoolValue__Output);
  'timeout': (_google_protobuf_Duration__Output);
  'retry_policy': (_envoy_api_v2_route_RetryPolicy__Output);
  'request_mirror_policy': (_envoy_api_v2_route_RouteAction_RequestMirrorPolicy__Output);
  'priority': (keyof typeof _envoy_api_v2_core_RoutingPriority);
  'rate_limits': (_envoy_api_v2_route_RateLimit__Output)[];
  'include_vh_rate_limits': (_google_protobuf_BoolValue__Output);
  'hash_policy': (_envoy_api_v2_route_RouteAction_HashPolicy__Output)[];
  'cors': (_envoy_api_v2_route_CorsPolicy__Output);
  'cluster_not_found_response_code': (keyof typeof _envoy_api_v2_route_RouteAction_ClusterNotFoundResponseCode);
  'max_grpc_timeout': (_google_protobuf_Duration__Output);
  'idle_timeout': (_google_protobuf_Duration__Output);
  'upgrade_configs': (_envoy_api_v2_route_RouteAction_UpgradeConfig__Output)[];
  'internal_redirect_action': (keyof typeof _envoy_api_v2_route_RouteAction_InternalRedirectAction);
  'hedge_policy': (_envoy_api_v2_route_HedgePolicy__Output);
  'grpc_timeout_offset': (_google_protobuf_Duration__Output);
  'auto_host_rewrite_header'?: (string);
  'request_mirror_policies': (_envoy_api_v2_route_RouteAction_RequestMirrorPolicy__Output)[];
  'max_internal_redirects': (_google_protobuf_UInt32Value__Output);
  'regex_rewrite': (_envoy_type_matcher_RegexMatchAndSubstitute__Output);
  'retry_policy_typed_config': (_google_protobuf_Any__Output);
  'cluster_specifier': "cluster"|"cluster_header"|"weighted_clusters";
  'host_rewrite_specifier': "host_rewrite"|"auto_host_rewrite"|"auto_host_rewrite_header";
}
