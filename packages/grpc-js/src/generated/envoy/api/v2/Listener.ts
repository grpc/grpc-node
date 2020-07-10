// Original file: deps/envoy-api/envoy/api/v2/listener.proto

import { Address as _envoy_api_v2_core_Address, Address__Output as _envoy_api_v2_core_Address__Output } from '../../../envoy/api/v2/core/Address';
import { FilterChain as _envoy_api_v2_listener_FilterChain, FilterChain__Output as _envoy_api_v2_listener_FilterChain__Output } from '../../../envoy/api/v2/listener/FilterChain';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../google/protobuf/BoolValue';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../google/protobuf/UInt32Value';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../envoy/api/v2/core/Metadata';
import { ListenerFilter as _envoy_api_v2_listener_ListenerFilter, ListenerFilter__Output as _envoy_api_v2_listener_ListenerFilter__Output } from '../../../envoy/api/v2/listener/ListenerFilter';
import { SocketOption as _envoy_api_v2_core_SocketOption, SocketOption__Output as _envoy_api_v2_core_SocketOption__Output } from '../../../envoy/api/v2/core/SocketOption';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../google/protobuf/Duration';
import { TrafficDirection as _envoy_api_v2_core_TrafficDirection } from '../../../envoy/api/v2/core/TrafficDirection';
import { UdpListenerConfig as _envoy_api_v2_listener_UdpListenerConfig, UdpListenerConfig__Output as _envoy_api_v2_listener_UdpListenerConfig__Output } from '../../../envoy/api/v2/listener/UdpListenerConfig';
import { ApiListener as _envoy_config_listener_v2_ApiListener, ApiListener__Output as _envoy_config_listener_v2_ApiListener__Output } from '../../../envoy/config/listener/v2/ApiListener';
import { AccessLog as _envoy_config_filter_accesslog_v2_AccessLog, AccessLog__Output as _envoy_config_filter_accesslog_v2_AccessLog__Output } from '../../../envoy/config/filter/accesslog/v2/AccessLog';

export interface _envoy_api_v2_Listener_ConnectionBalanceConfig {
  'exact_balance'?: (_envoy_api_v2_Listener_ConnectionBalanceConfig_ExactBalance);
  'balance_type'?: "exact_balance";
}

export interface _envoy_api_v2_Listener_ConnectionBalanceConfig__Output {
  'exact_balance'?: (_envoy_api_v2_Listener_ConnectionBalanceConfig_ExactBalance__Output);
  'balance_type': "exact_balance";
}

export interface _envoy_api_v2_Listener_ConnectionBalanceConfig_ExactBalance {
}

export interface _envoy_api_v2_Listener_ConnectionBalanceConfig_ExactBalance__Output {
}

export interface _envoy_api_v2_Listener_DeprecatedV1 {
  'bind_to_port'?: (_google_protobuf_BoolValue);
}

export interface _envoy_api_v2_Listener_DeprecatedV1__Output {
  'bind_to_port': (_google_protobuf_BoolValue__Output);
}

// Original file: deps/envoy-api/envoy/api/v2/listener.proto

export enum _envoy_api_v2_Listener_DrainType {
  DEFAULT = 0,
  MODIFY_ONLY = 1,
}

export interface Listener {
  'name'?: (string);
  'address'?: (_envoy_api_v2_core_Address);
  'filter_chains'?: (_envoy_api_v2_listener_FilterChain)[];
  'use_original_dst'?: (_google_protobuf_BoolValue);
  'per_connection_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  'metadata'?: (_envoy_api_v2_core_Metadata);
  'deprecated_v1'?: (_envoy_api_v2_Listener_DeprecatedV1);
  'drain_type'?: (_envoy_api_v2_Listener_DrainType | keyof typeof _envoy_api_v2_Listener_DrainType);
  'listener_filters'?: (_envoy_api_v2_listener_ListenerFilter)[];
  'transparent'?: (_google_protobuf_BoolValue);
  'freebind'?: (_google_protobuf_BoolValue);
  'tcp_fast_open_queue_length'?: (_google_protobuf_UInt32Value);
  'socket_options'?: (_envoy_api_v2_core_SocketOption)[];
  'listener_filters_timeout'?: (_google_protobuf_Duration);
  'traffic_direction'?: (_envoy_api_v2_core_TrafficDirection | keyof typeof _envoy_api_v2_core_TrafficDirection);
  'continue_on_listener_filters_timeout'?: (boolean);
  'udp_listener_config'?: (_envoy_api_v2_listener_UdpListenerConfig);
  'api_listener'?: (_envoy_config_listener_v2_ApiListener);
  'connection_balance_config'?: (_envoy_api_v2_Listener_ConnectionBalanceConfig);
  'reuse_port'?: (boolean);
  'access_log'?: (_envoy_config_filter_accesslog_v2_AccessLog)[];
}

export interface Listener__Output {
  'name': (string);
  'address': (_envoy_api_v2_core_Address__Output);
  'filter_chains': (_envoy_api_v2_listener_FilterChain__Output)[];
  'use_original_dst': (_google_protobuf_BoolValue__Output);
  'per_connection_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output);
  'metadata': (_envoy_api_v2_core_Metadata__Output);
  'deprecated_v1': (_envoy_api_v2_Listener_DeprecatedV1__Output);
  'drain_type': (keyof typeof _envoy_api_v2_Listener_DrainType);
  'listener_filters': (_envoy_api_v2_listener_ListenerFilter__Output)[];
  'transparent': (_google_protobuf_BoolValue__Output);
  'freebind': (_google_protobuf_BoolValue__Output);
  'tcp_fast_open_queue_length': (_google_protobuf_UInt32Value__Output);
  'socket_options': (_envoy_api_v2_core_SocketOption__Output)[];
  'listener_filters_timeout': (_google_protobuf_Duration__Output);
  'traffic_direction': (keyof typeof _envoy_api_v2_core_TrafficDirection);
  'continue_on_listener_filters_timeout': (boolean);
  'udp_listener_config': (_envoy_api_v2_listener_UdpListenerConfig__Output);
  'api_listener': (_envoy_config_listener_v2_ApiListener__Output);
  'connection_balance_config': (_envoy_api_v2_Listener_ConnectionBalanceConfig__Output);
  'reuse_port': (boolean);
  'access_log': (_envoy_config_filter_accesslog_v2_AccessLog__Output)[];
}
