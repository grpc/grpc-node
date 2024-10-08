// Original file: deps/envoy-api/envoy/config/endpoint/v3/load_report.proto

import type { Locality as _envoy_config_core_v3_Locality, Locality__Output as _envoy_config_core_v3_Locality__Output } from '../../../../envoy/config/core/v3/Locality';
import type { EndpointLoadMetricStats as _envoy_config_endpoint_v3_EndpointLoadMetricStats, EndpointLoadMetricStats__Output as _envoy_config_endpoint_v3_EndpointLoadMetricStats__Output } from '../../../../envoy/config/endpoint/v3/EndpointLoadMetricStats';
import type { UpstreamEndpointStats as _envoy_config_endpoint_v3_UpstreamEndpointStats, UpstreamEndpointStats__Output as _envoy_config_endpoint_v3_UpstreamEndpointStats__Output } from '../../../../envoy/config/endpoint/v3/UpstreamEndpointStats';
import type { UnnamedEndpointLoadMetricStats as _envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats, UnnamedEndpointLoadMetricStats__Output as _envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats__Output } from '../../../../envoy/config/endpoint/v3/UnnamedEndpointLoadMetricStats';
import type { Long } from '@grpc/proto-loader';

/**
 * These are stats Envoy reports to the management server at a frequency defined by
 * :ref:`LoadStatsResponse.load_reporting_interval<envoy_v3_api_field_service.load_stats.v3.LoadStatsResponse.load_reporting_interval>`.
 * Stats per upstream region/zone and optionally per subzone.
 * [#next-free-field: 15]
 */
export interface UpstreamLocalityStats {
  /**
   * Name of zone, region and optionally endpoint group these metrics were
   * collected from. Zone and region names could be empty if unknown.
   */
  'locality'?: (_envoy_config_core_v3_Locality | null);
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
   * Named stats for multi-dimensional load balancing.
   * These typically come from endpoint metrics reported via ORCA.
   */
  'load_metric_stats'?: (_envoy_config_endpoint_v3_EndpointLoadMetricStats)[];
  /**
   * [#not-implemented-hide:] The priority of the endpoint group these metrics
   * were collected from.
   */
  'priority'?: (number);
  /**
   * Endpoint granularity stats information for this locality. This information
   * is populated if the Server requests it by setting
   * :ref:`LoadStatsResponse.report_endpoint_granularity<envoy_v3_api_field_service.load_stats.v3.LoadStatsResponse.report_endpoint_granularity>`.
   */
  'upstream_endpoint_stats'?: (_envoy_config_endpoint_v3_UpstreamEndpointStats)[];
  /**
   * The total number of requests that were issued by this Envoy since
   * the last report. This information is aggregated over all the
   * upstream endpoints in the locality.
   */
  'total_issued_requests'?: (number | string | Long);
  /**
   * The total number of connections in an established state at the time of the
   * report. This field is aggregated over all the upstream endpoints in the
   * locality.
   * In Envoy, this information may be based on ``upstream_cx_active metric``.
   * [#not-implemented-hide:]
   */
  'total_active_connections'?: (number | string | Long);
  /**
   * The total number of connections opened since the last report.
   * This field is aggregated over all the upstream endpoints in the locality.
   * In Envoy, this information may be based on ``upstream_cx_total`` metric
   * compared to itself between start and end of an interval, i.e.
   * ``upstream_cx_total``(now) - ``upstream_cx_total``(now -
   * load_report_interval).
   * [#not-implemented-hide:]
   */
  'total_new_connections'?: (number | string | Long);
  /**
   * The total number of connection failures since the last report.
   * This field is aggregated over all the upstream endpoints in the locality.
   * In Envoy, this information may be based on ``upstream_cx_connect_fail``
   * metric compared to itself between start and end of an interval, i.e.
   * ``upstream_cx_connect_fail``(now) - ``upstream_cx_connect_fail``(now -
   * load_report_interval).
   * [#not-implemented-hide:]
   */
  'total_fail_connections'?: (number | string | Long);
  /**
   * CPU utilization stats for multi-dimensional load balancing.
   * This typically comes from endpoint metrics reported via ORCA.
   */
  'cpu_utilization'?: (_envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats | null);
  /**
   * Memory utilization for multi-dimensional load balancing.
   * This typically comes from endpoint metrics reported via ORCA.
   */
  'mem_utilization'?: (_envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats | null);
  /**
   * Blended application-defined utilization for multi-dimensional load balancing.
   * This typically comes from endpoint metrics reported via ORCA.
   */
  'application_utilization'?: (_envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats | null);
}

/**
 * These are stats Envoy reports to the management server at a frequency defined by
 * :ref:`LoadStatsResponse.load_reporting_interval<envoy_v3_api_field_service.load_stats.v3.LoadStatsResponse.load_reporting_interval>`.
 * Stats per upstream region/zone and optionally per subzone.
 * [#next-free-field: 15]
 */
export interface UpstreamLocalityStats__Output {
  /**
   * Name of zone, region and optionally endpoint group these metrics were
   * collected from. Zone and region names could be empty if unknown.
   */
  'locality': (_envoy_config_core_v3_Locality__Output | null);
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
   * Named stats for multi-dimensional load balancing.
   * These typically come from endpoint metrics reported via ORCA.
   */
  'load_metric_stats': (_envoy_config_endpoint_v3_EndpointLoadMetricStats__Output)[];
  /**
   * [#not-implemented-hide:] The priority of the endpoint group these metrics
   * were collected from.
   */
  'priority': (number);
  /**
   * Endpoint granularity stats information for this locality. This information
   * is populated if the Server requests it by setting
   * :ref:`LoadStatsResponse.report_endpoint_granularity<envoy_v3_api_field_service.load_stats.v3.LoadStatsResponse.report_endpoint_granularity>`.
   */
  'upstream_endpoint_stats': (_envoy_config_endpoint_v3_UpstreamEndpointStats__Output)[];
  /**
   * The total number of requests that were issued by this Envoy since
   * the last report. This information is aggregated over all the
   * upstream endpoints in the locality.
   */
  'total_issued_requests': (string);
  /**
   * The total number of connections in an established state at the time of the
   * report. This field is aggregated over all the upstream endpoints in the
   * locality.
   * In Envoy, this information may be based on ``upstream_cx_active metric``.
   * [#not-implemented-hide:]
   */
  'total_active_connections': (string);
  /**
   * The total number of connections opened since the last report.
   * This field is aggregated over all the upstream endpoints in the locality.
   * In Envoy, this information may be based on ``upstream_cx_total`` metric
   * compared to itself between start and end of an interval, i.e.
   * ``upstream_cx_total``(now) - ``upstream_cx_total``(now -
   * load_report_interval).
   * [#not-implemented-hide:]
   */
  'total_new_connections': (string);
  /**
   * The total number of connection failures since the last report.
   * This field is aggregated over all the upstream endpoints in the locality.
   * In Envoy, this information may be based on ``upstream_cx_connect_fail``
   * metric compared to itself between start and end of an interval, i.e.
   * ``upstream_cx_connect_fail``(now) - ``upstream_cx_connect_fail``(now -
   * load_report_interval).
   * [#not-implemented-hide:]
   */
  'total_fail_connections': (string);
  /**
   * CPU utilization stats for multi-dimensional load balancing.
   * This typically comes from endpoint metrics reported via ORCA.
   */
  'cpu_utilization': (_envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats__Output | null);
  /**
   * Memory utilization for multi-dimensional load balancing.
   * This typically comes from endpoint metrics reported via ORCA.
   */
  'mem_utilization': (_envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats__Output | null);
  /**
   * Blended application-defined utilization for multi-dimensional load balancing.
   * This typically comes from endpoint metrics reported via ORCA.
   */
  'application_utilization': (_envoy_config_endpoint_v3_UnnamedEndpointLoadMetricStats__Output | null);
}
