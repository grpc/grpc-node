// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { ListenerFilterChainMatchPredicate as _envoy_api_v2_listener_ListenerFilterChainMatchPredicate, ListenerFilterChainMatchPredicate__Output as _envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output } from '../../../../envoy/api/v2/listener/ListenerFilterChainMatchPredicate';
import { Int32Range as _envoy_type_Int32Range, Int32Range__Output as _envoy_type_Int32Range__Output } from '../../../../envoy/type/Int32Range';

export interface _envoy_api_v2_listener_ListenerFilterChainMatchPredicate_MatchSet {
  'rules'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate)[];
}

export interface _envoy_api_v2_listener_ListenerFilterChainMatchPredicate_MatchSet__Output {
  'rules': (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output)[];
}

export interface ListenerFilterChainMatchPredicate {
  'or_match'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate_MatchSet);
  'and_match'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate_MatchSet);
  'not_match'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate);
  'any_match'?: (boolean);
  'destination_port_range'?: (_envoy_type_Int32Range);
  'rule'?: "or_match"|"and_match"|"not_match"|"any_match"|"destination_port_range";
}

export interface ListenerFilterChainMatchPredicate__Output {
  'or_match'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate_MatchSet__Output);
  'and_match'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate_MatchSet__Output);
  'not_match'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output);
  'any_match'?: (boolean);
  'destination_port_range'?: (_envoy_type_Int32Range__Output);
  'rule': "or_match"|"and_match"|"not_match"|"any_match"|"destination_port_range";
}
