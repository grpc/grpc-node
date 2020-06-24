// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { RouteMatch as _envoy_api_v2_route_RouteMatch, RouteMatch__Output as _envoy_api_v2_route_RouteMatch__Output } from '../../../../envoy/api/v2/route/RouteMatch';
import { RouteAction as _envoy_api_v2_route_RouteAction, RouteAction__Output as _envoy_api_v2_route_RouteAction__Output } from '../../../../envoy/api/v2/route/RouteAction';
import { RedirectAction as _envoy_api_v2_route_RedirectAction, RedirectAction__Output as _envoy_api_v2_route_RedirectAction__Output } from '../../../../envoy/api/v2/route/RedirectAction';
import { DirectResponseAction as _envoy_api_v2_route_DirectResponseAction, DirectResponseAction__Output as _envoy_api_v2_route_DirectResponseAction__Output } from '../../../../envoy/api/v2/route/DirectResponseAction';
import { FilterAction as _envoy_api_v2_route_FilterAction, FilterAction__Output as _envoy_api_v2_route_FilterAction__Output } from '../../../../envoy/api/v2/route/FilterAction';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { Decorator as _envoy_api_v2_route_Decorator, Decorator__Output as _envoy_api_v2_route_Decorator__Output } from '../../../../envoy/api/v2/route/Decorator';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { Tracing as _envoy_api_v2_route_Tracing, Tracing__Output as _envoy_api_v2_route_Tracing__Output } from '../../../../envoy/api/v2/route/Tracing';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface Route {
  'name'?: (string);
  'match'?: (_envoy_api_v2_route_RouteMatch);
  'route'?: (_envoy_api_v2_route_RouteAction);
  'redirect'?: (_envoy_api_v2_route_RedirectAction);
  'direct_response'?: (_envoy_api_v2_route_DirectResponseAction);
  'filter_action'?: (_envoy_api_v2_route_FilterAction);
  'metadata'?: (_envoy_api_v2_core_Metadata);
  'decorator'?: (_envoy_api_v2_route_Decorator);
  'per_filter_config'?: (_google_protobuf_Struct);
  'typed_per_filter_config'?: (_google_protobuf_Any);
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'request_headers_to_remove'?: (string)[];
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'response_headers_to_remove'?: (string)[];
  'tracing'?: (_envoy_api_v2_route_Tracing);
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  'action'?: "route"|"redirect"|"direct_response"|"filter_action";
}

export interface Route__Output {
  'name': (string);
  'match': (_envoy_api_v2_route_RouteMatch__Output);
  'route'?: (_envoy_api_v2_route_RouteAction__Output);
  'redirect'?: (_envoy_api_v2_route_RedirectAction__Output);
  'direct_response'?: (_envoy_api_v2_route_DirectResponseAction__Output);
  'filter_action'?: (_envoy_api_v2_route_FilterAction__Output);
  'metadata': (_envoy_api_v2_core_Metadata__Output);
  'decorator': (_envoy_api_v2_route_Decorator__Output);
  'per_filter_config': (_google_protobuf_Struct__Output);
  'typed_per_filter_config': (_google_protobuf_Any__Output);
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'request_headers_to_remove': (string)[];
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'response_headers_to_remove': (string)[];
  'tracing': (_envoy_api_v2_route_Tracing__Output);
  'per_request_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output);
  'action': "route"|"redirect"|"direct_response"|"filter_action";
}
