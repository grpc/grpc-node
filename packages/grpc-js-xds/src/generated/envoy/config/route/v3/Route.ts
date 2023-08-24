// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { RouteMatch as _envoy_config_route_v3_RouteMatch, RouteMatch__Output as _envoy_config_route_v3_RouteMatch__Output } from '../../../../envoy/config/route/v3/RouteMatch';
import type { RouteAction as _envoy_config_route_v3_RouteAction, RouteAction__Output as _envoy_config_route_v3_RouteAction__Output } from '../../../../envoy/config/route/v3/RouteAction';
import type { RedirectAction as _envoy_config_route_v3_RedirectAction, RedirectAction__Output as _envoy_config_route_v3_RedirectAction__Output } from '../../../../envoy/config/route/v3/RedirectAction';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { Decorator as _envoy_config_route_v3_Decorator, Decorator__Output as _envoy_config_route_v3_Decorator__Output } from '../../../../envoy/config/route/v3/Decorator';
import type { DirectResponseAction as _envoy_config_route_v3_DirectResponseAction, DirectResponseAction__Output as _envoy_config_route_v3_DirectResponseAction__Output } from '../../../../envoy/config/route/v3/DirectResponseAction';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from '../../../../envoy/config/core/v3/HeaderValueOption';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { Tracing as _envoy_config_route_v3_Tracing, Tracing__Output as _envoy_config_route_v3_Tracing__Output } from '../../../../envoy/config/route/v3/Tracing';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { FilterAction as _envoy_config_route_v3_FilterAction, FilterAction__Output as _envoy_config_route_v3_FilterAction__Output } from '../../../../envoy/config/route/v3/FilterAction';
import type { NonForwardingAction as _envoy_config_route_v3_NonForwardingAction, NonForwardingAction__Output as _envoy_config_route_v3_NonForwardingAction__Output } from '../../../../envoy/config/route/v3/NonForwardingAction';

/**
 * A route is both a specification of how to match a request as well as an indication of what to do
 * next (e.g., redirect, forward, rewrite, etc.).
 * 
 * .. attention::
 * 
 * Envoy supports routing on HTTP method via :ref:`header matching
 * <envoy_v3_api_msg_config.route.v3.HeaderMatcher>`.
 * [#next-free-field: 20]
 */
export interface Route {
  /**
   * Route matching parameters.
   */
  'match'?: (_envoy_config_route_v3_RouteMatch | null);
  /**
   * Route request to some upstream cluster.
   */
  'route'?: (_envoy_config_route_v3_RouteAction | null);
  /**
   * Return a redirect.
   */
  'redirect'?: (_envoy_config_route_v3_RedirectAction | null);
  /**
   * The Metadata field can be used to provide additional information
   * about the route. It can be used for configuration, stats, and logging.
   * The metadata should go under the filter namespace that will need it.
   * For instance, if the metadata is intended for the Router filter,
   * the filter name should be specified as ``envoy.filters.http.router``.
   */
  'metadata'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * Decorator for the matched route.
   */
  'decorator'?: (_envoy_config_route_v3_Decorator | null);
  /**
   * Return an arbitrary HTTP response directly, without proxying.
   */
  'direct_response'?: (_envoy_config_route_v3_DirectResponseAction | null);
  /**
   * Specifies a set of headers that will be added to requests matching this
   * route. Headers specified at this level are applied before headers from the
   * enclosing :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Specifies a set of headers that will be added to responses to requests
   * matching this route. Headers specified at this level are applied before
   * headers from the enclosing :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on
   * :ref:`custom request headers <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * to requests matching this route.
   */
  'response_headers_to_remove'?: (string)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * matching this route.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * The per_filter_config field can be used to provide route-specific configurations for filters.
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
  /**
   * Name for the route.
   */
  'name'?: (string);
  /**
   * Presence of the object defines whether the connection manager's tracing configuration
   * is overridden by this route specific instance.
   */
  'tracing'?: (_envoy_config_route_v3_Tracing | null);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set, the bytes actually buffered will be the minimum value of this and the
   * listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value | null);
  /**
   * [#not-implemented-hide:]
   * A filter-defined action (e.g., it could dynamically generate the RouteAction).
   * [#comment: TODO(samflattery): Remove cleanup in route_fuzz_test.cc when
   * implemented]
   */
  'filter_action'?: (_envoy_config_route_v3_FilterAction | null);
  /**
   * [#not-implemented-hide:]
   * An action used when the route will generate a response directly,
   * without forwarding to an upstream host. This will be used in non-proxy
   * xDS clients like the gRPC server. It could also be used in the future
   * in Envoy for a filter that directly generates responses for requests.
   */
  'non_forwarding_action'?: (_envoy_config_route_v3_NonForwardingAction | null);
  /**
   * The human readable prefix to use when emitting statistics for this endpoint.
   * The statistics are rooted at vhost.<virtual host name>.route.<stat_prefix>.
   * This should be set for highly critical
   * endpoints that one wishes to get “per-route” statistics on.
   * If not set, endpoint statistics are not generated.
   * 
   * The emitted statistics are the same as those documented for :ref:`virtual clusters <config_http_filters_router_vcluster_stats>`.
   * 
   * .. warning::
   * 
   * We do not recommend setting up a stat prefix for
   * every application endpoint. This is both not easily maintainable and
   * statistics use a non-trivial amount of memory(approximately 1KiB per route).
   */
  'stat_prefix'?: (string);
  'action'?: "route"|"redirect"|"direct_response"|"filter_action"|"non_forwarding_action";
}

/**
 * A route is both a specification of how to match a request as well as an indication of what to do
 * next (e.g., redirect, forward, rewrite, etc.).
 * 
 * .. attention::
 * 
 * Envoy supports routing on HTTP method via :ref:`header matching
 * <envoy_v3_api_msg_config.route.v3.HeaderMatcher>`.
 * [#next-free-field: 20]
 */
export interface Route__Output {
  /**
   * Route matching parameters.
   */
  'match': (_envoy_config_route_v3_RouteMatch__Output | null);
  /**
   * Route request to some upstream cluster.
   */
  'route'?: (_envoy_config_route_v3_RouteAction__Output | null);
  /**
   * Return a redirect.
   */
  'redirect'?: (_envoy_config_route_v3_RedirectAction__Output | null);
  /**
   * The Metadata field can be used to provide additional information
   * about the route. It can be used for configuration, stats, and logging.
   * The metadata should go under the filter namespace that will need it.
   * For instance, if the metadata is intended for the Router filter,
   * the filter name should be specified as ``envoy.filters.http.router``.
   */
  'metadata': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * Decorator for the matched route.
   */
  'decorator': (_envoy_config_route_v3_Decorator__Output | null);
  /**
   * Return an arbitrary HTTP response directly, without proxying.
   */
  'direct_response'?: (_envoy_config_route_v3_DirectResponseAction__Output | null);
  /**
   * Specifies a set of headers that will be added to requests matching this
   * route. Headers specified at this level are applied before headers from the
   * enclosing :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Specifies a set of headers that will be added to responses to requests
   * matching this route. Headers specified at this level are applied before
   * headers from the enclosing :ref:`envoy_v3_api_msg_config.route.v3.VirtualHost` and
   * :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on
   * :ref:`custom request headers <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * to requests matching this route.
   */
  'response_headers_to_remove': (string)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * matching this route.
   */
  'request_headers_to_remove': (string)[];
  /**
   * The per_filter_config field can be used to provide route-specific configurations for filters.
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
  /**
   * Name for the route.
   */
  'name': (string);
  /**
   * Presence of the object defines whether the connection manager's tracing configuration
   * is overridden by this route specific instance.
   */
  'tracing': (_envoy_config_route_v3_Tracing__Output | null);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set, the bytes actually buffered will be the minimum value of this and the
   * listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output | null);
  /**
   * [#not-implemented-hide:]
   * A filter-defined action (e.g., it could dynamically generate the RouteAction).
   * [#comment: TODO(samflattery): Remove cleanup in route_fuzz_test.cc when
   * implemented]
   */
  'filter_action'?: (_envoy_config_route_v3_FilterAction__Output | null);
  /**
   * [#not-implemented-hide:]
   * An action used when the route will generate a response directly,
   * without forwarding to an upstream host. This will be used in non-proxy
   * xDS clients like the gRPC server. It could also be used in the future
   * in Envoy for a filter that directly generates responses for requests.
   */
  'non_forwarding_action'?: (_envoy_config_route_v3_NonForwardingAction__Output | null);
  /**
   * The human readable prefix to use when emitting statistics for this endpoint.
   * The statistics are rooted at vhost.<virtual host name>.route.<stat_prefix>.
   * This should be set for highly critical
   * endpoints that one wishes to get “per-route” statistics on.
   * If not set, endpoint statistics are not generated.
   * 
   * The emitted statistics are the same as those documented for :ref:`virtual clusters <config_http_filters_router_vcluster_stats>`.
   * 
   * .. warning::
   * 
   * We do not recommend setting up a stat prefix for
   * every application endpoint. This is both not easily maintainable and
   * statistics use a non-trivial amount of memory(approximately 1KiB per route).
   */
  'stat_prefix': (string);
  'action': "route"|"redirect"|"direct_response"|"filter_action"|"non_forwarding_action";
}
