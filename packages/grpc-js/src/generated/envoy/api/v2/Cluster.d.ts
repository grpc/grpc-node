// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';
import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../envoy/api/v2/core/Address';
import { ClusterLoadAssignment as _envoy_api_v2_ClusterLoadAssignment, ClusterLoadAssignment__Output as _envoy_api_v2_ClusterLoadAssignment__Output } from '../../../envoy/api/v2/ClusterLoadAssignment';
import { HealthCheck as _envoy_api_v2_core_HealthCheck, HealthCheck__Output as _envoy_api_v2_core_HealthCheck__Output } from '../../../envoy/api/v2/core/HealthCheck';
import { CircuitBreakers as _envoy_api_v2_cluster_CircuitBreakers, CircuitBreakers__Output as _envoy_api_v2_cluster_CircuitBreakers__Output } from '../../../envoy/api/v2/cluster/CircuitBreakers';
import { UpstreamTlsContext as _envoy_api_v2_auth_UpstreamTlsContext, UpstreamTlsContext__Output as _envoy_api_v2_auth_UpstreamTlsContext__Output } from '../../../envoy/api/v2/auth/UpstreamTlsContext';
import { UpstreamHttpProtocolOptions as _envoy_api_v2_core_UpstreamHttpProtocolOptions, UpstreamHttpProtocolOptions__Output as _envoy_api_v2_core_UpstreamHttpProtocolOptions__Output } from '../../../envoy/api/v2/core/UpstreamHttpProtocolOptions';
import { HttpProtocolOptions as _envoy_api_v2_core_HttpProtocolOptions, HttpProtocolOptions__Output as _envoy_api_v2_core_HttpProtocolOptions__Output } from '../../../envoy/api/v2/core/HttpProtocolOptions';
import { Http1ProtocolOptions as _envoy_api_v2_core_Http1ProtocolOptions, Http1ProtocolOptions__Output as _envoy_api_v2_core_Http1ProtocolOptions__Output } from '../../../envoy/api/v2/core/Http1ProtocolOptions';
import { Http2ProtocolOptions as _envoy_api_v2_core_Http2ProtocolOptions, Http2ProtocolOptions__Output as _envoy_api_v2_core_Http2ProtocolOptions__Output } from '../../../envoy/api/v2/core/Http2ProtocolOptions';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import { OutlierDetection as _envoy_api_v2_cluster_OutlierDetection, OutlierDetection__Output as _envoy_api_v2_cluster_OutlierDetection__Output } from '../../../envoy/api/v2/cluster/OutlierDetection';
import { BindConfig as _envoy_api_v2_core_BindConfig, BindConfig__Output as _envoy_api_v2_core_BindConfig__Output } from '../../../envoy/api/v2/core/BindConfig';
import { TransportSocket as _envoy_api_v2_core_TransportSocket, TransportSocket__Output as _envoy_api_v2_core_TransportSocket__Output } from '../../../envoy/api/v2/core/TransportSocket';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../envoy/api/v2/core/Metadata';
import { UpstreamConnectionOptions as _envoy_api_v2_UpstreamConnectionOptions, UpstreamConnectionOptions__Output as _envoy_api_v2_UpstreamConnectionOptions__Output } from '../../../envoy/api/v2/UpstreamConnectionOptions';
import { Filter as _envoy_api_v2_cluster_Filter, Filter__Output as _envoy_api_v2_cluster_Filter__Output } from '../../../envoy/api/v2/cluster/Filter';
import { LoadBalancingPolicy as _envoy_api_v2_LoadBalancingPolicy, LoadBalancingPolicy__Output as _envoy_api_v2_LoadBalancingPolicy__Output } from '../../../envoy/api/v2/LoadBalancingPolicy';
import { ConfigSource as _envoy_api_v2_core_ConfigSource, ConfigSource__Output as _envoy_api_v2_core_ConfigSource__Output } from '../../../envoy/api/v2/core/ConfigSource';
import { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../google/protobuf/UInt64Value';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from '../../../envoy/type/Percent';
import { Long } from '@grpc/proto-loader';

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_DiscoveryType {
  STATIC = 0,
  STRICT_DNS = 1,
  LOGICAL_DNS = 2,
  EDS = 3,
  ORIGINAL_DST = 4,
}

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_LbPolicy {
  ROUND_ROBIN = 0,
  LEAST_REQUEST = 1,
  RING_HASH = 2,
  RANDOM = 3,
  ORIGINAL_DST_LB = 4,
  MAGLEV = 5,
  CLUSTER_PROVIDED = 6,
  LOAD_BALANCING_POLICY_CONFIG = 7,
}

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_DnsLookupFamily {
  AUTO = 0,
  V4_ONLY = 1,
  V6_ONLY = 2,
}

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_ClusterProtocolSelection {
  USE_CONFIGURED_PROTOCOL = 0,
  USE_DOWNSTREAM_PROTOCOL = 1,
}

export interface _envoy_api_v2_Cluster_TransportSocketMatch {
  'name'?: (string);
  'match'?: (_google_protobuf_Struct);
  'transport_socket'?: (_envoy_api_v2_core_TransportSocket);
}

export interface _envoy_api_v2_Cluster_TransportSocketMatch__Output {
  'name': (string);
  'match': (_google_protobuf_Struct__Output);
  'transport_socket': (_envoy_api_v2_core_TransportSocket__Output);
}

export interface _envoy_api_v2_Cluster_CustomClusterType {
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any);
}

export interface _envoy_api_v2_Cluster_CustomClusterType__Output {
  'name': (string);
  'typed_config': (_google_protobuf_Any__Output);
}

export interface _envoy_api_v2_Cluster_EdsClusterConfig {
  'eds_config'?: (_envoy_api_v2_core_ConfigSource);
  'service_name'?: (string);
}

export interface _envoy_api_v2_Cluster_EdsClusterConfig__Output {
  'eds_config': (_envoy_api_v2_core_ConfigSource__Output);
  'service_name': (string);
}

export interface _envoy_api_v2_Cluster_LbSubsetConfig {
  'fallback_policy'?: (_envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy | keyof typeof _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy);
  'default_subset'?: (_google_protobuf_Struct);
  'subset_selectors'?: (_envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector)[];
  'locality_weight_aware'?: (boolean);
  'scale_locality_weight'?: (boolean);
  'panic_mode_any'?: (boolean);
  'list_as_any'?: (boolean);
}

export interface _envoy_api_v2_Cluster_LbSubsetConfig__Output {
  'fallback_policy': (keyof typeof _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy);
  'default_subset': (_google_protobuf_Struct__Output);
  'subset_selectors': (_envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector__Output)[];
  'locality_weight_aware': (boolean);
  'scale_locality_weight': (boolean);
  'panic_mode_any': (boolean);
  'list_as_any': (boolean);
}

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy {
  NO_FALLBACK = 0,
  ANY_ENDPOINT = 1,
  DEFAULT_SUBSET = 2,
}

export interface _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector {
  'keys'?: (string)[];
  'fallback_policy'?: (_envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy | keyof typeof _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy);
  'fallback_keys_subset'?: (string)[];
}

export interface _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector__Output {
  'keys': (string)[];
  'fallback_policy': (keyof typeof _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy);
  'fallback_keys_subset': (string)[];
}

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy {
  NOT_DEFINED = 0,
  NO_FALLBACK = 1,
  ANY_ENDPOINT = 2,
  DEFAULT_SUBSET = 3,
  KEYS_SUBSET = 4,
}

export interface _envoy_api_v2_Cluster_LeastRequestLbConfig {
  'choice_count'?: (_google_protobuf_UInt32Value);
}

export interface _envoy_api_v2_Cluster_LeastRequestLbConfig__Output {
  'choice_count': (_google_protobuf_UInt32Value__Output);
}

export interface _envoy_api_v2_Cluster_RingHashLbConfig {
  'minimum_ring_size'?: (_google_protobuf_UInt64Value);
  'hash_function'?: (_envoy_api_v2_Cluster_RingHashLbConfig_HashFunction | keyof typeof _envoy_api_v2_Cluster_RingHashLbConfig_HashFunction);
  'maximum_ring_size'?: (_google_protobuf_UInt64Value);
}

export interface _envoy_api_v2_Cluster_RingHashLbConfig__Output {
  'minimum_ring_size': (_google_protobuf_UInt64Value__Output);
  'hash_function': (keyof typeof _envoy_api_v2_Cluster_RingHashLbConfig_HashFunction);
  'maximum_ring_size': (_google_protobuf_UInt64Value__Output);
}

// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

export enum _envoy_api_v2_Cluster_RingHashLbConfig_HashFunction {
  XX_HASH = 0,
  MURMUR_HASH_2 = 1,
}

export interface _envoy_api_v2_Cluster_OriginalDstLbConfig {
  'use_http_header'?: (boolean);
}

export interface _envoy_api_v2_Cluster_OriginalDstLbConfig__Output {
  'use_http_header': (boolean);
}

export interface _envoy_api_v2_Cluster_CommonLbConfig {
  'healthy_panic_threshold'?: (_envoy_type_Percent);
  'zone_aware_lb_config'?: (_envoy_api_v2_Cluster_CommonLbConfig_ZoneAwareLbConfig);
  'locality_weighted_lb_config'?: (_envoy_api_v2_Cluster_CommonLbConfig_LocalityWeightedLbConfig);
  'update_merge_window'?: (_google_protobuf_Duration);
  'ignore_new_hosts_until_first_hc'?: (boolean);
  'close_connections_on_host_set_change'?: (boolean);
  'consistent_hashing_lb_config'?: (_envoy_api_v2_Cluster_CommonLbConfig_ConsistentHashingLbConfig);
  'locality_config_specifier'?: "zone_aware_lb_config"|"locality_weighted_lb_config";
}

export interface _envoy_api_v2_Cluster_CommonLbConfig__Output {
  'healthy_panic_threshold': (_envoy_type_Percent__Output);
  'zone_aware_lb_config'?: (_envoy_api_v2_Cluster_CommonLbConfig_ZoneAwareLbConfig__Output);
  'locality_weighted_lb_config'?: (_envoy_api_v2_Cluster_CommonLbConfig_LocalityWeightedLbConfig__Output);
  'update_merge_window': (_google_protobuf_Duration__Output);
  'ignore_new_hosts_until_first_hc': (boolean);
  'close_connections_on_host_set_change': (boolean);
  'consistent_hashing_lb_config': (_envoy_api_v2_Cluster_CommonLbConfig_ConsistentHashingLbConfig__Output);
  'locality_config_specifier': "zone_aware_lb_config"|"locality_weighted_lb_config";
}

export interface _envoy_api_v2_Cluster_CommonLbConfig_ZoneAwareLbConfig {
  'routing_enabled'?: (_envoy_type_Percent);
  'min_cluster_size'?: (_google_protobuf_UInt64Value);
  'fail_traffic_on_panic'?: (boolean);
}

export interface _envoy_api_v2_Cluster_CommonLbConfig_ZoneAwareLbConfig__Output {
  'routing_enabled': (_envoy_type_Percent__Output);
  'min_cluster_size': (_google_protobuf_UInt64Value__Output);
  'fail_traffic_on_panic': (boolean);
}

export interface _envoy_api_v2_Cluster_CommonLbConfig_LocalityWeightedLbConfig {
}

export interface _envoy_api_v2_Cluster_CommonLbConfig_LocalityWeightedLbConfig__Output {
}

export interface _envoy_api_v2_Cluster_CommonLbConfig_ConsistentHashingLbConfig {
  'use_hostname_for_hashing'?: (boolean);
}

export interface _envoy_api_v2_Cluster_CommonLbConfig_ConsistentHashingLbConfig__Output {
  'use_hostname_for_hashing': (boolean);
}

export interface _envoy_api_v2_Cluster_RefreshRate {
  'base_interval'?: (_google_protobuf_Duration);
  'max_interval'?: (_google_protobuf_Duration);
}

export interface _envoy_api_v2_Cluster_RefreshRate__Output {
  'base_interval': (_google_protobuf_Duration__Output);
  'max_interval': (_google_protobuf_Duration__Output);
}

export interface Cluster {
  'transport_socket_matches'?: (_envoy_api_v2_Cluster_TransportSocketMatch)[];
  'name'?: (string);
  'alt_stat_name'?: (string);
  'type'?: (_envoy_api_v2_Cluster_DiscoveryType | keyof typeof _envoy_api_v2_Cluster_DiscoveryType);
  'cluster_type'?: (_envoy_api_v2_Cluster_CustomClusterType);
  'eds_cluster_config'?: (_envoy_api_v2_Cluster_EdsClusterConfig);
  'connect_timeout'?: (_google_protobuf_Duration);
  'per_connection_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  'lb_policy'?: (_envoy_api_v2_Cluster_LbPolicy | keyof typeof _envoy_api_v2_Cluster_LbPolicy);
  'hosts'?: (_envoy_api_v2_core_Address)[];
  'load_assignment'?: (_envoy_api_v2_ClusterLoadAssignment);
  'health_checks'?: (_envoy_api_v2_core_HealthCheck)[];
  'max_requests_per_connection'?: (_google_protobuf_UInt32Value);
  'circuit_breakers'?: (_envoy_api_v2_cluster_CircuitBreakers);
  'tls_context'?: (_envoy_api_v2_auth_UpstreamTlsContext);
  'upstream_http_protocol_options'?: (_envoy_api_v2_core_UpstreamHttpProtocolOptions);
  'common_http_protocol_options'?: (_envoy_api_v2_core_HttpProtocolOptions);
  'http_protocol_options'?: (_envoy_api_v2_core_Http1ProtocolOptions);
  'http2_protocol_options'?: (_envoy_api_v2_core_Http2ProtocolOptions);
  'extension_protocol_options'?: (_google_protobuf_Struct);
  'typed_extension_protocol_options'?: (_google_protobuf_Any);
  'dns_refresh_rate'?: (_google_protobuf_Duration);
  'dns_failure_refresh_rate'?: (_envoy_api_v2_Cluster_RefreshRate);
  'respect_dns_ttl'?: (boolean);
  'dns_lookup_family'?: (_envoy_api_v2_Cluster_DnsLookupFamily | keyof typeof _envoy_api_v2_Cluster_DnsLookupFamily);
  'dns_resolvers'?: (_envoy_api_v2_core_Address)[];
  'use_tcp_for_dns_lookups'?: (boolean);
  'outlier_detection'?: (_envoy_api_v2_cluster_OutlierDetection);
  'cleanup_interval'?: (_google_protobuf_Duration);
  'upstream_bind_config'?: (_envoy_api_v2_core_BindConfig);
  'lb_subset_config'?: (_envoy_api_v2_Cluster_LbSubsetConfig);
  'ring_hash_lb_config'?: (_envoy_api_v2_Cluster_RingHashLbConfig);
  'original_dst_lb_config'?: (_envoy_api_v2_Cluster_OriginalDstLbConfig);
  'least_request_lb_config'?: (_envoy_api_v2_Cluster_LeastRequestLbConfig);
  'common_lb_config'?: (_envoy_api_v2_Cluster_CommonLbConfig);
  'transport_socket'?: (_envoy_api_v2_core_TransportSocket);
  'metadata'?: (_envoy_api_v2_core_Metadata);
  'protocol_selection'?: (_envoy_api_v2_Cluster_ClusterProtocolSelection | keyof typeof _envoy_api_v2_Cluster_ClusterProtocolSelection);
  'upstream_connection_options'?: (_envoy_api_v2_UpstreamConnectionOptions);
  'close_connections_on_host_health_failure'?: (boolean);
  'drain_connections_on_host_removal'?: (boolean);
  'filters'?: (_envoy_api_v2_cluster_Filter)[];
  'load_balancing_policy'?: (_envoy_api_v2_LoadBalancingPolicy);
  'lrs_server'?: (_envoy_api_v2_core_ConfigSource);
  'track_timeout_budgets'?: (boolean);
  'cluster_discovery_type'?: "type"|"cluster_type";
  'lb_config'?: "ring_hash_lb_config"|"original_dst_lb_config"|"least_request_lb_config";
}

export interface Cluster__Output {
  'transport_socket_matches': (_envoy_api_v2_Cluster_TransportSocketMatch__Output)[];
  'name': (string);
  'alt_stat_name': (string);
  'type'?: (keyof typeof _envoy_api_v2_Cluster_DiscoveryType);
  'cluster_type'?: (_envoy_api_v2_Cluster_CustomClusterType__Output);
  'eds_cluster_config': (_envoy_api_v2_Cluster_EdsClusterConfig__Output);
  'connect_timeout': (_google_protobuf_Duration__Output);
  'per_connection_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output);
  'lb_policy': (keyof typeof _envoy_api_v2_Cluster_LbPolicy);
  'hosts': (_envoy_api_v2_core_Address__Output)[];
  'load_assignment': (_envoy_api_v2_ClusterLoadAssignment__Output);
  'health_checks': (_envoy_api_v2_core_HealthCheck__Output)[];
  'max_requests_per_connection': (_google_protobuf_UInt32Value__Output);
  'circuit_breakers': (_envoy_api_v2_cluster_CircuitBreakers__Output);
  'tls_context': (_envoy_api_v2_auth_UpstreamTlsContext__Output);
  'upstream_http_protocol_options': (_envoy_api_v2_core_UpstreamHttpProtocolOptions__Output);
  'common_http_protocol_options': (_envoy_api_v2_core_HttpProtocolOptions__Output);
  'http_protocol_options': (_envoy_api_v2_core_Http1ProtocolOptions__Output);
  'http2_protocol_options': (_envoy_api_v2_core_Http2ProtocolOptions__Output);
  'extension_protocol_options': (_google_protobuf_Struct__Output);
  'typed_extension_protocol_options': (_google_protobuf_Any__Output);
  'dns_refresh_rate': (_google_protobuf_Duration__Output);
  'dns_failure_refresh_rate': (_envoy_api_v2_Cluster_RefreshRate__Output);
  'respect_dns_ttl': (boolean);
  'dns_lookup_family': (keyof typeof _envoy_api_v2_Cluster_DnsLookupFamily);
  'dns_resolvers': (_envoy_api_v2_core_Address__Output)[];
  'use_tcp_for_dns_lookups': (boolean);
  'outlier_detection': (_envoy_api_v2_cluster_OutlierDetection__Output);
  'cleanup_interval': (_google_protobuf_Duration__Output);
  'upstream_bind_config': (_envoy_api_v2_core_BindConfig__Output);
  'lb_subset_config': (_envoy_api_v2_Cluster_LbSubsetConfig__Output);
  'ring_hash_lb_config'?: (_envoy_api_v2_Cluster_RingHashLbConfig__Output);
  'original_dst_lb_config'?: (_envoy_api_v2_Cluster_OriginalDstLbConfig__Output);
  'least_request_lb_config'?: (_envoy_api_v2_Cluster_LeastRequestLbConfig__Output);
  'common_lb_config': (_envoy_api_v2_Cluster_CommonLbConfig__Output);
  'transport_socket': (_envoy_api_v2_core_TransportSocket__Output);
  'metadata': (_envoy_api_v2_core_Metadata__Output);
  'protocol_selection': (keyof typeof _envoy_api_v2_Cluster_ClusterProtocolSelection);
  'upstream_connection_options': (_envoy_api_v2_UpstreamConnectionOptions__Output);
  'close_connections_on_host_health_failure': (boolean);
  'drain_connections_on_host_removal': (boolean);
  'filters': (_envoy_api_v2_cluster_Filter__Output)[];
  'load_balancing_policy': (_envoy_api_v2_LoadBalancingPolicy__Output);
  'lrs_server': (_envoy_api_v2_core_ConfigSource__Output);
  'track_timeout_budgets': (boolean);
  'cluster_discovery_type': "type"|"cluster_type";
  'lb_config': "ring_hash_lb_config"|"original_dst_lb_config"|"least_request_lb_config";
}
