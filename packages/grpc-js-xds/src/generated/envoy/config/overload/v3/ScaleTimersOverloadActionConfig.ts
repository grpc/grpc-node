// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../envoy/type/v3/Percent';

export interface _envoy_config_overload_v3_ScaleTimersOverloadActionConfig_ScaleTimer {
  /**
   * The type of timer this minimum applies to.
   */
  'timer'?: (_envoy_config_overload_v3_ScaleTimersOverloadActionConfig_TimerType | keyof typeof _envoy_config_overload_v3_ScaleTimersOverloadActionConfig_TimerType);
  /**
   * Sets the minimum duration as an absolute value.
   */
  'min_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Sets the minimum duration as a percentage of the maximum value.
   */
  'min_scale'?: (_envoy_type_v3_Percent | null);
  'overload_adjust'?: "min_timeout"|"min_scale";
}

export interface _envoy_config_overload_v3_ScaleTimersOverloadActionConfig_ScaleTimer__Output {
  /**
   * The type of timer this minimum applies to.
   */
  'timer': (keyof typeof _envoy_config_overload_v3_ScaleTimersOverloadActionConfig_TimerType);
  /**
   * Sets the minimum duration as an absolute value.
   */
  'min_timeout'?: (_google_protobuf_Duration__Output | null);
  /**
   * Sets the minimum duration as a percentage of the maximum value.
   */
  'min_scale'?: (_envoy_type_v3_Percent__Output | null);
  'overload_adjust': "min_timeout"|"min_scale";
}

// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto

export enum _envoy_config_overload_v3_ScaleTimersOverloadActionConfig_TimerType {
  /**
   * Unsupported value; users must explicitly specify the timer they want scaled.
   */
  UNSPECIFIED = 0,
  /**
   * Adjusts the idle timer for downstream HTTP connections that takes effect when there are no active streams.
   * This affects the value of :ref:`HttpConnectionManager.common_http_protocol_options.idle_timeout
   * <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.idle_timeout>`
   */
  HTTP_DOWNSTREAM_CONNECTION_IDLE = 1,
  /**
   * Adjusts the idle timer for HTTP streams initiated by downstream clients.
   * This affects the value of :ref:`RouteAction.idle_timeout <envoy_v3_api_field_config.route.v3.RouteAction.idle_timeout>` and
   * :ref:`HttpConnectionManager.stream_idle_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   */
  HTTP_DOWNSTREAM_STREAM_IDLE = 2,
  /**
   * Adjusts the timer for how long downstream clients have to finish transport-level negotiations
   * before the connection is closed.
   * This affects the value of
   * :ref:`FilterChain.transport_socket_connect_timeout <envoy_v3_api_field_config.listener.v3.FilterChain.transport_socket_connect_timeout>`.
   */
  TRANSPORT_SOCKET_CONNECT = 3,
}

/**
 * Typed configuration for the "envoy.overload_actions.reduce_timeouts" action. See
 * :ref:`the docs <config_overload_manager_reducing_timeouts>` for an example of how to configure
 * the action with different timeouts and minimum values.
 */
export interface ScaleTimersOverloadActionConfig {
  /**
   * A set of timer scaling rules to be applied.
   */
  'timer_scale_factors'?: (_envoy_config_overload_v3_ScaleTimersOverloadActionConfig_ScaleTimer)[];
}

/**
 * Typed configuration for the "envoy.overload_actions.reduce_timeouts" action. See
 * :ref:`the docs <config_overload_manager_reducing_timeouts>` for an example of how to configure
 * the action with different timeouts and minimum values.
 */
export interface ScaleTimersOverloadActionConfig__Output {
  /**
   * A set of timer scaling rules to be applied.
   */
  'timer_scale_factors': (_envoy_config_overload_v3_ScaleTimersOverloadActionConfig_ScaleTimer__Output)[];
}
