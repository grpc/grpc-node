// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { HttpUri as _envoy_api_v2_core_HttpUri, HttpUri__Output as _envoy_api_v2_core_HttpUri__Output } from '../../../../envoy/api/v2/core/HttpUri';
import { RetryPolicy as _envoy_api_v2_core_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_core_RetryPolicy__Output } from '../../../../envoy/api/v2/core/RetryPolicy';

/**
 * The message specifies how to fetch data from remote and how to verify it.
 */
export interface RemoteDataSource {
  /**
   * The HTTP URI to fetch the remote data.
   */
  'http_uri'?: (_envoy_api_v2_core_HttpUri);
  /**
   * SHA256 string for verifying data.
   */
  'sha256'?: (string);
  /**
   * Retry policy for fetching remote data.
   */
  'retry_policy'?: (_envoy_api_v2_core_RetryPolicy);
}

/**
 * The message specifies how to fetch data from remote and how to verify it.
 */
export interface RemoteDataSource__Output {
  /**
   * The HTTP URI to fetch the remote data.
   */
  'http_uri'?: (_envoy_api_v2_core_HttpUri__Output);
  /**
   * SHA256 string for verifying data.
   */
  'sha256': (string);
  /**
   * Retry policy for fetching remote data.
   */
  'retry_policy'?: (_envoy_api_v2_core_RetryPolicy__Output);
}
