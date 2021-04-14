// Original file: deps/envoy-api/envoy/config/endpoint/v3/load_report.proto

import type { Long } from '@grpc/proto-loader';

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
  'total_metric_value': (number);
}
