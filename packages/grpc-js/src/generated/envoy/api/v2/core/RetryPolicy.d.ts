// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { BackoffStrategy as _envoy_api_v2_core_BackoffStrategy, BackoffStrategy__Output as _envoy_api_v2_core_BackoffStrategy__Output } from '../../../../envoy/api/v2/core/BackoffStrategy';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface RetryPolicy {
  'retry_back_off'?: (_envoy_api_v2_core_BackoffStrategy);
  'num_retries'?: (_google_protobuf_UInt32Value);
}

export interface RetryPolicy__Output {
  'retry_back_off': (_envoy_api_v2_core_BackoffStrategy__Output);
  'num_retries': (_google_protobuf_UInt32Value__Output);
}
