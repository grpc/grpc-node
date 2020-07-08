// Original file: deps/envoy-api/envoy/api/v2/core/config_source.proto

import { ApiConfigSource as _envoy_api_v2_core_ApiConfigSource, ApiConfigSource__Output as _envoy_api_v2_core_ApiConfigSource__Output } from '../../../../envoy/api/v2/core/ApiConfigSource';
import { AggregatedConfigSource as _envoy_api_v2_core_AggregatedConfigSource, AggregatedConfigSource__Output as _envoy_api_v2_core_AggregatedConfigSource__Output } from '../../../../envoy/api/v2/core/AggregatedConfigSource';
import { SelfConfigSource as _envoy_api_v2_core_SelfConfigSource, SelfConfigSource__Output as _envoy_api_v2_core_SelfConfigSource__Output } from '../../../../envoy/api/v2/core/SelfConfigSource';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { ApiVersion as _envoy_api_v2_core_ApiVersion } from '../../../../envoy/api/v2/core/ApiVersion';

export interface ConfigSource {
  'path'?: (string);
  'api_config_source'?: (_envoy_api_v2_core_ApiConfigSource);
  'ads'?: (_envoy_api_v2_core_AggregatedConfigSource);
  'self'?: (_envoy_api_v2_core_SelfConfigSource);
  'initial_fetch_timeout'?: (_google_protobuf_Duration);
  'resource_api_version'?: (_envoy_api_v2_core_ApiVersion | keyof typeof _envoy_api_v2_core_ApiVersion);
  'config_source_specifier'?: "path"|"api_config_source"|"ads"|"self";
}

export interface ConfigSource__Output {
  'path'?: (string);
  'api_config_source'?: (_envoy_api_v2_core_ApiConfigSource__Output);
  'ads'?: (_envoy_api_v2_core_AggregatedConfigSource__Output);
  'self'?: (_envoy_api_v2_core_SelfConfigSource__Output);
  'initial_fetch_timeout': (_google_protobuf_Duration__Output);
  'resource_api_version': (keyof typeof _envoy_api_v2_core_ApiVersion);
  'config_source_specifier': "path"|"api_config_source"|"ads"|"self";
}
