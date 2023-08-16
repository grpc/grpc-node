// Original file: deps/envoy-api/envoy/config/route/v3/route.proto

import type { VirtualHost as _envoy_config_route_v3_VirtualHost, VirtualHost__Output as _envoy_config_route_v3_VirtualHost__Output } from '../../../../envoy/config/route/v3/VirtualHost';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from '../../../../envoy/config/core/v3/HeaderValueOption';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { Vhds as _envoy_config_route_v3_Vhds, Vhds__Output as _envoy_config_route_v3_Vhds__Output } from '../../../../envoy/config/route/v3/Vhds';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { ClusterSpecifierPlugin as _envoy_config_route_v3_ClusterSpecifierPlugin, ClusterSpecifierPlugin__Output as _envoy_config_route_v3_ClusterSpecifierPlugin__Output } from '../../../../envoy/config/route/v3/ClusterSpecifierPlugin';
import type { _envoy_config_route_v3_RouteAction_RequestMirrorPolicy, _envoy_config_route_v3_RouteAction_RequestMirrorPolicy__Output } from '../../../../envoy/config/route/v3/RouteAction';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * [#next-free-field: 17]
 */
export interface RouteConfiguration {
  /**
   * The name of the route configuration. For example, it might match
   * :ref:`route_config_name
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.Rds.route_config_name>` in
   * :ref:`envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.Rds`.
   */
  'name'?: (string);
  /**
   * An array of virtual hosts that make up the route table.
   */
  'virtual_hosts'?: (_envoy_config_route_v3_VirtualHost)[];
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
   * after headers from any enclosed :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` or
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * that the connection manager encodes.
   */
  'response_headers_to_remove'?: (string)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * routed by the HTTP connection manager. Headers specified at this level are
   * applied after headers from any enclosed :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` or
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * An optional boolean that specifies whether the clusters that the route
   * table refers to will be validated by the cluster manager. If set to true
   * and a route refers to a non-existent cluster, the route table will not
   * load. If set to false and a route refers to a non-existent cluster, the
   * route table will load and the router filter will return a 404 if the route
   * is selected at runtime. This setting defaults to true if the route table
   * is statically defined via the :ref:`route_config
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.route_config>`
   * option. This setting default to false if the route table is loaded dynamically via the
   * :ref:`rds
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.rds>`
   * option. Users may wish to override the default behavior in certain cases (for example when
   * using CDS with a static route table).
   */
  'validate_clusters'?: (_google_protobuf_BoolValue | null);
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * routed by the HTTP connection manager.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * An array of virtual hosts will be dynamically loaded via the VHDS API.
   * Both ``virtual_hosts`` and ``vhds`` fields will be used when present. ``virtual_hosts`` can be used
   * for a base routing table or for infrequently changing virtual hosts. ``vhds`` is used for
   * on-demand discovery of virtual hosts. The contents of these two fields will be merged to
   * generate a routing table for a given RouteConfiguration, with ``vhds`` derived configuration
   * taking precedence.
   */
  'vhds'?: (_envoy_config_route_v3_Vhds | null);
  /**
   * By default, headers that should be added/removed are evaluated from most to least specific:
   * 
   * * route level
   * * virtual host level
   * * connection manager level
   * 
   * To allow setting overrides at the route or virtual host level, this order can be reversed
   * by setting this option to true. Defaults to false.
   */
  'most_specific_header_mutations_wins'?: (boolean);
  /**
   * The maximum bytes of the response :ref:`direct response body
   * <envoy_v3_api_field_config.route.v3.DirectResponseAction.body>` size. If not specified the default
   * is 4096.
   * 
   * .. warning::
   * 
   * Envoy currently holds the content of :ref:`direct response body
   * <envoy_v3_api_field_config.route.v3.DirectResponseAction.body>` in memory. Be careful setting
   * this to be larger than the default 4KB, since the allocated memory for direct response body
   * is not subject to data plane buffering controls.
   */
  'max_direct_response_body_size_bytes'?: (_google_protobuf_UInt32Value | null);
  /**
   * A list of plugins and their configurations which may be used by a
   * :ref:`cluster specifier plugin name <envoy_v3_api_field_config.route.v3.RouteAction.cluster_specifier_plugin>`
   * within the route. All ``extension.name`` fields in this list must be unique.
   */
  'cluster_specifier_plugins'?: (_envoy_config_route_v3_ClusterSpecifierPlugin)[];
  /**
   * Specify a set of default request mirroring policies which apply to all routes under its virtual hosts.
   * Note that policies are not merged, the most specific non-empty one becomes the mirror policies.
   */
  'request_mirror_policies'?: (_envoy_config_route_v3_RouteAction_RequestMirrorPolicy)[];
  /**
   * By default, port in :authority header (if any) is used in host matching.
   * With this option enabled, Envoy will ignore the port number in the :authority header (if any) when picking VirtualHost.
   * NOTE: this option will not strip the port number (if any) contained in route config
   * :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`.domains field.
   */
  'ignore_port_in_host_matching'?: (boolean);
  /**
   * Ignore path-parameters in path-matching.
   * Before RFC3986, URI were like(RFC1808): <scheme>://<net_loc>/<path>;<params>?<query>#<fragment>
   * Envoy by default takes ":path" as "<path>;<params>".
   * For users who want to only match path on the "<path>" portion, this option should be true.
   */
  'ignore_path_parameters_in_path_matching'?: (boolean);
  /**
   * The typed_per_filter_config field can be used to provide RouteConfiguration level per filter config.
   * The key should match the :ref:`filter config name
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpFilter.name>`.
   * The canonical filter name (e.g., ``envoy.filters.http.buffer`` for the HTTP buffer filter) can also
   * be used for the backwards compatibility. If there is no entry referred by the filter config name, the
   * entry referred by the canonical filter name will be provided to the filters as fallback.
   * 
   * Use of this field is filter specific;
   * see the :ref:`HTTP filter documentation <config_http_filters>` for if and how it is utilized.
   * [#comment: An entry's value may be wrapped in a
   * :ref:`FilterConfig<envoy_v3_api_msg_config.route.v3.FilterConfig>`
   * message to specify additional options.]
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any});
}

/**
 * [#next-free-field: 17]
 */
export interface RouteConfiguration__Output {
  /**
   * The name of the route configuration. For example, it might match
   * :ref:`route_config_name
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.Rds.route_config_name>` in
   * :ref:`envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.Rds`.
   */
  'name': (string);
  /**
   * An array of virtual hosts that make up the route table.
   */
  'virtual_hosts': (_envoy_config_route_v3_VirtualHost__Output)[];
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
   * after headers from any enclosed :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` or
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * that the connection manager encodes.
   */
  'response_headers_to_remove': (string)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * routed by the HTTP connection manager. Headers specified at this level are
   * applied after headers from any enclosed :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` or
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteAction`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * An optional boolean that specifies whether the clusters that the route
   * table refers to will be validated by the cluster manager. If set to true
   * and a route refers to a non-existent cluster, the route table will not
   * load. If set to false and a route refers to a non-existent cluster, the
   * route table will load and the router filter will return a 404 if the route
   * is selected at runtime. This setting defaults to true if the route table
   * is statically defined via the :ref:`route_config
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.route_config>`
   * option. This setting default to false if the route table is loaded dynamically via the
   * :ref:`rds
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.rds>`
   * option. Users may wish to override the default behavior in certain cases (for example when
   * using CDS with a static route table).
   */
  'validate_clusters': (_google_protobuf_BoolValue__Output | null);
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * routed by the HTTP connection manager.
   */
  'request_headers_to_remove': (string)[];
  /**
   * An array of virtual hosts will be dynamically loaded via the VHDS API.
   * Both ``virtual_hosts`` and ``vhds`` fields will be used when present. ``virtual_hosts`` can be used
   * for a base routing table or for infrequently changing virtual hosts. ``vhds`` is used for
   * on-demand discovery of virtual hosts. The contents of these two fields will be merged to
   * generate a routing table for a given RouteConfiguration, with ``vhds`` derived configuration
   * taking precedence.
   */
  'vhds': (_envoy_config_route_v3_Vhds__Output | null);
  /**
   * By default, headers that should be added/removed are evaluated from most to least specific:
   * 
   * * route level
   * * virtual host level
   * * connection manager level
   * 
   * To allow setting overrides at the route or virtual host level, this order can be reversed
   * by setting this option to true. Defaults to false.
   */
  'most_specific_header_mutations_wins': (boolean);
  /**
   * The maximum bytes of the response :ref:`direct response body
   * <envoy_v3_api_field_config.route.v3.DirectResponseAction.body>` size. If not specified the default
   * is 4096.
   * 
   * .. warning::
   * 
   * Envoy currently holds the content of :ref:`direct response body
   * <envoy_v3_api_field_config.route.v3.DirectResponseAction.body>` in memory. Be careful setting
   * this to be larger than the default 4KB, since the allocated memory for direct response body
   * is not subject to data plane buffering controls.
   */
  'max_direct_response_body_size_bytes': (_google_protobuf_UInt32Value__Output | null);
  /**
   * A list of plugins and their configurations which may be used by a
   * :ref:`cluster specifier plugin name <envoy_v3_api_field_config.route.v3.RouteAction.cluster_specifier_plugin>`
   * within the route. All ``extension.name`` fields in this list must be unique.
   */
  'cluster_specifier_plugins': (_envoy_config_route_v3_ClusterSpecifierPlugin__Output)[];
  /**
   * Specify a set of default request mirroring policies which apply to all routes under its virtual hosts.
   * Note that policies are not merged, the most specific non-empty one becomes the mirror policies.
   */
  'request_mirror_policies': (_envoy_config_route_v3_RouteAction_RequestMirrorPolicy__Output)[];
  /**
   * By default, port in :authority header (if any) is used in host matching.
   * With this option enabled, Envoy will ignore the port number in the :authority header (if any) when picking VirtualHost.
   * NOTE: this option will not strip the port number (if any) contained in route config
   * :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost`.domains field.
   */
  'ignore_port_in_host_matching': (boolean);
  /**
   * Ignore path-parameters in path-matching.
   * Before RFC3986, URI were like(RFC1808): <scheme>://<net_loc>/<path>;<params>?<query>#<fragment>
   * Envoy by default takes ":path" as "<path>;<params>".
   * For users who want to only match path on the "<path>" portion, this option should be true.
   */
  'ignore_path_parameters_in_path_matching': (boolean);
  /**
   * The typed_per_filter_config field can be used to provide RouteConfiguration level per filter config.
   * The key should match the :ref:`filter config name
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpFilter.name>`.
   * The canonical filter name (e.g., ``envoy.filters.http.buffer`` for the HTTP buffer filter) can also
   * be used for the backwards compatibility. If there is no entry referred by the filter config name, the
   * entry referred by the canonical filter name will be provided to the filters as fallback.
   * 
   * Use of this field is filter specific;
   * see the :ref:`HTTP filter documentation <config_http_filters>` for if and how it is utilized.
   * [#comment: An entry's value may be wrapped in a
   * :ref:`FilterConfig<envoy_v3_api_msg_config.route.v3.FilterConfig>`
   * message to specify additional options.]
   */
  'typed_per_filter_config': ({[key: string]: _google_protobuf_Any__Output});
}
