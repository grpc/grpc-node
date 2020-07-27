// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

import { Route as _envoy_api_v2_route_Route, Route__Output as _envoy_api_v2_route_Route__Output } from '../../../../envoy/api/v2/route/Route';
import { VirtualCluster as _envoy_api_v2_route_VirtualCluster, VirtualCluster__Output as _envoy_api_v2_route_VirtualCluster__Output } from '../../../../envoy/api/v2/route/VirtualCluster';
import { RateLimit as _envoy_api_v2_route_RateLimit, RateLimit__Output as _envoy_api_v2_route_RateLimit__Output } from '../../../../envoy/api/v2/route/RateLimit';
import { HeaderValueOption as _envoy_api_v2_core_HeaderValueOption, HeaderValueOption__Output as _envoy_api_v2_core_HeaderValueOption__Output } from '../../../../envoy/api/v2/core/HeaderValueOption';
import { CorsPolicy as _envoy_api_v2_route_CorsPolicy, CorsPolicy__Output as _envoy_api_v2_route_CorsPolicy__Output } from '../../../../envoy/api/v2/route/CorsPolicy';
import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import { RetryPolicy as _envoy_api_v2_route_RetryPolicy, RetryPolicy__Output as _envoy_api_v2_route_RetryPolicy__Output } from '../../../../envoy/api/v2/route/RetryPolicy';
import { HedgePolicy as _envoy_api_v2_route_HedgePolicy, HedgePolicy__Output as _envoy_api_v2_route_HedgePolicy__Output } from '../../../../envoy/api/v2/route/HedgePolicy';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/api/v2/route/route_components.proto

export enum _envoy_api_v2_route_VirtualHost_TlsRequirementType {
  /**
   * No TLS requirement for the virtual host.
   */
  NONE = 0,
  /**
   * External requests must use TLS. If a request is external and it is not
   * using TLS, a 301 redirect will be sent telling the client to use HTTPS.
   */
  EXTERNAL_ONLY = 1,
  /**
   * All requests must use TLS. If a request is not using TLS, a 301 redirect
   * will be sent telling the client to use HTTPS.
   */
  ALL = 2,
}

/**
 * The top level element in the routing configuration is a virtual host. Each virtual host has
 * a logical name as well as a set of domains that get routed to it based on the incoming request's
 * host header. This allows a single listener to service multiple top level domain path trees. Once
 * a virtual host is selected based on the domain, the routes are processed in order to see which
 * upstream cluster to route to or whether to perform a redirect.
 * [#next-free-field: 21]
 */
export interface VirtualHost {
  /**
   * The logical name of the virtual host. This is used when emitting certain
   * statistics but is not relevant for routing.
   */
  'name'?: (string);
  /**
   * A list of domains (host/authority header) that will be matched to this
   * virtual host. Wildcard hosts are supported in the suffix or prefix form.
   * 
   * Domain search order:
   * 1. Exact domain names: ``www.foo.com``.
   * 2. Suffix domain wildcards: ``*.foo.com`` or ``*-bar.foo.com``.
   * 3. Prefix domain wildcards: ``foo.*`` or ``foo-*``.
   * 4. Special wildcard ``*`` matching any domain.
   * 
   * .. note::
   * 
   * The wildcard will not match the empty string.
   * e.g. ``*-bar.foo.com`` will match ``baz-bar.foo.com`` but not ``-bar.foo.com``.
   * The longest wildcards match first.
   * Only a single virtual host in the entire route configuration can match on ``*``. A domain
   * must be unique across all virtual hosts or the config will fail to load.
   * 
   * Domains cannot contain control characters. This is validated by the well_known_regex HTTP_HEADER_VALUE.
   */
  'domains'?: (string)[];
  /**
   * The list of routes that will be matched, in order, for incoming requests.
   * The first route that matches will be used.
   */
  'routes'?: (_envoy_api_v2_route_Route)[];
  /**
   * Specifies the type of TLS enforcement the virtual host expects. If this option is not
   * specified, there is no TLS requirement for the virtual host.
   */
  'require_tls'?: (_envoy_api_v2_route_VirtualHost_TlsRequirementType | keyof typeof _envoy_api_v2_route_VirtualHost_TlsRequirementType);
  /**
   * A list of virtual clusters defined for this virtual host. Virtual clusters
   * are used for additional statistics gathering.
   */
  'virtual_clusters'?: (_envoy_api_v2_route_VirtualCluster)[];
  /**
   * Specifies a set of rate limit configurations that will be applied to the
   * virtual host.
   */
  'rate_limits'?: (_envoy_api_v2_route_RateLimit)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_api_msg_route.Route` and before headers from the
   * enclosing :ref:`envoy_api_msg_RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Indicates that the virtual host has a CORS policy.
   */
  'cors'?: (_envoy_api_v2_route_CorsPolicy);
  /**
   * Specifies a list of HTTP headers that should be added to each response
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_api_msg_route.Route` and before headers from the
   * enclosing :ref:`envoy_api_msg_RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_api_v2_core_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * handled by this virtual host.
   */
  'response_headers_to_remove'?: (string)[];
  /**
   * The per_filter_config field can be used to provide virtual host-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'per_filter_config'?: ({[key: string]: _google_protobuf_Struct});
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * handled by this virtual host.
   */
  'request_headers_to_remove'?: (string)[];
  /**
   * Decides whether the :ref:`x-envoy-attempt-count
   * <config_http_filters_router_x-envoy-attempt-count>` header should be included
   * in the upstream request. Setting this option will cause it to override any existing header
   * value, so in the case of two Envoys on the request path with this option enabled, the upstream
   * will see the attempt count as perceived by the second Envoy. Defaults to false.
   * This header is unaffected by the
   * :ref:`suppress_envoy_headers
   * <envoy_api_field_config.filter.http.router.v2.Router.suppress_envoy_headers>` flag.
   * 
   * [#next-major-version: rename to include_attempt_count_in_request.]
   */
  'include_request_attempt_count'?: (boolean);
  /**
   * The per_filter_config field can be used to provide virtual host-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any});
  /**
   * Indicates the retry policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'retry_policy'?: (_envoy_api_v2_route_RetryPolicy);
  /**
   * Indicates the hedge policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'hedge_policy'?: (_envoy_api_v2_route_HedgePolicy);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set and a route-specific limit is not set, the bytes actually buffered will be the minimum
   * value of this and the listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value);
  /**
   * Decides whether the :ref:`x-envoy-attempt-count
   * <config_http_filters_router_x-envoy-attempt-count>` header should be included
   * in the downstream response. Setting this option will cause the router to override any existing header
   * value, so in the case of two Envoys on the request path with this option enabled, the downstream
   * will see the attempt count as perceived by the Envoy closest upstream from itself. Defaults to false.
   * This header is unaffected by the
   * :ref:`suppress_envoy_headers
   * <envoy_api_field_config.filter.http.router.v2.Router.suppress_envoy_headers>` flag.
   */
  'include_attempt_count_in_response'?: (boolean);
  /**
   * [#not-implemented-hide:]
   * Specifies the configuration for retry policy extension. Note that setting a route level entry
   * will take precedence over this config and it'll be treated independently (e.g.: values are not
   * inherited). :ref:`Retry policy <envoy_api_field_route.VirtualHost.retry_policy>` should not be
   * set if this field is used.
   */
  'retry_policy_typed_config'?: (_google_protobuf_Any);
}

/**
 * The top level element in the routing configuration is a virtual host. Each virtual host has
 * a logical name as well as a set of domains that get routed to it based on the incoming request's
 * host header. This allows a single listener to service multiple top level domain path trees. Once
 * a virtual host is selected based on the domain, the routes are processed in order to see which
 * upstream cluster to route to or whether to perform a redirect.
 * [#next-free-field: 21]
 */
export interface VirtualHost__Output {
  /**
   * The logical name of the virtual host. This is used when emitting certain
   * statistics but is not relevant for routing.
   */
  'name': (string);
  /**
   * A list of domains (host/authority header) that will be matched to this
   * virtual host. Wildcard hosts are supported in the suffix or prefix form.
   * 
   * Domain search order:
   * 1. Exact domain names: ``www.foo.com``.
   * 2. Suffix domain wildcards: ``*.foo.com`` or ``*-bar.foo.com``.
   * 3. Prefix domain wildcards: ``foo.*`` or ``foo-*``.
   * 4. Special wildcard ``*`` matching any domain.
   * 
   * .. note::
   * 
   * The wildcard will not match the empty string.
   * e.g. ``*-bar.foo.com`` will match ``baz-bar.foo.com`` but not ``-bar.foo.com``.
   * The longest wildcards match first.
   * Only a single virtual host in the entire route configuration can match on ``*``. A domain
   * must be unique across all virtual hosts or the config will fail to load.
   * 
   * Domains cannot contain control characters. This is validated by the well_known_regex HTTP_HEADER_VALUE.
   */
  'domains': (string)[];
  /**
   * The list of routes that will be matched, in order, for incoming requests.
   * The first route that matches will be used.
   */
  'routes': (_envoy_api_v2_route_Route__Output)[];
  /**
   * Specifies the type of TLS enforcement the virtual host expects. If this option is not
   * specified, there is no TLS requirement for the virtual host.
   */
  'require_tls': (keyof typeof _envoy_api_v2_route_VirtualHost_TlsRequirementType);
  /**
   * A list of virtual clusters defined for this virtual host. Virtual clusters
   * are used for additional statistics gathering.
   */
  'virtual_clusters': (_envoy_api_v2_route_VirtualCluster__Output)[];
  /**
   * Specifies a set of rate limit configurations that will be applied to the
   * virtual host.
   */
  'rate_limits': (_envoy_api_v2_route_RateLimit__Output)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_api_msg_route.Route` and before headers from the
   * enclosing :ref:`envoy_api_msg_RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Indicates that the virtual host has a CORS policy.
   */
  'cors'?: (_envoy_api_v2_route_CorsPolicy__Output);
  /**
   * Specifies a list of HTTP headers that should be added to each response
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_api_msg_route.Route` and before headers from the
   * enclosing :ref:`envoy_api_msg_RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_api_v2_core_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * handled by this virtual host.
   */
  'response_headers_to_remove': (string)[];
  /**
   * The per_filter_config field can be used to provide virtual host-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'per_filter_config'?: ({[key: string]: _google_protobuf_Struct__Output});
  /**
   * Specifies a list of HTTP headers that should be removed from each request
   * handled by this virtual host.
   */
  'request_headers_to_remove': (string)[];
  /**
   * Decides whether the :ref:`x-envoy-attempt-count
   * <config_http_filters_router_x-envoy-attempt-count>` header should be included
   * in the upstream request. Setting this option will cause it to override any existing header
   * value, so in the case of two Envoys on the request path with this option enabled, the upstream
   * will see the attempt count as perceived by the second Envoy. Defaults to false.
   * This header is unaffected by the
   * :ref:`suppress_envoy_headers
   * <envoy_api_field_config.filter.http.router.v2.Router.suppress_envoy_headers>` flag.
   * 
   * [#next-major-version: rename to include_attempt_count_in_request.]
   */
  'include_request_attempt_count': (boolean);
  /**
   * The per_filter_config field can be used to provide virtual host-specific
   * configurations for filters. The key should match the filter name, such as
   * *envoy.filters.http.buffer* for the HTTP buffer filter. Use of this field is filter
   * specific; see the :ref:`HTTP filter documentation <config_http_filters>`
   * for if and how it is utilized.
   */
  'typed_per_filter_config'?: ({[key: string]: _google_protobuf_Any__Output});
  /**
   * Indicates the retry policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'retry_policy'?: (_envoy_api_v2_route_RetryPolicy__Output);
  /**
   * Indicates the hedge policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'hedge_policy'?: (_envoy_api_v2_route_HedgePolicy__Output);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set and a route-specific limit is not set, the bytes actually buffered will be the minimum
   * value of this and the listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Decides whether the :ref:`x-envoy-attempt-count
   * <config_http_filters_router_x-envoy-attempt-count>` header should be included
   * in the downstream response. Setting this option will cause the router to override any existing header
   * value, so in the case of two Envoys on the request path with this option enabled, the downstream
   * will see the attempt count as perceived by the Envoy closest upstream from itself. Defaults to false.
   * This header is unaffected by the
   * :ref:`suppress_envoy_headers
   * <envoy_api_field_config.filter.http.router.v2.Router.suppress_envoy_headers>` flag.
   */
  'include_attempt_count_in_response': (boolean);
  /**
   * [#not-implemented-hide:]
   * Specifies the configuration for retry policy extension. Note that setting a route level entry
   * will take precedence over this config and it'll be treated independently (e.g.: values are not
   * inherited). :ref:`Retry policy <envoy_api_field_route.VirtualHost.retry_policy>` should not be
   * set if this field is used.
   */
  'retry_policy_typed_config'?: (_google_protobuf_Any__Output);
}
