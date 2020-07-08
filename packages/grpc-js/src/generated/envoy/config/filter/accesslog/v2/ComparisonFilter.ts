// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { RuntimeUInt32 as _envoy_api_v2_core_RuntimeUInt32, RuntimeUInt32__Output as _envoy_api_v2_core_RuntimeUInt32__Output } from '../../../../../envoy/api/v2/core/RuntimeUInt32';

// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

export enum _envoy_config_filter_accesslog_v2_ComparisonFilter_Op {
  EQ = 0,
  GE = 1,
  LE = 2,
}

export interface ComparisonFilter {
  'op'?: (_envoy_config_filter_accesslog_v2_ComparisonFilter_Op | keyof typeof _envoy_config_filter_accesslog_v2_ComparisonFilter_Op);
  'value'?: (_envoy_api_v2_core_RuntimeUInt32);
}

export interface ComparisonFilter__Output {
  'op': (keyof typeof _envoy_config_filter_accesslog_v2_ComparisonFilter_Op);
  'value': (_envoy_api_v2_core_RuntimeUInt32__Output);
}
