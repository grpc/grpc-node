// Original file: deps/envoy-api/envoy/api/v2/endpoint/load_report.proto

import { Long } from '@grpc/proto-loader';

/**
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 */
export interface EndpointLoadMetricStats {
  /**
   * Name of the metric; may be empty.
   */
  'metric_name'?: (string);
  /**
   * Number of calls that finished and included this metric.
   */
  'num_requests_finished_with_metric'?: (number | string | Long);
  /**
   * Sum of metric values across all calls that finished with this metric for
   * load_reporting_interval.
   */
  'total_metric_value'?: (number | string);
}

/**
 * [#not-implemented-hide:] Not configuration. TBD how to doc proto APIs.
 */
export interface EndpointLoadMetricStats__Output {
  /**
   * Name of the metric; may be empty.
   */
  'metric_name': (string);
  /**
   * Number of calls that finished and included this metric.
   */
  'num_requests_finished_with_metric': (string);
  /**
   * Sum of metric values across all calls that finished with this metric for
   * load_reporting_interval.
   */
  'total_metric_value': (number | string);
}
