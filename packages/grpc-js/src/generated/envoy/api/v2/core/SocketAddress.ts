// Original file: deps/envoy-api/envoy/api/v2/core/address.proto


// Original file: deps/envoy-api/envoy/api/v2/core/address.proto

export enum _envoy_api_v2_core_SocketAddress_Protocol {
  TCP = 0,
  UDP = 1,
}

/**
 * [#next-free-field: 7]
 */
export interface SocketAddress {
  'protocol'?: (_envoy_api_v2_core_SocketAddress_Protocol | keyof typeof _envoy_api_v2_core_SocketAddress_Protocol);
  /**
   * The address for this socket. :ref:`Listeners <config_listeners>` will bind
   * to the address. An empty address is not allowed. Specify ``0.0.0.0`` or ``::``
   * to bind to any address. [#comment:TODO(zuercher) reinstate when implemented:
   * It is possible to distinguish a Listener address via the prefix/suffix matching
   * in :ref:`FilterChainMatch <envoy_api_msg_listener.FilterChainMatch>`.] When used
   * within an upstream :ref:`BindConfig <envoy_api_msg_core.BindConfig>`, the address
   * controls the source address of outbound connections. For :ref:`clusters
   * <envoy_api_msg_Cluster>`, the cluster type determines whether the
   * address must be an IP (*STATIC* or *EDS* clusters) or a hostname resolved by DNS
   * (*STRICT_DNS* or *LOGICAL_DNS* clusters). Address resolution can be customized
   * via :ref:`resolver_name <envoy_api_field_core.SocketAddress.resolver_name>`.
   */
  'address'?: (string);
  'port_value'?: (number);
  /**
   * This is only valid if :ref:`resolver_name
   * <envoy_api_field_core.SocketAddress.resolver_name>` is specified below and the
   * named resolver is capable of named port resolution.
   */
  'named_port'?: (string);
  /**
   * The name of the custom resolver. This must have been registered with Envoy. If
   * this is empty, a context dependent default applies. If the address is a concrete
   * IP address, no resolution will occur. If address is a hostname this
   * should be set for resolution other than DNS. Specifying a custom resolver with
   * *STRICT_DNS* or *LOGICAL_DNS* will generate an error at runtime.
   */
  'resolver_name'?: (string);
  /**
   * When binding to an IPv6 address above, this enables `IPv4 compatibility
   * <https://tools.ietf.org/html/rfc3493#page-11>`_. Binding to ``::`` will
   * allow both IPv4 and IPv6 connections, with peer IPv4 addresses mapped into
   * IPv6 space as ``::FFFF:<IPv4-address>``.
   */
  'ipv4_compat'?: (boolean);
  'port_specifier'?: "port_value"|"named_port";
}

/**
 * [#next-free-field: 7]
 */
export interface SocketAddress__Output {
  'protocol': (keyof typeof _envoy_api_v2_core_SocketAddress_Protocol);
  /**
   * The address for this socket. :ref:`Listeners <config_listeners>` will bind
   * to the address. An empty address is not allowed. Specify ``0.0.0.0`` or ``::``
   * to bind to any address. [#comment:TODO(zuercher) reinstate when implemented:
   * It is possible to distinguish a Listener address via the prefix/suffix matching
   * in :ref:`FilterChainMatch <envoy_api_msg_listener.FilterChainMatch>`.] When used
   * within an upstream :ref:`BindConfig <envoy_api_msg_core.BindConfig>`, the address
   * controls the source address of outbound connections. For :ref:`clusters
   * <envoy_api_msg_Cluster>`, the cluster type determines whether the
   * address must be an IP (*STATIC* or *EDS* clusters) or a hostname resolved by DNS
   * (*STRICT_DNS* or *LOGICAL_DNS* clusters). Address resolution can be customized
   * via :ref:`resolver_name <envoy_api_field_core.SocketAddress.resolver_name>`.
   */
  'address': (string);
  'port_value'?: (number);
  /**
   * This is only valid if :ref:`resolver_name
   * <envoy_api_field_core.SocketAddress.resolver_name>` is specified below and the
   * named resolver is capable of named port resolution.
   */
  'named_port'?: (string);
  /**
   * The name of the custom resolver. This must have been registered with Envoy. If
   * this is empty, a context dependent default applies. If the address is a concrete
   * IP address, no resolution will occur. If address is a hostname this
   * should be set for resolution other than DNS. Specifying a custom resolver with
   * *STRICT_DNS* or *LOGICAL_DNS* will generate an error at runtime.
   */
  'resolver_name': (string);
  /**
   * When binding to an IPv6 address above, this enables `IPv4 compatibility
   * <https://tools.ietf.org/html/rfc3493#page-11>`_. Binding to ``::`` will
   * allow both IPv4 and IPv6 connections, with peer IPv4 addresses mapped into
   * IPv6 space as ``::FFFF:<IPv4-address>``.
   */
  'ipv4_compat': (boolean);
  'port_specifier': "port_value"|"named_port";
}
