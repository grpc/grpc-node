// Original file: deps/envoy-api/envoy/service/load_stats/v2/lrs.proto

import * as grpc from '../../../../../index'
import { LoadStatsRequest as _envoy_service_load_stats_v2_LoadStatsRequest, LoadStatsRequest__Output as _envoy_service_load_stats_v2_LoadStatsRequest__Output } from '../../../../envoy/service/load_stats/v2/LoadStatsRequest';
import { LoadStatsResponse as _envoy_service_load_stats_v2_LoadStatsResponse, LoadStatsResponse__Output as _envoy_service_load_stats_v2_LoadStatsResponse__Output } from '../../../../envoy/service/load_stats/v2/LoadStatsResponse';

export interface LoadReportingServiceClient extends grpc.Client {
  /**
   * Advanced API to allow for multi-dimensional load balancing by remote
   * server. For receiving LB assignments, the steps are:
   * 1, The management server is configured with per cluster/zone/load metric
   * capacity configuration. The capacity configuration definition is
   * outside of the scope of this document.
   * 2. Envoy issues a standard {Stream,Fetch}Endpoints request for the clusters
   * to balance.
   * 
   * Independently, Envoy will initiate a StreamLoadStats bidi stream with a
   * management server:
   * 1. Once a connection establishes, the management server publishes a
   * LoadStatsResponse for all clusters it is interested in learning load
   * stats about.
   * 2. For each cluster, Envoy load balances incoming traffic to upstream hosts
   * based on per-zone weights and/or per-instance weights (if specified)
   * based on intra-zone LbPolicy. This information comes from the above
   * {Stream,Fetch}Endpoints.
   * 3. When upstream hosts reply, they optionally add header <define header
   * name> with ASCII representation of EndpointLoadMetricStats.
   * 4. Envoy aggregates load reports over the period of time given to it in
   * LoadStatsResponse.load_reporting_interval. This includes aggregation
   * stats Envoy maintains by itself (total_requests, rpc_errors etc.) as
   * well as load metrics from upstream hosts.
   * 5. When the timer of load_reporting_interval expires, Envoy sends new
   * LoadStatsRequest filled with load reports for each cluster.
   * 6. The management server uses the load reports from all reported Envoys
   * from around the world, computes global assignment and prepares traffic
   * assignment destined for each zone Envoys are located in. Goto 2.
   */
  StreamLoadStats(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_load_stats_v2_LoadStatsRequest, _envoy_service_load_stats_v2_LoadStatsResponse__Output>;
  StreamLoadStats(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_load_stats_v2_LoadStatsRequest, _envoy_service_load_stats_v2_LoadStatsResponse__Output>;
  /**
   * Advanced API to allow for multi-dimensional load balancing by remote
   * server. For receiving LB assignments, the steps are:
   * 1, The management server is configured with per cluster/zone/load metric
   * capacity configuration. The capacity configuration definition is
   * outside of the scope of this document.
   * 2. Envoy issues a standard {Stream,Fetch}Endpoints request for the clusters
   * to balance.
   * 
   * Independently, Envoy will initiate a StreamLoadStats bidi stream with a
   * management server:
   * 1. Once a connection establishes, the management server publishes a
   * LoadStatsResponse for all clusters it is interested in learning load
   * stats about.
   * 2. For each cluster, Envoy load balances incoming traffic to upstream hosts
   * based on per-zone weights and/or per-instance weights (if specified)
   * based on intra-zone LbPolicy. This information comes from the above
   * {Stream,Fetch}Endpoints.
   * 3. When upstream hosts reply, they optionally add header <define header
   * name> with ASCII representation of EndpointLoadMetricStats.
   * 4. Envoy aggregates load reports over the period of time given to it in
   * LoadStatsResponse.load_reporting_interval. This includes aggregation
   * stats Envoy maintains by itself (total_requests, rpc_errors etc.) as
   * well as load metrics from upstream hosts.
   * 5. When the timer of load_reporting_interval expires, Envoy sends new
   * LoadStatsRequest filled with load reports for each cluster.
   * 6. The management server uses the load reports from all reported Envoys
   * from around the world, computes global assignment and prepares traffic
   * assignment destined for each zone Envoys are located in. Goto 2.
   */
  streamLoadStats(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_load_stats_v2_LoadStatsRequest, _envoy_service_load_stats_v2_LoadStatsResponse__Output>;
  streamLoadStats(options?: grpc.CallOptions): grpc.ClientDuplexStream<_envoy_service_load_stats_v2_LoadStatsRequest, _envoy_service_load_stats_v2_LoadStatsResponse__Output>;
  
}

export interface LoadReportingServiceHandlers {
  /**
   * Advanced API to allow for multi-dimensional load balancing by remote
   * server. For receiving LB assignments, the steps are:
   * 1, The management server is configured with per cluster/zone/load metric
   * capacity configuration. The capacity configuration definition is
   * outside of the scope of this document.
   * 2. Envoy issues a standard {Stream,Fetch}Endpoints request for the clusters
   * to balance.
   * 
   * Independently, Envoy will initiate a StreamLoadStats bidi stream with a
   * management server:
   * 1. Once a connection establishes, the management server publishes a
   * LoadStatsResponse for all clusters it is interested in learning load
   * stats about.
   * 2. For each cluster, Envoy load balances incoming traffic to upstream hosts
   * based on per-zone weights and/or per-instance weights (if specified)
   * based on intra-zone LbPolicy. This information comes from the above
   * {Stream,Fetch}Endpoints.
   * 3. When upstream hosts reply, they optionally add header <define header
   * name> with ASCII representation of EndpointLoadMetricStats.
   * 4. Envoy aggregates load reports over the period of time given to it in
   * LoadStatsResponse.load_reporting_interval. This includes aggregation
   * stats Envoy maintains by itself (total_requests, rpc_errors etc.) as
   * well as load metrics from upstream hosts.
   * 5. When the timer of load_reporting_interval expires, Envoy sends new
   * LoadStatsRequest filled with load reports for each cluster.
   * 6. The management server uses the load reports from all reported Envoys
   * from around the world, computes global assignment and prepares traffic
   * assignment destined for each zone Envoys are located in. Goto 2.
   */
  StreamLoadStats(call: grpc.ServerDuplexStream<_envoy_service_load_stats_v2_LoadStatsRequest, _envoy_service_load_stats_v2_LoadStatsResponse__Output>): void;
  
}
