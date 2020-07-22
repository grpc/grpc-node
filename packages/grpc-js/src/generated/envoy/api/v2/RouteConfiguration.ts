// Original file: deps/envoy-api/envoy/api/v2/route.proto

import { VirtualHost as _envoy_api_v2_route_VirtualHost, VirtualHost__Output as _envoy_api_v2_route_VirtualHost__Output } from '../../../envoy/api/v2/route/VirtualHost';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../envoy/api/v2/core/HeaderValueOption';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../google/protobuf/BoolValue';
import { Vhds as _envoy_api_v2_Vhds, Vhds__Output as _envoy_api_v2_Vhds__Output } from '../../../envoy/api/v2/Vhds';

/**
 * [#next-free-field: 11]
 */
export interface RouteConfiguration {
  /**
   * The name of the route configuration. For example, it might match
   * :ref:`route_config_name
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.Rds.route_config_name>` in
   * :ref:`envoy_api_msg_config.filter.network.http_connection_manager.v2.Rds`.
   */
  'name'?: (string);
  /**
   * An array of virtual hosts that make up the route table.
   */
  'virtual_hosts'?: (_envoy_api_v2_route_VirtualHost)[];
  /**
   * Optionally specifies a list of HTTP headers that the connection manager
   * will consider to be internal only. If they are found on external requests they will be cleaned
   * prior to filter invocation. See :ref:`config_http_conn_man_headers_x-envoy-internal` for more
   * information.
   */
  'internal_only_headers'?: (string)[];
  /**
   * Specifies a list of HTTP headers that should be added to each response that
   * the connection manager encodes. Headers specified at this level are applied
   * after headers from any enclosed :ref:`envoy_api_msg_route.VirtualHost` or
   * :ref:`envoy_api_msg_route.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * that the connection manager encodes.
   */
  'response_headers_to_remove'?: (string)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * routed by the HTTP connection manager. Headers specified at this level are
   * applied after headers from any enclosed :ref:`envoy_api_msg_route.VirtualHost` or
   * :ref:`envoy_api_msg_route.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * An optional boolean that specifies whether the clusters that the route
   * table refers to will be validated by the cluster manager. If set to true
   * and a route refers to a non-existent cluster, the route table will not
   * load. If set to false and a route refers to a non-existent cluster, the
   * route table will load and the router filter will return a 404 if the route
   * is selected at runtime. This setting defaults to true if the route table
   * is statically defined via the :ref:`route_config
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.route_config>`
   * option. This setting default to false if the route table is loaded dynamically via the
   * :ref:`rds
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.rds>`
   * option. Users may wish to override the default behavior in certain cases (for example when
   * using CDS with a static route table).
   */
  'validate_clusters'?: (_google_protobuf_BoolValue);
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * routed by the HTTP connection manager.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * An array of virtual hosts will be dynamically loaded via the VHDS API.
   * Both *virtual_hosts* and *vhds* fields will be used when present. *virtual_hosts* can be used
   * for a base routing table or for infrequently changing virtual hosts. *vhds* is used for
   * on-demand discovery of virtual hosts. The contents of these two fields will be merged to
   * generate a routing table for a given RouteConfiguration, with *vhds* derived configuration
   * taking precedence.
   */
  'vhds'?: (_envoy_api_v2_Vhds);
  /**
   * By default, headers that should be added/removed are evaluated from most to least specific:
   * 
   * * route level
   * * virtual host level
   * * connection manager level
   * 
   * To allow setting overrides at the route or virtual host level, this order can be reversed
   * by setting this option to true. Defaults to false.
   * 
   * [#next-major-version: In the v3 API, this will default to true.]
   */
  'most_specific_header_mutations_wins'?: (boolean);
}

/**
 * [#next-free-field: 11]
 */
export interface RouteConfiguration__Output {
  /**
   * The name of the route configuration. For example, it might match
   * :ref:`route_config_name
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.Rds.route_config_name>` in
   * :ref:`envoy_api_msg_config.filter.network.http_connection_manager.v2.Rds`.
   */
  'name': (string);
  /**
   * An array of virtual hosts that make up the route table.
   */
  'virtual_hosts': (_envoy_api_v2_route_VirtualHost__Output)[];
  /**
   * Optionally specifies a list of HTTP headers that the connection manager
   * will consider to be internal only. If they are found on external requests they will be cleaned
   * prior to filter invocation. See :ref:`config_http_conn_man_headers_x-envoy-internal` for more
   * information.
   */
  'internal_only_headers': (string)[];
  /**
   * Specifies a list of HTTP headers that should be added to each response that
   * the connection manager encodes. Headers specified at this level are applied
   * after headers from any enclosed :ref:`envoy_api_msg_route.VirtualHost` or
   * :ref:`envoy_api_msg_route.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * that the connection manager encodes.
   */
  'response_headers_to_remove': (string)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * routed by the HTTP connection manager. Headers specified at this level are
   * applied after headers from any enclosed :ref:`envoy_api_msg_route.VirtualHost` or
   * :ref:`envoy_api_msg_route.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * An optional boolean that specifies whether the clusters that the route
   * table refers to will be validated by the cluster manager. If set to true
   * and a route refers to a non-existent cluster, the route table will not
   * load. If set to false and a route refers to a non-existent cluster, the
   * route table will load and the router filter will return a 404 if the route
   * is selected at runtime. This setting defaults to true if the route table
   * is statically defined via the :ref:`route_config
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.route_config>`
   * option. This setting default to false if the route table is loaded dynamically via the
   * :ref:`rds
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.rds>`
   * option. Users may wish to override the default behavior in certain cases (for example when
   * using CDS with a static route table).
   */
  'validate_clusters'?: (_google_protobuf_BoolValue__Output);
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * routed by the HTTP connection manager.
   */
  'request_headers_to_remove': (string)[];
  /**
   * An array of virtual hosts will be dynamically loaded via the VHDS API.
   * Both *virtual_hosts* and *vhds* fields will be used when present. *virtual_hosts* can be used
   * for a base routing table or for infrequently changing virtual hosts. *vhds* is used for
   * on-demand discovery of virtual hosts. The contents of these two fields will be merged to
   * generate a routing table for a given RouteConfiguration, with *vhds* derived configuration
   * taking precedence.
   */
  'vhds'?: (_envoy_api_v2_Vhds__Output);
  /**
   * By default, headers that should be added/removed are evaluated from most to least specific:
   * 
   * * route level
   * * virtual host level
   * * connection manager level
   * 
   * To allow setting overrides at the route or virtual host level, this order can be reversed
   * by setting this option to true. Defaults to false.
   * 
   * [#next-major-version: In the v3 API, this will default to true.]
   */
  'most_specific_header_mutations_wins': (boolean);
}
