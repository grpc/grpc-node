// Original file: deps/envoy-api/envoy/config/listener/v3/listener_components.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { ListenerFilterChainMatchPredicate as _envoy_config_listener_v3_ListenerFilterChainMatchPredicate, ListenerFilterChainMatchPredicate__Output as _envoy_config_listener_v3_ListenerFilterChainMatchPredicate__Output } from '../../../../envoy/config/listener/v3/ListenerFilterChainMatchPredicate';

export interface ListenerFilter {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_listener_filters>`.
   */
  'name'?: (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   * [#extension-category: envoy.filters.listener,envoy.filters.udp_listener]
   */
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Optional match predicate used to disable the filter. The filter is enabled when this field is empty.
   * See :ref:`ListenerFilterChainMatchPredicate <envoy_v3_api_msg_config.listener.v3.ListenerFilterChainMatchPredicate>`
   * for further examples.
   */
  'filter_disabled'?: (_envoy_config_listener_v3_ListenerFilterChainMatchPredicate | null);
  'config_type'?: "typed_config";
}

export interface ListenerFilter__Output {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_listener_filters>`.
   */
  'name': (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   * [#extension-category: envoy.filters.listener,envoy.filters.udp_listener]
   */
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Optional match predicate used to disable the filter. The filter is enabled when this field is empty.
   * See :ref:`ListenerFilterChainMatchPredicate <envoy_v3_api_msg_config.listener.v3.ListenerFilterChainMatchPredicate>`
   * for further examples.
   */
  'filter_disabled': (_envoy_config_listener_v3_ListenerFilterChainMatchPredicate__Output | null);
  'config_type': "typed_config";
}
