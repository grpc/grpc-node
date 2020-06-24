// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { HeaderMatcher as _envoy_api_v2_route_HeaderMatcher, HeaderMatcher__Output as _envoy_api_v2_route_HeaderMatcher__Output } from '../../../../envoy/api/v2/route/HeaderMatcher';

export interface _envoy_api_v2_route_RateLimit_Action {
  'source_cluster'?: (_envoy_api_v2_route_RateLimit_Action_SourceCluster);
  'destination_cluster'?: (_envoy_api_v2_route_RateLimit_Action_DestinationCluster);
  'request_headers'?: (_envoy_api_v2_route_RateLimit_Action_RequestHeaders);
  'remote_address'?: (_envoy_api_v2_route_RateLimit_Action_RemoteAddress);
  'generic_key'?: (_envoy_api_v2_route_RateLimit_Action_GenericKey);
  'header_value_match'?: (_envoy_api_v2_route_RateLimit_Action_HeaderValueMatch);
  'action_specifier'?: "source_cluster"|"destination_cluster"|"request_headers"|"remote_address"|"generic_key"|"header_value_match";
}

export interface _envoy_api_v2_route_RateLimit_Action__Output {
  'source_cluster'?: (_envoy_api_v2_route_RateLimit_Action_SourceCluster__Output);
  'destination_cluster'?: (_envoy_api_v2_route_RateLimit_Action_DestinationCluster__Output);
  'request_headers'?: (_envoy_api_v2_route_RateLimit_Action_RequestHeaders__Output);
  'remote_address'?: (_envoy_api_v2_route_RateLimit_Action_RemoteAddress__Output);
  'generic_key'?: (_envoy_api_v2_route_RateLimit_Action_GenericKey__Output);
  'header_value_match'?: (_envoy_api_v2_route_RateLimit_Action_HeaderValueMatch__Output);
  'action_specifier': "source_cluster"|"destination_cluster"|"request_headers"|"remote_address"|"generic_key"|"header_value_match";
}

export interface _envoy_api_v2_route_RateLimit_Action_SourceCluster {
}

export interface _envoy_api_v2_route_RateLimit_Action_SourceCluster__Output {
}

export interface _envoy_api_v2_route_RateLimit_Action_DestinationCluster {
}

export interface _envoy_api_v2_route_RateLimit_Action_DestinationCluster__Output {
}

export interface _envoy_api_v2_route_RateLimit_Action_RequestHeaders {
  'header_name'?: (string);
  'descriptor_key'?: (string);
}

export interface _envoy_api_v2_route_RateLimit_Action_RequestHeaders__Output {
  'header_name': (string);
  'descriptor_key': (string);
}

export interface _envoy_api_v2_route_RateLimit_Action_RemoteAddress {
}

export interface _envoy_api_v2_route_RateLimit_Action_RemoteAddress__Output {
}

export interface _envoy_api_v2_route_RateLimit_Action_GenericKey {
  'descriptor_value'?: (string);
}

export interface _envoy_api_v2_route_RateLimit_Action_GenericKey__Output {
  'descriptor_value': (string);
}

export interface _envoy_api_v2_route_RateLimit_Action_HeaderValueMatch {
  'descriptor_value'?: (string);
  'expect_match'?: (_google_protobuf_BoolValue);
  'headers'?: (_envoy_api_v2_route_HeaderMatcher)[];
}

export interface _envoy_api_v2_route_RateLimit_Action_HeaderValueMatch__Output {
  'descriptor_value': (string);
  'expect_match': (_google_protobuf_BoolValue__Output);
  'headers': (_envoy_api_v2_route_HeaderMatcher__Output)[];
}

export interface RateLimit {
  'stage'?: (_google_protobuf_UInt32Value);
  'disable_key'?: (string);
  'actions'?: (_envoy_api_v2_route_RateLimit_Action)[];
}

export interface RateLimit__Output {
  'stage': (_google_protobuf_UInt32Value__Output);
  'disable_key': (string);
  'actions': (_envoy_api_v2_route_RateLimit_Action__Output)[];
}
