// Original file: deps/envoy-api/envoy/api/v2/cluster/outlier_detection.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

export interface OutlierDetection {
  'consecutive_5xx'?: (_google_protobuf_UInt32Value);
  'interval'?: (_google_protobuf_Duration);
  'base_ejection_time'?: (_google_protobuf_Duration);
  'max_ejection_percent'?: (_google_protobuf_UInt32Value);
  'enforcing_consecutive_5xx'?: (_google_protobuf_UInt32Value);
  'enforcing_success_rate'?: (_google_protobuf_UInt32Value);
  'success_rate_minimum_hosts'?: (_google_protobuf_UInt32Value);
  'success_rate_request_volume'?: (_google_protobuf_UInt32Value);
  'success_rate_stdev_factor'?: (_google_protobuf_UInt32Value);
  'consecutive_gateway_failure'?: (_google_protobuf_UInt32Value);
  'enforcing_consecutive_gateway_failure'?: (_google_protobuf_UInt32Value);
  'split_external_local_origin_errors'?: (boolean);
  'consecutive_local_origin_failure'?: (_google_protobuf_UInt32Value);
  'enforcing_consecutive_local_origin_failure'?: (_google_protobuf_UInt32Value);
  'enforcing_local_origin_success_rate'?: (_google_protobuf_UInt32Value);
  'failure_percentage_threshold'?: (_google_protobuf_UInt32Value);
  'enforcing_failure_percentage'?: (_google_protobuf_UInt32Value);
  'enforcing_failure_percentage_local_origin'?: (_google_protobuf_UInt32Value);
  'failure_percentage_minimum_hosts'?: (_google_protobuf_UInt32Value);
  'failure_percentage_request_volume'?: (_google_protobuf_UInt32Value);
}

export interface OutlierDetection__Output {
  'consecutive_5xx': (_google_protobuf_UInt32Value__Output);
  'interval': (_google_protobuf_Duration__Output);
  'base_ejection_time': (_google_protobuf_Duration__Output);
  'max_ejection_percent': (_google_protobuf_UInt32Value__Output);
  'enforcing_consecutive_5xx': (_google_protobuf_UInt32Value__Output);
  'enforcing_success_rate': (_google_protobuf_UInt32Value__Output);
  'success_rate_minimum_hosts': (_google_protobuf_UInt32Value__Output);
  'success_rate_request_volume': (_google_protobuf_UInt32Value__Output);
  'success_rate_stdev_factor': (_google_protobuf_UInt32Value__Output);
  'consecutive_gateway_failure': (_google_protobuf_UInt32Value__Output);
  'enforcing_consecutive_gateway_failure': (_google_protobuf_UInt32Value__Output);
  'split_external_local_origin_errors': (boolean);
  'consecutive_local_origin_failure': (_google_protobuf_UInt32Value__Output);
  'enforcing_consecutive_local_origin_failure': (_google_protobuf_UInt32Value__Output);
  'enforcing_local_origin_success_rate': (_google_protobuf_UInt32Value__Output);
  'failure_percentage_threshold': (_google_protobuf_UInt32Value__Output);
  'enforcing_failure_percentage': (_google_protobuf_UInt32Value__Output);
  'enforcing_failure_percentage_local_origin': (_google_protobuf_UInt32Value__Output);
  'failure_percentage_minimum_hosts': (_google_protobuf_UInt32Value__Output);
  'failure_percentage_request_volume': (_google_protobuf_UInt32Value__Output);
}
