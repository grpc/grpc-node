// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { Route as _envoy_config_route_v3_Route, Route__Output as _envoy_config_route_v3_Route__Output } from '../../../../envoy/config/route/v3/Route';
import type { VirtualCluster as _envoy_config_route_v3_VirtualCluster, VirtualCluster__Output as _envoy_config_route_v3_VirtualCluster__Output } from '../../../../envoy/config/route/v3/VirtualCluster';
import type { RateLimit as _envoy_config_route_v3_RateLimit, RateLimit__Output as _envoy_config_route_v3_RateLimit__Output } from '../../../../envoy/config/route/v3/RateLimit';
import type { HeaderValueOption as _envoy_config_core_v3_HeaderValueOption, HeaderValueOption__Output as _envoy_config_core_v3_HeaderValueOption__Output } from '../../../../envoy/config/core/v3/HeaderValueOption';
import type { CorsPolicy as _envoy_config_route_v3_CorsPolicy, CorsPolicy__Output as _envoy_config_route_v3_CorsPolicy__Output } from '../../../../envoy/config/route/v3/CorsPolicy';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { RetryPolicy as _envoy_config_route_v3_RetryPolicy, RetryPolicy__Output as _envoy_config_route_v3_RetryPolicy__Output } from '../../../../envoy/config/route/v3/RetryPolicy';
import type { HedgePolicy as _envoy_config_route_v3_HedgePolicy, HedgePolicy__Output as _envoy_config_route_v3_HedgePolicy__Output } from '../../../../envoy/config/route/v3/HedgePolicy';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Matcher as _xds_type_matcher_v3_Matcher, Matcher__Output as _xds_type_matcher_v3_Matcher__Output } from '../../../../xds/type/matcher/v3/Matcher';
import type { _envoy_config_route_v3_RouteAction_RequestMirrorPolicy, _envoy_config_route_v3_RouteAction_RequestMirrorPolicy__Output } from '../../../../envoy/config/route/v3/RouteAction';

// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

export enum _envoy_config_route_v3_VirtualHost_TlsRequirementType {
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
 * [#next-free-field: 24]
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
   * Only one of this and ``matcher`` can be specified.
   */
  'routes'?: (_envoy_config_route_v3_Route)[];
  /**
   * Specifies the type of TLS enforcement the virtual host expects. If this option is not
   * specified, there is no TLS requirement for the virtual host.
   */
  'require_tls'?: (_envoy_config_route_v3_VirtualHost_TlsRequirementType | keyof typeof _envoy_config_route_v3_VirtualHost_TlsRequirementType);
  /**
   * A list of virtual clusters defined for this virtual host. Virtual clusters
   * are used for additional statistics gathering.
   */
  'virtual_clusters'?: (_envoy_config_route_v3_VirtualCluster)[];
  /**
   * Specifies a set of rate limit configurations that will be applied to the
   * virtual host.
   */
  'rate_limits'?: (_envoy_config_route_v3_RateLimit)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_v3_api_msg_config.route.v3.Route` and before headers from the
   * enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Indicates that the virtual host has a CORS policy. This field is ignored if related cors policy is
   * found in the
   * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`.
   * 
   * .. attention::
   * 
   * This option has been deprecated. Please use
   * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`
   * to configure the CORS HTTP filter.
   */
  'cors'?: (_envoy_config_route_v3_CorsPolicy | null);
  /**
   * Specifies a list of HTTP headers that should be added to each response
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_v3_api_msg_config.route.v3.Route` and before headers from the
   * enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add'?: (_envoy_config_core_v3_HeaderValueOption)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * handled by this virtual host.
   */
  'response_headers_to_remove'?: (string)[];
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
   * <envoy_v3_api_field_extensions.filters.http.router.v3.Router.suppress_envoy_headers>` flag.
   * 
   * [#next-major-version: rename to include_attempt_count_in_request.]
   */
  'include_request_attempt_count'?: (boolean);
  /**
   * The per_filter_config field can be used to provide virtual host-specific configurations for filters.
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
   * Indicates the retry policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'retry_policy'?: (_envoy_config_route_v3_RetryPolicy | null);
  /**
   * Indicates the hedge policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'hedge_policy'?: (_envoy_config_route_v3_HedgePolicy | null);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set and a route-specific limit is not set, the bytes actually buffered will be the minimum
   * value of this and the listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes'?: (_google_protobuf_UInt32Value | null);
  /**
   * Decides whether the :ref:`x-envoy-attempt-count
   * <config_http_filters_router_x-envoy-attempt-count>` header should be included
   * in the downstream response. Setting this option will cause the router to override any existing header
   * value, so in the case of two Envoys on the request path with this option enabled, the downstream
   * will see the attempt count as perceived by the Envoy closest upstream from itself. Defaults to false.
   * This header is unaffected by the
   * :ref:`suppress_envoy_headers
   * <envoy_v3_api_field_extensions.filters.http.router.v3.Router.suppress_envoy_headers>` flag.
   */
  'include_attempt_count_in_response'?: (boolean);
  /**
   * [#not-implemented-hide:]
   * Specifies the configuration for retry policy extension. Note that setting a route level entry
   * will take precedence over this config and it'll be treated independently (e.g.: values are not
   * inherited). :ref:`Retry policy <envoy_v3_api_field_config.route.v3.VirtualHost.retry_policy>` should not be
   * set if this field is used.
   */
  'retry_policy_typed_config'?: (_google_protobuf_Any | null);
  /**
   * [#next-major-version: This should be included in a oneof with routes wrapped in a message.]
   * The match tree to use when resolving route actions for incoming requests. Only one of this and ``routes``
   * can be specified.
   */
  'matcher'?: (_xds_type_matcher_v3_Matcher | null);
  /**
   * Specify a set of default request mirroring policies for every route under this virtual host.
   * It takes precedence over the route config mirror policy entirely.
   * That is, policies are not merged, the most specific non-empty one becomes the mirror policies.
   */
  'request_mirror_policies'?: (_envoy_config_route_v3_RouteAction_RequestMirrorPolicy)[];
  /**
   * Decides whether to include the :ref:`x-envoy-is-timeout-retry <config_http_filters_router_x-envoy-is-timeout-retry>`
   * request header in retries initiated by per try timeouts.
   */
  'include_is_timeout_retry_header'?: (boolean);
}

/**
 * The top level element in the routing configuration is a virtual host. Each virtual host has
 * a logical name as well as a set of domains that get routed to it based on the incoming request's
 * host header. This allows a single listener to service multiple top level domain path trees. Once
 * a virtual host is selected based on the domain, the routes are processed in order to see which
 * upstream cluster to route to or whether to perform a redirect.
 * [#next-free-field: 24]
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
   * Only one of this and ``matcher`` can be specified.
   */
  'routes': (_envoy_config_route_v3_Route__Output)[];
  /**
   * Specifies the type of TLS enforcement the virtual host expects. If this option is not
   * specified, there is no TLS requirement for the virtual host.
   */
  'require_tls': (keyof typeof _envoy_config_route_v3_VirtualHost_TlsRequirementType);
  /**
   * A list of virtual clusters defined for this virtual host. Virtual clusters
   * are used for additional statistics gathering.
   */
  'virtual_clusters': (_envoy_config_route_v3_VirtualCluster__Output)[];
  /**
   * Specifies a set of rate limit configurations that will be applied to the
   * virtual host.
   */
  'rate_limits': (_envoy_config_route_v3_RateLimit__Output)[];
  /**
   * Specifies a list of HTTP headers that should be added to each request
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_v3_api_msg_config.route.v3.Route` and before headers from the
   * enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'request_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Indicates that the virtual host has a CORS policy. This field is ignored if related cors policy is
   * found in the
   * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`.
   * 
   * .. attention::
   * 
   * This option has been deprecated. Please use
   * :ref:`VirtualHost.typed_per_filter_config<envoy_v3_api_field_config.route.v3.VirtualHost.typed_per_filter_config>`
   * to configure the CORS HTTP filter.
   */
  'cors': (_envoy_config_route_v3_CorsPolicy__Output | null);
  /**
   * Specifies a list of HTTP headers that should be added to each response
   * handled by this virtual host. Headers specified at this level are applied
   * after headers from enclosed :ref:`envoy_v3_api_msg_config.route.v3.Route` and before headers from the
   * enclosing :ref:`envoy_v3_api_msg_config.route.v3.RouteConfiguration`. For more information, including
   * details on header value syntax, see the documentation on :ref:`custom request headers
   * <config_http_conn_man_headers_custom_request_headers>`.
   */
  'response_headers_to_add': (_envoy_config_core_v3_HeaderValueOption__Output)[];
  /**
   * Specifies a list of HTTP headers that should be removed from each response
   * handled by this virtual host.
   */
  'response_headers_to_remove': (string)[];
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
   * <envoy_v3_api_field_extensions.filters.http.router.v3.Router.suppress_envoy_headers>` flag.
   * 
   * [#next-major-version: rename to include_attempt_count_in_request.]
   */
  'include_request_attempt_count': (boolean);
  /**
   * The per_filter_config field can be used to provide virtual host-specific configurations for filters.
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
   * Indicates the retry policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'retry_policy': (_envoy_config_route_v3_RetryPolicy__Output | null);
  /**
   * Indicates the hedge policy for all routes in this virtual host. Note that setting a
   * route level entry will take precedence over this config and it'll be treated
   * independently (e.g.: values are not inherited).
   */
  'hedge_policy': (_envoy_config_route_v3_HedgePolicy__Output | null);
  /**
   * The maximum bytes which will be buffered for retries and shadowing.
   * If set and a route-specific limit is not set, the bytes actually buffered will be the minimum
   * value of this and the listener per_connection_buffer_limit_bytes.
   */
  'per_request_buffer_limit_bytes': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Decides whether the :ref:`x-envoy-attempt-count
   * <config_http_filters_router_x-envoy-attempt-count>` header should be included
   * in the downstream response. Setting this option will cause the router to override any existing header
   * value, so in the case of two Envoys on the request path with this option enabled, the downstream
   * will see the attempt count as perceived by the Envoy closest upstream from itself. Defaults to false.
   * This header is unaffected by the
   * :ref:`suppress_envoy_headers
   * <envoy_v3_api_field_extensions.filters.http.router.v3.Router.suppress_envoy_headers>` flag.
   */
  'include_attempt_count_in_response': (boolean);
  /**
   * [#not-implemented-hide:]
   * Specifies the configuration for retry policy extension. Note that setting a route level entry
   * will take precedence over this config and it'll be treated independently (e.g.: values are not
   * inherited). :ref:`Retry policy <envoy_v3_api_field_config.route.v3.VirtualHost.retry_policy>` should not be
   * set if this field is used.
   */
  'retry_policy_typed_config': (_google_protobuf_Any__Output | null);
  /**
   * [#next-major-version: This should be included in a oneof with routes wrapped in a message.]
   * The match tree to use when resolving route actions for incoming requests. Only one of this and ``routes``
   * can be specified.
   */
  'matcher': (_xds_type_matcher_v3_Matcher__Output | null);
  /**
   * Specify a set of default request mirroring policies for every route under this virtual host.
   * It takes precedence over the route config mirror policy entirely.
   * That is, policies are not merged, the most specific non-empty one becomes the mirror policies.
   */
  'request_mirror_policies': (_envoy_config_route_v3_RouteAction_RequestMirrorPolicy__Output)[];
  /**
   * Decides whether to include the :ref:`x-envoy-is-timeout-retry <config_http_filters_router_x-envoy-is-timeout-retry>`
   * request header in retries initiated by per try timeouts.
   */
  'include_is_timeout_retry_header': (boolean);
}
