// Original file: deps/envoy-api/envoy/api/v2/endpoint/load_report.proto

import { Locality as _envoy_api_v2_core_Locality, Locality__Output as _envoy_api_v2_core_Locality__Output } from '../../../../envoy/api/v2/core/Locality';
import { EndpointLoadMetricStats as _envoy_api_v2_endpoint_EndpointLoadMetricStats, EndpointLoadMetricStats__Output as _envoy_api_v2_endpoint_EndpointLoadMetricStats__Output } from '../../../../envoy/api/v2/endpoint/EndpointLoadMetricStats';
import { UpstreamEndpointStats as _envoy_api_v2_endpoint_UpstreamEndpointStats, UpstreamEndpointStats__Output as _envoy_api_v2_endpoint_UpstreamEndpointStats__Output } from '../../../../envoy/api/v2/endpoint/UpstreamEndpointStats';
import { Long } from '@grpc/proto-loader';

/**
 * These are stats Envoy reports to GLB every so often. Report frequency is
 * defined by
 * :ref:`LoadStatsResponse.load_reporting_interval<envoy_api_field_service.load_stats.v2.LoadStatsResponse.load_reporting_interval>`.
 * Stats per upstream region/zone and optionally per subzone.
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 * [#next-free-field: 9]
 */
export interface UpstreamLocalityStats {
  /**
   * Name of zone, region and optionally endpoint group these metrics were
   * collected from. Zone and region names could be empty if unknown.
   */
  'locality'?: (_envoy_api_v2_core_Locality);
  /**
   * The total number of requests successfully completed by the endpoints in the
   * locality.
   */
  'total_successful_requests'?: (number | string | Long);
  /**
   * The total number of unfinished requests
   */
  'total_requests_in_progress'?: (number | string | Long);
  /**
   * The total number of requests that failed due to errors at the endpoint,
   * aggregated over all endpoints in the locality.
   */
  'total_error_requests'?: (number | string | Long);
  /**
   * Stats for multi-dimensional load balancing.
   */
  'load_metric_stats'?: (_envoy_api_v2_endpoint_EndpointLoadMetricStats)[];
  /**
   * [#not-implemented-hide:] The priority of the endpoint group these metrics
   * were collected from.
   */
  'priority'?: (number);
  /**
   * Endpoint granularity stats information for this locality. This information
   * is populated if the Server requests it by setting
   * :ref:`LoadStatsResponse.report_endpoint_granularity<envoy_api_field_service.load_stats.v2.LoadStatsResponse.report_endpoint_granularity>`.
   */
  'upstream_endpoint_stats'?: (_envoy_api_v2_endpoint_UpstreamEndpointStats)[];
  /**
   * The total number of requests that were issued by this Envoy since
   * the last report. This information is aggregated over all the
   * upstream endpoints in the locality.
   */
  'total_issued_requests'?: (number | string | Long);
}

/**
 * These are stats Envoy reports to GLB every so often. Report frequency is
 * defined by
 * :ref:`LoadStatsResponse.load_reporting_interval<envoy_api_field_service.load_stats.v2.LoadStatsResponse.load_reporting_interval>`.
 * Stats per upstream region/zone and optionally per subzone.
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 * [#next-free-field: 9]
 */
export interface UpstreamLocalityStats__Output {
  /**
   * Name of zone, region and optionally endpoint group these metrics were
   * collected from. Zone and region names could be empty if unknown.
   */
  'locality'?: (_envoy_api_v2_core_Locality__Output);
  /**
   * The total number of requests successfully completed by the endpoints in the
   * locality.
   */
  'total_successful_requests': (string);
  /**
   * The total number of unfinished requests
   */
  'total_requests_in_progress': (string);
  /**
   * The total number of requests that failed due to errors at the endpoint,
   * aggregated over all endpoints in the locality.
   */
  'total_error_requests': (string);
  /**
   * Stats for multi-dimensional load balancing.
   */
  'load_metric_stats': (_envoy_api_v2_endpoint_EndpointLoadMetricStats__Output)[];
  /**
   * [#not-implemented-hide:] The priority of the endpoint group these metrics
   * were collected from.
   */
  'priority': (number);
  /**
   * Endpoint granularity stats information for this locality. This information
   * is populated if the Server requests it by setting
   * :ref:`LoadStatsResponse.report_endpoint_granularity<envoy_api_field_service.load_stats.v2.LoadStatsResponse.report_endpoint_granularity>`.
   */
  'upstream_endpoint_stats': (_envoy_api_v2_endpoint_UpstreamEndpointStats__Output)[];
  /**
   * The total number of requests that were issued by this Envoy since
   * the last report. This information is aggregated over all the
   * upstream endpoints in the locality.
   */
  'total_issued_requests': (string);
}
