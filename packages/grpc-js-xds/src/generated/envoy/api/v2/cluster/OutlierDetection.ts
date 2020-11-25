// Original file: deps/envoy-api/envoy/api/v2/cluster/outlier_detection.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * See the :ref:`architecture overview <arch_overview_outlier_detection>` for
 * more information on outlier detection.
 * [#next-free-field: 21]
 */
export interface OutlierDetection {
  /**
   * The number of consecutive 5xx responses or local origin errors that are mapped
   * to 5xx error codes before a consecutive 5xx ejection
   * occurs. Defaults to 5.
   */
  'consecutive_5xx'?: (_google_protobuf_UInt32Value);
  /**
   * The time interval between ejection analysis sweeps. This can result in
   * both new ejections as well as hosts being returned to service. Defaults
   * to 10000ms or 10s.
   */
  'interval'?: (_google_protobuf_Duration);
  /**
   * The base time that a host is ejected for. The real time is equal to the
   * base time multiplied by the number of times the host has been ejected.
   * Defaults to 30000ms or 30s.
   */
  'base_ejection_time'?: (_google_protobuf_Duration);
  /**
   * The maximum % of an upstream cluster that can be ejected due to outlier
   * detection. Defaults to 10% but will eject at least one host regardless of the value.
   */
  'max_ejection_percent'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through consecutive 5xx. This setting can be used to disable
   * ejection or to ramp it up slowly. Defaults to 100.
   */
  'enforcing_consecutive_5xx'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through success rate statistics. This setting can be used to
   * disable ejection or to ramp it up slowly. Defaults to 100.
   */
  'enforcing_success_rate'?: (_google_protobuf_UInt32Value);
  /**
   * The number of hosts in a cluster that must have enough request volume to
   * detect success rate outliers. If the number of hosts is less than this
   * setting, outlier detection via success rate statistics is not performed
   * for any host in the cluster. Defaults to 5.
   */
  'success_rate_minimum_hosts'?: (_google_protobuf_UInt32Value);
  /**
   * The minimum number of total requests that must be collected in one
   * interval (as defined by the interval duration above) to include this host
   * in success rate based outlier detection. If the volume is lower than this
   * setting, outlier detection via success rate statistics is not performed
   * for that host. Defaults to 100.
   */
  'success_rate_request_volume'?: (_google_protobuf_UInt32Value);
  /**
   * This factor is used to determine the ejection threshold for success rate
   * outlier ejection. The ejection threshold is the difference between the
   * mean success rate, and the product of this factor and the standard
   * deviation of the mean success rate: mean - (stdev *
   * success_rate_stdev_factor). This factor is divided by a thousand to get a
   * double. That is, if the desired factor is 1.9, the runtime value should
   * be 1900. Defaults to 1900.
   */
  'success_rate_stdev_factor'?: (_google_protobuf_UInt32Value);
  /**
   * The number of consecutive gateway failures (502, 503, 504 status codes)
   * before a consecutive gateway failure ejection occurs. Defaults to 5.
   */
  'consecutive_gateway_failure'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through consecutive gateway failures. This setting can be
   * used to disable ejection or to ramp it up slowly. Defaults to 0.
   */
  'enforcing_consecutive_gateway_failure'?: (_google_protobuf_UInt32Value);
  /**
   * Determines whether to distinguish local origin failures from external errors. If set to true
   * the following configuration parameters are taken into account:
   * :ref:`consecutive_local_origin_failure<envoy_api_field_cluster.OutlierDetection.consecutive_local_origin_failure>`,
   * :ref:`enforcing_consecutive_local_origin_failure<envoy_api_field_cluster.OutlierDetection.enforcing_consecutive_local_origin_failure>`
   * and
   * :ref:`enforcing_local_origin_success_rate<envoy_api_field_cluster.OutlierDetection.enforcing_local_origin_success_rate>`.
   * Defaults to false.
   */
  'split_external_local_origin_errors'?: (boolean);
  /**
   * The number of consecutive locally originated failures before ejection
   * occurs. Defaults to 5. Parameter takes effect only when
   * :ref:`split_external_local_origin_errors<envoy_api_field_cluster.OutlierDetection.split_external_local_origin_errors>`
   * is set to true.
   */
  'consecutive_local_origin_failure'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through consecutive locally originated failures. This setting can be
   * used to disable ejection or to ramp it up slowly. Defaults to 100.
   * Parameter takes effect only when
   * :ref:`split_external_local_origin_errors<envoy_api_field_cluster.OutlierDetection.split_external_local_origin_errors>`
   * is set to true.
   */
  'enforcing_consecutive_local_origin_failure'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through success rate statistics for locally originated errors.
   * This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100.
   * Parameter takes effect only when
   * :ref:`split_external_local_origin_errors<envoy_api_field_cluster.OutlierDetection.split_external_local_origin_errors>`
   * is set to true.
   */
  'enforcing_local_origin_success_rate'?: (_google_protobuf_UInt32Value);
  /**
   * The failure percentage to use when determining failure percentage-based outlier detection. If
   * the failure percentage of a given host is greater than or equal to this value, it will be
   * ejected. Defaults to 85.
   */
  'failure_percentage_threshold'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status is detected through
   * failure percentage statistics. This setting can be used to disable ejection or to ramp it up
   * slowly. Defaults to 0.
   * 
   * [#next-major-version: setting this without setting failure_percentage_threshold should be
   * invalid in v4.]
   */
  'enforcing_failure_percentage'?: (_google_protobuf_UInt32Value);
  /**
   * The % chance that a host will be actually ejected when an outlier status is detected through
   * local-origin failure percentage statistics. This setting can be used to disable ejection or to
   * ramp it up slowly. Defaults to 0.
   */
  'enforcing_failure_percentage_local_origin'?: (_google_protobuf_UInt32Value);
  /**
   * The minimum number of hosts in a cluster in order to perform failure percentage-based ejection.
   * If the total number of hosts in the cluster is less than this value, failure percentage-based
   * ejection will not be performed. Defaults to 5.
   */
  'failure_percentage_minimum_hosts'?: (_google_protobuf_UInt32Value);
  /**
   * The minimum number of total requests that must be collected in one interval (as defined by the
   * interval duration above) to perform failure percentage-based ejection for this host. If the
   * volume is lower than this setting, failure percentage-based ejection will not be performed for
   * this host. Defaults to 50.
   */
  'failure_percentage_request_volume'?: (_google_protobuf_UInt32Value);
}

/**
 * See the :ref:`architecture overview <arch_overview_outlier_detection>` for
 * more information on outlier detection.
 * [#next-free-field: 21]
 */
export interface OutlierDetection__Output {
  /**
   * The number of consecutive 5xx responses or local origin errors that are mapped
   * to 5xx error codes before a consecutive 5xx ejection
   * occurs. Defaults to 5.
   */
  'consecutive_5xx'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The time interval between ejection analysis sweeps. This can result in
   * both new ejections as well as hosts being returned to service. Defaults
   * to 10000ms or 10s.
   */
  'interval'?: (_google_protobuf_Duration__Output);
  /**
   * The base time that a host is ejected for. The real time is equal to the
   * base time multiplied by the number of times the host has been ejected.
   * Defaults to 30000ms or 30s.
   */
  'base_ejection_time'?: (_google_protobuf_Duration__Output);
  /**
   * The maximum % of an upstream cluster that can be ejected due to outlier
   * detection. Defaults to 10% but will eject at least one host regardless of the value.
   */
  'max_ejection_percent'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through consecutive 5xx. This setting can be used to disable
   * ejection or to ramp it up slowly. Defaults to 100.
   */
  'enforcing_consecutive_5xx'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through success rate statistics. This setting can be used to
   * disable ejection or to ramp it up slowly. Defaults to 100.
   */
  'enforcing_success_rate'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The number of hosts in a cluster that must have enough request volume to
   * detect success rate outliers. If the number of hosts is less than this
   * setting, outlier detection via success rate statistics is not performed
   * for any host in the cluster. Defaults to 5.
   */
  'success_rate_minimum_hosts'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The minimum number of total requests that must be collected in one
   * interval (as defined by the interval duration above) to include this host
   * in success rate based outlier detection. If the volume is lower than this
   * setting, outlier detection via success rate statistics is not performed
   * for that host. Defaults to 100.
   */
  'success_rate_request_volume'?: (_google_protobuf_UInt32Value__Output);
  /**
   * This factor is used to determine the ejection threshold for success rate
   * outlier ejection. The ejection threshold is the difference between the
   * mean success rate, and the product of this factor and the standard
   * deviation of the mean success rate: mean - (stdev *
   * success_rate_stdev_factor). This factor is divided by a thousand to get a
   * double. That is, if the desired factor is 1.9, the runtime value should
   * be 1900. Defaults to 1900.
   */
  'success_rate_stdev_factor'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The number of consecutive gateway failures (502, 503, 504 status codes)
   * before a consecutive gateway failure ejection occurs. Defaults to 5.
   */
  'consecutive_gateway_failure'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through consecutive gateway failures. This setting can be
   * used to disable ejection or to ramp it up slowly. Defaults to 0.
   */
  'enforcing_consecutive_gateway_failure'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Determines whether to distinguish local origin failures from external errors. If set to true
   * the following configuration parameters are taken into account:
   * :ref:`consecutive_local_origin_failure<envoy_api_field_cluster.OutlierDetection.consecutive_local_origin_failure>`,
   * :ref:`enforcing_consecutive_local_origin_failure<envoy_api_field_cluster.OutlierDetection.enforcing_consecutive_local_origin_failure>`
   * and
   * :ref:`enforcing_local_origin_success_rate<envoy_api_field_cluster.OutlierDetection.enforcing_local_origin_success_rate>`.
   * Defaults to false.
   */
  'split_external_local_origin_errors': (boolean);
  /**
   * The number of consecutive locally originated failures before ejection
   * occurs. Defaults to 5. Parameter takes effect only when
   * :ref:`split_external_local_origin_errors<envoy_api_field_cluster.OutlierDetection.split_external_local_origin_errors>`
   * is set to true.
   */
  'consecutive_local_origin_failure'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through consecutive locally originated failures. This setting can be
   * used to disable ejection or to ramp it up slowly. Defaults to 100.
   * Parameter takes effect only when
   * :ref:`split_external_local_origin_errors<envoy_api_field_cluster.OutlierDetection.split_external_local_origin_errors>`
   * is set to true.
   */
  'enforcing_consecutive_local_origin_failure'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status
   * is detected through success rate statistics for locally originated errors.
   * This setting can be used to disable ejection or to ramp it up slowly. Defaults to 100.
   * Parameter takes effect only when
   * :ref:`split_external_local_origin_errors<envoy_api_field_cluster.OutlierDetection.split_external_local_origin_errors>`
   * is set to true.
   */
  'enforcing_local_origin_success_rate'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The failure percentage to use when determining failure percentage-based outlier detection. If
   * the failure percentage of a given host is greater than or equal to this value, it will be
   * ejected. Defaults to 85.
   */
  'failure_percentage_threshold'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status is detected through
   * failure percentage statistics. This setting can be used to disable ejection or to ramp it up
   * slowly. Defaults to 0.
   * 
   * [#next-major-version: setting this without setting failure_percentage_threshold should be
   * invalid in v4.]
   */
  'enforcing_failure_percentage'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The % chance that a host will be actually ejected when an outlier status is detected through
   * local-origin failure percentage statistics. This setting can be used to disable ejection or to
   * ramp it up slowly. Defaults to 0.
   */
  'enforcing_failure_percentage_local_origin'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The minimum number of hosts in a cluster in order to perform failure percentage-based ejection.
   * If the total number of hosts in the cluster is less than this value, failure percentage-based
   * ejection will not be performed. Defaults to 5.
   */
  'failure_percentage_minimum_hosts'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The minimum number of total requests that must be collected in one interval (as defined by the
   * interval duration above) to perform failure percentage-based ejection for this host. If the
   * volume is lower than this setting, failure percentage-based ejection will not be performed for
   * this host. Defaults to 50.
   */
  'failure_percentage_request_volume'?: (_google_protobuf_UInt32Value__Output);
}
