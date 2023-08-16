// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { HealthCheck as _envoy_config_core_v3_HealthCheck, HealthCheck__Output as _envoy_config_core_v3_HealthCheck__Output } from '../../../../envoy/config/core/v3/HealthCheck';
import type { CircuitBreakers as _envoy_config_cluster_v3_CircuitBreakers, CircuitBreakers__Output as _envoy_config_cluster_v3_CircuitBreakers__Output } from '../../../../envoy/config/cluster/v3/CircuitBreakers';
import type { Http1ProtocolOptions as _envoy_config_core_v3_Http1ProtocolOptions, Http1ProtocolOptions__Output as _envoy_config_core_v3_Http1ProtocolOptions__Output } from '../../../../envoy/config/core/v3/Http1ProtocolOptions';
import type { Http2ProtocolOptions as _envoy_config_core_v3_Http2ProtocolOptions, Http2ProtocolOptions__Output as _envoy_config_core_v3_Http2ProtocolOptions__Output } from '../../../../envoy/config/core/v3/Http2ProtocolOptions';
import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { OutlierDetection as _envoy_config_cluster_v3_OutlierDetection, OutlierDetection__Output as _envoy_config_cluster_v3_OutlierDetection__Output } from '../../../../envoy/config/cluster/v3/OutlierDetection';
import type { BindConfig as _envoy_config_core_v3_BindConfig, BindConfig__Output as _envoy_config_core_v3_BindConfig__Output } from '../../../../envoy/config/core/v3/BindConfig';
import type { TransportSocket as _envoy_config_core_v3_TransportSocket, TransportSocket__Output as _envoy_config_core_v3_TransportSocket__Output } from '../../../../envoy/config/core/v3/TransportSocket';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { HttpProtocolOptions as _envoy_config_core_v3_HttpProtocolOptions, HttpProtocolOptions__Output as _envoy_config_core_v3_HttpProtocolOptions__Output } from '../../../../envoy/config/core/v3/HttpProtocolOptions';
import type { UpstreamConnectionOptions as _envoy_config_cluster_v3_UpstreamConnectionOptions, UpstreamConnectionOptions__Output as _envoy_config_cluster_v3_UpstreamConnectionOptions__Output } from '../../../../envoy/config/cluster/v3/UpstreamConnectionOptions';
import type { ClusterLoadAssignment as _envoy_config_endpoint_v3_ClusterLoadAssignment, ClusterLoadAssignment__Output as _envoy_config_endpoint_v3_ClusterLoadAssignment__Output } from '../../../../envoy/config/endpoint/v3/ClusterLoadAssignment';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { Filter as _envoy_config_cluster_v3_Filter, Filter__Output as _envoy_config_cluster_v3_Filter__Output } from '../../../../envoy/config/cluster/v3/Filter';
import type { LoadBalancingPolicy as _envoy_config_cluster_v3_LoadBalancingPolicy, LoadBalancingPolicy__Output as _envoy_config_cluster_v3_LoadBalancingPolicy__Output } from '../../../../envoy/config/cluster/v3/LoadBalancingPolicy';
import type { ConfigSource as _envoy_config_core_v3_ConfigSource, ConfigSource__Output as _envoy_config_core_v3_ConfigSource__Output } from '../../../../envoy/config/core/v3/ConfigSource';
import type { UpstreamHttpProtocolOptions as _envoy_config_core_v3_UpstreamHttpProtocolOptions, UpstreamHttpProtocolOptions__Output as _envoy_config_core_v3_UpstreamHttpProtocolOptions__Output } from '../../../../envoy/config/core/v3/UpstreamHttpProtocolOptions';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { TrackClusterStats as _envoy_config_cluster_v3_TrackClusterStats, TrackClusterStats__Output as _envoy_config_cluster_v3_TrackClusterStats__Output } from '../../../../envoy/config/cluster/v3/TrackClusterStats';
import type { DnsResolutionConfig as _envoy_config_core_v3_DnsResolutionConfig, DnsResolutionConfig__Output as _envoy_config_core_v3_DnsResolutionConfig__Output } from '../../../../envoy/config/core/v3/DnsResolutionConfig';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import type { RuntimeDouble as _envoy_config_core_v3_RuntimeDouble, RuntimeDouble__Output as _envoy_config_core_v3_RuntimeDouble__Output } from '../../../../envoy/config/core/v3/RuntimeDouble';
import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../envoy/type/v3/Percent';
import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../../google/protobuf/UInt64Value';
import type { HealthStatusSet as _envoy_config_core_v3_HealthStatusSet, HealthStatusSet__Output as _envoy_config_core_v3_HealthStatusSet__Output } from '../../../../envoy/config/core/v3/HealthStatusSet';
import type { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from '../../../../google/protobuf/DoubleValue';
import type { Long } from '@grpc/proto-loader';

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

export enum _envoy_config_cluster_v3_Cluster_ClusterProtocolSelection {
  /**
   * Cluster can only operate on one of the possible upstream protocols (HTTP1.1, HTTP2).
   * If :ref:`http2_protocol_options <envoy_v3_api_field_config.cluster.v3.Cluster.http2_protocol_options>` are
   * present, HTTP2 will be used, otherwise HTTP1.1 will be used.
   */
  USE_CONFIGURED_PROTOCOL = 0,
  /**
   * Use HTTP1.1 or HTTP2, depending on which one is used on the downstream connection.
   */
  USE_DOWNSTREAM_PROTOCOL = 1,
}

/**
 * Common configuration for all load balancer implementations.
 * [#next-free-field: 9]
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig {
  /**
   * Configures the :ref:`healthy panic threshold <arch_overview_load_balancing_panic_threshold>`.
   * If not specified, the default is 50%.
   * To disable panic mode, set to 0%.
   * 
   * .. note::
   * The specified percent will be truncated to the nearest 1%.
   */
  'healthy_panic_threshold'?: (_envoy_type_v3_Percent | null);
  'zone_aware_lb_config'?: (_envoy_config_cluster_v3_Cluster_CommonLbConfig_ZoneAwareLbConfig | null);
  'locality_weighted_lb_config'?: (_envoy_config_cluster_v3_Cluster_CommonLbConfig_LocalityWeightedLbConfig | null);
  /**
   * If set, all health check/weight/metadata updates that happen within this duration will be
   * merged and delivered in one shot when the duration expires. The start of the duration is when
   * the first update happens. This is useful for big clusters, with potentially noisy deploys
   * that might trigger excessive CPU usage due to a constant stream of healthcheck state changes
   * or metadata updates. The first set of updates to be seen apply immediately (e.g.: a new
   * cluster). Please always keep in mind that the use of sandbox technologies may change this
   * behavior.
   * 
   * If this is not set, we default to a merge window of 1000ms. To disable it, set the merge
   * window to 0.
   * 
   * Note: merging does not apply to cluster membership changes (e.g.: adds/removes); this is
   * because merging those updates isn't currently safe. See
   * https://github.com/envoyproxy/envoy/pull/3941.
   */
  'update_merge_window'?: (_google_protobuf_Duration | null);
  /**
   * If set to true, Envoy will :ref:`exclude <arch_overview_load_balancing_excluded>` new hosts
   * when computing load balancing weights until they have been health checked for the first time.
   * This will have no effect unless active health checking is also configured.
   */
  'ignore_new_hosts_until_first_hc'?: (boolean);
  /**
   * If set to ``true``, the cluster manager will drain all existing
   * connections to upstream hosts whenever hosts are added or removed from the cluster.
   */
  'close_connections_on_host_set_change'?: (boolean);
  /**
   * Common Configuration for all consistent hashing load balancers (MaglevLb, RingHashLb, etc.)
   */
  'consistent_hashing_lb_config'?: (_envoy_config_cluster_v3_Cluster_CommonLbConfig_ConsistentHashingLbConfig | null);
  /**
   * This controls what hosts are considered valid when using
   * :ref:`host overrides <arch_overview_load_balancing_override_host>`, which is used by some
   * filters to modify the load balancing decision.
   * 
   * If this is unset then [UNKNOWN, HEALTHY, DEGRADED] will be applied by default. If this is
   * set with an empty set of statuses then host overrides will be ignored by the load balancing.
   */
  'override_host_status'?: (_envoy_config_core_v3_HealthStatusSet | null);
  'locality_config_specifier'?: "zone_aware_lb_config"|"locality_weighted_lb_config";
}

/**
 * Common configuration for all load balancer implementations.
 * [#next-free-field: 9]
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig__Output {
  /**
   * Configures the :ref:`healthy panic threshold <arch_overview_load_balancing_panic_threshold>`.
   * If not specified, the default is 50%.
   * To disable panic mode, set to 0%.
   * 
   * .. note::
   * The specified percent will be truncated to the nearest 1%.
   */
  'healthy_panic_threshold': (_envoy_type_v3_Percent__Output | null);
  'zone_aware_lb_config'?: (_envoy_config_cluster_v3_Cluster_CommonLbConfig_ZoneAwareLbConfig__Output | null);
  'locality_weighted_lb_config'?: (_envoy_config_cluster_v3_Cluster_CommonLbConfig_LocalityWeightedLbConfig__Output | null);
  /**
   * If set, all health check/weight/metadata updates that happen within this duration will be
   * merged and delivered in one shot when the duration expires. The start of the duration is when
   * the first update happens. This is useful for big clusters, with potentially noisy deploys
   * that might trigger excessive CPU usage due to a constant stream of healthcheck state changes
   * or metadata updates. The first set of updates to be seen apply immediately (e.g.: a new
   * cluster). Please always keep in mind that the use of sandbox technologies may change this
   * behavior.
   * 
   * If this is not set, we default to a merge window of 1000ms. To disable it, set the merge
   * window to 0.
   * 
   * Note: merging does not apply to cluster membership changes (e.g.: adds/removes); this is
   * because merging those updates isn't currently safe. See
   * https://github.com/envoyproxy/envoy/pull/3941.
   */
  'update_merge_window': (_google_protobuf_Duration__Output | null);
  /**
   * If set to true, Envoy will :ref:`exclude <arch_overview_load_balancing_excluded>` new hosts
   * when computing load balancing weights until they have been health checked for the first time.
   * This will have no effect unless active health checking is also configured.
   */
  'ignore_new_hosts_until_first_hc': (boolean);
  /**
   * If set to ``true``, the cluster manager will drain all existing
   * connections to upstream hosts whenever hosts are added or removed from the cluster.
   */
  'close_connections_on_host_set_change': (boolean);
  /**
   * Common Configuration for all consistent hashing load balancers (MaglevLb, RingHashLb, etc.)
   */
  'consistent_hashing_lb_config': (_envoy_config_cluster_v3_Cluster_CommonLbConfig_ConsistentHashingLbConfig__Output | null);
  /**
   * This controls what hosts are considered valid when using
   * :ref:`host overrides <arch_overview_load_balancing_override_host>`, which is used by some
   * filters to modify the load balancing decision.
   * 
   * If this is unset then [UNKNOWN, HEALTHY, DEGRADED] will be applied by default. If this is
   * set with an empty set of statuses then host overrides will be ignored by the load balancing.
   */
  'override_host_status': (_envoy_config_core_v3_HealthStatusSet__Output | null);
  'locality_config_specifier': "zone_aware_lb_config"|"locality_weighted_lb_config";
}

/**
 * Common Configuration for all consistent hashing load balancers (MaglevLb, RingHashLb, etc.)
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig_ConsistentHashingLbConfig {
  /**
   * If set to ``true``, the cluster will use hostname instead of the resolved
   * address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.
   */
  'use_hostname_for_hashing'?: (boolean);
  /**
   * Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150
   * no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster.
   * If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200.
   * Minimum is 100.
   * 
   * Applies to both Ring Hash and Maglev load balancers.
   * 
   * This is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified
   * ``hash_balance_factor``, requests to any upstream host are capped at ``hash_balance_factor/100`` times the average number of requests
   * across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing
   * is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify
   * the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the
   * cascading overflow effect when choosing the next host in the ring/table).
   * 
   * If weights are specified on the hosts, they are respected.
   * 
   * This is an O(N) algorithm, unlike other load balancers. Using a lower ``hash_balance_factor`` results in more hosts
   * being probed, so use a higher value if you require better performance.
   */
  'hash_balance_factor'?: (_google_protobuf_UInt32Value | null);
}

/**
 * Common Configuration for all consistent hashing load balancers (MaglevLb, RingHashLb, etc.)
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig_ConsistentHashingLbConfig__Output {
  /**
   * If set to ``true``, the cluster will use hostname instead of the resolved
   * address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.
   */
  'use_hostname_for_hashing': (boolean);
  /**
   * Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150
   * no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster.
   * If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200.
   * Minimum is 100.
   * 
   * Applies to both Ring Hash and Maglev load balancers.
   * 
   * This is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified
   * ``hash_balance_factor``, requests to any upstream host are capped at ``hash_balance_factor/100`` times the average number of requests
   * across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing
   * is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify
   * the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the
   * cascading overflow effect when choosing the next host in the ring/table).
   * 
   * If weights are specified on the hosts, they are respected.
   * 
   * This is an O(N) algorithm, unlike other load balancers. Using a lower ``hash_balance_factor`` results in more hosts
   * being probed, so use a higher value if you require better performance.
   */
  'hash_balance_factor': (_google_protobuf_UInt32Value__Output | null);
}

/**
 * Extended cluster type.
 */
export interface _envoy_config_cluster_v3_Cluster_CustomClusterType {
  /**
   * The type of the cluster to instantiate. The name must match a supported cluster type.
   */
  'name'?: (string);
  /**
   * Cluster specific configuration which depends on the cluster being instantiated.
   * See the supported cluster for further documentation.
   * [#extension-category: envoy.clusters]
   */
  'typed_config'?: (_google_protobuf_Any | null);
}

/**
 * Extended cluster type.
 */
export interface _envoy_config_cluster_v3_Cluster_CustomClusterType__Output {
  /**
   * The type of the cluster to instantiate. The name must match a supported cluster type.
   */
  'name': (string);
  /**
   * Cluster specific configuration which depends on the cluster being instantiated.
   * See the supported cluster for further documentation.
   * [#extension-category: envoy.clusters]
   */
  'typed_config': (_google_protobuf_Any__Output | null);
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

/**
 * Refer to :ref:`service discovery type <arch_overview_service_discovery_types>`
 * for an explanation on each type.
 */
export enum _envoy_config_cluster_v3_Cluster_DiscoveryType {
  /**
   * Refer to the :ref:`static discovery type<arch_overview_service_discovery_types_static>`
   * for an explanation.
   */
  STATIC = 0,
  /**
   * Refer to the :ref:`strict DNS discovery
   * type<arch_overview_service_discovery_types_strict_dns>`
   * for an explanation.
   */
  STRICT_DNS = 1,
  /**
   * Refer to the :ref:`logical DNS discovery
   * type<arch_overview_service_discovery_types_logical_dns>`
   * for an explanation.
   */
  LOGICAL_DNS = 2,
  /**
   * Refer to the :ref:`service discovery type<arch_overview_service_discovery_types_eds>`
   * for an explanation.
   */
  EDS = 3,
  /**
   * Refer to the :ref:`original destination discovery
   * type<arch_overview_service_discovery_types_original_destination>`
   * for an explanation.
   */
  ORIGINAL_DST = 4,
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

/**
 * When V4_ONLY is selected, the DNS resolver will only perform a lookup for
 * addresses in the IPv4 family. If V6_ONLY is selected, the DNS resolver will
 * only perform a lookup for addresses in the IPv6 family. If AUTO is
 * specified, the DNS resolver will first perform a lookup for addresses in
 * the IPv6 family and fallback to a lookup for addresses in the IPv4 family.
 * This is semantically equivalent to a non-existent V6_PREFERRED option.
 * AUTO is a legacy name that is more opaque than
 * necessary and will be deprecated in favor of V6_PREFERRED in a future major version of the API.
 * If V4_PREFERRED is specified, the DNS resolver will first perform a lookup for addresses in the
 * IPv4 family and fallback to a lookup for addresses in the IPv6 family. i.e., the callback
 * target will only get v6 addresses if there were NO v4 addresses to return.
 * If ALL is specified, the DNS resolver will perform a lookup for both IPv4 and IPv6 families,
 * and return all resolved addresses. When this is used, Happy Eyeballs will be enabled for
 * upstream connections. Refer to :ref:`Happy Eyeballs Support <arch_overview_happy_eyeballs>`
 * for more information.
 * For cluster types other than
 * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>` and
 * :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
 * this setting is
 * ignored.
 * [#next-major-version: deprecate AUTO in favor of a V6_PREFERRED option.]
 */
export enum _envoy_config_cluster_v3_Cluster_DnsLookupFamily {
  AUTO = 0,
  V4_ONLY = 1,
  V6_ONLY = 2,
  V4_PREFERRED = 3,
  ALL = 4,
}

/**
 * Only valid when discovery type is EDS.
 */
export interface _envoy_config_cluster_v3_Cluster_EdsClusterConfig {
  /**
   * Configuration for the source of EDS updates for this Cluster.
   */
  'eds_config'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * Optional alternative to cluster name to present to EDS. This does not
   * have the same restrictions as cluster name, i.e. it may be arbitrary
   * length. This may be a xdstp:// URL.
   */
  'service_name'?: (string);
}

/**
 * Only valid when discovery type is EDS.
 */
export interface _envoy_config_cluster_v3_Cluster_EdsClusterConfig__Output {
  /**
   * Configuration for the source of EDS updates for this Cluster.
   */
  'eds_config': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * Optional alternative to cluster name to present to EDS. This does not
   * have the same restrictions as cluster name, i.e. it may be arbitrary
   * length. This may be a xdstp:// URL.
   */
  'service_name': (string);
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

/**
 * The hash function used to hash hosts onto the ketama ring.
 */
export enum _envoy_config_cluster_v3_Cluster_RingHashLbConfig_HashFunction {
  /**
   * Use `xxHash <https://github.com/Cyan4973/xxHash>`_, this is the default hash function.
   */
  XX_HASH = 0,
  /**
   * Use `MurmurHash2 <https://sites.google.com/site/murmurhash/>`_, this is compatible with
   * std:hash<string> in GNU libstdc++ 3.4.20 or above. This is typically the case when compiled
   * on Linux and not macOS.
   */
  MURMUR_HASH_2 = 1,
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

/**
 * Refer to :ref:`load balancer type <arch_overview_load_balancing_types>` architecture
 * overview section for information on each type.
 */
export enum _envoy_config_cluster_v3_Cluster_LbPolicy {
  /**
   * Refer to the :ref:`round robin load balancing
   * policy<arch_overview_load_balancing_types_round_robin>`
   * for an explanation.
   */
  ROUND_ROBIN = 0,
  /**
   * Refer to the :ref:`least request load balancing
   * policy<arch_overview_load_balancing_types_least_request>`
   * for an explanation.
   */
  LEAST_REQUEST = 1,
  /**
   * Refer to the :ref:`ring hash load balancing
   * policy<arch_overview_load_balancing_types_ring_hash>`
   * for an explanation.
   */
  RING_HASH = 2,
  /**
   * Refer to the :ref:`random load balancing
   * policy<arch_overview_load_balancing_types_random>`
   * for an explanation.
   */
  RANDOM = 3,
  /**
   * Refer to the :ref:`Maglev load balancing policy<arch_overview_load_balancing_types_maglev>`
   * for an explanation.
   */
  MAGLEV = 5,
  /**
   * This load balancer type must be specified if the configured cluster provides a cluster
   * specific load balancer. Consult the configured cluster's documentation for whether to set
   * this option or not.
   */
  CLUSTER_PROVIDED = 6,
  /**
   * Use the new :ref:`load_balancing_policy
   * <envoy_v3_api_field_config.cluster.v3.Cluster.load_balancing_policy>` field to determine the LB policy.
   * This has been deprecated in favor of using the :ref:`load_balancing_policy
   * <envoy_v3_api_field_config.cluster.v3.Cluster.load_balancing_policy>` field without
   * setting any value in :ref:`lb_policy<envoy_v3_api_field_config.cluster.v3.Cluster.lb_policy>`.
   */
  LOAD_BALANCING_POLICY_CONFIG = 7,
}

/**
 * Optionally divide the endpoints in this cluster into subsets defined by
 * endpoint metadata and selected by route and weighted cluster metadata.
 * [#next-free-field: 9]
 */
export interface _envoy_config_cluster_v3_Cluster_LbSubsetConfig {
  /**
   * The behavior used when no endpoint subset matches the selected route's
   * metadata. The value defaults to
   * :ref:`NO_FALLBACK<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetFallbackPolicy.NO_FALLBACK>`.
   */
  'fallback_policy'?: (_envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy | keyof typeof _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy);
  /**
   * Specifies the default subset of endpoints used during fallback if
   * fallback_policy is
   * :ref:`DEFAULT_SUBSET<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetFallbackPolicy.DEFAULT_SUBSET>`.
   * Each field in default_subset is
   * compared to the matching LbEndpoint.Metadata under the ``envoy.lb``
   * namespace. It is valid for no hosts to match, in which case the behavior
   * is the same as a fallback_policy of
   * :ref:`NO_FALLBACK<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetFallbackPolicy.NO_FALLBACK>`.
   */
  'default_subset'?: (_google_protobuf_Struct | null);
  /**
   * For each entry, LbEndpoint.Metadata's
   * ``envoy.lb`` namespace is traversed and a subset is created for each unique
   * combination of key and value. For example:
   * 
   * .. code-block:: json
   * 
   * { "subset_selectors": [
   * { "keys": [ "version" ] },
   * { "keys": [ "stage", "hardware_type" ] }
   * ]}
   * 
   * A subset is matched when the metadata from the selected route and
   * weighted cluster contains the same keys and values as the subset's
   * metadata. The same host may appear in multiple subsets.
   */
  'subset_selectors'?: (_envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector)[];
  /**
   * If true, routing to subsets will take into account the localities and locality weights of the
   * endpoints when making the routing decision.
   * 
   * There are some potential pitfalls associated with enabling this feature, as the resulting
   * traffic split after applying both a subset match and locality weights might be undesirable.
   * 
   * Consider for example a situation in which you have 50/50 split across two localities X/Y
   * which have 100 hosts each without subsetting. If the subset LB results in X having only 1
   * host selected but Y having 100, then a lot more load is being dumped on the single host in X
   * than originally anticipated in the load balancing assignment delivered via EDS.
   */
  'locality_weight_aware'?: (boolean);
  /**
   * When used with locality_weight_aware, scales the weight of each locality by the ratio
   * of hosts in the subset vs hosts in the original subset. This aims to even out the load
   * going to an individual locality if said locality is disproportionately affected by the
   * subset predicate.
   */
  'scale_locality_weight'?: (boolean);
  /**
   * If true, when a fallback policy is configured and its corresponding subset fails to find
   * a host this will cause any host to be selected instead.
   * 
   * This is useful when using the default subset as the fallback policy, given the default
   * subset might become empty. With this option enabled, if that happens the LB will attempt
   * to select a host from the entire cluster.
   */
  'panic_mode_any'?: (boolean);
  /**
   * If true, metadata specified for a metadata key will be matched against the corresponding
   * endpoint metadata if the endpoint metadata matches the value exactly OR it is a list value
   * and any of the elements in the list matches the criteria.
   */
  'list_as_any'?: (boolean);
  /**
   * Fallback mechanism that allows to try different route metadata until a host is found.
   * If load balancing process, including all its mechanisms (like
   * :ref:`fallback_policy<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.fallback_policy>`)
   * fails to select a host, this policy decides if and how the process is repeated using another metadata.
   * 
   * The value defaults to
   * :ref:`METADATA_NO_FALLBACK<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetMetadataFallbackPolicy.METADATA_NO_FALLBACK>`.
   */
  'metadata_fallback_policy'?: (_envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetMetadataFallbackPolicy | keyof typeof _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetMetadataFallbackPolicy);
}

/**
 * Optionally divide the endpoints in this cluster into subsets defined by
 * endpoint metadata and selected by route and weighted cluster metadata.
 * [#next-free-field: 9]
 */
export interface _envoy_config_cluster_v3_Cluster_LbSubsetConfig__Output {
  /**
   * The behavior used when no endpoint subset matches the selected route's
   * metadata. The value defaults to
   * :ref:`NO_FALLBACK<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetFallbackPolicy.NO_FALLBACK>`.
   */
  'fallback_policy': (keyof typeof _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy);
  /**
   * Specifies the default subset of endpoints used during fallback if
   * fallback_policy is
   * :ref:`DEFAULT_SUBSET<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetFallbackPolicy.DEFAULT_SUBSET>`.
   * Each field in default_subset is
   * compared to the matching LbEndpoint.Metadata under the ``envoy.lb``
   * namespace. It is valid for no hosts to match, in which case the behavior
   * is the same as a fallback_policy of
   * :ref:`NO_FALLBACK<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetFallbackPolicy.NO_FALLBACK>`.
   */
  'default_subset': (_google_protobuf_Struct__Output | null);
  /**
   * For each entry, LbEndpoint.Metadata's
   * ``envoy.lb`` namespace is traversed and a subset is created for each unique
   * combination of key and value. For example:
   * 
   * .. code-block:: json
   * 
   * { "subset_selectors": [
   * { "keys": [ "version" ] },
   * { "keys": [ "stage", "hardware_type" ] }
   * ]}
   * 
   * A subset is matched when the metadata from the selected route and
   * weighted cluster contains the same keys and values as the subset's
   * metadata. The same host may appear in multiple subsets.
   */
  'subset_selectors': (_envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector__Output)[];
  /**
   * If true, routing to subsets will take into account the localities and locality weights of the
   * endpoints when making the routing decision.
   * 
   * There are some potential pitfalls associated with enabling this feature, as the resulting
   * traffic split after applying both a subset match and locality weights might be undesirable.
   * 
   * Consider for example a situation in which you have 50/50 split across two localities X/Y
   * which have 100 hosts each without subsetting. If the subset LB results in X having only 1
   * host selected but Y having 100, then a lot more load is being dumped on the single host in X
   * than originally anticipated in the load balancing assignment delivered via EDS.
   */
  'locality_weight_aware': (boolean);
  /**
   * When used with locality_weight_aware, scales the weight of each locality by the ratio
   * of hosts in the subset vs hosts in the original subset. This aims to even out the load
   * going to an individual locality if said locality is disproportionately affected by the
   * subset predicate.
   */
  'scale_locality_weight': (boolean);
  /**
   * If true, when a fallback policy is configured and its corresponding subset fails to find
   * a host this will cause any host to be selected instead.
   * 
   * This is useful when using the default subset as the fallback policy, given the default
   * subset might become empty. With this option enabled, if that happens the LB will attempt
   * to select a host from the entire cluster.
   */
  'panic_mode_any': (boolean);
  /**
   * If true, metadata specified for a metadata key will be matched against the corresponding
   * endpoint metadata if the endpoint metadata matches the value exactly OR it is a list value
   * and any of the elements in the list matches the criteria.
   */
  'list_as_any': (boolean);
  /**
   * Fallback mechanism that allows to try different route metadata until a host is found.
   * If load balancing process, including all its mechanisms (like
   * :ref:`fallback_policy<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.fallback_policy>`)
   * fails to select a host, this policy decides if and how the process is repeated using another metadata.
   * 
   * The value defaults to
   * :ref:`METADATA_NO_FALLBACK<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetMetadataFallbackPolicy.METADATA_NO_FALLBACK>`.
   */
  'metadata_fallback_policy': (keyof typeof _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetMetadataFallbackPolicy);
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

/**
 * If NO_FALLBACK is selected, a result
 * equivalent to no healthy hosts is reported. If ANY_ENDPOINT is selected,
 * any cluster endpoint may be returned (subject to policy, health checks,
 * etc). If DEFAULT_SUBSET is selected, load balancing is performed over the
 * endpoints matching the values from the default_subset field.
 */
export enum _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetFallbackPolicy {
  NO_FALLBACK = 0,
  ANY_ENDPOINT = 1,
  DEFAULT_SUBSET = 2,
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

export enum _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetMetadataFallbackPolicy {
  /**
   * No fallback. Route metadata will be used as-is.
   */
  METADATA_NO_FALLBACK = 0,
  /**
   * A special metadata key ``fallback_list`` will be used to provide variants of metadata to try.
   * Value of ``fallback_list`` key has to be a list. Every list element has to be a struct - it will
   * be merged with route metadata, overriding keys that appear in both places.
   * ``fallback_list`` entries will be used in order until a host is found.
   * 
   * ``fallback_list`` key itself is removed from metadata before subset load balancing is performed.
   * 
   * Example:
   * 
   * for metadata:
   * 
   * .. code-block:: yaml
   * 
   * version: 1.0
   * fallback_list:
   * - version: 2.0
   * hardware: c64
   * - hardware: c32
   * - version: 3.0
   * 
   * at first, metadata:
   * 
   * .. code-block:: json
   * 
   * {"version": "2.0", "hardware": "c64"}
   * 
   * will be used for load balancing. If no host is found, metadata:
   * 
   * .. code-block:: json
   * 
   * {"version": "1.0", "hardware": "c32"}
   * 
   * is next to try. If it still results in no host, finally metadata:
   * 
   * .. code-block:: json
   * 
   * {"version": "3.0"}
   * 
   * is used.
   */
  FALLBACK_LIST = 1,
}

/**
 * Specifications for subsets.
 */
export interface _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector {
  /**
   * List of keys to match with the weighted cluster metadata.
   */
  'keys'?: (string)[];
  /**
   * Selects a mode of operation in which each subset has only one host. This mode uses the same rules for
   * choosing a host, but updating hosts is faster, especially for large numbers of hosts.
   * 
   * If a match is found to a host, that host will be used regardless of priority levels.
   * 
   * When this mode is enabled, configurations that contain more than one host with the same metadata value for the single key in ``keys``
   * will use only one of the hosts with the given key; no requests will be routed to the others. The cluster gauge
   * :ref:`lb_subsets_single_host_per_subset_duplicate<config_cluster_manager_cluster_stats_subset_lb>` indicates how many duplicates are
   * present in the current configuration.
   */
  'single_host_per_subset'?: (boolean);
  /**
   * The behavior used when no endpoint subset matches the selected route's
   * metadata.
   */
  'fallback_policy'?: (_envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy | keyof typeof _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy);
  /**
   * Subset of
   * :ref:`keys<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.keys>` used by
   * :ref:`KEYS_SUBSET<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.LbSubsetSelectorFallbackPolicy.KEYS_SUBSET>`
   * fallback policy.
   * It has to be a non empty list if KEYS_SUBSET fallback policy is selected.
   * For any other fallback policy the parameter is not used and should not be set.
   * Only values also present in
   * :ref:`keys<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.keys>` are allowed, but
   * ``fallback_keys_subset`` cannot be equal to ``keys``.
   */
  'fallback_keys_subset'?: (string)[];
}

/**
 * Specifications for subsets.
 */
export interface _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector__Output {
  /**
   * List of keys to match with the weighted cluster metadata.
   */
  'keys': (string)[];
  /**
   * Selects a mode of operation in which each subset has only one host. This mode uses the same rules for
   * choosing a host, but updating hosts is faster, especially for large numbers of hosts.
   * 
   * If a match is found to a host, that host will be used regardless of priority levels.
   * 
   * When this mode is enabled, configurations that contain more than one host with the same metadata value for the single key in ``keys``
   * will use only one of the hosts with the given key; no requests will be routed to the others. The cluster gauge
   * :ref:`lb_subsets_single_host_per_subset_duplicate<config_cluster_manager_cluster_stats_subset_lb>` indicates how many duplicates are
   * present in the current configuration.
   */
  'single_host_per_subset': (boolean);
  /**
   * The behavior used when no endpoint subset matches the selected route's
   * metadata.
   */
  'fallback_policy': (keyof typeof _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy);
  /**
   * Subset of
   * :ref:`keys<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.keys>` used by
   * :ref:`KEYS_SUBSET<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.LbSubsetSelectorFallbackPolicy.KEYS_SUBSET>`
   * fallback policy.
   * It has to be a non empty list if KEYS_SUBSET fallback policy is selected.
   * For any other fallback policy the parameter is not used and should not be set.
   * Only values also present in
   * :ref:`keys<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.keys>` are allowed, but
   * ``fallback_keys_subset`` cannot be equal to ``keys``.
   */
  'fallback_keys_subset': (string)[];
}

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

/**
 * Allows to override top level fallback policy per selector.
 */
export enum _envoy_config_cluster_v3_Cluster_LbSubsetConfig_LbSubsetSelector_LbSubsetSelectorFallbackPolicy {
  /**
   * If NOT_DEFINED top level config fallback policy is used instead.
   */
  NOT_DEFINED = 0,
  /**
   * If NO_FALLBACK is selected, a result equivalent to no healthy hosts is reported.
   */
  NO_FALLBACK = 1,
  /**
   * If ANY_ENDPOINT is selected, any cluster endpoint may be returned
   * (subject to policy, health checks, etc).
   */
  ANY_ENDPOINT = 2,
  /**
   * If DEFAULT_SUBSET is selected, load balancing is performed over the
   * endpoints matching the values from the default_subset field.
   */
  DEFAULT_SUBSET = 3,
  /**
   * If KEYS_SUBSET is selected, subset selector matching is performed again with metadata
   * keys reduced to
   * :ref:`fallback_keys_subset<envoy_v3_api_field_config.cluster.v3.Cluster.LbSubsetConfig.LbSubsetSelector.fallback_keys_subset>`.
   * It allows for a fallback to a different, less specific selector if some of the keys of
   * the selector are considered optional.
   */
  KEYS_SUBSET = 4,
}

/**
 * Specific configuration for the LeastRequest load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_LeastRequestLbConfig {
  /**
   * The number of random healthy hosts from which the host with the fewest active requests will
   * be chosen. Defaults to 2 so that we perform two-choice selection if the field is not set.
   */
  'choice_count'?: (_google_protobuf_UInt32Value | null);
  /**
   * The following formula is used to calculate the dynamic weights when hosts have different load
   * balancing weights:
   * 
   * ``weight = load_balancing_weight / (active_requests + 1)^active_request_bias``
   * 
   * The larger the active request bias is, the more aggressively active requests will lower the
   * effective weight when all host weights are not equal.
   * 
   * ``active_request_bias`` must be greater than or equal to 0.0.
   * 
   * When ``active_request_bias == 0.0`` the Least Request Load Balancer doesn't consider the number
   * of active requests at the time it picks a host and behaves like the Round Robin Load
   * Balancer.
   * 
   * When ``active_request_bias > 0.0`` the Least Request Load Balancer scales the load balancing
   * weight by the number of active requests at the time it does a pick.
   * 
   * The value is cached for performance reasons and refreshed whenever one of the Load Balancer's
   * host sets changes, e.g., whenever there is a host membership update or a host load balancing
   * weight change.
   * 
   * .. note::
   * This setting only takes effect if all host weights are not equal.
   */
  'active_request_bias'?: (_envoy_config_core_v3_RuntimeDouble | null);
  /**
   * Configuration for slow start mode.
   * If this configuration is not set, slow start will not be not enabled.
   */
  'slow_start_config'?: (_envoy_config_cluster_v3_Cluster_SlowStartConfig | null);
}

/**
 * Specific configuration for the LeastRequest load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_LeastRequestLbConfig__Output {
  /**
   * The number of random healthy hosts from which the host with the fewest active requests will
   * be chosen. Defaults to 2 so that we perform two-choice selection if the field is not set.
   */
  'choice_count': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The following formula is used to calculate the dynamic weights when hosts have different load
   * balancing weights:
   * 
   * ``weight = load_balancing_weight / (active_requests + 1)^active_request_bias``
   * 
   * The larger the active request bias is, the more aggressively active requests will lower the
   * effective weight when all host weights are not equal.
   * 
   * ``active_request_bias`` must be greater than or equal to 0.0.
   * 
   * When ``active_request_bias == 0.0`` the Least Request Load Balancer doesn't consider the number
   * of active requests at the time it picks a host and behaves like the Round Robin Load
   * Balancer.
   * 
   * When ``active_request_bias > 0.0`` the Least Request Load Balancer scales the load balancing
   * weight by the number of active requests at the time it does a pick.
   * 
   * The value is cached for performance reasons and refreshed whenever one of the Load Balancer's
   * host sets changes, e.g., whenever there is a host membership update or a host load balancing
   * weight change.
   * 
   * .. note::
   * This setting only takes effect if all host weights are not equal.
   */
  'active_request_bias': (_envoy_config_core_v3_RuntimeDouble__Output | null);
  /**
   * Configuration for slow start mode.
   * If this configuration is not set, slow start will not be not enabled.
   */
  'slow_start_config': (_envoy_config_cluster_v3_Cluster_SlowStartConfig__Output | null);
}

/**
 * Configuration for :ref:`locality weighted load balancing
 * <arch_overview_load_balancing_locality_weighted_lb>`
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig_LocalityWeightedLbConfig {
}

/**
 * Configuration for :ref:`locality weighted load balancing
 * <arch_overview_load_balancing_locality_weighted_lb>`
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig_LocalityWeightedLbConfig__Output {
}

/**
 * Specific configuration for the :ref:`Maglev<arch_overview_load_balancing_types_maglev>`
 * load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_MaglevLbConfig {
  /**
   * The table size for Maglev hashing. Maglev aims for "minimal disruption" rather than an absolute guarantee.
   * Minimal disruption means that when the set of upstream hosts change, a connection will likely be sent to the same
   * upstream as it was before. Increasing the table size reduces the amount of disruption.
   * The table size must be prime number limited to 5000011. If it is not specified, the default is 65537.
   */
  'table_size'?: (_google_protobuf_UInt64Value | null);
}

/**
 * Specific configuration for the :ref:`Maglev<arch_overview_load_balancing_types_maglev>`
 * load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_MaglevLbConfig__Output {
  /**
   * The table size for Maglev hashing. Maglev aims for "minimal disruption" rather than an absolute guarantee.
   * Minimal disruption means that when the set of upstream hosts change, a connection will likely be sent to the same
   * upstream as it was before. Increasing the table size reduces the amount of disruption.
   * The table size must be prime number limited to 5000011. If it is not specified, the default is 65537.
   */
  'table_size': (_google_protobuf_UInt64Value__Output | null);
}

/**
 * Specific configuration for the
 * :ref:`Original Destination <arch_overview_load_balancing_types_original_destination>`
 * load balancing policy.
 * [#extension: envoy.clusters.original_dst]
 */
export interface _envoy_config_cluster_v3_Cluster_OriginalDstLbConfig {
  /**
   * When true, a HTTP header can be used to override the original dst address. The default header is
   * :ref:`x-envoy-original-dst-host <config_http_conn_man_headers_x-envoy-original-dst-host>`.
   * 
   * .. attention::
   * 
   * This header isn't sanitized by default, so enabling this feature allows HTTP clients to
   * route traffic to arbitrary hosts and/or ports, which may have serious security
   * consequences.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'use_http_header'?: (boolean);
  /**
   * The http header to override destination address if :ref:`use_http_header <envoy_v3_api_field_config.cluster.v3.Cluster.OriginalDstLbConfig.use_http_header>`.
   * is set to true. If the value is empty, :ref:`x-envoy-original-dst-host <config_http_conn_man_headers_x-envoy-original-dst-host>` will be used.
   */
  'http_header_name'?: (string);
  /**
   * The port to override for the original dst address. This port
   * will take precedence over filter state and header override ports
   */
  'upstream_port_override'?: (_google_protobuf_UInt32Value | null);
}

/**
 * Specific configuration for the
 * :ref:`Original Destination <arch_overview_load_balancing_types_original_destination>`
 * load balancing policy.
 * [#extension: envoy.clusters.original_dst]
 */
export interface _envoy_config_cluster_v3_Cluster_OriginalDstLbConfig__Output {
  /**
   * When true, a HTTP header can be used to override the original dst address. The default header is
   * :ref:`x-envoy-original-dst-host <config_http_conn_man_headers_x-envoy-original-dst-host>`.
   * 
   * .. attention::
   * 
   * This header isn't sanitized by default, so enabling this feature allows HTTP clients to
   * route traffic to arbitrary hosts and/or ports, which may have serious security
   * consequences.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'use_http_header': (boolean);
  /**
   * The http header to override destination address if :ref:`use_http_header <envoy_v3_api_field_config.cluster.v3.Cluster.OriginalDstLbConfig.use_http_header>`.
   * is set to true. If the value is empty, :ref:`x-envoy-original-dst-host <config_http_conn_man_headers_x-envoy-original-dst-host>` will be used.
   */
  'http_header_name': (string);
  /**
   * The port to override for the original dst address. This port
   * will take precedence over filter state and header override ports
   */
  'upstream_port_override': (_google_protobuf_UInt32Value__Output | null);
}

export interface _envoy_config_cluster_v3_Cluster_PreconnectPolicy {
  /**
   * Indicates how many streams (rounded up) can be anticipated per-upstream for each
   * incoming stream. This is useful for high-QPS or latency-sensitive services. Preconnecting
   * will only be done if the upstream is healthy and the cluster has traffic.
   * 
   * For example if this is 2, for an incoming HTTP/1.1 stream, 2 connections will be
   * established, one for the new incoming stream, and one for a presumed follow-up stream. For
   * HTTP/2, only one connection would be established by default as one connection can
   * serve both the original and presumed follow-up stream.
   * 
   * In steady state for non-multiplexed connections a value of 1.5 would mean if there were 100
   * active streams, there would be 100 connections in use, and 50 connections preconnected.
   * This might be a useful value for something like short lived single-use connections,
   * for example proxying HTTP/1.1 if keep-alive were false and each stream resulted in connection
   * termination. It would likely be overkill for long lived connections, such as TCP proxying SMTP
   * or regular HTTP/1.1 with keep-alive. For long lived traffic, a value of 1.05 would be more
   * reasonable, where for every 100 connections, 5 preconnected connections would be in the queue
   * in case of unexpected disconnects where the connection could not be reused.
   * 
   * If this value is not set, or set explicitly to one, Envoy will fetch as many connections
   * as needed to serve streams in flight. This means in steady state if a connection is torn down,
   * a subsequent streams will pay an upstream-rtt latency penalty waiting for a new connection.
   * 
   * This is limited somewhat arbitrarily to 3 because preconnecting too aggressively can
   * harm latency more than the preconnecting helps.
   */
  'per_upstream_preconnect_ratio'?: (_google_protobuf_DoubleValue | null);
  /**
   * Indicates how many streams (rounded up) can be anticipated across a cluster for each
   * stream, useful for low QPS services. This is currently supported for a subset of
   * deterministic non-hash-based load-balancing algorithms (weighted round robin, random).
   * Unlike ``per_upstream_preconnect_ratio`` this preconnects across the upstream instances in a
   * cluster, doing best effort predictions of what upstream would be picked next and
   * pre-establishing a connection.
   * 
   * Preconnecting will be limited to one preconnect per configured upstream in the cluster and will
   * only be done if there are healthy upstreams and the cluster has traffic.
   * 
   * For example if preconnecting is set to 2 for a round robin HTTP/2 cluster, on the first
   * incoming stream, 2 connections will be preconnected - one to the first upstream for this
   * cluster, one to the second on the assumption there will be a follow-up stream.
   * 
   * If this value is not set, or set explicitly to one, Envoy will fetch as many connections
   * as needed to serve streams in flight, so during warm up and in steady state if a connection
   * is closed (and per_upstream_preconnect_ratio is not set), there will be a latency hit for
   * connection establishment.
   * 
   * If both this and preconnect_ratio are set, Envoy will make sure both predicted needs are met,
   * basically preconnecting max(predictive-preconnect, per-upstream-preconnect), for each
   * upstream.
   */
  'predictive_preconnect_ratio'?: (_google_protobuf_DoubleValue | null);
}

export interface _envoy_config_cluster_v3_Cluster_PreconnectPolicy__Output {
  /**
   * Indicates how many streams (rounded up) can be anticipated per-upstream for each
   * incoming stream. This is useful for high-QPS or latency-sensitive services. Preconnecting
   * will only be done if the upstream is healthy and the cluster has traffic.
   * 
   * For example if this is 2, for an incoming HTTP/1.1 stream, 2 connections will be
   * established, one for the new incoming stream, and one for a presumed follow-up stream. For
   * HTTP/2, only one connection would be established by default as one connection can
   * serve both the original and presumed follow-up stream.
   * 
   * In steady state for non-multiplexed connections a value of 1.5 would mean if there were 100
   * active streams, there would be 100 connections in use, and 50 connections preconnected.
   * This might be a useful value for something like short lived single-use connections,
   * for example proxying HTTP/1.1 if keep-alive were false and each stream resulted in connection
   * termination. It would likely be overkill for long lived connections, such as TCP proxying SMTP
   * or regular HTTP/1.1 with keep-alive. For long lived traffic, a value of 1.05 would be more
   * reasonable, where for every 100 connections, 5 preconnected connections would be in the queue
   * in case of unexpected disconnects where the connection could not be reused.
   * 
   * If this value is not set, or set explicitly to one, Envoy will fetch as many connections
   * as needed to serve streams in flight. This means in steady state if a connection is torn down,
   * a subsequent streams will pay an upstream-rtt latency penalty waiting for a new connection.
   * 
   * This is limited somewhat arbitrarily to 3 because preconnecting too aggressively can
   * harm latency more than the preconnecting helps.
   */
  'per_upstream_preconnect_ratio': (_google_protobuf_DoubleValue__Output | null);
  /**
   * Indicates how many streams (rounded up) can be anticipated across a cluster for each
   * stream, useful for low QPS services. This is currently supported for a subset of
   * deterministic non-hash-based load-balancing algorithms (weighted round robin, random).
   * Unlike ``per_upstream_preconnect_ratio`` this preconnects across the upstream instances in a
   * cluster, doing best effort predictions of what upstream would be picked next and
   * pre-establishing a connection.
   * 
   * Preconnecting will be limited to one preconnect per configured upstream in the cluster and will
   * only be done if there are healthy upstreams and the cluster has traffic.
   * 
   * For example if preconnecting is set to 2 for a round robin HTTP/2 cluster, on the first
   * incoming stream, 2 connections will be preconnected - one to the first upstream for this
   * cluster, one to the second on the assumption there will be a follow-up stream.
   * 
   * If this value is not set, or set explicitly to one, Envoy will fetch as many connections
   * as needed to serve streams in flight, so during warm up and in steady state if a connection
   * is closed (and per_upstream_preconnect_ratio is not set), there will be a latency hit for
   * connection establishment.
   * 
   * If both this and preconnect_ratio are set, Envoy will make sure both predicted needs are met,
   * basically preconnecting max(predictive-preconnect, per-upstream-preconnect), for each
   * upstream.
   */
  'predictive_preconnect_ratio': (_google_protobuf_DoubleValue__Output | null);
}

export interface _envoy_config_cluster_v3_Cluster_RefreshRate {
  /**
   * Specifies the base interval between refreshes. This parameter is required and must be greater
   * than zero and less than
   * :ref:`max_interval <envoy_v3_api_field_config.cluster.v3.Cluster.RefreshRate.max_interval>`.
   */
  'base_interval'?: (_google_protobuf_Duration | null);
  /**
   * Specifies the maximum interval between refreshes. This parameter is optional, but must be
   * greater than or equal to the
   * :ref:`base_interval <envoy_v3_api_field_config.cluster.v3.Cluster.RefreshRate.base_interval>`  if set. The default
   * is 10 times the :ref:`base_interval <envoy_v3_api_field_config.cluster.v3.Cluster.RefreshRate.base_interval>`.
   */
  'max_interval'?: (_google_protobuf_Duration | null);
}

export interface _envoy_config_cluster_v3_Cluster_RefreshRate__Output {
  /**
   * Specifies the base interval between refreshes. This parameter is required and must be greater
   * than zero and less than
   * :ref:`max_interval <envoy_v3_api_field_config.cluster.v3.Cluster.RefreshRate.max_interval>`.
   */
  'base_interval': (_google_protobuf_Duration__Output | null);
  /**
   * Specifies the maximum interval between refreshes. This parameter is optional, but must be
   * greater than or equal to the
   * :ref:`base_interval <envoy_v3_api_field_config.cluster.v3.Cluster.RefreshRate.base_interval>`  if set. The default
   * is 10 times the :ref:`base_interval <envoy_v3_api_field_config.cluster.v3.Cluster.RefreshRate.base_interval>`.
   */
  'max_interval': (_google_protobuf_Duration__Output | null);
}

/**
 * Specific configuration for the :ref:`RingHash<arch_overview_load_balancing_types_ring_hash>`
 * load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_RingHashLbConfig {
  /**
   * Minimum hash ring size. The larger the ring is (that is, the more hashes there are for each
   * provided host) the better the request distribution will reflect the desired weights. Defaults
   * to 1024 entries, and limited to 8M entries. See also
   * :ref:`maximum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.maximum_ring_size>`.
   */
  'minimum_ring_size'?: (_google_protobuf_UInt64Value | null);
  /**
   * The hash function used to hash hosts onto the ketama ring. The value defaults to
   * :ref:`XX_HASH<envoy_v3_api_enum_value_config.cluster.v3.Cluster.RingHashLbConfig.HashFunction.XX_HASH>`.
   */
  'hash_function'?: (_envoy_config_cluster_v3_Cluster_RingHashLbConfig_HashFunction | keyof typeof _envoy_config_cluster_v3_Cluster_RingHashLbConfig_HashFunction);
  /**
   * Maximum hash ring size. Defaults to 8M entries, and limited to 8M entries, but can be lowered
   * to further constrain resource use. See also
   * :ref:`minimum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.minimum_ring_size>`.
   */
  'maximum_ring_size'?: (_google_protobuf_UInt64Value | null);
}

/**
 * Specific configuration for the :ref:`RingHash<arch_overview_load_balancing_types_ring_hash>`
 * load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_RingHashLbConfig__Output {
  /**
   * Minimum hash ring size. The larger the ring is (that is, the more hashes there are for each
   * provided host) the better the request distribution will reflect the desired weights. Defaults
   * to 1024 entries, and limited to 8M entries. See also
   * :ref:`maximum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.maximum_ring_size>`.
   */
  'minimum_ring_size': (_google_protobuf_UInt64Value__Output | null);
  /**
   * The hash function used to hash hosts onto the ketama ring. The value defaults to
   * :ref:`XX_HASH<envoy_v3_api_enum_value_config.cluster.v3.Cluster.RingHashLbConfig.HashFunction.XX_HASH>`.
   */
  'hash_function': (keyof typeof _envoy_config_cluster_v3_Cluster_RingHashLbConfig_HashFunction);
  /**
   * Maximum hash ring size. Defaults to 8M entries, and limited to 8M entries, but can be lowered
   * to further constrain resource use. See also
   * :ref:`minimum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.minimum_ring_size>`.
   */
  'maximum_ring_size': (_google_protobuf_UInt64Value__Output | null);
}

/**
 * Specific configuration for the RoundRobin load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_RoundRobinLbConfig {
  /**
   * Configuration for slow start mode.
   * If this configuration is not set, slow start will not be not enabled.
   */
  'slow_start_config'?: (_envoy_config_cluster_v3_Cluster_SlowStartConfig | null);
}

/**
 * Specific configuration for the RoundRobin load balancing policy.
 */
export interface _envoy_config_cluster_v3_Cluster_RoundRobinLbConfig__Output {
  /**
   * Configuration for slow start mode.
   * If this configuration is not set, slow start will not be not enabled.
   */
  'slow_start_config': (_envoy_config_cluster_v3_Cluster_SlowStartConfig__Output | null);
}

/**
 * Configuration for :ref:`slow start mode <arch_overview_load_balancing_slow_start>`.
 */
export interface _envoy_config_cluster_v3_Cluster_SlowStartConfig {
  /**
   * Represents the size of slow start window.
   * If set, the newly created host remains in slow start mode starting from its creation time
   * for the duration of slow start window.
   */
  'slow_start_window'?: (_google_protobuf_Duration | null);
  /**
   * This parameter controls the speed of traffic increase over the slow start window. Defaults to 1.0,
   * so that endpoint would get linearly increasing amount of traffic.
   * When increasing the value for this parameter, the speed of traffic ramp-up increases non-linearly.
   * The value of aggression parameter should be greater than 0.0.
   * By tuning the parameter, is possible to achieve polynomial or exponential shape of ramp-up curve.
   * 
   * During slow start window, effective weight of an endpoint would be scaled with time factor and aggression:
   * ``new_weight = weight * max(min_weight_percent, time_factor ^ (1 / aggression))``,
   * where ``time_factor=(time_since_start_seconds / slow_start_time_seconds)``.
   * 
   * As time progresses, more and more traffic would be sent to endpoint, which is in slow start window.
   * Once host exits slow start, time_factor and aggression no longer affect its weight.
   */
  'aggression'?: (_envoy_config_core_v3_RuntimeDouble | null);
  /**
   * Configures the minimum percentage of origin weight that avoids too small new weight,
   * which may cause endpoints in slow start mode receive no traffic in slow start window.
   * If not specified, the default is 10%.
   */
  'min_weight_percent'?: (_envoy_type_v3_Percent | null);
}

/**
 * Configuration for :ref:`slow start mode <arch_overview_load_balancing_slow_start>`.
 */
export interface _envoy_config_cluster_v3_Cluster_SlowStartConfig__Output {
  /**
   * Represents the size of slow start window.
   * If set, the newly created host remains in slow start mode starting from its creation time
   * for the duration of slow start window.
   */
  'slow_start_window': (_google_protobuf_Duration__Output | null);
  /**
   * This parameter controls the speed of traffic increase over the slow start window. Defaults to 1.0,
   * so that endpoint would get linearly increasing amount of traffic.
   * When increasing the value for this parameter, the speed of traffic ramp-up increases non-linearly.
   * The value of aggression parameter should be greater than 0.0.
   * By tuning the parameter, is possible to achieve polynomial or exponential shape of ramp-up curve.
   * 
   * During slow start window, effective weight of an endpoint would be scaled with time factor and aggression:
   * ``new_weight = weight * max(min_weight_percent, time_factor ^ (1 / aggression))``,
   * where ``time_factor=(time_since_start_seconds / slow_start_time_seconds)``.
   * 
   * As time progresses, more and more traffic would be sent to endpoint, which is in slow start window.
   * Once host exits slow start, time_factor and aggression no longer affect its weight.
   */
  'aggression': (_envoy_config_core_v3_RuntimeDouble__Output | null);
  /**
   * Configures the minimum percentage of origin weight that avoids too small new weight,
   * which may cause endpoints in slow start mode receive no traffic in slow start window.
   * If not specified, the default is 10%.
   */
  'min_weight_percent': (_envoy_type_v3_Percent__Output | null);
}

/**
 * TransportSocketMatch specifies what transport socket config will be used
 * when the match conditions are satisfied.
 */
export interface _envoy_config_cluster_v3_Cluster_TransportSocketMatch {
  /**
   * The name of the match, used in stats generation.
   */
  'name'?: (string);
  /**
   * Optional endpoint metadata match criteria.
   * The connection to the endpoint with metadata matching what is set in this field
   * will use the transport socket configuration specified here.
   * The endpoint's metadata entry in ``envoy.transport_socket_match`` is used to match
   * against the values specified in this field.
   */
  'match'?: (_google_protobuf_Struct | null);
  /**
   * The configuration of the transport socket.
   * [#extension-category: envoy.transport_sockets.upstream]
   */
  'transport_socket'?: (_envoy_config_core_v3_TransportSocket | null);
}

/**
 * TransportSocketMatch specifies what transport socket config will be used
 * when the match conditions are satisfied.
 */
export interface _envoy_config_cluster_v3_Cluster_TransportSocketMatch__Output {
  /**
   * The name of the match, used in stats generation.
   */
  'name': (string);
  /**
   * Optional endpoint metadata match criteria.
   * The connection to the endpoint with metadata matching what is set in this field
   * will use the transport socket configuration specified here.
   * The endpoint's metadata entry in ``envoy.transport_socket_match`` is used to match
   * against the values specified in this field.
   */
  'match': (_google_protobuf_Struct__Output | null);
  /**
   * The configuration of the transport socket.
   * [#extension-category: envoy.transport_sockets.upstream]
   */
  'transport_socket': (_envoy_config_core_v3_TransportSocket__Output | null);
}

/**
 * Configuration for :ref:`zone aware routing
 * <arch_overview_load_balancing_zone_aware_routing>`.
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig_ZoneAwareLbConfig {
  /**
   * Configures percentage of requests that will be considered for zone aware routing
   * if zone aware routing is configured. If not specified, the default is 100%.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'routing_enabled'?: (_envoy_type_v3_Percent | null);
  /**
   * Configures minimum upstream cluster size required for zone aware routing
   * If upstream cluster size is less than specified, zone aware routing is not performed
   * even if zone aware routing is configured. If not specified, the default is 6.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'min_cluster_size'?: (_google_protobuf_UInt64Value | null);
  /**
   * If set to true, Envoy will not consider any hosts when the cluster is in :ref:`panic
   * mode<arch_overview_load_balancing_panic_threshold>`. Instead, the cluster will fail all
   * requests as if all hosts are unhealthy. This can help avoid potentially overwhelming a
   * failing service.
   */
  'fail_traffic_on_panic'?: (boolean);
}

/**
 * Configuration for :ref:`zone aware routing
 * <arch_overview_load_balancing_zone_aware_routing>`.
 */
export interface _envoy_config_cluster_v3_Cluster_CommonLbConfig_ZoneAwareLbConfig__Output {
  /**
   * Configures percentage of requests that will be considered for zone aware routing
   * if zone aware routing is configured. If not specified, the default is 100%.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'routing_enabled': (_envoy_type_v3_Percent__Output | null);
  /**
   * Configures minimum upstream cluster size required for zone aware routing
   * If upstream cluster size is less than specified, zone aware routing is not performed
   * even if zone aware routing is configured. If not specified, the default is 6.
   * * :ref:`runtime values <config_cluster_manager_cluster_runtime_zone_routing>`.
   * * :ref:`Zone aware routing support <arch_overview_load_balancing_zone_aware_routing>`.
   */
  'min_cluster_size': (_google_protobuf_UInt64Value__Output | null);
  /**
   * If set to true, Envoy will not consider any hosts when the cluster is in :ref:`panic
   * mode<arch_overview_load_balancing_panic_threshold>`. Instead, the cluster will fail all
   * requests as if all hosts are unhealthy. This can help avoid potentially overwhelming a
   * failing service.
   */
  'fail_traffic_on_panic': (boolean);
}

/**
 * Configuration for a single upstream cluster.
 * [#next-free-field: 57]
 */
export interface Cluster {
  /**
   * Supplies the name of the cluster which must be unique across all clusters.
   * The cluster name is used when emitting
   * :ref:`statistics <config_cluster_manager_cluster_stats>` if :ref:`alt_stat_name
   * <envoy_v3_api_field_config.cluster.v3.Cluster.alt_stat_name>` is not provided.
   * Any ``:`` in the cluster name will be converted to ``_`` when emitting statistics.
   */
  'name'?: (string);
  /**
   * The :ref:`service discovery type <arch_overview_service_discovery_types>`
   * to use for resolving the cluster.
   */
  'type'?: (_envoy_config_cluster_v3_Cluster_DiscoveryType | keyof typeof _envoy_config_cluster_v3_Cluster_DiscoveryType);
  /**
   * Configuration to use for EDS updates for the Cluster.
   */
  'eds_cluster_config'?: (_envoy_config_cluster_v3_Cluster_EdsClusterConfig | null);
  /**
   * The timeout for new network connections to hosts in the cluster.
   * If not set, a default value of 5s will be used.
   */
  'connect_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Soft limit on size of the cluster’s connections read and write buffers. If
   * unspecified, an implementation defined default is applied (1MiB).
   */
  'per_connection_buffer_limit_bytes'?: (_google_protobuf_UInt32Value | null);
  /**
   * The :ref:`load balancer type <arch_overview_load_balancing_types>` to use
   * when picking a host in the cluster.
   */
  'lb_policy'?: (_envoy_config_cluster_v3_Cluster_LbPolicy | keyof typeof _envoy_config_cluster_v3_Cluster_LbPolicy);
  /**
   * Optional :ref:`active health checking <arch_overview_health_checking>`
   * configuration for the cluster. If no
   * configuration is specified no health checking will be done and all cluster
   * members will be considered healthy at all times.
   */
  'health_checks'?: (_envoy_config_core_v3_HealthCheck)[];
  /**
   * Optional maximum requests for a single upstream connection. This parameter
   * is respected by both the HTTP/1.1 and HTTP/2 connection pool
   * implementations. If not specified, there is no limit. Setting this
   * parameter to 1 will effectively disable keep alive.
   * 
   * .. attention::
   * This field has been deprecated in favor of the :ref:`max_requests_per_connection <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.max_requests_per_connection>` field.
   */
  'max_requests_per_connection'?: (_google_protobuf_UInt32Value | null);
  /**
   * Optional :ref:`circuit breaking <arch_overview_circuit_break>` for the cluster.
   */
  'circuit_breakers'?: (_envoy_config_cluster_v3_CircuitBreakers | null);
  /**
   * Additional options when handling HTTP1 requests.
   * This has been deprecated in favor of http_protocol_options fields in the
   * :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'http_protocol_options'?: (_envoy_config_core_v3_Http1ProtocolOptions | null);
  /**
   * Even if default HTTP2 protocol options are desired, this field must be
   * set so that Envoy will assume that the upstream supports HTTP/2 when
   * making new HTTP connection pool connections. Currently, Envoy only
   * supports prior knowledge for upstream connections. Even if TLS is used
   * with ALPN, ``http2_protocol_options`` must be specified. As an aside this allows HTTP/2
   * connections to happen over plain text.
   * This has been deprecated in favor of http2_protocol_options fields in the
   * :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>`
   * message. http2_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'http2_protocol_options'?: (_envoy_config_core_v3_Http2ProtocolOptions | null);
  /**
   * If the DNS refresh rate is specified and the cluster type is either
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * this value is used as the cluster’s DNS refresh
   * rate. The value configured must be at least 1ms. If this setting is not specified, the
   * value defaults to 5000ms. For cluster types other than
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`
   * and :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`
   * this setting is ignored.
   */
  'dns_refresh_rate'?: (_google_protobuf_Duration | null);
  /**
   * The DNS IP address resolution policy. If this setting is not specified, the
   * value defaults to
   * :ref:`AUTO<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DnsLookupFamily.AUTO>`.
   */
  'dns_lookup_family'?: (_envoy_config_cluster_v3_Cluster_DnsLookupFamily | keyof typeof _envoy_config_cluster_v3_Cluster_DnsLookupFamily);
  /**
   * If DNS resolvers are specified and the cluster type is either
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * this value is used to specify the cluster’s dns resolvers.
   * If this setting is not specified, the value defaults to the default
   * resolver, which uses /etc/resolv.conf for configuration. For cluster types
   * other than
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`
   * and :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`
   * this setting is ignored.
   * This field is deprecated in favor of ``dns_resolution_config``
   * which aggregates all of the DNS resolver configuration in a single message.
   */
  'dns_resolvers'?: (_envoy_config_core_v3_Address)[];
  /**
   * If specified, outlier detection will be enabled for this upstream cluster.
   * Each of the configuration values can be overridden via
   * :ref:`runtime values <config_cluster_manager_cluster_runtime_outlier_detection>`.
   */
  'outlier_detection'?: (_envoy_config_cluster_v3_OutlierDetection | null);
  /**
   * The interval for removing stale hosts from a cluster type
   * :ref:`ORIGINAL_DST<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.ORIGINAL_DST>`.
   * Hosts are considered stale if they have not been used
   * as upstream destinations during this interval. New hosts are added
   * to original destination clusters on demand as new connections are
   * redirected to Envoy, causing the number of hosts in the cluster to
   * grow over time. Hosts that are not stale (they are actively used as
   * destinations) are kept in the cluster, which allows connections to
   * them remain open, saving the latency that would otherwise be spent
   * on opening new connections. If this setting is not specified, the
   * value defaults to 5000ms. For cluster types other than
   * :ref:`ORIGINAL_DST<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.ORIGINAL_DST>`
   * this setting is ignored.
   */
  'cleanup_interval'?: (_google_protobuf_Duration | null);
  /**
   * Optional configuration used to bind newly established upstream connections.
   * This overrides any bind_config specified in the bootstrap proto.
   * If the address and port are empty, no bind will be performed.
   */
  'upstream_bind_config'?: (_envoy_config_core_v3_BindConfig | null);
  /**
   * Configuration for load balancing subsetting.
   */
  'lb_subset_config'?: (_envoy_config_cluster_v3_Cluster_LbSubsetConfig | null);
  /**
   * Optional configuration for the Ring Hash load balancing policy.
   */
  'ring_hash_lb_config'?: (_envoy_config_cluster_v3_Cluster_RingHashLbConfig | null);
  /**
   * Optional custom transport socket implementation to use for upstream connections.
   * To setup TLS, set a transport socket with name ``envoy.transport_sockets.tls`` and
   * :ref:`UpstreamTlsContexts <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.UpstreamTlsContext>` in the ``typed_config``.
   * If no transport socket configuration is specified, new connections
   * will be set up with plaintext.
   */
  'transport_socket'?: (_envoy_config_core_v3_TransportSocket | null);
  /**
   * The Metadata field can be used to provide additional information about the
   * cluster. It can be used for stats, logging, and varying filter behavior.
   * Fields should use reverse DNS notation to denote which entity within Envoy
   * will need the information. For instance, if the metadata is intended for
   * the Router filter, the filter name should be specified as ``envoy.filters.http.router``.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * Determines how Envoy selects the protocol used to speak to upstream hosts.
   * This has been deprecated in favor of setting explicit protocol selection
   * in the :ref:`http_protocol_options
   * <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   */
  'protocol_selection'?: (_envoy_config_cluster_v3_Cluster_ClusterProtocolSelection | keyof typeof _envoy_config_cluster_v3_Cluster_ClusterProtocolSelection);
  /**
   * Common configuration for all load balancer implementations.
   */
  'common_lb_config'?: (_envoy_config_cluster_v3_Cluster_CommonLbConfig | null);
  /**
   * An optional alternative to the cluster name to be used for observability. This name is used
   * emitting stats for the cluster and access logging the cluster name. This will appear as
   * additional information in configuration dumps of a cluster's current status as
   * :ref:`observability_name <envoy_v3_api_field_admin.v3.ClusterStatus.observability_name>`
   * and as an additional tag "upstream_cluster.name" while tracing. Note: Any ``:`` in the name
   * will be converted to ``_`` when emitting statistics. This should not be confused with
   * :ref:`Router Filter Header <config_http_filters_router_x-envoy-upstream-alt-stat-name>`.
   */
  'alt_stat_name'?: (string);
  /**
   * Additional options when handling HTTP requests upstream. These options will be applicable to
   * both HTTP1 and HTTP2 requests.
   * This has been deprecated in favor of
   * :ref:`common_http_protocol_options <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.common_http_protocol_options>`
   * in the :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * common_http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'common_http_protocol_options'?: (_envoy_config_core_v3_HttpProtocolOptions | null);
  /**
   * Optional options for upstream connections.
   */
  'upstream_connection_options'?: (_envoy_config_cluster_v3_UpstreamConnectionOptions | null);
  /**
   * If an upstream host becomes unhealthy (as determined by the configured health checks
   * or outlier detection), immediately close all connections to the failed host.
   * 
   * .. note::
   * 
   * This is currently only supported for connections created by tcp_proxy.
   * 
   * .. note::
   * 
   * The current implementation of this feature closes all connections immediately when
   * the unhealthy status is detected. If there are a large number of connections open
   * to an upstream host that becomes unhealthy, Envoy may spend a substantial amount of
   * time exclusively closing these connections, and not processing any other traffic.
   */
  'close_connections_on_host_health_failure'?: (boolean);
  /**
   * If set to true, Envoy will ignore the health value of a host when processing its removal
   * from service discovery. This means that if active health checking is used, Envoy will *not*
   * wait for the endpoint to go unhealthy before removing it.
   */
  'ignore_health_on_host_removal'?: (boolean);
  /**
   * Setting this is required for specifying members of
   * :ref:`STATIC<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STATIC>`,
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>` clusters.
   * This field supersedes the ``hosts`` field in the v2 API.
   * 
   * .. attention::
   * 
   * Setting this allows non-EDS cluster types to contain embedded EDS equivalent
   * :ref:`endpoint assignments<envoy_v3_api_msg_config.endpoint.v3.ClusterLoadAssignment>`.
   */
  'load_assignment'?: (_envoy_config_endpoint_v3_ClusterLoadAssignment | null);
  /**
   * Optional configuration for the Original Destination load balancing policy.
   */
  'original_dst_lb_config'?: (_envoy_config_cluster_v3_Cluster_OriginalDstLbConfig | null);
  /**
   * The extension_protocol_options field is used to provide extension-specific protocol options
   * for upstream connections. The key should match the extension filter name, such as
   * "envoy.filters.network.thrift_proxy". See the extension's documentation for details on
   * specific options.
   * [#next-major-version: make this a list of typed extensions.]
   */
  'typed_extension_protocol_options'?: ({[key: string]: _google_protobuf_Any});
  /**
   * Optional configuration for the LeastRequest load balancing policy.
   */
  'least_request_lb_config'?: (_envoy_config_cluster_v3_Cluster_LeastRequestLbConfig | null);
  /**
   * The custom cluster type.
   */
  'cluster_type'?: (_envoy_config_cluster_v3_Cluster_CustomClusterType | null);
  /**
   * Optional configuration for setting cluster's DNS refresh rate. If the value is set to true,
   * cluster's DNS refresh rate will be set to resource record's TTL which comes from DNS
   * resolution.
   */
  'respect_dns_ttl'?: (boolean);
  /**
   * An (optional) network filter chain, listed in the order the filters should be applied.
   * The chain will be applied to all outgoing connections that Envoy makes to the upstream
   * servers of this cluster.
   */
  'filters'?: (_envoy_config_cluster_v3_Filter)[];
  /**
   * If this field is set and is supported by the client, it will supersede the value of
   * :ref:`lb_policy<envoy_v3_api_field_config.cluster.v3.Cluster.lb_policy>`.
   */
  'load_balancing_policy'?: (_envoy_config_cluster_v3_LoadBalancingPolicy | null);
  /**
   * [#not-implemented-hide:]
   * If present, tells the client where to send load reports via LRS. If not present, the
   * client will fall back to a client-side default, which may be either (a) don't send any
   * load reports or (b) send load reports for all clusters to a single default server
   * (which may be configured in the bootstrap file).
   * 
   * Note that if multiple clusters point to the same LRS server, the client may choose to
   * create a separate stream for each cluster or it may choose to coalesce the data for
   * multiple clusters onto a single stream. Either way, the client must make sure to send
   * the data for any given cluster on no more than one stream.
   * 
   * [#next-major-version: In the v3 API, we should consider restructuring this somehow,
   * maybe by allowing LRS to go on the ADS stream, or maybe by moving some of the negotiation
   * from the LRS stream here.]
   */
  'lrs_server'?: (_envoy_config_core_v3_ConfigSource | null);
  /**
   * Configuration to use different transport sockets for different endpoints.
   * The entry of ``envoy.transport_socket_match`` in the
   * :ref:`LbEndpoint.Metadata <envoy_v3_api_field_config.endpoint.v3.LbEndpoint.metadata>`
   * is used to match against the transport sockets as they appear in the list. The first
   * :ref:`match <envoy_v3_api_msg_config.cluster.v3.Cluster.TransportSocketMatch>` is used.
   * For example, with the following match
   * 
   * .. code-block:: yaml
   * 
   * transport_socket_matches:
   * - name: "enableMTLS"
   * match:
   * acceptMTLS: true
   * transport_socket:
   * name: envoy.transport_sockets.tls
   * config: { ... } # tls socket configuration
   * - name: "defaultToPlaintext"
   * match: {}
   * transport_socket:
   * name: envoy.transport_sockets.raw_buffer
   * 
   * Connections to the endpoints whose metadata value under ``envoy.transport_socket_match``
   * having "acceptMTLS"/"true" key/value pair use the "enableMTLS" socket configuration.
   * 
   * If a :ref:`socket match <envoy_v3_api_msg_config.cluster.v3.Cluster.TransportSocketMatch>` with empty match
   * criteria is provided, that always match any endpoint. For example, the "defaultToPlaintext"
   * socket match in case above.
   * 
   * If an endpoint metadata's value under ``envoy.transport_socket_match`` does not match any
   * ``TransportSocketMatch``, socket configuration fallbacks to use the ``tls_context`` or
   * ``transport_socket`` specified in this cluster.
   * 
   * This field allows gradual and flexible transport socket configuration changes.
   * 
   * The metadata of endpoints in EDS can indicate transport socket capabilities. For example,
   * an endpoint's metadata can have two key value pairs as "acceptMTLS": "true",
   * "acceptPlaintext": "true". While some other endpoints, only accepting plaintext traffic
   * has "acceptPlaintext": "true" metadata information.
   * 
   * Then the xDS server can configure the CDS to a client, Envoy A, to send mutual TLS
   * traffic for endpoints with "acceptMTLS": "true", by adding a corresponding
   * ``TransportSocketMatch`` in this field. Other client Envoys receive CDS without
   * ``transport_socket_match`` set, and still send plain text traffic to the same cluster.
   * 
   * This field can be used to specify custom transport socket configurations for health
   * checks by adding matching key/value pairs in a health check's
   * :ref:`transport socket match criteria <envoy_v3_api_field_config.core.v3.HealthCheck.transport_socket_match_criteria>` field.
   * 
   * [#comment:TODO(incfly): add a detailed architecture doc on intended usage.]
   */
  'transport_socket_matches'?: (_envoy_config_cluster_v3_Cluster_TransportSocketMatch)[];
  /**
   * If the DNS failure refresh rate is specified and the cluster type is either
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * this is used as the cluster’s DNS refresh rate when requests are failing. If this setting is
   * not specified, the failure refresh rate defaults to the DNS refresh rate. For cluster types
   * other than :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>` and
   * :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>` this setting is
   * ignored.
   */
  'dns_failure_refresh_rate'?: (_envoy_config_cluster_v3_Cluster_RefreshRate | null);
  /**
   * Always use TCP queries instead of UDP queries for DNS lookups.
   * This field is deprecated in favor of ``dns_resolution_config``
   * which aggregates all of the DNS resolver configuration in a single message.
   */
  'use_tcp_for_dns_lookups'?: (boolean);
  /**
   * HTTP protocol options that are applied only to upstream HTTP connections.
   * These options apply to all HTTP versions.
   * This has been deprecated in favor of
   * :ref:`upstream_http_protocol_options <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * in the :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * upstream_http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'upstream_http_protocol_options'?: (_envoy_config_core_v3_UpstreamHttpProtocolOptions | null);
  /**
   * If track_timeout_budgets is true, the :ref:`timeout budget histograms
   * <config_cluster_manager_cluster_stats_timeout_budgets>` will be published for each
   * request. These show what percentage of a request's per try and global timeout was used. A value
   * of 0 would indicate that none of the timeout was used or that the timeout was infinite. A value
   * of 100 would indicate that the request took the entirety of the timeout given to it.
   * 
   * .. attention::
   * 
   * This field has been deprecated in favor of ``timeout_budgets``, part of
   * :ref:`track_cluster_stats <envoy_v3_api_field_config.cluster.v3.Cluster.track_cluster_stats>`.
   */
  'track_timeout_budgets'?: (boolean);
  /**
   * Optional customization and configuration of upstream connection pool, and upstream type.
   * 
   * Currently this field only applies for HTTP traffic but is designed for eventual use for custom
   * TCP upstreams.
   * 
   * For HTTP traffic, Envoy will generally take downstream HTTP and send it upstream as upstream
   * HTTP, using the http connection pool and the codec from ``http2_protocol_options``
   * 
   * For routes where CONNECT termination is configured, Envoy will take downstream CONNECT
   * requests and forward the CONNECT payload upstream over raw TCP using the tcp connection pool.
   * 
   * The default pool used is the generic connection pool which creates the HTTP upstream for most
   * HTTP requests, and the TCP upstream if CONNECT termination is configured.
   * 
   * If users desire custom connection pool or upstream behavior, for example terminating
   * CONNECT only if a custom filter indicates it is appropriate, the custom factories
   * can be registered and configured here.
   * [#extension-category: envoy.upstreams]
   */
  'upstream_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Configuration to track optional cluster stats.
   */
  'track_cluster_stats'?: (_envoy_config_cluster_v3_TrackClusterStats | null);
  /**
   * Preconnect configuration for this cluster.
   */
  'preconnect_policy'?: (_envoy_config_cluster_v3_Cluster_PreconnectPolicy | null);
  /**
   * If ``connection_pool_per_downstream_connection`` is true, the cluster will use a separate
   * connection pool for every downstream connection
   */
  'connection_pool_per_downstream_connection'?: (boolean);
  /**
   * Optional configuration for the Maglev load balancing policy.
   */
  'maglev_lb_config'?: (_envoy_config_cluster_v3_Cluster_MaglevLbConfig | null);
  /**
   * DNS resolution configuration which includes the underlying dns resolver addresses and options.
   * This field is deprecated in favor of
   * :ref:`typed_dns_resolver_config <envoy_v3_api_field_config.cluster.v3.Cluster.typed_dns_resolver_config>`.
   */
  'dns_resolution_config'?: (_envoy_config_core_v3_DnsResolutionConfig | null);
  /**
   * Optional configuration for having cluster readiness block on warm-up. Currently, only applicable for
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * or :ref:`Redis Cluster<arch_overview_redis>`.
   * If true, cluster readiness blocks on warm-up. If false, the cluster will complete
   * initialization whether or not warm-up has completed. Defaults to true.
   */
  'wait_for_warm_on_init'?: (_google_protobuf_BoolValue | null);
  /**
   * DNS resolver type configuration extension. This extension can be used to configure c-ares, apple,
   * or any other DNS resolver types and the related parameters.
   * For example, an object of
   * :ref:`CaresDnsResolverConfig <envoy_v3_api_msg_extensions.network.dns_resolver.cares.v3.CaresDnsResolverConfig>`
   * can be packed into this ``typed_dns_resolver_config``. This configuration replaces the
   * :ref:`dns_resolution_config <envoy_v3_api_field_config.cluster.v3.Cluster.dns_resolution_config>`
   * configuration.
   * During the transition period when both ``dns_resolution_config`` and ``typed_dns_resolver_config`` exists,
   * when ``typed_dns_resolver_config`` is in place, Envoy will use it and ignore ``dns_resolution_config``.
   * When ``typed_dns_resolver_config`` is missing, the default behavior is in place.
   * [#extension-category: envoy.network.dns_resolver]
   */
  'typed_dns_resolver_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Optional configuration for the RoundRobin load balancing policy.
   */
  'round_robin_lb_config'?: (_envoy_config_cluster_v3_Cluster_RoundRobinLbConfig | null);
  'cluster_discovery_type'?: "type"|"cluster_type";
  /**
   * Optional configuration for the load balancing algorithm selected by
   * LbPolicy. Currently only
   * :ref:`RING_HASH<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbPolicy.RING_HASH>`,
   * :ref:`MAGLEV<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbPolicy.MAGLEV>` and
   * :ref:`LEAST_REQUEST<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbPolicy.LEAST_REQUEST>`
   * has additional configuration options.
   * Specifying ring_hash_lb_config or maglev_lb_config or least_request_lb_config without setting the corresponding
   * LbPolicy will generate an error at runtime.
   */
  'lb_config'?: "ring_hash_lb_config"|"maglev_lb_config"|"original_dst_lb_config"|"least_request_lb_config"|"round_robin_lb_config";
}

/**
 * Configuration for a single upstream cluster.
 * [#next-free-field: 57]
 */
export interface Cluster__Output {
  /**
   * Supplies the name of the cluster which must be unique across all clusters.
   * The cluster name is used when emitting
   * :ref:`statistics <config_cluster_manager_cluster_stats>` if :ref:`alt_stat_name
   * <envoy_v3_api_field_config.cluster.v3.Cluster.alt_stat_name>` is not provided.
   * Any ``:`` in the cluster name will be converted to ``_`` when emitting statistics.
   */
  'name': (string);
  /**
   * The :ref:`service discovery type <arch_overview_service_discovery_types>`
   * to use for resolving the cluster.
   */
  'type'?: (keyof typeof _envoy_config_cluster_v3_Cluster_DiscoveryType);
  /**
   * Configuration to use for EDS updates for the Cluster.
   */
  'eds_cluster_config': (_envoy_config_cluster_v3_Cluster_EdsClusterConfig__Output | null);
  /**
   * The timeout for new network connections to hosts in the cluster.
   * If not set, a default value of 5s will be used.
   */
  'connect_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Soft limit on size of the cluster’s connections read and write buffers. If
   * unspecified, an implementation defined default is applied (1MiB).
   */
  'per_connection_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The :ref:`load balancer type <arch_overview_load_balancing_types>` to use
   * when picking a host in the cluster.
   */
  'lb_policy': (keyof typeof _envoy_config_cluster_v3_Cluster_LbPolicy);
  /**
   * Optional :ref:`active health checking <arch_overview_health_checking>`
   * configuration for the cluster. If no
   * configuration is specified no health checking will be done and all cluster
   * members will be considered healthy at all times.
   */
  'health_checks': (_envoy_config_core_v3_HealthCheck__Output)[];
  /**
   * Optional maximum requests for a single upstream connection. This parameter
   * is respected by both the HTTP/1.1 and HTTP/2 connection pool
   * implementations. If not specified, there is no limit. Setting this
   * parameter to 1 will effectively disable keep alive.
   * 
   * .. attention::
   * This field has been deprecated in favor of the :ref:`max_requests_per_connection <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.max_requests_per_connection>` field.
   */
  'max_requests_per_connection': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Optional :ref:`circuit breaking <arch_overview_circuit_break>` for the cluster.
   */
  'circuit_breakers': (_envoy_config_cluster_v3_CircuitBreakers__Output | null);
  /**
   * Additional options when handling HTTP1 requests.
   * This has been deprecated in favor of http_protocol_options fields in the
   * :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'http_protocol_options': (_envoy_config_core_v3_Http1ProtocolOptions__Output | null);
  /**
   * Even if default HTTP2 protocol options are desired, this field must be
   * set so that Envoy will assume that the upstream supports HTTP/2 when
   * making new HTTP connection pool connections. Currently, Envoy only
   * supports prior knowledge for upstream connections. Even if TLS is used
   * with ALPN, ``http2_protocol_options`` must be specified. As an aside this allows HTTP/2
   * connections to happen over plain text.
   * This has been deprecated in favor of http2_protocol_options fields in the
   * :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>`
   * message. http2_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'http2_protocol_options': (_envoy_config_core_v3_Http2ProtocolOptions__Output | null);
  /**
   * If the DNS refresh rate is specified and the cluster type is either
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * this value is used as the cluster’s DNS refresh
   * rate. The value configured must be at least 1ms. If this setting is not specified, the
   * value defaults to 5000ms. For cluster types other than
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`
   * and :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`
   * this setting is ignored.
   */
  'dns_refresh_rate': (_google_protobuf_Duration__Output | null);
  /**
   * The DNS IP address resolution policy. If this setting is not specified, the
   * value defaults to
   * :ref:`AUTO<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DnsLookupFamily.AUTO>`.
   */
  'dns_lookup_family': (keyof typeof _envoy_config_cluster_v3_Cluster_DnsLookupFamily);
  /**
   * If DNS resolvers are specified and the cluster type is either
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * this value is used to specify the cluster’s dns resolvers.
   * If this setting is not specified, the value defaults to the default
   * resolver, which uses /etc/resolv.conf for configuration. For cluster types
   * other than
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`
   * and :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`
   * this setting is ignored.
   * This field is deprecated in favor of ``dns_resolution_config``
   * which aggregates all of the DNS resolver configuration in a single message.
   */
  'dns_resolvers': (_envoy_config_core_v3_Address__Output)[];
  /**
   * If specified, outlier detection will be enabled for this upstream cluster.
   * Each of the configuration values can be overridden via
   * :ref:`runtime values <config_cluster_manager_cluster_runtime_outlier_detection>`.
   */
  'outlier_detection': (_envoy_config_cluster_v3_OutlierDetection__Output | null);
  /**
   * The interval for removing stale hosts from a cluster type
   * :ref:`ORIGINAL_DST<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.ORIGINAL_DST>`.
   * Hosts are considered stale if they have not been used
   * as upstream destinations during this interval. New hosts are added
   * to original destination clusters on demand as new connections are
   * redirected to Envoy, causing the number of hosts in the cluster to
   * grow over time. Hosts that are not stale (they are actively used as
   * destinations) are kept in the cluster, which allows connections to
   * them remain open, saving the latency that would otherwise be spent
   * on opening new connections. If this setting is not specified, the
   * value defaults to 5000ms. For cluster types other than
   * :ref:`ORIGINAL_DST<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.ORIGINAL_DST>`
   * this setting is ignored.
   */
  'cleanup_interval': (_google_protobuf_Duration__Output | null);
  /**
   * Optional configuration used to bind newly established upstream connections.
   * This overrides any bind_config specified in the bootstrap proto.
   * If the address and port are empty, no bind will be performed.
   */
  'upstream_bind_config': (_envoy_config_core_v3_BindConfig__Output | null);
  /**
   * Configuration for load balancing subsetting.
   */
  'lb_subset_config': (_envoy_config_cluster_v3_Cluster_LbSubsetConfig__Output | null);
  /**
   * Optional configuration for the Ring Hash load balancing policy.
   */
  'ring_hash_lb_config'?: (_envoy_config_cluster_v3_Cluster_RingHashLbConfig__Output | null);
  /**
   * Optional custom transport socket implementation to use for upstream connections.
   * To setup TLS, set a transport socket with name ``envoy.transport_sockets.tls`` and
   * :ref:`UpstreamTlsContexts <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.UpstreamTlsContext>` in the ``typed_config``.
   * If no transport socket configuration is specified, new connections
   * will be set up with plaintext.
   */
  'transport_socket': (_envoy_config_core_v3_TransportSocket__Output | null);
  /**
   * The Metadata field can be used to provide additional information about the
   * cluster. It can be used for stats, logging, and varying filter behavior.
   * Fields should use reverse DNS notation to denote which entity within Envoy
   * will need the information. For instance, if the metadata is intended for
   * the Router filter, the filter name should be specified as ``envoy.filters.http.router``.
   */
  'metadata': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * Determines how Envoy selects the protocol used to speak to upstream hosts.
   * This has been deprecated in favor of setting explicit protocol selection
   * in the :ref:`http_protocol_options
   * <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   */
  'protocol_selection': (keyof typeof _envoy_config_cluster_v3_Cluster_ClusterProtocolSelection);
  /**
   * Common configuration for all load balancer implementations.
   */
  'common_lb_config': (_envoy_config_cluster_v3_Cluster_CommonLbConfig__Output | null);
  /**
   * An optional alternative to the cluster name to be used for observability. This name is used
   * emitting stats for the cluster and access logging the cluster name. This will appear as
   * additional information in configuration dumps of a cluster's current status as
   * :ref:`observability_name <envoy_v3_api_field_admin.v3.ClusterStatus.observability_name>`
   * and as an additional tag "upstream_cluster.name" while tracing. Note: Any ``:`` in the name
   * will be converted to ``_`` when emitting statistics. This should not be confused with
   * :ref:`Router Filter Header <config_http_filters_router_x-envoy-upstream-alt-stat-name>`.
   */
  'alt_stat_name': (string);
  /**
   * Additional options when handling HTTP requests upstream. These options will be applicable to
   * both HTTP1 and HTTP2 requests.
   * This has been deprecated in favor of
   * :ref:`common_http_protocol_options <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.common_http_protocol_options>`
   * in the :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * common_http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'common_http_protocol_options': (_envoy_config_core_v3_HttpProtocolOptions__Output | null);
  /**
   * Optional options for upstream connections.
   */
  'upstream_connection_options': (_envoy_config_cluster_v3_UpstreamConnectionOptions__Output | null);
  /**
   * If an upstream host becomes unhealthy (as determined by the configured health checks
   * or outlier detection), immediately close all connections to the failed host.
   * 
   * .. note::
   * 
   * This is currently only supported for connections created by tcp_proxy.
   * 
   * .. note::
   * 
   * The current implementation of this feature closes all connections immediately when
   * the unhealthy status is detected. If there are a large number of connections open
   * to an upstream host that becomes unhealthy, Envoy may spend a substantial amount of
   * time exclusively closing these connections, and not processing any other traffic.
   */
  'close_connections_on_host_health_failure': (boolean);
  /**
   * If set to true, Envoy will ignore the health value of a host when processing its removal
   * from service discovery. This means that if active health checking is used, Envoy will *not*
   * wait for the endpoint to go unhealthy before removing it.
   */
  'ignore_health_on_host_removal': (boolean);
  /**
   * Setting this is required for specifying members of
   * :ref:`STATIC<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STATIC>`,
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>` clusters.
   * This field supersedes the ``hosts`` field in the v2 API.
   * 
   * .. attention::
   * 
   * Setting this allows non-EDS cluster types to contain embedded EDS equivalent
   * :ref:`endpoint assignments<envoy_v3_api_msg_config.endpoint.v3.ClusterLoadAssignment>`.
   */
  'load_assignment': (_envoy_config_endpoint_v3_ClusterLoadAssignment__Output | null);
  /**
   * Optional configuration for the Original Destination load balancing policy.
   */
  'original_dst_lb_config'?: (_envoy_config_cluster_v3_Cluster_OriginalDstLbConfig__Output | null);
  /**
   * The extension_protocol_options field is used to provide extension-specific protocol options
   * for upstream connections. The key should match the extension filter name, such as
   * "envoy.filters.network.thrift_proxy". See the extension's documentation for details on
   * specific options.
   * [#next-major-version: make this a list of typed extensions.]
   */
  'typed_extension_protocol_options': ({[key: string]: _google_protobuf_Any__Output});
  /**
   * Optional configuration for the LeastRequest load balancing policy.
   */
  'least_request_lb_config'?: (_envoy_config_cluster_v3_Cluster_LeastRequestLbConfig__Output | null);
  /**
   * The custom cluster type.
   */
  'cluster_type'?: (_envoy_config_cluster_v3_Cluster_CustomClusterType__Output | null);
  /**
   * Optional configuration for setting cluster's DNS refresh rate. If the value is set to true,
   * cluster's DNS refresh rate will be set to resource record's TTL which comes from DNS
   * resolution.
   */
  'respect_dns_ttl': (boolean);
  /**
   * An (optional) network filter chain, listed in the order the filters should be applied.
   * The chain will be applied to all outgoing connections that Envoy makes to the upstream
   * servers of this cluster.
   */
  'filters': (_envoy_config_cluster_v3_Filter__Output)[];
  /**
   * If this field is set and is supported by the client, it will supersede the value of
   * :ref:`lb_policy<envoy_v3_api_field_config.cluster.v3.Cluster.lb_policy>`.
   */
  'load_balancing_policy': (_envoy_config_cluster_v3_LoadBalancingPolicy__Output | null);
  /**
   * [#not-implemented-hide:]
   * If present, tells the client where to send load reports via LRS. If not present, the
   * client will fall back to a client-side default, which may be either (a) don't send any
   * load reports or (b) send load reports for all clusters to a single default server
   * (which may be configured in the bootstrap file).
   * 
   * Note that if multiple clusters point to the same LRS server, the client may choose to
   * create a separate stream for each cluster or it may choose to coalesce the data for
   * multiple clusters onto a single stream. Either way, the client must make sure to send
   * the data for any given cluster on no more than one stream.
   * 
   * [#next-major-version: In the v3 API, we should consider restructuring this somehow,
   * maybe by allowing LRS to go on the ADS stream, or maybe by moving some of the negotiation
   * from the LRS stream here.]
   */
  'lrs_server': (_envoy_config_core_v3_ConfigSource__Output | null);
  /**
   * Configuration to use different transport sockets for different endpoints.
   * The entry of ``envoy.transport_socket_match`` in the
   * :ref:`LbEndpoint.Metadata <envoy_v3_api_field_config.endpoint.v3.LbEndpoint.metadata>`
   * is used to match against the transport sockets as they appear in the list. The first
   * :ref:`match <envoy_v3_api_msg_config.cluster.v3.Cluster.TransportSocketMatch>` is used.
   * For example, with the following match
   * 
   * .. code-block:: yaml
   * 
   * transport_socket_matches:
   * - name: "enableMTLS"
   * match:
   * acceptMTLS: true
   * transport_socket:
   * name: envoy.transport_sockets.tls
   * config: { ... } # tls socket configuration
   * - name: "defaultToPlaintext"
   * match: {}
   * transport_socket:
   * name: envoy.transport_sockets.raw_buffer
   * 
   * Connections to the endpoints whose metadata value under ``envoy.transport_socket_match``
   * having "acceptMTLS"/"true" key/value pair use the "enableMTLS" socket configuration.
   * 
   * If a :ref:`socket match <envoy_v3_api_msg_config.cluster.v3.Cluster.TransportSocketMatch>` with empty match
   * criteria is provided, that always match any endpoint. For example, the "defaultToPlaintext"
   * socket match in case above.
   * 
   * If an endpoint metadata's value under ``envoy.transport_socket_match`` does not match any
   * ``TransportSocketMatch``, socket configuration fallbacks to use the ``tls_context`` or
   * ``transport_socket`` specified in this cluster.
   * 
   * This field allows gradual and flexible transport socket configuration changes.
   * 
   * The metadata of endpoints in EDS can indicate transport socket capabilities. For example,
   * an endpoint's metadata can have two key value pairs as "acceptMTLS": "true",
   * "acceptPlaintext": "true". While some other endpoints, only accepting plaintext traffic
   * has "acceptPlaintext": "true" metadata information.
   * 
   * Then the xDS server can configure the CDS to a client, Envoy A, to send mutual TLS
   * traffic for endpoints with "acceptMTLS": "true", by adding a corresponding
   * ``TransportSocketMatch`` in this field. Other client Envoys receive CDS without
   * ``transport_socket_match`` set, and still send plain text traffic to the same cluster.
   * 
   * This field can be used to specify custom transport socket configurations for health
   * checks by adding matching key/value pairs in a health check's
   * :ref:`transport socket match criteria <envoy_v3_api_field_config.core.v3.HealthCheck.transport_socket_match_criteria>` field.
   * 
   * [#comment:TODO(incfly): add a detailed architecture doc on intended usage.]
   */
  'transport_socket_matches': (_envoy_config_cluster_v3_Cluster_TransportSocketMatch__Output)[];
  /**
   * If the DNS failure refresh rate is specified and the cluster type is either
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * this is used as the cluster’s DNS refresh rate when requests are failing. If this setting is
   * not specified, the failure refresh rate defaults to the DNS refresh rate. For cluster types
   * other than :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>` and
   * :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>` this setting is
   * ignored.
   */
  'dns_failure_refresh_rate': (_envoy_config_cluster_v3_Cluster_RefreshRate__Output | null);
  /**
   * Always use TCP queries instead of UDP queries for DNS lookups.
   * This field is deprecated in favor of ``dns_resolution_config``
   * which aggregates all of the DNS resolver configuration in a single message.
   */
  'use_tcp_for_dns_lookups': (boolean);
  /**
   * HTTP protocol options that are applied only to upstream HTTP connections.
   * These options apply to all HTTP versions.
   * This has been deprecated in favor of
   * :ref:`upstream_http_protocol_options <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * in the :ref:`http_protocol_options <envoy_v3_api_msg_extensions.upstreams.http.v3.HttpProtocolOptions>` message.
   * upstream_http_protocol_options can be set via the cluster's
   * :ref:`extension_protocol_options<envoy_v3_api_field_config.cluster.v3.Cluster.typed_extension_protocol_options>`.
   * See :ref:`upstream_http_protocol_options
   * <envoy_v3_api_field_extensions.upstreams.http.v3.HttpProtocolOptions.upstream_http_protocol_options>`
   * for example usage.
   */
  'upstream_http_protocol_options': (_envoy_config_core_v3_UpstreamHttpProtocolOptions__Output | null);
  /**
   * If track_timeout_budgets is true, the :ref:`timeout budget histograms
   * <config_cluster_manager_cluster_stats_timeout_budgets>` will be published for each
   * request. These show what percentage of a request's per try and global timeout was used. A value
   * of 0 would indicate that none of the timeout was used or that the timeout was infinite. A value
   * of 100 would indicate that the request took the entirety of the timeout given to it.
   * 
   * .. attention::
   * 
   * This field has been deprecated in favor of ``timeout_budgets``, part of
   * :ref:`track_cluster_stats <envoy_v3_api_field_config.cluster.v3.Cluster.track_cluster_stats>`.
   */
  'track_timeout_budgets': (boolean);
  /**
   * Optional customization and configuration of upstream connection pool, and upstream type.
   * 
   * Currently this field only applies for HTTP traffic but is designed for eventual use for custom
   * TCP upstreams.
   * 
   * For HTTP traffic, Envoy will generally take downstream HTTP and send it upstream as upstream
   * HTTP, using the http connection pool and the codec from ``http2_protocol_options``
   * 
   * For routes where CONNECT termination is configured, Envoy will take downstream CONNECT
   * requests and forward the CONNECT payload upstream over raw TCP using the tcp connection pool.
   * 
   * The default pool used is the generic connection pool which creates the HTTP upstream for most
   * HTTP requests, and the TCP upstream if CONNECT termination is configured.
   * 
   * If users desire custom connection pool or upstream behavior, for example terminating
   * CONNECT only if a custom filter indicates it is appropriate, the custom factories
   * can be registered and configured here.
   * [#extension-category: envoy.upstreams]
   */
  'upstream_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Configuration to track optional cluster stats.
   */
  'track_cluster_stats': (_envoy_config_cluster_v3_TrackClusterStats__Output | null);
  /**
   * Preconnect configuration for this cluster.
   */
  'preconnect_policy': (_envoy_config_cluster_v3_Cluster_PreconnectPolicy__Output | null);
  /**
   * If ``connection_pool_per_downstream_connection`` is true, the cluster will use a separate
   * connection pool for every downstream connection
   */
  'connection_pool_per_downstream_connection': (boolean);
  /**
   * Optional configuration for the Maglev load balancing policy.
   */
  'maglev_lb_config'?: (_envoy_config_cluster_v3_Cluster_MaglevLbConfig__Output | null);
  /**
   * DNS resolution configuration which includes the underlying dns resolver addresses and options.
   * This field is deprecated in favor of
   * :ref:`typed_dns_resolver_config <envoy_v3_api_field_config.cluster.v3.Cluster.typed_dns_resolver_config>`.
   */
  'dns_resolution_config': (_envoy_config_core_v3_DnsResolutionConfig__Output | null);
  /**
   * Optional configuration for having cluster readiness block on warm-up. Currently, only applicable for
   * :ref:`STRICT_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.STRICT_DNS>`,
   * or :ref:`LOGICAL_DNS<envoy_v3_api_enum_value_config.cluster.v3.Cluster.DiscoveryType.LOGICAL_DNS>`,
   * or :ref:`Redis Cluster<arch_overview_redis>`.
   * If true, cluster readiness blocks on warm-up. If false, the cluster will complete
   * initialization whether or not warm-up has completed. Defaults to true.
   */
  'wait_for_warm_on_init': (_google_protobuf_BoolValue__Output | null);
  /**
   * DNS resolver type configuration extension. This extension can be used to configure c-ares, apple,
   * or any other DNS resolver types and the related parameters.
   * For example, an object of
   * :ref:`CaresDnsResolverConfig <envoy_v3_api_msg_extensions.network.dns_resolver.cares.v3.CaresDnsResolverConfig>`
   * can be packed into this ``typed_dns_resolver_config``. This configuration replaces the
   * :ref:`dns_resolution_config <envoy_v3_api_field_config.cluster.v3.Cluster.dns_resolution_config>`
   * configuration.
   * During the transition period when both ``dns_resolution_config`` and ``typed_dns_resolver_config`` exists,
   * when ``typed_dns_resolver_config`` is in place, Envoy will use it and ignore ``dns_resolution_config``.
   * When ``typed_dns_resolver_config`` is missing, the default behavior is in place.
   * [#extension-category: envoy.network.dns_resolver]
   */
  'typed_dns_resolver_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Optional configuration for the RoundRobin load balancing policy.
   */
  'round_robin_lb_config'?: (_envoy_config_cluster_v3_Cluster_RoundRobinLbConfig__Output | null);
  'cluster_discovery_type': "type"|"cluster_type";
  /**
   * Optional configuration for the load balancing algorithm selected by
   * LbPolicy. Currently only
   * :ref:`RING_HASH<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbPolicy.RING_HASH>`,
   * :ref:`MAGLEV<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbPolicy.MAGLEV>` and
   * :ref:`LEAST_REQUEST<envoy_v3_api_enum_value_config.cluster.v3.Cluster.LbPolicy.LEAST_REQUEST>`
   * has additional configuration options.
   * Specifying ring_hash_lb_config or maglev_lb_config or least_request_lb_config without setting the corresponding
   * LbPolicy will generate an error at runtime.
   */
  'lb_config': "ring_hash_lb_config"|"maglev_lb_config"|"original_dst_lb_config"|"least_request_lb_config"|"round_robin_lb_config";
}
