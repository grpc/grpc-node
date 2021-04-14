// Original file: deps/envoy-api/envoy/config/listener/v3/listener.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { FilterChain as _envoy_config_listener_v3_FilterChain, FilterChain__Output as _envoy_config_listener_v3_FilterChain__Output } from '../../../../envoy/config/listener/v3/FilterChain';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { ListenerFilter as _envoy_config_listener_v3_ListenerFilter, ListenerFilter__Output as _envoy_config_listener_v3_ListenerFilter__Output } from '../../../../envoy/config/listener/v3/ListenerFilter';
import type { SocketOption as _envoy_config_core_v3_SocketOption, SocketOption__Output as _envoy_config_core_v3_SocketOption__Output } from '../../../../envoy/config/core/v3/SocketOption';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { TrafficDirection as _envoy_config_core_v3_TrafficDirection } from '../../../../envoy/config/core/v3/TrafficDirection';
import type { UdpListenerConfig as _envoy_config_listener_v3_UdpListenerConfig, UdpListenerConfig__Output as _envoy_config_listener_v3_UdpListenerConfig__Output } from '../../../../envoy/config/listener/v3/UdpListenerConfig';
import type { ApiListener as _envoy_config_listener_v3_ApiListener, ApiListener__Output as _envoy_config_listener_v3_ApiListener__Output } from '../../../../envoy/config/listener/v3/ApiListener';
import type { AccessLog as _envoy_config_accesslog_v3_AccessLog, AccessLog__Output as _envoy_config_accesslog_v3_AccessLog__Output } from '../../../../envoy/config/accesslog/v3/AccessLog';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Configuration for listener connection balancing.
 */
export interface _envoy_config_listener_v3_Listener_ConnectionBalanceConfig {
  /**
   * If specified, the listener will use the exact connection balancer.
   */
  'exact_balance'?: (_envoy_config_listener_v3_Listener_ConnectionBalanceConfig_ExactBalance);
  'balance_type'?: "exact_balance";
}

/**
 * Configuration for listener connection balancing.
 */
export interface _envoy_config_listener_v3_Listener_ConnectionBalanceConfig__Output {
  /**
   * If specified, the listener will use the exact connection balancer.
   */
  'exact_balance'?: (_envoy_config_listener_v3_Listener_ConnectionBalanceConfig_ExactBalance__Output);
  'balance_type': "exact_balance";
}

/**
 * [#not-implemented-hide:]
 */
export interface _envoy_config_listener_v3_Listener_DeprecatedV1 {
  /**
   * Whether the listener should bind to the port. A listener that doesn't
   * bind can only receive connections redirected from other listeners that
   * set use_original_dst parameter to true. Default is true.
   * 
   * This is deprecated. Use :ref:`Listener.bind_to_port
   * <envoy_api_field_config.listener.v3.Listener.bind_to_port>`
   */
  'bind_to_port'?: (_google_protobuf_BoolValue);
}

/**
 * [#not-implemented-hide:]
 */
export interface _envoy_config_listener_v3_Listener_DeprecatedV1__Output {
  /**
   * Whether the listener should bind to the port. A listener that doesn't
   * bind can only receive connections redirected from other listeners that
   * set use_original_dst parameter to true. Default is true.
   * 
   * This is deprecated. Use :ref:`Listener.bind_to_port
   * <envoy_api_field_config.listener.v3.Listener.bind_to_port>`
   */
  'bind_to_port'?: (_google_protobuf_BoolValue__Output);
}

// Original file: deps/envoy-api/envoy/config/listener/v3/listener.proto

export enum _envoy_config_listener_v3_Listener_DrainType {
  /**
   * Drain in response to calling /healthcheck/fail admin endpoint (along with the health check
   * filter), listener removal/modification, and hot restart.
   */
  DEFAULT = 0,
  /**
   * Drain in response to listener removal/modification and hot restart. This setting does not
   * include /healthcheck/fail. This setting may be desirable if Envoy is hosting both ingress
   * and egress listeners.
   */
  MODIFY_ONLY = 1,
}

/**
 * A connection balancer implementation that does exact balancing. This means that a lock is
 * held during balancing so that connection counts are nearly exactly balanced between worker
 * threads. This is "nearly" exact in the sense that a connection might close in parallel thus
 * making the counts incorrect, but this should be rectified on the next accept. This balancer
 * sacrifices accept throughput for accuracy and should be used when there are a small number of
 * connections that rarely cycle (e.g., service mesh gRPC egress).
 */
export interface _envoy_config_listener_v3_Listener_ConnectionBalanceConfig_ExactBalance {
}

/**
 * A connection balancer implementation that does exact balancing. This means that a lock is
 * held during balancing so that connection counts are nearly exactly balanced between worker
 * threads. This is "nearly" exact in the sense that a connection might close in parallel thus
 * making the counts incorrect, but this should be rectified on the next accept. This balancer
 * sacrifices accept throughput for accuracy and should be used when there are a small number of
 * connections that rarely cycle (e.g., service mesh gRPC egress).
 */
export interface _envoy_config_listener_v3_Listener_ConnectionBalanceConfig_ExactBalance__Output {
}

/**
 * [#next-free-field: 27]
 */
export interface Listener {
  /**
   * The unique name by which this listener is known. If no name is provided,
   * Envoy will allocate an internal UUID for the listener. If the listener is to be dynamically
   * updated or removed via :ref:`LDS <config_listeners_lds>` a unique name must be provided.
   */
  'name'?: (string);
  /**
   * The address that the listener should listen on. In general, the address must be unique, though
   * that is governed by the bind rules of the OS. E.g., multiple listeners can listen on port 0 on
   * Linux as the actual port will be allocated by the OS.
   */
  'address'?: (_envoy_config_core_v3_Address);
  /**
   * A list of filter chains to consider for this listener. The
   * :ref:`FilterChain <envoy_api_msg_config.listener.v3.FilterChain>` with the most specific
   * :ref:`FilterChainMatch <envoy_api_msg_config.listener.v3.FilterChainMatch>` criteria is used on a
   * connection.
   * 
   * Example using SNI for filter chain selection can be found in the
   * :ref:`FAQ entry <faq_how_to_setup_sni>`.
   */
  'filter_chains'?: (_envoy_config_listener_v3_FilterChain)[];
  /**
   * If a connection is redirected using *iptables*, the port on which the proxy
   * receives it might be different from the original destination address. When this flag is set to
   * true, the listener hands off redirected connections to the listener associated with the
   * original destination address. If there is no listener associated with the original destination
   * address, the connection is handled by the listener that receives it. Defaults to false.
   */
  'use_original_dst'?: (_google_protobuf_BoolValue);
  /**
   * Soft limit on size of the listener’s new connection read and write buffers.
   * If unspecified, an implementation defined default is applied (1MiB).
   */
  'per_connection_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  /**
   * Listener metadata.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata);
  /**
   * [#not-implemented-hide:]
   */
  'deprecated_v1'?: (_envoy_config_listener_v3_Listener_DeprecatedV1);
  /**
   * The type of draining to perform at a listener-wide level.
   */
  'drain_type'?: (_envoy_config_listener_v3_Listener_DrainType | keyof typeof _envoy_config_listener_v3_Listener_DrainType);
  /**
   * Listener filters have the opportunity to manipulate and augment the connection metadata that
   * is used in connection filter chain matching, for example. These filters are run before any in
   * :ref:`filter_chains <envoy_api_field_config.listener.v3.Listener.filter_chains>`. Order matters as the
   * filters are processed sequentially right after a socket has been accepted by the listener, and
   * before a connection is created.
   * UDP Listener filters can be specified when the protocol in the listener socket address in
   * :ref:`protocol <envoy_api_field_config.core.v3.SocketAddress.protocol>` is :ref:`UDP
   * <envoy_api_enum_value_config.core.v3.SocketAddress.Protocol.UDP>`.
   * UDP listeners currently support a single filter.
   */
  'listener_filters'?: (_envoy_config_listener_v3_ListenerFilter)[];
  /**
   * Whether the listener should be set as a transparent socket.
   * When this flag is set to true, connections can be redirected to the listener using an
   * *iptables* *TPROXY* target, in which case the original source and destination addresses and
   * ports are preserved on accepted connections. This flag should be used in combination with
   * :ref:`an original_dst <config_listener_filters_original_dst>` :ref:`listener filter
   * <envoy_api_field_config.listener.v3.Listener.listener_filters>` to mark the connections' local addresses as
   * "restored." This can be used to hand off each redirected connection to another listener
   * associated with the connection's destination address. Direct connections to the socket without
   * using *TPROXY* cannot be distinguished from connections redirected using *TPROXY* and are
   * therefore treated as if they were redirected.
   * When this flag is set to false, the listener's socket is explicitly reset as non-transparent.
   * Setting this flag requires Envoy to run with the *CAP_NET_ADMIN* capability.
   * When this flag is not set (default), the socket is not modified, i.e. the transparent option
   * is neither set nor reset.
   */
  'transparent'?: (_google_protobuf_BoolValue);
  /**
   * Whether the listener should set the *IP_FREEBIND* socket option. When this
   * flag is set to true, listeners can be bound to an IP address that is not
   * configured on the system running Envoy. When this flag is set to false, the
   * option *IP_FREEBIND* is disabled on the socket. When this flag is not set
   * (default), the socket is not modified, i.e. the option is neither enabled
   * nor disabled.
   */
  'freebind'?: (_google_protobuf_BoolValue);
  /**
   * Whether the listener should accept TCP Fast Open (TFO) connections.
   * When this flag is set to a value greater than 0, the option TCP_FASTOPEN is enabled on
   * the socket, with a queue length of the specified size
   * (see `details in RFC7413 <https://tools.ietf.org/html/rfc7413#section-5.1>`_).
   * When this flag is set to 0, the option TCP_FASTOPEN is disabled on the socket.
   * When this flag is not set (default), the socket is not modified,
   * i.e. the option is neither enabled nor disabled.
   * 
   * On Linux, the net.ipv4.tcp_fastopen kernel parameter must include flag 0x2 to enable
   * TCP_FASTOPEN.
   * See `ip-sysctl.txt <https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt>`_.
   * 
   * On macOS, only values of 0, 1, and unset are valid; other values may result in an error.
   * To set the queue length on macOS, set the net.inet.tcp.fastopen_backlog kernel parameter.
   */
  'tcp_fast_open_queue_length'?: (_google_protobuf_UInt32Value);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options'?: (_envoy_config_core_v3_SocketOption)[];
  /**
   * The timeout to wait for all listener filters to complete operation. If the timeout is reached,
   * the accepted socket is closed without a connection being created unless
   * `continue_on_listener_filters_timeout` is set to true. Specify 0 to disable the
   * timeout. If not specified, a default timeout of 15s is used.
   */
  'listener_filters_timeout'?: (_google_protobuf_Duration);
  /**
   * Specifies the intended direction of the traffic relative to the local Envoy.
   */
  'traffic_direction'?: (_envoy_config_core_v3_TrafficDirection | keyof typeof _envoy_config_core_v3_TrafficDirection);
  /**
   * Whether a connection should be created when listener filters timeout. Default is false.
   * 
   * .. attention::
   * 
   * Some listener filters, such as :ref:`Proxy Protocol filter
   * <config_listener_filters_proxy_protocol>`, should not be used with this option. It will cause
   * unexpected behavior when a connection is created.
   */
  'continue_on_listener_filters_timeout'?: (boolean);
  /**
   * If the protocol in the listener socket address in :ref:`protocol
   * <envoy_api_field_config.core.v3.SocketAddress.protocol>` is :ref:`UDP
   * <envoy_api_enum_value_config.core.v3.SocketAddress.Protocol.UDP>`, this field specifies the actual udp
   * listener to create, i.e. :ref:`udp_listener_name
   * <envoy_api_field_config.listener.v3.UdpListenerConfig.udp_listener_name>` = "raw_udp_listener" for
   * creating a packet-oriented UDP listener. If not present, treat it as "raw_udp_listener".
   */
  'udp_listener_config'?: (_envoy_config_listener_v3_UdpListenerConfig);
  /**
   * Used to represent an API listener, which is used in non-proxy clients. The type of API
   * exposed to the non-proxy application depends on the type of API listener.
   * When this field is set, no other field except for :ref:`name<envoy_api_field_config.listener.v3.Listener.name>`
   * should be set.
   * 
   * .. note::
   * 
   * Currently only one ApiListener can be installed; and it can only be done via bootstrap config,
   * not LDS.
   * 
   * [#next-major-version: In the v3 API, instead of this messy approach where the socket
   * listener fields are directly in the top-level Listener message and the API listener types
   * are in the ApiListener message, the socket listener messages should be in their own message,
   * and the top-level Listener should essentially be a oneof that selects between the
   * socket listener and the various types of API listener. That way, a given Listener message
   * can structurally only contain the fields of the relevant type.]
   */
  'api_listener'?: (_envoy_config_listener_v3_ApiListener);
  /**
   * The listener's connection balancer configuration, currently only applicable to TCP listeners.
   * If no configuration is specified, Envoy will not attempt to balance active connections between
   * worker threads.
   */
  'connection_balance_config'?: (_envoy_config_listener_v3_Listener_ConnectionBalanceConfig);
  /**
   * When this flag is set to true, listeners set the *SO_REUSEPORT* socket option and
   * create one socket for each worker thread. This makes inbound connections
   * distribute among worker threads roughly evenly in cases where there are a high number
   * of connections. When this flag is set to false, all worker threads share one socket.
   * 
   * Before Linux v4.19-rc1, new TCP connections may be rejected during hot restart
   * (see `3rd paragraph in 'soreuseport' commit message
   * <https://github.com/torvalds/linux/commit/c617f398edd4db2b8567a28e89>`_).
   * This issue was fixed by `tcp: Avoid TCP syncookie rejected by SO_REUSEPORT socket
   * <https://github.com/torvalds/linux/commit/40a1227ea845a37ab197dd1caffb60b047fa36b1>`_.
   */
  'reuse_port'?: (boolean);
  /**
   * Configuration for :ref:`access logs <arch_overview_access_logs>`
   * emitted by this listener.
   */
  'access_log'?: (_envoy_config_accesslog_v3_AccessLog)[];
  /**
   * If the protocol in the listener socket address in :ref:`protocol
   * <envoy_api_field_config.core.v3.SocketAddress.protocol>` is :ref:`UDP
   * <envoy_api_enum_value_config.core.v3.SocketAddress.Protocol.UDP>`, this field specifies the actual udp
   * writer to create, i.e. :ref:`name <envoy_api_field_config.core.v3.TypedExtensionConfig.name>`
   * = "udp_default_writer" for creating a udp writer with writing in passthrough mode,
   * = "udp_gso_batch_writer" for creating a udp writer with writing in batch mode.
   * If not present, treat it as "udp_default_writer".
   * [#not-implemented-hide:]
   */
  'udp_writer_config'?: (_envoy_config_core_v3_TypedExtensionConfig);
  /**
   * The maximum length a tcp listener's pending connections queue can grow to. If no value is
   * provided net.core.somaxconn will be used on Linux and 128 otherwise.
   */
  'tcp_backlog_size'?: (_google_protobuf_UInt32Value);
  /**
   * The default filter chain if none of the filter chain matches. If no default filter chain is supplied,
   * the connection will be closed. The filter chain match is ignored in this field.
   */
  'default_filter_chain'?: (_envoy_config_listener_v3_FilterChain);
  /**
   * Whether the listener should bind to the port. A listener that doesn't
   * bind can only receive connections redirected from other listeners that set
   * :ref:`use_original_dst <envoy_api_field_config.listener.v3.Listener.use_original_dst>`
   * to true. Default is true.
   */
  'bind_to_port'?: (_google_protobuf_BoolValue);
}

/**
 * [#next-free-field: 27]
 */
export interface Listener__Output {
  /**
   * The unique name by which this listener is known. If no name is provided,
   * Envoy will allocate an internal UUID for the listener. If the listener is to be dynamically
   * updated or removed via :ref:`LDS <config_listeners_lds>` a unique name must be provided.
   */
  'name': (string);
  /**
   * The address that the listener should listen on. In general, the address must be unique, though
   * that is governed by the bind rules of the OS. E.g., multiple listeners can listen on port 0 on
   * Linux as the actual port will be allocated by the OS.
   */
  'address'?: (_envoy_config_core_v3_Address__Output);
  /**
   * A list of filter chains to consider for this listener. The
   * :ref:`FilterChain <envoy_api_msg_config.listener.v3.FilterChain>` with the most specific
   * :ref:`FilterChainMatch <envoy_api_msg_config.listener.v3.FilterChainMatch>` criteria is used on a
   * connection.
   * 
   * Example using SNI for filter chain selection can be found in the
   * :ref:`FAQ entry <faq_how_to_setup_sni>`.
   */
  'filter_chains': (_envoy_config_listener_v3_FilterChain__Output)[];
  /**
   * If a connection is redirected using *iptables*, the port on which the proxy
   * receives it might be different from the original destination address. When this flag is set to
   * true, the listener hands off redirected connections to the listener associated with the
   * original destination address. If there is no listener associated with the original destination
   * address, the connection is handled by the listener that receives it. Defaults to false.
   */
  'use_original_dst'?: (_google_protobuf_BoolValue__Output);
  /**
   * Soft limit on size of the listener’s new connection read and write buffers.
   * If unspecified, an implementation defined default is applied (1MiB).
   */
  'per_connection_buffer_limit_bytes'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Listener metadata.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata__Output);
  /**
   * [#not-implemented-hide:]
   */
  'deprecated_v1'?: (_envoy_config_listener_v3_Listener_DeprecatedV1__Output);
  /**
   * The type of draining to perform at a listener-wide level.
   */
  'drain_type': (keyof typeof _envoy_config_listener_v3_Listener_DrainType);
  /**
   * Listener filters have the opportunity to manipulate and augment the connection metadata that
   * is used in connection filter chain matching, for example. These filters are run before any in
   * :ref:`filter_chains <envoy_api_field_config.listener.v3.Listener.filter_chains>`. Order matters as the
   * filters are processed sequentially right after a socket has been accepted by the listener, and
   * before a connection is created.
   * UDP Listener filters can be specified when the protocol in the listener socket address in
   * :ref:`protocol <envoy_api_field_config.core.v3.SocketAddress.protocol>` is :ref:`UDP
   * <envoy_api_enum_value_config.core.v3.SocketAddress.Protocol.UDP>`.
   * UDP listeners currently support a single filter.
   */
  'listener_filters': (_envoy_config_listener_v3_ListenerFilter__Output)[];
  /**
   * Whether the listener should be set as a transparent socket.
   * When this flag is set to true, connections can be redirected to the listener using an
   * *iptables* *TPROXY* target, in which case the original source and destination addresses and
   * ports are preserved on accepted connections. This flag should be used in combination with
   * :ref:`an original_dst <config_listener_filters_original_dst>` :ref:`listener filter
   * <envoy_api_field_config.listener.v3.Listener.listener_filters>` to mark the connections' local addresses as
   * "restored." This can be used to hand off each redirected connection to another listener
   * associated with the connection's destination address. Direct connections to the socket without
   * using *TPROXY* cannot be distinguished from connections redirected using *TPROXY* and are
   * therefore treated as if they were redirected.
   * When this flag is set to false, the listener's socket is explicitly reset as non-transparent.
   * Setting this flag requires Envoy to run with the *CAP_NET_ADMIN* capability.
   * When this flag is not set (default), the socket is not modified, i.e. the transparent option
   * is neither set nor reset.
   */
  'transparent'?: (_google_protobuf_BoolValue__Output);
  /**
   * Whether the listener should set the *IP_FREEBIND* socket option. When this
   * flag is set to true, listeners can be bound to an IP address that is not
   * configured on the system running Envoy. When this flag is set to false, the
   * option *IP_FREEBIND* is disabled on the socket. When this flag is not set
   * (default), the socket is not modified, i.e. the option is neither enabled
   * nor disabled.
   */
  'freebind'?: (_google_protobuf_BoolValue__Output);
  /**
   * Whether the listener should accept TCP Fast Open (TFO) connections.
   * When this flag is set to a value greater than 0, the option TCP_FASTOPEN is enabled on
   * the socket, with a queue length of the specified size
   * (see `details in RFC7413 <https://tools.ietf.org/html/rfc7413#section-5.1>`_).
   * When this flag is set to 0, the option TCP_FASTOPEN is disabled on the socket.
   * When this flag is not set (default), the socket is not modified,
   * i.e. the option is neither enabled nor disabled.
   * 
   * On Linux, the net.ipv4.tcp_fastopen kernel parameter must include flag 0x2 to enable
   * TCP_FASTOPEN.
   * See `ip-sysctl.txt <https://www.kernel.org/doc/Documentation/networking/ip-sysctl.txt>`_.
   * 
   * On macOS, only values of 0, 1, and unset are valid; other values may result in an error.
   * To set the queue length on macOS, set the net.inet.tcp.fastopen_backlog kernel parameter.
   */
  'tcp_fast_open_queue_length'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Additional socket options that may not be present in Envoy source code or
   * precompiled binaries.
   */
  'socket_options': (_envoy_config_core_v3_SocketOption__Output)[];
  /**
   * The timeout to wait for all listener filters to complete operation. If the timeout is reached,
   * the accepted socket is closed without a connection being created unless
   * `continue_on_listener_filters_timeout` is set to true. Specify 0 to disable the
   * timeout. If not specified, a default timeout of 15s is used.
   */
  'listener_filters_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Specifies the intended direction of the traffic relative to the local Envoy.
   */
  'traffic_direction': (keyof typeof _envoy_config_core_v3_TrafficDirection);
  /**
   * Whether a connection should be created when listener filters timeout. Default is false.
   * 
   * .. attention::
   * 
   * Some listener filters, such as :ref:`Proxy Protocol filter
   * <config_listener_filters_proxy_protocol>`, should not be used with this option. It will cause
   * unexpected behavior when a connection is created.
   */
  'continue_on_listener_filters_timeout': (boolean);
  /**
   * If the protocol in the listener socket address in :ref:`protocol
   * <envoy_api_field_config.core.v3.SocketAddress.protocol>` is :ref:`UDP
   * <envoy_api_enum_value_config.core.v3.SocketAddress.Protocol.UDP>`, this field specifies the actual udp
   * listener to create, i.e. :ref:`udp_listener_name
   * <envoy_api_field_config.listener.v3.UdpListenerConfig.udp_listener_name>` = "raw_udp_listener" for
   * creating a packet-oriented UDP listener. If not present, treat it as "raw_udp_listener".
   */
  'udp_listener_config'?: (_envoy_config_listener_v3_UdpListenerConfig__Output);
  /**
   * Used to represent an API listener, which is used in non-proxy clients. The type of API
   * exposed to the non-proxy application depends on the type of API listener.
   * When this field is set, no other field except for :ref:`name<envoy_api_field_config.listener.v3.Listener.name>`
   * should be set.
   * 
   * .. note::
   * 
   * Currently only one ApiListener can be installed; and it can only be done via bootstrap config,
   * not LDS.
   * 
   * [#next-major-version: In the v3 API, instead of this messy approach where the socket
   * listener fields are directly in the top-level Listener message and the API listener types
   * are in the ApiListener message, the socket listener messages should be in their own message,
   * and the top-level Listener should essentially be a oneof that selects between the
   * socket listener and the various types of API listener. That way, a given Listener message
   * can structurally only contain the fields of the relevant type.]
   */
  'api_listener'?: (_envoy_config_listener_v3_ApiListener__Output);
  /**
   * The listener's connection balancer configuration, currently only applicable to TCP listeners.
   * If no configuration is specified, Envoy will not attempt to balance active connections between
   * worker threads.
   */
  'connection_balance_config'?: (_envoy_config_listener_v3_Listener_ConnectionBalanceConfig__Output);
  /**
   * When this flag is set to true, listeners set the *SO_REUSEPORT* socket option and
   * create one socket for each worker thread. This makes inbound connections
   * distribute among worker threads roughly evenly in cases where there are a high number
   * of connections. When this flag is set to false, all worker threads share one socket.
   * 
   * Before Linux v4.19-rc1, new TCP connections may be rejected during hot restart
   * (see `3rd paragraph in 'soreuseport' commit message
   * <https://github.com/torvalds/linux/commit/c617f398edd4db2b8567a28e89>`_).
   * This issue was fixed by `tcp: Avoid TCP syncookie rejected by SO_REUSEPORT socket
   * <https://github.com/torvalds/linux/commit/40a1227ea845a37ab197dd1caffb60b047fa36b1>`_.
   */
  'reuse_port': (boolean);
  /**
   * Configuration for :ref:`access logs <arch_overview_access_logs>`
   * emitted by this listener.
   */
  'access_log': (_envoy_config_accesslog_v3_AccessLog__Output)[];
  /**
   * If the protocol in the listener socket address in :ref:`protocol
   * <envoy_api_field_config.core.v3.SocketAddress.protocol>` is :ref:`UDP
   * <envoy_api_enum_value_config.core.v3.SocketAddress.Protocol.UDP>`, this field specifies the actual udp
   * writer to create, i.e. :ref:`name <envoy_api_field_config.core.v3.TypedExtensionConfig.name>`
   * = "udp_default_writer" for creating a udp writer with writing in passthrough mode,
   * = "udp_gso_batch_writer" for creating a udp writer with writing in batch mode.
   * If not present, treat it as "udp_default_writer".
   * [#not-implemented-hide:]
   */
  'udp_writer_config'?: (_envoy_config_core_v3_TypedExtensionConfig__Output);
  /**
   * The maximum length a tcp listener's pending connections queue can grow to. If no value is
   * provided net.core.somaxconn will be used on Linux and 128 otherwise.
   */
  'tcp_backlog_size'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The default filter chain if none of the filter chain matches. If no default filter chain is supplied,
   * the connection will be closed. The filter chain match is ignored in this field.
   */
  'default_filter_chain'?: (_envoy_config_listener_v3_FilterChain__Output);
  /**
   * Whether the listener should bind to the port. A listener that doesn't
   * bind can only receive connections redirected from other listeners that set
   * :ref:`use_original_dst <envoy_api_field_config.listener.v3.Listener.use_original_dst>`
   * to true. Default is true.
   */
  'bind_to_port'?: (_google_protobuf_BoolValue__Output);
}
