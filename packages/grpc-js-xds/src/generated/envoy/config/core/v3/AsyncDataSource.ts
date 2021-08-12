// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../envoy/config/core/v3/DataSource';
import type { RemoteDataSource as _envoy_config_core_v3_RemoteDataSource, RemoteDataSource__Output as _envoy_config_core_v3_RemoteDataSource__Output } from '../../../../envoy/config/core/v3/RemoteDataSource';

/**
 * Async data source which support async data fetch.
 */
export interface AsyncDataSource {
  /**
   * Local async data source.
   */
  'local'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * Remote async data source.
   */
  'remote'?: (_envoy_config_core_v3_RemoteDataSource | null);
  'specifier'?: "local"|"remote";
}

/**
 * Async data source which support async data fetch.
 */
export interface AsyncDataSource__Output {
  /**
   * Local async data source.
   */
  'local'?: (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * Remote async data source.
   */
  'remote'?: (_envoy_config_core_v3_RemoteDataSource__Output | null);
  'specifier': "local"|"remote";
}
