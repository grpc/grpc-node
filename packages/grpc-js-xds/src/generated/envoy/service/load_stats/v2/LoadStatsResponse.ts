// Original file: deps/envoy-api/envoy/service/load_stats/v2/lrs.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * The management server sends envoy a LoadStatsResponse with all clusters it
 * is interested in learning load stats about.
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 */
export interface LoadStatsResponse {
  /**
   * Clusters to report stats for.
   * Not populated if *send_all_clusters* is true.
   */
  'clusters'?: (string)[];
  /**
   * The minimum interval of time to collect stats over. This is only a minimum for two reasons:
   * 1. There may be some delay from when the timer fires until stats sampling occurs.
   * 2. For clusters that were already feature in the previous *LoadStatsResponse*, any traffic
   * that is observed in between the corresponding previous *LoadStatsRequest* and this
   * *LoadStatsResponse* will also be accumulated and billed to the cluster. This avoids a period
   * of inobservability that might otherwise exists between the messages. New clusters are not
   * subject to this consideration.
   */
  'load_reporting_interval'?: (_google_protobuf_Duration);
  /**
   * Set to *true* if the management server supports endpoint granularity
   * report.
   */
  'report_endpoint_granularity'?: (boolean);
  /**
   * If true, the client should send all clusters it knows about.
   * Only clients that advertise the "envoy.lrs.supports_send_all_clusters" capability in their
   * :ref:`client_features<envoy_api_field_core.Node.client_features>` field will honor this field.
   */
  'send_all_clusters'?: (boolean);
}

/**
 * The management server sends envoy a LoadStatsResponse with all clusters it
 * is interested in learning load stats about.
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 */
export interface LoadStatsResponse__Output {
  /**
   * Clusters to report stats for.
   * Not populated if *send_all_clusters* is true.
   */
  'clusters': (string)[];
  /**
   * The minimum interval of time to collect stats over. This is only a minimum for two reasons:
   * 1. There may be some delay from when the timer fires until stats sampling occurs.
   * 2. For clusters that were already feature in the previous *LoadStatsResponse*, any traffic
   * that is observed in between the corresponding previous *LoadStatsRequest* and this
   * *LoadStatsResponse* will also be accumulated and billed to the cluster. This avoids a period
   * of inobservability that might otherwise exists between the messages. New clusters are not
   * subject to this consideration.
   */
  'load_reporting_interval'?: (_google_protobuf_Duration__Output);
  /**
   * Set to *true* if the management server supports endpoint granularity
   * report.
   */
  'report_endpoint_granularity': (boolean);
  /**
   * If true, the client should send all clusters it knows about.
   * Only clients that advertise the "envoy.lrs.supports_send_all_clusters" capability in their
   * :ref:`client_features<envoy_api_field_core.Node.client_features>` field will honor this field.
   */
  'send_all_clusters': (boolean);
}
