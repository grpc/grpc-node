// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { ListenerFilterChainMatchPredicate as _envoy_api_v2_listener_ListenerFilterChainMatchPredicate, ListenerFilterChainMatchPredicate__Output as _envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output } from '../../../../envoy/api/v2/listener/ListenerFilterChainMatchPredicate';

export interface ListenerFilter {
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  'filter_disabled'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate);
  'config_type'?: "config"|"typed_config";
}

export interface ListenerFilter__Output {
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  'filter_disabled': (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output);
  'config_type': "config"|"typed_config";
}
