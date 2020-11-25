// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { ListenerFilterChainMatchPredicate as _envoy_api_v2_listener_ListenerFilterChainMatchPredicate, ListenerFilterChainMatchPredicate__Output as _envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output } from '../../../../envoy/api/v2/listener/ListenerFilterChainMatchPredicate';

export interface ListenerFilter {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_listener_filters>`.
   */
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Optional match predicate used to disable the filter. The filter is enabled when this field is empty.
   * See :ref:`ListenerFilterChainMatchPredicate <envoy_api_msg_listener.ListenerFilterChainMatchPredicate>`
   * for further examples.
   */
  'filter_disabled'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate);
  /**
   * Filter specific configuration which depends on the filter being instantiated.
   * See the supported filters for further documentation.
   */
  'config_type'?: "config"|"typed_config";
}

export interface ListenerFilter__Output {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_listener_filters>`.
   */
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Optional match predicate used to disable the filter. The filter is enabled when this field is empty.
   * See :ref:`ListenerFilterChainMatchPredicate <envoy_api_msg_listener.ListenerFilterChainMatchPredicate>`
   * for further examples.
   */
  'filter_disabled'?: (_envoy_api_v2_listener_ListenerFilterChainMatchPredicate__Output);
  /**
   * Filter specific configuration which depends on the filter being instantiated.
   * See the supported filters for further documentation.
   */
  'config_type': "config"|"typed_config";
}
