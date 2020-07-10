// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface _envoy_api_v2_route_WeightedCluster_ClusterWeight {
  'name'?: (string);
  'weight'?: (_google_protobuf_UInt32Value);
  'metadata_match'?: (_envoy_api_v2_core_Metadata);
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'request_headers_to_remove'?: (string)[];
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'response_headers_to_remove'?: (string)[];
  'per_filter_config'?: (_google_protobuf_Struct);
  'typed_per_filter_config'?: (_google_protobuf_Any);
}

export interface _envoy_api_v2_route_WeightedCluster_ClusterWeight__Output {
  'name': (string);
  'weight': (_google_protobuf_UInt32Value__Output);
  'metadata_match': (_envoy_api_v2_core_Metadata__Output);
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'request_headers_to_remove': (string)[];
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'response_headers_to_remove': (string)[];
  'per_filter_config': (_google_protobuf_Struct__Output);
  'typed_per_filter_config': (_google_protobuf_Any__Output);
}

export interface WeightedCluster {
  'clusters'?: (_envoy_api_v2_route_WeightedCluster_ClusterWeight)[];
  'runtime_key_prefix'?: (string);
  'total_weight'?: (_google_protobuf_UInt32Value);
}

export interface WeightedCluster__Output {
  'clusters': (_envoy_api_v2_route_WeightedCluster_ClusterWeight__Output)[];
  'runtime_key_prefix': (string);
  'total_weight': (_google_protobuf_UInt32Value__Output);
}
