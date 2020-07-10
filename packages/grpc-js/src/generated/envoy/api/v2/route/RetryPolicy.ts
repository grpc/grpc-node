// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { Long } from '@grpc/proto-loader';

export interface _envoy_api_v2_route_RetryPolicy_RetryBackOff {
  'base_interval'?: (_google_protobuf_Duration);
  'max_interval'?: (_google_protobuf_Duration);
}

export interface _envoy_api_v2_route_RetryPolicy_RetryBackOff__Output {
  'base_interval': (_google_protobuf_Duration__Output);
  'max_interval': (_google_protobuf_Duration__Output);
}

export interface _envoy_api_v2_route_RetryPolicy_RetryHostPredicate {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface _envoy_api_v2_route_RetryPolicy_RetryHostPredicate__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}

export interface _envoy_api_v2_route_RetryPolicy_RetryPriority {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'config_type'?: "config"|"typed_config";
}

export interface _envoy_api_v2_route_RetryPolicy_RetryPriority__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'config_type': "config"|"typed_config";
}

export interface RetryPolicy {
  'retry_on'?: (string);
  'num_retries'?: (_google_protobuf_UInt32Value);
  'per_try_timeout'?: (_google_protobuf_Duration);
  'retry_priority'?: (_envoy_api_v2_route_RetryPolicy_RetryPriority);
  'retry_host_predicate'?: (_envoy_api_v2_route_RetryPolicy_RetryHostPredicate)[];
  'host_selection_retry_max_attempts'?: (number | string | Long);
  'retriable_status_codes'?: (number)[];
  'retry_back_off'?: (_envoy_api_v2_route_RetryPolicy_RetryBackOff);
  'retriable_headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
  'retriable_request_headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
}

export interface RetryPolicy__Output {
  'retry_on': (string);
  'num_retries': (_google_protobuf_UInt32Value__Output);
  'per_try_timeout': (_google_protobuf_Duration__Output);
  'retry_priority': (_envoy_api_v2_route_RetryPolicy_RetryPriority__Output);
  'retry_host_predicate': (_envoy_api_v2_route_RetryPolicy_RetryHostPredicate__Output)[];
  'host_selection_retry_max_attempts': (string);
  'retriable_status_codes': (number)[];
  'retry_back_off': (_envoy_api_v2_route_RetryPolicy_RetryBackOff__Output);
  'retriable_headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
  'retriable_request_headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
}
