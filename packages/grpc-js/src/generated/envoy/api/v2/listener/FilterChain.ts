// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { FilterChainMatch as _envoy_api_v2_listener_FilterChainMatch, FilterChainMatch__Output as _envoy_api_v2_listener_FilterChainMatch__Output } from '../../../../envoy/api/v2/listener/FilterChainMatch';
import { DownstreamTlsContext as _envoy_api_v2_auth_DownstreamTlsContext, DownstreamTlsContext__Output as _envoy_api_v2_auth_DownstreamTlsContext__Output } from '../../../../envoy/api/v2/auth/DownstreamTlsContext';
import { Filter as _envoy_api_v2_listener_Filter, Filter__Output as _envoy_api_v2_listener_Filter__Output } from '../../../../envoy/api/v2/listener/Filter';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { TransportSocket as _envoy_api_v2_core_TransportSocket, TransportSocket__Output as _envoy_api_v2_core_TransportSocket__Output } from '../../../../envoy/api/v2/core/TransportSocket';

/**
 * A filter chain wraps a set of match criteria, an option TLS context, a set of filters, and
 * various other parameters.
 * [#next-free-field: 8]
 */
export interface FilterChain {
  /**
   * The criteria to use when matching a connection to this filter chain.
   */
  'filter_chain_match'?: (_envoy_api_v2_listener_FilterChainMatch);
  /**
   * The TLS context for this filter chain.
   * 
   * .. attention::
   * 
   * **This field is deprecated**. Use `transport_socket` with name `tls` instead. If both are
   * set, `transport_socket` takes priority.
   */
  'tls_context'?: (_envoy_api_v2_auth_DownstreamTlsContext);
  /**
   * A list of individual network filters that make up the filter chain for
   * connections established with the listener. Order matters as the filters are
   * processed sequentially as connection events happen. Note: If the filter
   * list is empty, the connection will close by default.
   */
  'filters'?: (_envoy_api_v2_listener_Filter)[];
  /**
   * Whether the listener should expect a PROXY protocol V1 header on new
   * connections. If this option is enabled, the listener will assume that that
   * remote address of the connection is the one specified in the header. Some
   * load balancers including the AWS ELB support this option. If the option is
   * absent or set to false, Envoy will use the physical peer address of the
   * connection as the remote address.
   */
  'use_proxy_proto'?: (_google_protobuf_BoolValue);
  /**
   * [#not-implemented-hide:] filter chain metadata.
   */
  'metadata'?: (_envoy_api_v2_core_Metadata);
  /**
   * Optional custom transport socket implementation to use for downstream connections.
   * To setup TLS, set a transport socket with name `tls` and
   * :ref:`DownstreamTlsContext <envoy_api_msg_auth.DownstreamTlsContext>` in the `typed_config`.
   * If no transport socket configuration is specified, new connections
   * will be set up with plaintext.
   */
  'transport_socket'?: (_envoy_api_v2_core_TransportSocket);
  /**
   * [#not-implemented-hide:] The unique name (or empty) by which this filter chain is known. If no
   * name is provided, Envoy will allocate an internal UUID for the filter chain. If the filter
   * chain is to be dynamically updated or removed via FCDS a unique name must be provided.
   */
  'name'?: (string);
}

/**
 * A filter chain wraps a set of match criteria, an option TLS context, a set of filters, and
 * various other parameters.
 * [#next-free-field: 8]
 */
export interface FilterChain__Output {
  /**
   * The criteria to use when matching a connection to this filter chain.
   */
  'filter_chain_match'?: (_envoy_api_v2_listener_FilterChainMatch__Output);
  /**
   * The TLS context for this filter chain.
   * 
   * .. attention::
   * 
   * **This field is deprecated**. Use `transport_socket` with name `tls` instead. If both are
   * set, `transport_socket` takes priority.
   */
  'tls_context'?: (_envoy_api_v2_auth_DownstreamTlsContext__Output);
  /**
   * A list of individual network filters that make up the filter chain for
   * connections established with the listener. Order matters as the filters are
   * processed sequentially as connection events happen. Note: If the filter
   * list is empty, the connection will close by default.
   */
  'filters': (_envoy_api_v2_listener_Filter__Output)[];
  /**
   * Whether the listener should expect a PROXY protocol V1 header on new
   * connections. If this option is enabled, the listener will assume that that
   * remote address of the connection is the one specified in the header. Some
   * load balancers including the AWS ELB support this option. If the option is
   * absent or set to false, Envoy will use the physical peer address of the
   * connection as the remote address.
   */
  'use_proxy_proto'?: (_google_protobuf_BoolValue__Output);
  /**
   * [#not-implemented-hide:] filter chain metadata.
   */
  'metadata'?: (_envoy_api_v2_core_Metadata__Output);
  /**
   * Optional custom transport socket implementation to use for downstream connections.
   * To setup TLS, set a transport socket with name `tls` and
   * :ref:`DownstreamTlsContext <envoy_api_msg_auth.DownstreamTlsContext>` in the `typed_config`.
   * If no transport socket configuration is specified, new connections
   * will be set up with plaintext.
   */
  'transport_socket'?: (_envoy_api_v2_core_TransportSocket__Output);
  /**
   * [#not-implemented-hide:] The unique name (or empty) by which this filter chain is known. If no
   * name is provided, Envoy will allocate an internal UUID for the filter chain. If the filter
   * chain is to be dynamically updated or removed via FCDS a unique name must be provided.
   */
  'name': (string);
}
