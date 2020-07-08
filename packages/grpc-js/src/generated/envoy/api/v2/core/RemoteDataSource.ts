// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { HttpUri as _envoy_api_v2_core_HttpUri, HttpUri__Output as _envoy_api_v2_core_HttpUri__Output } from '../../../../envoy/api/v2/core/HttpUri';
import { RetryPolicy as _envoy_api_v2_core_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_core_RetryPolicy__Output } from '../../../../envoy/api/v2/core/RetryPolicy';

export interface RemoteDataSource {
  'http_uri'?: (_envoy_api_v2_core_HttpUri);
  'sha256'?: (string);
  'retry_policy'?: (_envoy_api_v2_core_RetryPolicy);
}

export interface RemoteDataSource__Output {
  'http_uri': (_envoy_api_v2_core_HttpUri__Output);
  'sha256': (string);
  'retry_policy': (_envoy_api_v2_core_RetryPolicy__Output);
}
