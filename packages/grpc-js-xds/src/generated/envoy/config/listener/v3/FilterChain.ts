// Original file: deps/envoy-api/envoy/config/listener/v3/listener_components.proto

import type { FilterChainMatch as _envoy_config_listener_v3_FilterChainMatch, FilterChainMatch__Output as _envoy_config_listener_v3_FilterChainMatch__Output } from '../../../../envoy/config/listener/v3/FilterChainMatch';
import type { Filter as _envoy_config_listener_v3_Filter, Filter__Output as _envoy_config_listener_v3_Filter__Output } from '../../../../envoy/config/listener/v3/Filter';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { TransportSocket as _envoy_config_core_v3_TransportSocket, TransportSocket__Output as _envoy_config_core_v3_TransportSocket__Output } from '../../../../envoy/config/core/v3/TransportSocket';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * The configuration for on-demand filter chain. If this field is not empty in FilterChain message,
 * a filter chain will be built on-demand.
 * On-demand filter chains help speedup the warming up of listeners since the building and initialization of
 * an on-demand filter chain will be postponed to the arrival of new connection requests that require this filter chain.
 * Filter chains that are not often used can be set as on-demand.
 */
export interface _envoy_config_listener_v3_FilterChain_OnDemandConfiguration {
  /**
   * The timeout to wait for filter chain placeholders to complete rebuilding.
   * 1. If this field is set to 0, timeout is disabled.
   * 2. If not specified, a default timeout of 15s is used.
   * Rebuilding will wait until dependencies are ready, have failed, or this timeout is reached.
   * Upon failure or timeout, all connections related to this filter chain will be closed.
   * Rebuilding will start again on the next new connection.
   */
  'rebuild_timeout'?: (_google_protobuf_Duration | null);
}

/**
 * The configuration for on-demand filter chain. If this field is not empty in FilterChain message,
 * a filter chain will be built on-demand.
 * On-demand filter chains help speedup the warming up of listeners since the building and initialization of
 * an on-demand filter chain will be postponed to the arrival of new connection requests that require this filter chain.
 * Filter chains that are not often used can be set as on-demand.
 */
export interface _envoy_config_listener_v3_FilterChain_OnDemandConfiguration__Output {
  /**
   * The timeout to wait for filter chain placeholders to complete rebuilding.
   * 1. If this field is set to 0, timeout is disabled.
   * 2. If not specified, a default timeout of 15s is used.
   * Rebuilding will wait until dependencies are ready, have failed, or this timeout is reached.
   * Upon failure or timeout, all connections related to this filter chain will be closed.
   * Rebuilding will start again on the next new connection.
   */
  'rebuild_timeout': (_google_protobuf_Duration__Output | null);
}

/**
 * A filter chain wraps a set of match criteria, an option TLS context, a set of filters, and
 * various other parameters.
 * [#next-free-field: 10]
 */
export interface FilterChain {
  /**
   * The criteria to use when matching a connection to this filter chain.
   */
  'filter_chain_match'?: (_envoy_config_listener_v3_FilterChainMatch | null);
  /**
   * A list of individual network filters that make up the filter chain for
   * connections established with the listener. Order matters as the filters are
   * processed sequentially as connection events happen. Note: If the filter
   * list is empty, the connection will close by default.
   * 
   * For QUIC listeners, network filters other than HTTP Connection Manager (HCM)
   * can be created, but due to differences in the connection implementation compared
   * to TCP, the onData() method will never be called. Therefore, network filters
   * for QUIC listeners should only expect to do work at the start of a new connection
   * (i.e. in onNewConnection()). HCM must be the last (or only) filter in the chain.
   */
  'filters'?: (_envoy_config_listener_v3_Filter)[];
  /**
   * Whether the listener should expect a PROXY protocol V1 header on new
   * connections. If this option is enabled, the listener will assume that that
   * remote address of the connection is the one specified in the header. Some
   * load balancers including the AWS ELB support this option. If the option is
   * absent or set to false, Envoy will use the physical peer address of the
   * connection as the remote address.
   * 
   * This field is deprecated. Add a
   * :ref:`PROXY protocol listener filter <config_listener_filters_proxy_protocol>`
   * explicitly instead.
   */
  'use_proxy_proto'?: (_google_protobuf_BoolValue | null);
  /**
   * [#not-implemented-hide:] filter chain metadata.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * Optional custom transport socket implementation to use for downstream connections.
   * To setup TLS, set a transport socket with name ``envoy.transport_sockets.tls`` and
   * :ref:`DownstreamTlsContext <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.DownstreamTlsContext>` in the ``typed_config``.
   * If no transport socket configuration is specified, new connections
   * will be set up with plaintext.
   * [#extension-category: envoy.transport_sockets.downstream]
   */
  'transport_socket'?: (_envoy_config_core_v3_TransportSocket | null);
  /**
   * The unique name (or empty) by which this filter chain is known.
   * Note: :ref:`filter_chain_matcher
   * <envoy_v3_api_field_config.listener.v3.Listener.filter_chain_matcher>`
   * requires that filter chains are uniquely named within a listener.
   */
  'name'?: (string);
  /**
   * [#not-implemented-hide:] The configuration to specify whether the filter chain will be built on-demand.
   * If this field is not empty, the filter chain will be built on-demand.
   * Otherwise, the filter chain will be built normally and block listener warming.
   */
  'on_demand_configuration'?: (_envoy_config_listener_v3_FilterChain_OnDemandConfiguration | null);
  /**
   * If present and nonzero, the amount of time to allow incoming connections to complete any
   * transport socket negotiations. If this expires before the transport reports connection
   * establishment, the connection is summarily closed.
   */
  'transport_socket_connect_timeout'?: (_google_protobuf_Duration | null);
}

/**
 * A filter chain wraps a set of match criteria, an option TLS context, a set of filters, and
 * various other parameters.
 * [#next-free-field: 10]
 */
export interface FilterChain__Output {
  /**
   * The criteria to use when matching a connection to this filter chain.
   */
  'filter_chain_match': (_envoy_config_listener_v3_FilterChainMatch__Output | null);
  /**
   * A list of individual network filters that make up the filter chain for
   * connections established with the listener. Order matters as the filters are
   * processed sequentially as connection events happen. Note: If the filter
   * list is empty, the connection will close by default.
   * 
   * For QUIC listeners, network filters other than HTTP Connection Manager (HCM)
   * can be created, but due to differences in the connection implementation compared
   * to TCP, the onData() method will never be called. Therefore, network filters
   * for QUIC listeners should only expect to do work at the start of a new connection
   * (i.e. in onNewConnection()). HCM must be the last (or only) filter in the chain.
   */
  'filters': (_envoy_config_listener_v3_Filter__Output)[];
  /**
   * Whether the listener should expect a PROXY protocol V1 header on new
   * connections. If this option is enabled, the listener will assume that that
   * remote address of the connection is the one specified in the header. Some
   * load balancers including the AWS ELB support this option. If the option is
   * absent or set to false, Envoy will use the physical peer address of the
   * connection as the remote address.
   * 
   * This field is deprecated. Add a
   * :ref:`PROXY protocol listener filter <config_listener_filters_proxy_protocol>`
   * explicitly instead.
   */
  'use_proxy_proto': (_google_protobuf_BoolValue__Output | null);
  /**
   * [#not-implemented-hide:] filter chain metadata.
   */
  'metadata': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * Optional custom transport socket implementation to use for downstream connections.
   * To setup TLS, set a transport socket with name ``envoy.transport_sockets.tls`` and
   * :ref:`DownstreamTlsContext <envoy_v3_api_msg_extensions.transport_sockets.tls.v3.DownstreamTlsContext>` in the ``typed_config``.
   * If no transport socket configuration is specified, new connections
   * will be set up with plaintext.
   * [#extension-category: envoy.transport_sockets.downstream]
   */
  'transport_socket': (_envoy_config_core_v3_TransportSocket__Output | null);
  /**
   * The unique name (or empty) by which this filter chain is known.
   * Note: :ref:`filter_chain_matcher
   * <envoy_v3_api_field_config.listener.v3.Listener.filter_chain_matcher>`
   * requires that filter chains are uniquely named within a listener.
   */
  'name': (string);
  /**
   * [#not-implemented-hide:] The configuration to specify whether the filter chain will be built on-demand.
   * If this field is not empty, the filter chain will be built on-demand.
   * Otherwise, the filter chain will be built normally and block listener warming.
   */
  'on_demand_configuration': (_envoy_config_listener_v3_FilterChain_OnDemandConfiguration__Output | null);
  /**
   * If present and nonzero, the amount of time to allow incoming connections to complete any
   * transport socket negotiations. If this expires before the transport reports connection
   * establishment, the connection is summarily closed.
   */
  'transport_socket_connect_timeout': (_google_protobuf_Duration__Output | null);
}
