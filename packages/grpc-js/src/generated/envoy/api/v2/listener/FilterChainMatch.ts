// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { CidrRange as _envoy_api_v2_core_CidrRange, CidrRange__Output as _envoy_api_v2_core_CidrRange__Output } from '../../../../envoy/api/v2/core/CidrRange';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

export enum _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType {
  /**
   * Any connection source matches.
   */
  ANY = 0,
  /**
   * Match a connection originating from the same host.
   */
  LOCAL = 1,
  /**
   * Match a connection originating from a different host.
   */
  EXTERNAL = 2,
}

/**
 * Specifies the match criteria for selecting a specific filter chain for a
 * listener.
 * 
 * In order for a filter chain to be selected, *ALL* of its criteria must be
 * fulfilled by the incoming connection, properties of which are set by the
 * networking stack and/or listener filters.
 * 
 * The following order applies:
 * 
 * 1. Destination port.
 * 2. Destination IP address.
 * 3. Server name (e.g. SNI for TLS protocol),
 * 4. Transport protocol.
 * 5. Application protocols (e.g. ALPN for TLS protocol).
 * 6. Source type (e.g. any, local or external network).
 * 7. Source IP address.
 * 8. Source port.
 * 
 * For criteria that allow ranges or wildcards, the most specific value in any
 * of the configured filter chains that matches the incoming connection is going
 * to be used (e.g. for SNI ``www.example.com`` the most specific match would be
 * ``www.example.com``, then ``*.example.com``, then ``*.com``, then any filter
 * chain without ``server_names`` requirements).
 * 
 * [#comment: Implemented rules are kept in the preference order, with deprecated fields
 * listed at the end, because that's how we want to list them in the docs.
 * 
 * [#comment:TODO(PiotrSikora): Add support for configurable precedence of the rules]
 * [#next-free-field: 13]
 */
export interface FilterChainMatch {
  /**
   * If non-empty, an IP address and prefix length to match addresses when the
   * listener is bound to 0.0.0.0/:: or when use_original_dst is specified.
   */
  'prefix_ranges'?: (_envoy_api_v2_core_CidrRange)[];
  /**
   * If non-empty, an IP address and suffix length to match addresses when the
   * listener is bound to 0.0.0.0/:: or when use_original_dst is specified.
   * [#not-implemented-hide:]
   */
  'address_suffix'?: (string);
  /**
   * [#not-implemented-hide:]
   */
  'suffix_len'?: (_google_protobuf_UInt32Value);
  /**
   * The criteria is satisfied if the source IP address of the downstream
   * connection is contained in at least one of the specified subnets. If the
   * parameter is not specified or the list is empty, the source IP address is
   * ignored.
   */
  'source_prefix_ranges'?: (_envoy_api_v2_core_CidrRange)[];
  /**
   * The criteria is satisfied if the source port of the downstream connection
   * is contained in at least one of the specified ports. If the parameter is
   * not specified, the source port is ignored.
   */
  'source_ports'?: (number)[];
  /**
   * Optional destination port to consider when use_original_dst is set on the
   * listener in determining a filter chain match.
   */
  'destination_port'?: (_google_protobuf_UInt32Value);
  /**
   * If non-empty, a transport protocol to consider when determining a filter chain match.
   * This value will be compared against the transport protocol of a new connection, when
   * it's detected by one of the listener filters.
   * 
   * Suggested values include:
   * 
   * * ``raw_buffer`` - default, used when no transport protocol is detected,
   * * ``tls`` - set by :ref:`envoy.filters.listener.tls_inspector <config_listener_filters_tls_inspector>`
   * when TLS protocol is detected.
   */
  'transport_protocol'?: (string);
  /**
   * If non-empty, a list of application protocols (e.g. ALPN for TLS protocol) to consider when
   * determining a filter chain match. Those values will be compared against the application
   * protocols of a new connection, when detected by one of the listener filters.
   * 
   * Suggested values include:
   * 
   * * ``http/1.1`` - set by :ref:`envoy.filters.listener.tls_inspector
   * <config_listener_filters_tls_inspector>`,
   * * ``h2`` - set by :ref:`envoy.filters.listener.tls_inspector <config_listener_filters_tls_inspector>`
   * 
   * .. attention::
   * 
   * Currently, only :ref:`TLS Inspector <config_listener_filters_tls_inspector>` provides
   * application protocol detection based on the requested
   * `ALPN <https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation>`_ values.
   * 
   * However, the use of ALPN is pretty much limited to the HTTP/2 traffic on the Internet,
   * and matching on values other than ``h2`` is going to lead to a lot of false negatives,
   * unless all connecting clients are known to use ALPN.
   */
  'application_protocols'?: (string)[];
  /**
   * If non-empty, a list of server names (e.g. SNI for TLS protocol) to consider when determining
   * a filter chain match. Those values will be compared against the server names of a new
   * connection, when detected by one of the listener filters.
   * 
   * The server name will be matched against all wildcard domains, i.e. ``www.example.com``
   * will be first matched against ``www.example.com``, then ``*.example.com``, then ``*.com``.
   * 
   * Note that partial wildcards are not supported, and values like ``*w.example.com`` are invalid.
   * 
   * .. attention::
   * 
   * See the :ref:`FAQ entry <faq_how_to_setup_sni>` on how to configure SNI for more
   * information.
   */
  'server_names'?: (string)[];
  /**
   * Specifies the connection source IP match type. Can be any, local or external network.
   */
  'source_type'?: (_envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType | keyof typeof _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType);
}

/**
 * Specifies the match criteria for selecting a specific filter chain for a
 * listener.
 * 
 * In order for a filter chain to be selected, *ALL* of its criteria must be
 * fulfilled by the incoming connection, properties of which are set by the
 * networking stack and/or listener filters.
 * 
 * The following order applies:
 * 
 * 1. Destination port.
 * 2. Destination IP address.
 * 3. Server name (e.g. SNI for TLS protocol),
 * 4. Transport protocol.
 * 5. Application protocols (e.g. ALPN for TLS protocol).
 * 6. Source type (e.g. any, local or external network).
 * 7. Source IP address.
 * 8. Source port.
 * 
 * For criteria that allow ranges or wildcards, the most specific value in any
 * of the configured filter chains that matches the incoming connection is going
 * to be used (e.g. for SNI ``www.example.com`` the most specific match would be
 * ``www.example.com``, then ``*.example.com``, then ``*.com``, then any filter
 * chain without ``server_names`` requirements).
 * 
 * [#comment: Implemented rules are kept in the preference order, with deprecated fields
 * listed at the end, because that's how we want to list them in the docs.
 * 
 * [#comment:TODO(PiotrSikora): Add support for configurable precedence of the rules]
 * [#next-free-field: 13]
 */
export interface FilterChainMatch__Output {
  /**
   * If non-empty, an IP address and prefix length to match addresses when the
   * listener is bound to 0.0.0.0/:: or when use_original_dst is specified.
   */
  'prefix_ranges': (_envoy_api_v2_core_CidrRange__Output)[];
  /**
   * If non-empty, an IP address and suffix length to match addresses when the
   * listener is bound to 0.0.0.0/:: or when use_original_dst is specified.
   * [#not-implemented-hide:]
   */
  'address_suffix': (string);
  /**
   * [#not-implemented-hide:]
   */
  'suffix_len'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The criteria is satisfied if the source IP address of the downstream
   * connection is contained in at least one of the specified subnets. If the
   * parameter is not specified or the list is empty, the source IP address is
   * ignored.
   */
  'source_prefix_ranges': (_envoy_api_v2_core_CidrRange__Output)[];
  /**
   * The criteria is satisfied if the source port of the downstream connection
   * is contained in at least one of the specified ports. If the parameter is
   * not specified, the source port is ignored.
   */
  'source_ports': (number)[];
  /**
   * Optional destination port to consider when use_original_dst is set on the
   * listener in determining a filter chain match.
   */
  'destination_port'?: (_google_protobuf_UInt32Value__Output);
  /**
   * If non-empty, a transport protocol to consider when determining a filter chain match.
   * This value will be compared against the transport protocol of a new connection, when
   * it's detected by one of the listener filters.
   * 
   * Suggested values include:
   * 
   * * ``raw_buffer`` - default, used when no transport protocol is detected,
   * * ``tls`` - set by :ref:`envoy.filters.listener.tls_inspector <config_listener_filters_tls_inspector>`
   * when TLS protocol is detected.
   */
  'transport_protocol': (string);
  /**
   * If non-empty, a list of application protocols (e.g. ALPN for TLS protocol) to consider when
   * determining a filter chain match. Those values will be compared against the application
   * protocols of a new connection, when detected by one of the listener filters.
   * 
   * Suggested values include:
   * 
   * * ``http/1.1`` - set by :ref:`envoy.filters.listener.tls_inspector
   * <config_listener_filters_tls_inspector>`,
   * * ``h2`` - set by :ref:`envoy.filters.listener.tls_inspector <config_listener_filters_tls_inspector>`
   * 
   * .. attention::
   * 
   * Currently, only :ref:`TLS Inspector <config_listener_filters_tls_inspector>` provides
   * application protocol detection based on the requested
   * `ALPN <https://en.wikipedia.org/wiki/Application-Layer_Protocol_Negotiation>`_ values.
   * 
   * However, the use of ALPN is pretty much limited to the HTTP/2 traffic on the Internet,
   * and matching on values other than ``h2`` is going to lead to a lot of false negatives,
   * unless all connecting clients are known to use ALPN.
   */
  'application_protocols': (string)[];
  /**
   * If non-empty, a list of server names (e.g. SNI for TLS protocol) to consider when determining
   * a filter chain match. Those values will be compared against the server names of a new
   * connection, when detected by one of the listener filters.
   * 
   * The server name will be matched against all wildcard domains, i.e. ``www.example.com``
   * will be first matched against ``www.example.com``, then ``*.example.com``, then ``*.com``.
   * 
   * Note that partial wildcards are not supported, and values like ``*w.example.com`` are invalid.
   * 
   * .. attention::
   * 
   * See the :ref:`FAQ entry <faq_how_to_setup_sni>` on how to configure SNI for more
   * information.
   */
  'server_names': (string)[];
  /**
   * Specifies the connection source IP match type. Can be any, local or external network.
   */
  'source_type': (keyof typeof _envoy_api_v2_listener_FilterChainMatch_ConnectionSourceType);
}
