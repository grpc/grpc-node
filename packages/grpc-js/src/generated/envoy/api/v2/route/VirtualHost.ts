// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { Route as _envoy_api_v2_route_Route, Route__Output as _envoy_api_v2_route_Route__Output } from '../../../../envoy/api/v2/route/Route';
import { VirtualCluster as _envoy_api_v2_route_VirtualCluster, VirtualCluster__Output as _envoy_api_v2_route_VirtualCluster__Output } from '../../../../envoy/api/v2/route/VirtualCluster';
import { RateLimit as _envoy_api_v2_route_RateLimit, RateLimit__Output as _envoy_api_v2_route_RateLimit__Output } from '../../../../envoy/api/v2/route/RateLimit';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { CorsPolicy as _envoy_api_v2_route_CorsPolicy, CorsPolicy__Output as _envoy_api_v2_route_CorsPolicy__Output } from '../../../../envoy/api/v2/route/CorsPolicy';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { RetryPolicy as _envoy_api_v2_route_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_route_RetryPolicy__Output } from '../../../../envoy/api/v2/route/RetryPolicy';
import { HedgePolicy as _envoy_api_v2_route_HedgePolicy, HedgePolicy__Output as _envoy_api_v2_route_HedgePolicy__Output } from '../../../../envoy/api/v2/route/HedgePolicy';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

export enum _envoy_api_v2_route_VirtualHost_TlsRequirementType {
  NONE = 0,
  EXTERNAL_ONLY = 1,
  ALL = 2,
}

export interface VirtualHost {
  'name'?: (string);
  'domains'?: (string)[];
  'routes'?: (_envoy_api_v2_route_Route)[];
  'require_tls'?: (_envoy_api_v2_route_VirtualHost_TlsRequirementType | keyof typeof _envoy_api_v2_route_VirtualHost_TlsRequirementType);
  'virtual_clusters'?: (_envoy_api_v2_route_VirtualCluster)[];
  'rate_limits'?: (_envoy_api_v2_route_RateLimit)[];
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'cors'?: (_envoy_api_v2_route_CorsPolicy);
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'response_headers_to_remove'?: (string)[];
  'per_filter_config'?: (_google_protobuf_Struct);
  'request_headers_to_remove'?: (string)[];
  'include_request_attempt_count'?: (boolean);
  'typed_per_filter_config'?: (_google_protobuf_Any);
  'retry_policy'?: (_envoy_api_v2_route_RetryPolicy);
  'hedge_policy'?: (_envoy_api_v2_route_HedgePolicy);
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  'include_attempt_count_in_response'?: (boolean);
  'retry_policy_typed_config'?: (_google_protobuf_Any);
}

export interface VirtualHost__Output {
  'name': (string);
  'domains': (string)[];
  'routes': (_envoy_api_v2_route_Route__Output)[];
  'require_tls': (keyof typeof _envoy_api_v2_route_VirtualHost_TlsRequirementType);
  'virtual_clusters': (_envoy_api_v2_route_VirtualCluster__Output)[];
  'rate_limits': (_envoy_api_v2_route_RateLimit__Output)[];
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'cors': (_envoy_api_v2_route_CorsPolicy__Output);
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'response_headers_to_remove': (string)[];
  'per_filter_config': (_google_protobuf_Struct__Output);
  'request_headers_to_remove': (string)[];
  'include_request_attempt_count': (boolean);
  'typed_per_filter_config': (_google_protobuf_Any__Output);
  'retry_policy': (_envoy_api_v2_route_RetryPolicy__Output);
  'hedge_policy': (_envoy_api_v2_route_HedgePolicy__Output);
  'per_request_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output);
  'include_attempt_count_in_response': (boolean);
  'retry_policy_typed_config': (_google_protobuf_Any__Output);
}
