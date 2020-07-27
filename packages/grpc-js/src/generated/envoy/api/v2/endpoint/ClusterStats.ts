// Original file: deps/envoy-api/envoy/api/v2/endpoint/load_report.proto

import { UpstreamLocalityStats as _envoy_api_v2_endpoint_UpstreamLocalityStats, UpstreamLocalityStats__Output as _envoy_api_v2_endpoint_UpstreamLocalityStats__Output } from '../../../../envoy/api/v2/endpoint/UpstreamLocalityStats';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { Long } from '@grpc/proto-loader';

export interface _envoy_api_v2_endpoint_ClusterStats_DroppedRequests {
  /**
   * Identifier for the policy specifying the drop.
   */
  'category'?: (string);
  /**
   * Total number of deliberately dropped requests for the category.
   */
  'dropped_count'?: (number | string | Long);
}

export interface _envoy_api_v2_endpoint_ClusterStats_DroppedRequests__Output {
  /**
   * Identifier for the policy specifying the drop.
   */
  'category': (string);
  /**
   * Total number of deliberately dropped requests for the category.
   */
  'dropped_count': (string);
}

/**
 * Per cluster load stats. Envoy reports these stats a management server in a
 * :ref:`LoadStatsRequest<envoy_api_msg_service.load_stats.v2.LoadStatsRequest>`
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 * Next ID: 7
 * [#next-free-field: 7]
 */
export interface ClusterStats {
  /**
   * The name of the cluster.
   */
  'cluster_name'?: (string);
  /**
   * Need at least one.
   */
  'upstream_locality_stats'?: (_envoy_api_v2_endpoint_UpstreamLocalityStats)[];
  /**
   * Cluster-level stats such as total_successful_requests may be computed by
   * summing upstream_locality_stats. In addition, below there are additional
   * cluster-wide stats.
   * 
   * The total number of dropped requests. This covers requests
   * deliberately dropped by the drop_overload policy and circuit breaking.
   */
  'total_dropped_requests'?: (number | string | Long);
  /**
   * Period over which the actual load report occurred. This will be guaranteed to include every
   * request reported. Due to system load and delays between the *LoadStatsRequest* sent from Envoy
   * and the *LoadStatsResponse* message sent from the management server, this may be longer than
   * the requested load reporting interval in the *LoadStatsResponse*.
   */
  'load_report_interval'?: (_google_protobuf_Duration);
  /**
   * Information about deliberately dropped requests for each category specified
   * in the DropOverload policy.
   */
  'dropped_requests'?: (_envoy_api_v2_endpoint_ClusterStats_DroppedRequests)[];
  /**
   * The eds_cluster_config service_name of the cluster.
   * It's possible that two clusters send the same service_name to EDS,
   * in that case, the management server is supposed to do aggregation on the load reports.
   */
  'cluster_service_name'?: (string);
}

/**
 * Per cluster load stats. Envoy reports these stats a management server in a
 * :ref:`LoadStatsRequest<envoy_api_msg_service.load_stats.v2.LoadStatsRequest>`
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 * Next ID: 7
 * [#next-free-field: 7]
 */
export interface ClusterStats__Output {
  /**
   * The name of the cluster.
   */
  'cluster_name': (string);
  /**
   * Need at least one.
   */
  'upstream_locality_stats': (_envoy_api_v2_endpoint_UpstreamLocalityStats__Output)[];
  /**
   * Cluster-level stats such as total_successful_requests may be computed by
   * summing upstream_locality_stats. In addition, below there are additional
   * cluster-wide stats.
   * 
   * The total number of dropped requests. This covers requests
   * deliberately dropped by the drop_overload policy and circuit breaking.
   */
  'total_dropped_requests': (string);
  /**
   * Period over which the actual load report occurred. This will be guaranteed to include every
   * request reported. Due to system load and delays between the *LoadStatsRequest* sent from Envoy
   * and the *LoadStatsResponse* message sent from the management server, this may be longer than
   * the requested load reporting interval in the *LoadStatsResponse*.
   */
  'load_report_interval'?: (_google_protobuf_Duration__Output);
  /**
   * Information about deliberately dropped requests for each category specified
   * in the DropOverload policy.
   */
  'dropped_requests': (_envoy_api_v2_endpoint_ClusterStats_DroppedRequests__Output)[];
  /**
   * The eds_cluster_config service_name of the cluster.
   * It's possible that two clusters send the same service_name to EDS,
   * in that case, the management server is supposed to do aggregation on the load reports.
   */
  'cluster_service_name': (string);
}
