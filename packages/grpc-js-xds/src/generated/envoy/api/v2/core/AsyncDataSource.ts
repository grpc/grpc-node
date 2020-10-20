// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { RemoteDataSource as _envoy_api_v2_core_RemoteDataSource, RemoteDataSource__Output as _envoy_api_v2_core_RemoteDataSource__Output } from '../../../../envoy/api/v2/core/RemoteDataSource';

/**
 * Async data source which support async data fetch.
 */
export interface AsyncDataSource {
  /**
   * Local async data source.
   */
  'local'?: (_envoy_api_v2_core_DataSource);
  /**
   * Remote async data source.
   */
  'remote'?: (_envoy_api_v2_core_RemoteDataSource);
  'specifier'?: "local"|"remote";
}

/**
 * Async data source which support async data fetch.
 */
export interface AsyncDataSource__Output {
  /**
   * Local async data source.
   */
  'local'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * Remote async data source.
   */
  'remote'?: (_envoy_api_v2_core_RemoteDataSource__Output);
  'specifier': "local"|"remote";
}
