// Original file: deps/envoy-api/envoy/service/load_stats/v3/lrs.proto

import type { Node as _envoy_config_core_v3_Node, Node__Output as _envoy_config_core_v3_Node__Output } from '../../../../envoy/config/core/v3/Node';
import type { ClusterStats as _envoy_config_endpoint_v3_ClusterStats, ClusterStats__Output as _envoy_config_endpoint_v3_ClusterStats__Output } from '../../../../envoy/config/endpoint/v3/ClusterStats';

/**
 * A load report Envoy sends to the management server.
 */
export interface LoadStatsRequest {
  /**
   * Node identifier for Envoy instance.
   */
  'node'?: (_envoy_config_core_v3_Node | null);
  /**
   * A list of load stats to report.
   */
  'cluster_stats'?: (_envoy_config_endpoint_v3_ClusterStats)[];
}

/**
 * A load report Envoy sends to the management server.
 */
export interface LoadStatsRequest__Output {
  /**
   * Node identifier for Envoy instance.
   */
  'node': (_envoy_config_core_v3_Node__Output | null);
  /**
   * A list of load stats to report.
   */
  'cluster_stats': (_envoy_config_endpoint_v3_ClusterStats__Output)[];
}
