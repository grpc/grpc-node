// Original file: deps/envoy-api/envoy/api/v2/route.proto

import { VirtualHost as _envoy_api_v2_route_VirtualHost, VirtualHost__Output as _envoy_api_v2_route_VirtualHost__Output } from '../../../envoy/api/v2/route/VirtualHost';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../envoy/api/v2/core/HeaderValueOption';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../google/protobuf/BoolValue';
import { Vhds as _envoy_api_v2_Vhds, Vhds__Output as _envoy_api_v2_Vhds__Output } from '../../../envoy/api/v2/Vhds';

export interface RouteConfiguration {
  'name'?: (string);
  'virtual_hosts'?: (_envoy_api_v2_route_VirtualHost)[];
  'internal_only_headers'?: (string)[];
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'response_headers_to_remove'?: (string)[];
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  'validate_clusters'?: (_google_protobuf_BoolValue);
  'request_headers_to_remove'?: (string)[];
  'vhds'?: (_envoy_api_v2_Vhds);
  'most_specific_header_mutations_wins'?: (boolean);
}

export interface RouteConfiguration__Output {
  'name': (string);
  'virtual_hosts': (_envoy_api_v2_route_VirtualHost__Output)[];
  'internal_only_headers': (string)[];
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'response_headers_to_remove': (string)[];
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  'validate_clusters': (_google_protobuf_BoolValue__Output);
  'request_headers_to_remove': (string)[];
  'vhds': (_envoy_api_v2_Vhds__Output);
  'most_specific_header_mutations_wins': (boolean);
}
