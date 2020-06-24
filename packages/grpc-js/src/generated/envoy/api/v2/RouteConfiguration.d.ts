// Original file: deps/envoy-api/envoy/api/v2/route.proto

import { VirtualHost as _envoy_api_v2_route_VirtualHost, VirtualHost__Output as _envoy_api_v2_route_VirtualHost__Output } from '../../../envoy/api/v2/route/VirtualHost';
import { Vhds as _envoy_api_v2_Vhds, Vhds__Output as _envoy_api_v2_Vhds__Output } from '../../../envoy/api/v2/Vhds';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../envoy/api/v2/core/HeaderValueOption';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../google/protobuf/BoolValue';

export interface RouteConfiguration {
  'name'?: (string);
  'virtual_hosts'?: (_envoy_api_v2_route_VirtualHost)[];
  'vhds'?: (_envoy_api_v2_Vhds);
  'internal_only_headers'?: (string)[];
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'response_headers_to_remove'?: (string)[];
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'request_headers_to_remove'?: (string)[];
  'most_specific_header_mutations_wins'?: (boolean);
  'validate_clusters'?: (_google_protobuf_BoolValue);
}

export interface RouteConfiguration__Output {
  'name': (string);
  'virtual_hosts': (_envoy_api_v2_route_VirtualHost__Output)[];
  'vhds': (_envoy_api_v2_Vhds__Output);
  'internal_only_headers': (string)[];
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'response_headers_to_remove': (string)[];
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'request_headers_to_remove': (string)[];
  'most_specific_header_mutations_wins': (boolean);
  'validate_clusters': (_google_protobuf_BoolValue__Output);
}
