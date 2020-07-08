// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';

export interface DirectResponseAction {
  'status'?: (number);
  'body'?: (_envoy_api_v2_core_DataSource);
}

export interface DirectResponseAction__Output {
  'status': (number);
  'body': (_envoy_api_v2_core_DataSource__Output);
}
