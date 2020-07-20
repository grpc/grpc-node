// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { RouteMatch as _envoy_api_v2_route_RouteMatch, RouteMatch__Output as _envoy_api_v2_route_RouteMatch__Output } from '../../../../envoy/api/v2/route/RouteMatch';
import { RouteAction as _envoy_api_v2_route_RouteAction, RouteAction__Output as _envoy_api_v2_route_RouteAction__Output } from '../../../../envoy/api/v2/route/RouteAction';
import { RedirectAction as _envoy_api_v2_route_RedirectAction, RedirectAction__Output as _envoy_api_v2_route_RedirectAction__Output } from '../../../../envoy/api/v2/route/RedirectAction';
import { Metadata as _envoy_api_v2_core_Metadata, Metadata__Output as _envoy_api_v2_core_Metadata__Output } from '../../../../envoy/api/v2/core/Metadata';
import { Decorator as _envoy_api_v2_route_Decorator, Decorator__Output as _envoy_api_v2_route_Decorator__Output } from '../../../../envoy/api/v2/route/Decorator';
import { DirectResponseAction as _envoy_api_v2_route_DirectResponseAction, DirectResponseAction__Output as _envoy_api_v2_route_DirectResponseAction__Output } from '../../../../envoy/api/v2/route/DirectResponseAction';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { Tracing as _envoy_api_v2_route_Tracing, Tracing__Output as _envoy_api_v2_route_Tracing__Output } from '../../../../envoy/api/v2/route/Tracing';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import { FilterAction as _envoy_api_v2_route_FilterAction, FilterAction__Output as _envoy_api_v2_route_FilterAction__Output } from '../../../../envoy/api/v2/route/FilterAction';

/**
 * A route is both a specification of how to match a request as well as an indication of what to do
 * next (e.g., redirect, forward, rewrite, etc.).
 * 
 * .. attention::
 * 
 * Envoy supports routing on HTTP method via :ref:`header matching
 * <envoy_api_msg_route.HeaderMatcher>`.
 * [#next-free-field: 18]
 */
export interface Route {
  /**
   * Route matching parameters.
   */
  'match'?: (_envoy_api_v2_route_RouteMatch);
  /**
   * Route request to some upstream cluster.
   */
  'route'?: (_envoy_api_v2_route_RouteAction);
  /**
   * Return a redirect.
   */
  'redirect'?: (_envoy_api_v2_route_RedirectAction);
  /**
   * The Metadata field can be used to provide additional information
   * about the route. It can be used for configuration, stats, and logging.
   * The metadata should go under the filter namespace that will need it.
   * For instance, if the metadata is intended for the Router filter,
   * the filter name should be specified as *envoy.filters.http.router*.
   */
  'metadata'?: (_envoy_api_v2_core_Metadata);
  /**
   * Decorator for the matched route.
   */
  'decorator'?: (_envoy_api_v2_route_Decorator);
  /**
   * Return an arbitrary HTTP response directly, without proxying.
   */
  'direct_response'?: (_envoy_api_v2_route_DirectResponseAction);
  /**
   * The per_filter_config field can be used to provide route-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>` for
   * if and how it is utilized.
   */
  'per_filter_config'?: ({[key: string]: _google_protobuf_Struct});
  /**
   * Specifies a set of headers that will be added to requests matching this
   * route. Headers specified at this level are applied before headers from the
   * enclosing :ref:`envoy_api_msg_route.VirtualHost` and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Specifies a set of headers that will be added to responses to requests
   * matching this route. Headers specified at this level are applied before
   * headers from the enclosing :ref:`envoy_api_msg_route.VirtualHost` and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on
   * :ref:`custom request headers <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
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
   * The typed_per_filter_config field can be used to provide route-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>` for
   * if and how it is utilized.
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
  'tracing'?: (_envoy_api_v2_route_Tracing);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set, the bytes actually buffered will be the minimum value of this and the
   * listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  /**
   * [#not-implemented-hide:]
   * If true, a filter will define the action (e.g., it could dynamically generate the
   * RouteAction).
   */
  'filter_action'?: (_envoy_api_v2_route_FilterAction);
  'action'?: "route"|"redirect"|"direct_response"|"filter_action";
}

/**
 * A route is both a specification of how to match a request as well as an indication of what to do
 * next (e.g., redirect, forward, rewrite, etc.).
 * 
 * .. attention::
 * 
 * Envoy supports routing on HTTP method via :ref:`header matching
 * <envoy_api_msg_route.HeaderMatcher>`.
 * [#next-free-field: 18]
 */
export interface Route__Output {
  /**
   * Route matching parameters.
   */
  'match'?: (_envoy_api_v2_route_RouteMatch__Output);
  /**
   * Route request to some upstream cluster.
   */
  'route'?: (_envoy_api_v2_route_RouteAction__Output);
  /**
   * Return a redirect.
   */
  'redirect'?: (_envoy_api_v2_route_RedirectAction__Output);
  /**
   * The Metadata field can be used to provide additional information
   * about the route. It can be used for configuration, stats, and logging.
   * The metadata should go under the filter namespace that will need it.
   * For instance, if the metadata is intended for the Router filter,
   * the filter name should be specified as *envoy.filters.http.router*.
   */
  'metadata'?: (_envoy_api_v2_core_Metadata__Output);
  /**
   * Decorator for the matched route.
   */
  'decorator'?: (_envoy_api_v2_route_Decorator__Output);
  /**
   * Return an arbitrary HTTP response directly, without proxying.
   */
  'direct_response'?: (_envoy_api_v2_route_DirectResponseAction__Output);
  /**
   * The per_filter_config field can be used to provide route-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>` for
   * if and how it is utilized.
   */
  'per_filter_config'?: ({[key: string]: _google_protobuf_Struct__Output});
  /**
   * Specifies a set of headers that will be added to requests matching this
   * route. Headers specified at this level are applied before headers from the
   * enclosing :ref:`envoy_api_msg_route.VirtualHost` and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including details on
   * header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Specifies a set of headers that will be added to responses to requests
   * matching this route. Headers specified at this level are applied before
   * headers from the enclosing :ref:`envoy_api_msg_route.VirtualHost` and
   * :ref:`envoy_api_msg_RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on
   * :ref:`custom request headers <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
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
   * The typed_per_filter_config field can be used to provide route-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>` for
   * if and how it is utilized.
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any__Output});
  /**
   * Name for the route.
   */
  'name': (string);
  /**
   * Presence of the object defines whether the connection manager's tracing configuration
   * is overridden by this route specific instance.
   */
  'tracing'?: (_envoy_api_v2_route_Tracing__Output);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set, the bytes actually buffered will be the minimum value of this and the
   * listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value__Output);
  /**
   * [#not-implemented-hide:]
   * If true, a filter will define the action (e.g., it could dynamically generate the
   * RouteAction).
   */
  'filter_action'?: (_envoy_api_v2_route_FilterAction__Output);
  'action': "route"|"redirect"|"direct_response"|"filter_action";
}
