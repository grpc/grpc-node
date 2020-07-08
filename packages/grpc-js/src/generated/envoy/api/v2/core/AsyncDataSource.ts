// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { RemoteDataSource as _envoy_api_v2_core_RemoteDataSource, RemoteDataSource__Output as _envoy_api_v2_core_RemoteDataSource__Output } from '../../../../envoy/api/v2/core/RemoteDataSource';

export interface AsyncDataSource {
  'local'?: (_envoy_api_v2_core_DataSource);
  'remote'?: (_envoy_api_v2_core_RemoteDataSource);
  'specifier'?: "local"|"remote";
}

export interface AsyncDataSource__Output {
  'local'?: (_envoy_api_v2_core_DataSource__Output);
  'remote'?: (_envoy_api_v2_core_RemoteDataSource__Output);
  'specifier': "local"|"remote";
}
