// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash.proto

import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../../../google/protobuf/UInt64Value';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../google/protobuf/UInt32Value';
import type { ConsistentHashingLbConfig as _envoy_extensions_load_balancing_policies_common_v3_ConsistentHashingLbConfig, ConsistentHashingLbConfig__Output as _envoy_extensions_load_balancing_policies_common_v3_ConsistentHashingLbConfig__Output } from '../../../../../envoy/extensions/load_balancing_policies/common/v3/ConsistentHashingLbConfig';
import type { _envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig, _envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig__Output } from '../../../../../envoy/extensions/load_balancing_policies/common/v3/LocalityLbConfig';
import type { Long } from '@grpc/proto-loader';

// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/ring_hash/v3/ring_hash.proto

/**
 * The hash function used to hash hosts onto the ketama ring.
 */
export enum _envoy_extensions_load_balancing_policies_ring_hash_v3_RingHash_HashFunction {
  /**
   * Currently defaults to XX_HASH.
   */
  DEFAULT_HASH = 0,
  /**
   * Use `xxHash <https://github.com/Cyan4973/xxHash>`_.
   */
  XX_HASH = 1,
  /**
   * Use `MurmurHash2 <https://sites.google.com/site/murmurhash/>`_, this is compatible with
   * std:hash<string> in GNU libstdc++ 3.4.20 or above. This is typically the case when compiled
   * on Linux and not macOS.
   */
  MURMUR_HASH_2 = 2,
}

/**
 * This configuration allows the built-in RING_HASH LB policy to be configured via the LB policy
 * extension point. See the :ref:`load balancing architecture overview
 * <arch_overview_load_balancing_types>` for more information.
 * [#next-free-field: 8]
 */
export interface RingHash {
  /**
   * The hash function used to hash hosts onto the ketama ring. The value defaults to
   * :ref:`XX_HASH<envoy_v3_api_enum_value_config.cluster.v3.Cluster.RingHashLbConfig.HashFunction.XX_HASH>`.
   */
  'hash_function'?: (_envoy_extensions_load_balancing_policies_ring_hash_v3_RingHash_HashFunction | keyof typeof _envoy_extensions_load_balancing_policies_ring_hash_v3_RingHash_HashFunction);
  /**
   * Minimum hash ring size. The larger the ring is (that is, the more hashes there are for each
   * provided host) the better the request distribution will reflect the desired weights. Defaults
   * to 1024 entries, and limited to 8M entries. See also
   * :ref:`maximum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.maximum_ring_size>`.
   */
  'minimum_ring_size'?: (_google_protobuf_UInt64Value | null);
  /**
   * Maximum hash ring size. Defaults to 8M entries, and limited to 8M entries, but can be lowered
   * to further constrain resource use. See also
   * :ref:`minimum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.minimum_ring_size>`.
   */
  'maximum_ring_size'?: (_google_protobuf_UInt64Value | null);
  /**
   * If set to `true`, the cluster will use hostname instead of the resolved
   * address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.
   * 
   * ..note::
   * This is deprecated and please use :ref:`consistent_hashing_lb_config
   * <envoy_v3_api_field_extensions.load_balancing_policies.ring_hash.v3.RingHash.consistent_hashing_lb_config>` instead.
   */
  'use_hostname_for_hashing'?: (boolean);
  /**
   * Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150
   * no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster.
   * If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200.
   * Minimum is 100.
   * 
   * This is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified
   * `hash_balance_factor`, requests to any upstream host are capped at `hash_balance_factor/100` times the average number of requests
   * across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing
   * is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify
   * the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the
   * cascading overflow effect when choosing the next host in the ring/table).
   * 
   * If weights are specified on the hosts, they are respected.
   * 
   * This is an O(N) algorithm, unlike other load balancers. Using a lower `hash_balance_factor` results in more hosts
   * being probed, so use a higher value if you require better performance.
   * 
   * ..note::
   * This is deprecated and please use :ref:`consistent_hashing_lb_config
   * <envoy_v3_api_field_extensions.load_balancing_policies.ring_hash.v3.RingHash.consistent_hashing_lb_config>` instead.
   */
  'hash_balance_factor'?: (_google_protobuf_UInt32Value | null);
  /**
   * Common configuration for hashing-based load balancing policies.
   */
  'consistent_hashing_lb_config'?: (_envoy_extensions_load_balancing_policies_common_v3_ConsistentHashingLbConfig | null);
  /**
   * Enable locality weighted load balancing for ring hash lb explicitly.
   */
  'locality_weighted_lb_config'?: (_envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig | null);
}

/**
 * This configuration allows the built-in RING_HASH LB policy to be configured via the LB policy
 * extension point. See the :ref:`load balancing architecture overview
 * <arch_overview_load_balancing_types>` for more information.
 * [#next-free-field: 8]
 */
export interface RingHash__Output {
  /**
   * The hash function used to hash hosts onto the ketama ring. The value defaults to
   * :ref:`XX_HASH<envoy_v3_api_enum_value_config.cluster.v3.Cluster.RingHashLbConfig.HashFunction.XX_HASH>`.
   */
  'hash_function': (keyof typeof _envoy_extensions_load_balancing_policies_ring_hash_v3_RingHash_HashFunction);
  /**
   * Minimum hash ring size. The larger the ring is (that is, the more hashes there are for each
   * provided host) the better the request distribution will reflect the desired weights. Defaults
   * to 1024 entries, and limited to 8M entries. See also
   * :ref:`maximum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.maximum_ring_size>`.
   */
  'minimum_ring_size': (_google_protobuf_UInt64Value__Output | null);
  /**
   * Maximum hash ring size. Defaults to 8M entries, and limited to 8M entries, but can be lowered
   * to further constrain resource use. See also
   * :ref:`minimum_ring_size<envoy_v3_api_field_config.cluster.v3.Cluster.RingHashLbConfig.minimum_ring_size>`.
   */
  'maximum_ring_size': (_google_protobuf_UInt64Value__Output | null);
  /**
   * If set to `true`, the cluster will use hostname instead of the resolved
   * address as the key to consistently hash to an upstream host. Only valid for StrictDNS clusters with hostnames which resolve to a single IP address.
   * 
   * ..note::
   * This is deprecated and please use :ref:`consistent_hashing_lb_config
   * <envoy_v3_api_field_extensions.load_balancing_policies.ring_hash.v3.RingHash.consistent_hashing_lb_config>` instead.
   */
  'use_hostname_for_hashing': (boolean);
  /**
   * Configures percentage of average cluster load to bound per upstream host. For example, with a value of 150
   * no upstream host will get a load more than 1.5 times the average load of all the hosts in the cluster.
   * If not specified, the load is not bounded for any upstream host. Typical value for this parameter is between 120 and 200.
   * Minimum is 100.
   * 
   * This is implemented based on the method described in the paper https://arxiv.org/abs/1608.01350. For the specified
   * `hash_balance_factor`, requests to any upstream host are capped at `hash_balance_factor/100` times the average number of requests
   * across the cluster. When a request arrives for an upstream host that is currently serving at its max capacity, linear probing
   * is used to identify an eligible host. Further, the linear probe is implemented using a random jump in hosts ring/table to identify
   * the eligible host (this technique is as described in the paper https://arxiv.org/abs/1908.08762 - the random jump avoids the
   * cascading overflow effect when choosing the next host in the ring/table).
   * 
   * If weights are specified on the hosts, they are respected.
   * 
   * This is an O(N) algorithm, unlike other load balancers. Using a lower `hash_balance_factor` results in more hosts
   * being probed, so use a higher value if you require better performance.
   * 
   * ..note::
   * This is deprecated and please use :ref:`consistent_hashing_lb_config
   * <envoy_v3_api_field_extensions.load_balancing_policies.ring_hash.v3.RingHash.consistent_hashing_lb_config>` instead.
   */
  'hash_balance_factor': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Common configuration for hashing-based load balancing policies.
   */
  'consistent_hashing_lb_config': (_envoy_extensions_load_balancing_policies_common_v3_ConsistentHashingLbConfig__Output | null);
  /**
   * Enable locality weighted load balancing for ring hash lb explicitly.
   */
  'locality_weighted_lb_config': (_envoy_extensions_load_balancing_policies_common_v3_LocalityLbConfig_LocalityWeightedLbConfig__Output | null);
}
