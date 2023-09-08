// Original file: deps/envoy-api/envoy/extensions/load_balancing_policies/common/v3/common.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../google/protobuf/UInt32Value';

/**
 * Common Configuration for all consistent hashing load balancers (MaglevLb, RingHashLb, etc.)
 */
export interface ConsistentHashingLbConfig {
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
export interface ConsistentHashingLbConfig__Output {
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
