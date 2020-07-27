// Original file: deps/envoy-api/envoy/service/load_stats/v2/lrs.proto

import { Node as _envoy_api_v2_core_Node, Node__Output as _envoy_api_v2_core_Node__Output } from '../../../../envoy/api/v2/core/Node';
import { ClusterStats as _envoy_api_v2_endpoint_ClusterStats, ClusterStats__Output as _envoy_api_v2_endpoint_ClusterStats__Output } from '../../../../envoy/api/v2/endpoint/ClusterStats';

/**
 * A load report Envoy sends to the management server.
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 */
export interface LoadStatsRequest {
  /**
   * Node identifier for Envoy instance.
   */
  'node'?: (_envoy_api_v2_core_Node);
  /**
   * A list of load stats to report.
   */
  'cluster_stats'?: (_envoy_api_v2_endpoint_ClusterStats)[];
}

/**
 * A load report Envoy sends to the management server.
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 */
export interface LoadStatsRequest__Output {
  /**
   * Node identifier for Envoy instance.
   */
  'node'?: (_envoy_api_v2_core_Node__Output);
  /**
   * A list of load stats to report.
   */
  'cluster_stats': (_envoy_api_v2_endpoint_ClusterStats__Output)[];
}
