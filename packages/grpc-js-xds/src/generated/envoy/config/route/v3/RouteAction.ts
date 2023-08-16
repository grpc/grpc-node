// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { WeightedCluster as _envoy_config_route_v3_WeightedCluster, WeightedCluster__Output as _envoy_config_route_v3_WeightedCluster__Output } from '../../../../envoy/config/route/v3/WeightedCluster';
import type { Metadata as _envoy_config_core_v3_Metadata, Metadata__Output as _envoy_config_core_v3_Metadata__Output } from '../../../../envoy/config/core/v3/Metadata';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { RetryPolicy as _envoy_config_route_v3_RetryPolicy, RetryPolicy__Output as _envoy_config_route_v3_RetryPolicy__Output } from '../../../../envoy/config/route/v3/RetryPolicy';
import type { RoutingPriority as _envoy_config_core_v3_RoutingPriority } from '../../../../envoy/config/core/v3/RoutingPriority';
import type { RateLimit as _envoy_config_route_v3_RateLimit, RateLimit__Output as _envoy_config_route_v3_RateLimit__Output } from '../../../../envoy/config/route/v3/RateLimit';
import type { CorsPolicy as _envoy_config_route_v3_CorsPolicy, CorsPolicy__Output as _envoy_config_route_v3_CorsPolicy__Output } from '../../../../envoy/config/route/v3/CorsPolicy';
import type { HedgePolicy as _envoy_config_route_v3_HedgePolicy, HedgePolicy__Output as _envoy_config_route_v3_HedgePolicy__Output } from '../../../../envoy/config/route/v3/HedgePolicy';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { RegexMatchAndSubstitute as _envoy_type_matcher_v3_RegexMatchAndSubstitute, RegexMatchAndSubstitute__Output as _envoy_type_matcher_v3_RegexMatchAndSubstitute__Output } from '../../../../envoy/type/matcher/v3/RegexMatchAndSubstitute';
import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { InternalRedirectPolicy as _envoy_config_route_v3_InternalRedirectPolicy, InternalRedirectPolicy__Output as _envoy_config_route_v3_InternalRedirectPolicy__Output } from '../../../../envoy/config/route/v3/InternalRedirectPolicy';
import type { ClusterSpecifierPlugin as _envoy_config_route_v3_ClusterSpecifierPlugin, ClusterSpecifierPlugin__Output as _envoy_config_route_v3_ClusterSpecifierPlugin__Output } from '../../../../envoy/config/route/v3/ClusterSpecifierPlugin';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { RuntimeFractionalPercent as _envoy_config_core_v3_RuntimeFractionalPercent, RuntimeFractionalPercent__Output as _envoy_config_core_v3_RuntimeFractionalPercent__Output } from '../../../../envoy/config/core/v3/RuntimeFractionalPercent';
import type { ProxyProtocolConfig as _envoy_config_core_v3_ProxyProtocolConfig, ProxyProtocolConfig__Output as _envoy_config_core_v3_ProxyProtocolConfig__Output } from '../../../../envoy/config/core/v3/ProxyProtocolConfig';

// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

export enum _envoy_config_route_v3_RouteAction_ClusterNotFoundResponseCode {
  /**
   * HTTP status code - 503 Service Unavailable.
   */
  SERVICE_UNAVAILABLE = 0,
  /**
   * HTTP status code - 404 Not Found.
   */
  NOT_FOUND = 1,
  /**
   * HTTP status code - 500 Internal Server Error.
   */
  INTERNAL_SERVER_ERROR = 2,
}

/**
 * Configuration for sending data upstream as a raw data payload. This is used for
 * CONNECT or POST requests, when forwarding request payload as raw TCP.
 */
export interface _envoy_config_route_v3_RouteAction_UpgradeConfig_ConnectConfig {
  /**
   * If present, the proxy protocol header will be prepended to the CONNECT payload sent upstream.
   */
  'proxy_protocol_config'?: (_envoy_config_core_v3_ProxyProtocolConfig | null);
  /**
   * If set, the route will also allow forwarding POST payload as raw TCP.
   */
  'allow_post'?: (boolean);
}

/**
 * Configuration for sending data upstream as a raw data payload. This is used for
 * CONNECT or POST requests, when forwarding request payload as raw TCP.
 */
export interface _envoy_config_route_v3_RouteAction_UpgradeConfig_ConnectConfig__Output {
  /**
   * If present, the proxy protocol header will be prepended to the CONNECT payload sent upstream.
   */
  'proxy_protocol_config': (_envoy_config_core_v3_ProxyProtocolConfig__Output | null);
  /**
   * If set, the route will also allow forwarding POST payload as raw TCP.
   */
  'allow_post': (boolean);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_ConnectionProperties {
  /**
   * Hash on source IP address.
   */
  'source_ip'?: (boolean);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_ConnectionProperties__Output {
  /**
   * Hash on source IP address.
   */
  'source_ip': (boolean);
}

/**
 * Envoy supports two types of cookie affinity:
 * 
 * 1. Passive. Envoy takes a cookie that's present in the cookies header and
 * hashes on its value.
 * 
 * 2. Generated. Envoy generates and sets a cookie with an expiration (TTL)
 * on the first request from the client in its response to the client,
 * based on the endpoint the request gets sent to. The client then
 * presents this on the next and all subsequent requests. The hash of
 * this is sufficient to ensure these requests get sent to the same
 * endpoint. The cookie is generated by hashing the source and
 * destination ports and addresses so that multiple independent HTTP2
 * streams on the same connection will independently receive the same
 * cookie, even if they arrive at the Envoy simultaneously.
 */
export interface _envoy_config_route_v3_RouteAction_HashPolicy_Cookie {
  /**
   * The name of the cookie that will be used to obtain the hash key. If the
   * cookie is not present and ttl below is not set, no hash will be
   * produced.
   */
  'name'?: (string);
  /**
   * If specified, a cookie with the TTL will be generated if the cookie is
   * not present. If the TTL is present and zero, the generated cookie will
   * be a session cookie.
   */
  'ttl'?: (_google_protobuf_Duration | null);
  /**
   * The name of the path for the cookie. If no path is specified here, no path
   * will be set for the cookie.
   */
  'path'?: (string);
}

/**
 * Envoy supports two types of cookie affinity:
 * 
 * 1. Passive. Envoy takes a cookie that's present in the cookies header and
 * hashes on its value.
 * 
 * 2. Generated. Envoy generates and sets a cookie with an expiration (TTL)
 * on the first request from the client in its response to the client,
 * based on the endpoint the request gets sent to. The client then
 * presents this on the next and all subsequent requests. The hash of
 * this is sufficient to ensure these requests get sent to the same
 * endpoint. The cookie is generated by hashing the source and
 * destination ports and addresses so that multiple independent HTTP2
 * streams on the same connection will independently receive the same
 * cookie, even if they arrive at the Envoy simultaneously.
 */
export interface _envoy_config_route_v3_RouteAction_HashPolicy_Cookie__Output {
  /**
   * The name of the cookie that will be used to obtain the hash key. If the
   * cookie is not present and ttl below is not set, no hash will be
   * produced.
   */
  'name': (string);
  /**
   * If specified, a cookie with the TTL will be generated if the cookie is
   * not present. If the TTL is present and zero, the generated cookie will
   * be a session cookie.
   */
  'ttl': (_google_protobuf_Duration__Output | null);
  /**
   * The name of the path for the cookie. If no path is specified here, no path
   * will be set for the cookie.
   */
  'path': (string);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_FilterState {
  /**
   * The name of the Object in the per-request filterState, which is an
   * Envoy::Hashable object. If there is no data associated with the key,
   * or the stored object is not Envoy::Hashable, no hash will be produced.
   */
  'key'?: (string);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_FilterState__Output {
  /**
   * The name of the Object in the per-request filterState, which is an
   * Envoy::Hashable object. If there is no data associated with the key,
   * or the stored object is not Envoy::Hashable, no hash will be produced.
   */
  'key': (string);
}

/**
 * Specifies the route's hashing policy if the upstream cluster uses a hashing :ref:`load balancer
 * <arch_overview_load_balancing_types>`.
 * [#next-free-field: 7]
 */
export interface _envoy_config_route_v3_RouteAction_HashPolicy {
  /**
   * Header hash policy.
   */
  'header'?: (_envoy_config_route_v3_RouteAction_HashPolicy_Header | null);
  /**
   * Cookie hash policy.
   */
  'cookie'?: (_envoy_config_route_v3_RouteAction_HashPolicy_Cookie | null);
  /**
   * Connection properties hash policy.
   */
  'connection_properties'?: (_envoy_config_route_v3_RouteAction_HashPolicy_ConnectionProperties | null);
  /**
   * Query parameter hash policy.
   */
  'query_parameter'?: (_envoy_config_route_v3_RouteAction_HashPolicy_QueryParameter | null);
  /**
   * Filter state hash policy.
   */
  'filter_state'?: (_envoy_config_route_v3_RouteAction_HashPolicy_FilterState | null);
  /**
   * The flag that short-circuits the hash computing. This field provides a
   * 'fallback' style of configuration: "if a terminal policy doesn't work,
   * fallback to rest of the policy list", it saves time when the terminal
   * policy works.
   * 
   * If true, and there is already a hash computed, ignore rest of the
   * list of hash polices.
   * For example, if the following hash methods are configured:
   * 
   * ========= ========
   * specifier terminal
   * ========= ========
   * Header A  true
   * Header B  false
   * Header C  false
   * ========= ========
   * 
   * The generateHash process ends if policy "header A" generates a hash, as
   * it's a terminal policy.
   */
  'terminal'?: (boolean);
  'policy_specifier'?: "header"|"cookie"|"connection_properties"|"query_parameter"|"filter_state";
}

/**
 * Specifies the route's hashing policy if the upstream cluster uses a hashing :ref:`load balancer
 * <arch_overview_load_balancing_types>`.
 * [#next-free-field: 7]
 */
export interface _envoy_config_route_v3_RouteAction_HashPolicy__Output {
  /**
   * Header hash policy.
   */
  'header'?: (_envoy_config_route_v3_RouteAction_HashPolicy_Header__Output | null);
  /**
   * Cookie hash policy.
   */
  'cookie'?: (_envoy_config_route_v3_RouteAction_HashPolicy_Cookie__Output | null);
  /**
   * Connection properties hash policy.
   */
  'connection_properties'?: (_envoy_config_route_v3_RouteAction_HashPolicy_ConnectionProperties__Output | null);
  /**
   * Query parameter hash policy.
   */
  'query_parameter'?: (_envoy_config_route_v3_RouteAction_HashPolicy_QueryParameter__Output | null);
  /**
   * Filter state hash policy.
   */
  'filter_state'?: (_envoy_config_route_v3_RouteAction_HashPolicy_FilterState__Output | null);
  /**
   * The flag that short-circuits the hash computing. This field provides a
   * 'fallback' style of configuration: "if a terminal policy doesn't work,
   * fallback to rest of the policy list", it saves time when the terminal
   * policy works.
   * 
   * If true, and there is already a hash computed, ignore rest of the
   * list of hash polices.
   * For example, if the following hash methods are configured:
   * 
   * ========= ========
   * specifier terminal
   * ========= ========
   * Header A  true
   * Header B  false
   * Header C  false
   * ========= ========
   * 
   * The generateHash process ends if policy "header A" generates a hash, as
   * it's a terminal policy.
   */
  'terminal': (boolean);
  'policy_specifier': "header"|"cookie"|"connection_properties"|"query_parameter"|"filter_state";
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_Header {
  /**
   * The name of the request header that will be used to obtain the hash
   * key. If the request header is not present, no hash will be produced.
   */
  'header_name'?: (string);
  /**
   * If specified, the request header value will be rewritten and used
   * to produce the hash key.
   */
  'regex_rewrite'?: (_envoy_type_matcher_v3_RegexMatchAndSubstitute | null);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_Header__Output {
  /**
   * The name of the request header that will be used to obtain the hash
   * key. If the request header is not present, no hash will be produced.
   */
  'header_name': (string);
  /**
   * If specified, the request header value will be rewritten and used
   * to produce the hash key.
   */
  'regex_rewrite': (_envoy_type_matcher_v3_RegexMatchAndSubstitute__Output | null);
}

// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

/**
 * Configures :ref:`internal redirect <arch_overview_internal_redirects>` behavior.
 * [#next-major-version: remove this definition - it's defined in the InternalRedirectPolicy message.]
 */
export enum _envoy_config_route_v3_RouteAction_InternalRedirectAction {
  PASS_THROUGH_INTERNAL_REDIRECT = 0,
  HANDLE_INTERNAL_REDIRECT = 1,
}

export interface _envoy_config_route_v3_RouteAction_MaxStreamDuration {
  /**
   * Specifies the maximum duration allowed for streams on the route. If not specified, the value
   * from the :ref:`max_stream_duration
   * <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.max_stream_duration>` field in
   * :ref:`HttpConnectionManager.common_http_protocol_options
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.common_http_protocol_options>`
   * is used. If this field is set explicitly to zero, any
   * HttpConnectionManager max_stream_duration timeout will be disabled for
   * this route.
   */
  'max_stream_duration'?: (_google_protobuf_Duration | null);
  /**
   * If present, and the request contains a `grpc-timeout header
   * <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, use that value as the
   * ``max_stream_duration``, but limit the applied timeout to the maximum value specified here.
   * If set to 0, the ``grpc-timeout`` header is used without modification.
   */
  'grpc_timeout_header_max'?: (_google_protobuf_Duration | null);
  /**
   * If present, Envoy will adjust the timeout provided by the ``grpc-timeout`` header by
   * subtracting the provided duration from the header. This is useful for allowing Envoy to set
   * its global timeout to be less than that of the deadline imposed by the calling client, which
   * makes it more likely that Envoy will handle the timeout instead of having the call canceled
   * by the client. If, after applying the offset, the resulting timeout is zero or negative,
   * the stream will timeout immediately.
   */
  'grpc_timeout_header_offset'?: (_google_protobuf_Duration | null);
}

export interface _envoy_config_route_v3_RouteAction_MaxStreamDuration__Output {
  /**
   * Specifies the maximum duration allowed for streams on the route. If not specified, the value
   * from the :ref:`max_stream_duration
   * <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.max_stream_duration>` field in
   * :ref:`HttpConnectionManager.common_http_protocol_options
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.common_http_protocol_options>`
   * is used. If this field is set explicitly to zero, any
   * HttpConnectionManager max_stream_duration timeout will be disabled for
   * this route.
   */
  'max_stream_duration': (_google_protobuf_Duration__Output | null);
  /**
   * If present, and the request contains a `grpc-timeout header
   * <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, use that value as the
   * ``max_stream_duration``, but limit the applied timeout to the maximum value specified here.
   * If set to 0, the ``grpc-timeout`` header is used without modification.
   */
  'grpc_timeout_header_max': (_google_protobuf_Duration__Output | null);
  /**
   * If present, Envoy will adjust the timeout provided by the ``grpc-timeout`` header by
   * subtracting the provided duration from the header. This is useful for allowing Envoy to set
   * its global timeout to be less than that of the deadline imposed by the calling client, which
   * makes it more likely that Envoy will handle the timeout instead of having the call canceled
   * by the client. If, after applying the offset, the resulting timeout is zero or negative,
   * the stream will timeout immediately.
   */
  'grpc_timeout_header_offset': (_google_protobuf_Duration__Output | null);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_QueryParameter {
  /**
   * The name of the URL query parameter that will be used to obtain the hash
   * key. If the parameter is not present, no hash will be produced. Query
   * parameter names are case-sensitive.
   */
  'name'?: (string);
}

export interface _envoy_config_route_v3_RouteAction_HashPolicy_QueryParameter__Output {
  /**
   * The name of the URL query parameter that will be used to obtain the hash
   * key. If the parameter is not present, no hash will be produced. Query
   * parameter names are case-sensitive.
   */
  'name': (string);
}

/**
 * The router is capable of shadowing traffic from one cluster to another. The current
 * implementation is "fire and forget," meaning Envoy will not wait for the shadow cluster to
 * respond before returning the response from the primary cluster. All normal statistics are
 * collected for the shadow cluster making this feature useful for testing.
 * 
 * During shadowing, the host/authority header is altered such that ``-shadow`` is appended. This is
 * useful for logging. For example, ``cluster1`` becomes ``cluster1-shadow``.
 * 
 * .. note::
 * 
 * Shadowing will not be triggered if the primary cluster does not exist.
 * 
 * .. note::
 * 
 * Shadowing doesn't support Http CONNECT and upgrades.
 * [#next-free-field: 6]
 */
export interface _envoy_config_route_v3_RouteAction_RequestMirrorPolicy {
  /**
   * Only one of ``cluster`` and ``cluster_header`` can be specified.
   * [#next-major-version: Need to add back the validation rule: (validate.rules).string = {min_len: 1}]
   * Specifies the cluster that requests will be mirrored to. The cluster must
   * exist in the cluster manager configuration.
   */
  'cluster'?: (string);
  /**
   * Only one of ``cluster`` and ``cluster_header`` can be specified.
   * Envoy will determine the cluster to route to by reading the value of the
   * HTTP header named by cluster_header from the request headers. Only the first value in header is used,
   * and no shadow request will happen if the value is not found in headers. Envoy will not wait for
   * the shadow cluster to respond before returning the response from the primary cluster.
   * 
   * .. attention::
   * 
   * Internally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1
   * ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'cluster_header'?: (string);
  /**
   * If not specified, all requests to the target cluster will be mirrored.
   * 
   * If specified, this field takes precedence over the ``runtime_key`` field and requests must also
   * fall under the percentage of matches indicated by this field.
   * 
   * For some fraction N/D, a random number in the range [0,D) is selected. If the
   * number is <= the value of the numerator N, or if the key is not present, the default
   * value, the request will be mirrored.
   */
  'runtime_fraction'?: (_envoy_config_core_v3_RuntimeFractionalPercent | null);
  /**
   * Determines if the trace span should be sampled. Defaults to true.
   */
  'trace_sampled'?: (_google_protobuf_BoolValue | null);
}

/**
 * The router is capable of shadowing traffic from one cluster to another. The current
 * implementation is "fire and forget," meaning Envoy will not wait for the shadow cluster to
 * respond before returning the response from the primary cluster. All normal statistics are
 * collected for the shadow cluster making this feature useful for testing.
 * 
 * During shadowing, the host/authority header is altered such that ``-shadow`` is appended. This is
 * useful for logging. For example, ``cluster1`` becomes ``cluster1-shadow``.
 * 
 * .. note::
 * 
 * Shadowing will not be triggered if the primary cluster does not exist.
 * 
 * .. note::
 * 
 * Shadowing doesn't support Http CONNECT and upgrades.
 * [#next-free-field: 6]
 */
export interface _envoy_config_route_v3_RouteAction_RequestMirrorPolicy__Output {
  /**
   * Only one of ``cluster`` and ``cluster_header`` can be specified.
   * [#next-major-version: Need to add back the validation rule: (validate.rules).string = {min_len: 1}]
   * Specifies the cluster that requests will be mirrored to. The cluster must
   * exist in the cluster manager configuration.
   */
  'cluster': (string);
  /**
   * Only one of ``cluster`` and ``cluster_header`` can be specified.
   * Envoy will determine the cluster to route to by reading the value of the
   * HTTP header named by cluster_header from the request headers. Only the first value in header is used,
   * and no shadow request will happen if the value is not found in headers. Envoy will not wait for
   * the shadow cluster to respond before returning the response from the primary cluster.
   * 
   * .. attention::
   * 
   * Internally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1
   * ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'cluster_header': (string);
  /**
   * If not specified, all requests to the target cluster will be mirrored.
   * 
   * If specified, this field takes precedence over the ``runtime_key`` field and requests must also
   * fall under the percentage of matches indicated by this field.
   * 
   * For some fraction N/D, a random number in the range [0,D) is selected. If the
   * number is <= the value of the numerator N, or if the key is not present, the default
   * value, the request will be mirrored.
   */
  'runtime_fraction': (_envoy_config_core_v3_RuntimeFractionalPercent__Output | null);
  /**
   * Determines if the trace span should be sampled. Defaults to true.
   */
  'trace_sampled': (_google_protobuf_BoolValue__Output | null);
}

/**
 * Allows enabling and disabling upgrades on a per-route basis.
 * This overrides any enabled/disabled upgrade filter chain specified in the
 * HttpConnectionManager
 * :ref:`upgrade_configs
 * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.upgrade_configs>`
 * but does not affect any custom filter chain specified there.
 */
export interface _envoy_config_route_v3_RouteAction_UpgradeConfig {
  /**
   * The case-insensitive name of this upgrade, e.g. "websocket".
   * For each upgrade type present in upgrade_configs, requests with
   * Upgrade: [upgrade_type] will be proxied upstream.
   */
  'upgrade_type'?: (string);
  /**
   * Determines if upgrades are available on this route. Defaults to true.
   */
  'enabled'?: (_google_protobuf_BoolValue | null);
  /**
   * Configuration for sending data upstream as a raw data payload. This is used for
   * CONNECT requests, when forwarding CONNECT payload as raw TCP.
   * Note that CONNECT support is currently considered alpha in Envoy.
   * [#comment: TODO(htuch): Replace the above comment with an alpha tag.]
   */
  'connect_config'?: (_envoy_config_route_v3_RouteAction_UpgradeConfig_ConnectConfig | null);
}

/**
 * Allows enabling and disabling upgrades on a per-route basis.
 * This overrides any enabled/disabled upgrade filter chain specified in the
 * HttpConnectionManager
 * :ref:`upgrade_configs
 * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.upgrade_configs>`
 * but does not affect any custom filter chain specified there.
 */
export interface _envoy_config_route_v3_RouteAction_UpgradeConfig__Output {
  /**
   * The case-insensitive name of this upgrade, e.g. "websocket".
   * For each upgrade type present in upgrade_configs, requests with
   * Upgrade: [upgrade_type] will be proxied upstream.
   */
  'upgrade_type': (string);
  /**
   * Determines if upgrades are available on this route. Defaults to true.
   */
  'enabled': (_google_protobuf_BoolValue__Output | null);
  /**
   * Configuration for sending data upstream as a raw data payload. This is used for
   * CONNECT requests, when forwarding CONNECT payload as raw TCP.
   * Note that CONNECT support is currently considered alpha in Envoy.
   * [#comment: TODO(htuch): Replace the above comment with an alpha tag.]
   */
  'connect_config': (_envoy_config_route_v3_RouteAction_UpgradeConfig_ConnectConfig__Output | null);
}

/**
 * [#next-free-field: 42]
 */
export interface RouteAction {
  /**
   * Indicates the upstream cluster to which the request should be routed
   * to.
   */
  'cluster'?: (string);
  /**
   * Envoy will determine the cluster to route to by reading the value of the
   * HTTP header named by cluster_header from the request headers. If the
   * header is not found or the referenced cluster does not exist, Envoy will
   * return a 404 response.
   * 
   * .. attention::
   * 
   * Internally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1
   * ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'cluster_header'?: (string);
  /**
   * Multiple upstream clusters can be specified for a given route. The
   * request is routed to one of the upstream clusters based on weights
   * assigned to each cluster. See
   * :ref:`traffic splitting <config_http_conn_man_route_table_traffic_splitting_split>`
   * for additional documentation.
   */
  'weighted_clusters'?: (_envoy_config_route_v3_WeightedCluster | null);
  /**
   * Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints
   * in the upstream cluster with metadata matching what's set in this field will be considered
   * for load balancing. If using :ref:`weighted_clusters
   * <envoy_v3_api_field_config.route.v3.RouteAction.weighted_clusters>`, metadata will be merged, with values
   * provided there taking precedence. The filter name should be specified as ``envoy.lb``.
   */
  'metadata_match'?: (_envoy_config_core_v3_Metadata | null);
  /**
   * Indicates that during forwarding, the matched prefix (or path) should be
   * swapped with this value. This option allows application URLs to be rooted
   * at a different path from those exposed at the reverse proxy layer. The router filter will
   * place the original path before rewrite into the :ref:`x-envoy-original-path
   * <config_http_filters_router_x-envoy-original-path>` header.
   * 
   * Only one of :ref:`regex_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.regex_rewrite>`
   * :ref:`path_rewrite_policy <envoy_v3_api_field_config.route.v3.RouteAction.path_rewrite_policy>`,
   * or :ref:`prefix_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>` may be specified.
   * 
   * .. attention::
   * 
   * Pay careful attention to the use of trailing slashes in the
   * :ref:`route's match <envoy_v3_api_field_config.route.v3.Route.match>` prefix value.
   * Stripping a prefix from a path requires multiple Routes to handle all cases. For example,
   * rewriting ``/prefix`` to ``/`` and ``/prefix/etc`` to ``/etc`` cannot be done in a single
   * :ref:`Route <envoy_v3_api_msg_config.route.v3.Route>`, as shown by the below config entries:
   * 
   * .. code-block:: yaml
   * 
   * - match:
   * prefix: "/prefix/"
   * route:
   * prefix_rewrite: "/"
   * - match:
   * prefix: "/prefix"
   * route:
   * prefix_rewrite: "/"
   * 
   * Having above entries in the config, requests to ``/prefix`` will be stripped to ``/``, while
   * requests to ``/prefix/etc`` will be stripped to ``/etc``.
   */
  'prefix_rewrite'?: (string);
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * this value. Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   */
  'host_rewrite_literal'?: (string);
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * the hostname of the upstream host chosen by the cluster manager. This
   * option is applicable only when the destination cluster for a route is of
   * type ``strict_dns`` or ``logical_dns``. Setting this to true with other cluster types
   * has no effect. Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   */
  'auto_host_rewrite'?: (_google_protobuf_BoolValue | null);
  /**
   * Specifies the upstream timeout for the route. If not specified, the default is 15s. This
   * spans between the point at which the entire downstream request (i.e. end-of-stream) has been
   * processed and when the upstream response has been completely processed. A value of 0 will
   * disable the route's timeout.
   * 
   * .. note::
   * 
   * This timeout includes all retries. See also
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-timeout-ms`,
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`, and the
   * :ref:`retry overview <arch_overview_http_routing_retry>`.
   */
  'timeout'?: (_google_protobuf_Duration | null);
  /**
   * Indicates that the route has a retry policy. Note that if this is set,
   * it'll take precedence over the virtual host level retry policy entirely
   * (e.g.: policies are not merged, most internal one becomes the enforced policy).
   */
  'retry_policy'?: (_envoy_config_route_v3_RetryPolicy | null);
  /**
   * Optionally specifies the :ref:`routing priority <arch_overview_http_routing_priority>`.
   */
  'priority'?: (_envoy_config_core_v3_RoutingPriority | keyof typeof _envoy_config_core_v3_RoutingPriority);
  /**
   * Specifies a set of rate limit configurations that could be applied to the
   * route.
   */
  'rate_limits'?: (_envoy_config_route_v3_RateLimit)[];
  /**
   * Specifies if the rate limit filter should include the virtual host rate
   * limits. By default, if the route configured rate limits, the virtual host
   * :ref:`rate_limits <envoy_v3_api_field_config.route.v3.VirtualHost.rate_limits>` are not applied to the
   * request.
   * 
   * This field is deprecated. Please use :ref:`vh_rate_limits <envoy_v3_api_field_extensions.filters.http.ratelimit.v3.RateLimitPerRoute.vh_rate_limits>`
   */
  'include_vh_rate_limits'?: (_google_protobuf_BoolValue | null);
  /**
   * Specifies a list of hash policies to use for ring hash load balancing. Each
   * hash policy is evaluated individually and the combined result is used to
   * route the request. The method of combination is deterministic such that
   * identical lists of hash policies will produce the same hash. Since a hash
   * policy examines specific parts of a request, it can fail to produce a hash
   * (i.e. if the hashed header is not present). If (and only if) all configured
   * hash policies fail to generate a hash, no hash will be produced for
   * the route. In this case, the behavior is the same as if no hash policies
   * were specified (i.e. the ring hash load balancer will choose a random
   * backend). If a hash policy has the "terminal" attribute set to true, and
   * there is already a hash generated, the hash is returned immediately,
   * ignoring the rest of the hash policy list.
   */
  'hash_policy'?: (_envoy_config_route_v3_RouteAction_HashPolicy)[];
  /**
   * Indicates that the route has a CORS policy. This field is ignored if related cors policy is
   * found in the :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>` or
   * :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`.
   * 
   * .. attention::
   * 
   * This option has been deprecated. Please use
   * :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>` or
   * :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`
   * to configure the CORS HTTP filter.
   */
  'cors'?: (_envoy_config_route_v3_CorsPolicy | null);
  /**
   * The HTTP status code to use when configured cluster is not found.
   * The default response code is 503 Service Unavailable.
   */
  'cluster_not_found_response_code'?: (_envoy_config_route_v3_RouteAction_ClusterNotFoundResponseCode | keyof typeof _envoy_config_route_v3_RouteAction_ClusterNotFoundResponseCode);
  /**
   * Deprecated by :ref:`grpc_timeout_header_max <envoy_v3_api_field_config.route.v3.RouteAction.MaxStreamDuration.grpc_timeout_header_max>`
   * If present, and the request is a gRPC request, use the
   * `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_,
   * or its default value (infinity) instead of
   * :ref:`timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>`, but limit the applied timeout
   * to the maximum value specified here. If configured as 0, the maximum allowed timeout for
   * gRPC requests is infinity. If not configured at all, the ``grpc-timeout`` header is not used
   * and gRPC requests time out like any other requests using
   * :ref:`timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>` or its default.
   * This can be used to prevent unexpected upstream request timeouts due to potentially long
   * time gaps between gRPC request and response in gRPC streaming mode.
   * 
   * .. note::
   * 
   * If a timeout is specified using :ref:`config_http_filters_router_x-envoy-upstream-rq-timeout-ms`, it takes
   * precedence over `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, when
   * both are present. See also
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-timeout-ms`,
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`, and the
   * :ref:`retry overview <arch_overview_http_routing_retry>`.
   */
  'max_grpc_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Specifies the idle timeout for the route. If not specified, there is no per-route idle timeout,
   * although the connection manager wide :ref:`stream_idle_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   * will still apply. A value of 0 will completely disable the route's idle timeout, even if a
   * connection manager stream idle timeout is configured.
   * 
   * The idle timeout is distinct to :ref:`timeout
   * <envoy_v3_api_field_config.route.v3.RouteAction.timeout>`, which provides an upper bound
   * on the upstream response time; :ref:`idle_timeout
   * <envoy_v3_api_field_config.route.v3.RouteAction.idle_timeout>` instead bounds the amount
   * of time the request's stream may be idle.
   * 
   * After header decoding, the idle timeout will apply on downstream and
   * upstream request events. Each time an encode/decode event for headers or
   * data is processed for the stream, the timer will be reset. If the timeout
   * fires, the stream is terminated with a 408 Request Timeout error code if no
   * upstream response header has been received, otherwise a stream reset
   * occurs.
   * 
   * If the :ref:`overload action <config_overload_manager_overload_actions>` "envoy.overload_actions.reduce_timeouts"
   * is configured, this timeout is scaled according to the value for
   * :ref:`HTTP_DOWNSTREAM_STREAM_IDLE <envoy_v3_api_enum_value_config.overload.v3.ScaleTimersOverloadActionConfig.TimerType.HTTP_DOWNSTREAM_STREAM_IDLE>`.
   */
  'idle_timeout'?: (_google_protobuf_Duration | null);
  'upgrade_configs'?: (_envoy_config_route_v3_RouteAction_UpgradeConfig)[];
  'internal_redirect_action'?: (_envoy_config_route_v3_RouteAction_InternalRedirectAction | keyof typeof _envoy_config_route_v3_RouteAction_InternalRedirectAction);
  /**
   * Indicates that the route has a hedge policy. Note that if this is set,
   * it'll take precedence over the virtual host level hedge policy entirely
   * (e.g.: policies are not merged, most internal one becomes the enforced policy).
   */
  'hedge_policy'?: (_envoy_config_route_v3_HedgePolicy | null);
  /**
   * Deprecated by :ref:`grpc_timeout_header_offset <envoy_v3_api_field_config.route.v3.RouteAction.MaxStreamDuration.grpc_timeout_header_offset>`.
   * If present, Envoy will adjust the timeout provided by the ``grpc-timeout`` header by subtracting
   * the provided duration from the header. This is useful in allowing Envoy to set its global
   * timeout to be less than that of the deadline imposed by the calling client, which makes it more
   * likely that Envoy will handle the timeout instead of having the call canceled by the client.
   * The offset will only be applied if the provided grpc_timeout is greater than the offset. This
   * ensures that the offset will only ever decrease the timeout and never set it to 0 (meaning
   * infinity).
   */
  'grpc_timeout_offset'?: (_google_protobuf_Duration | null);
  /**
   * Indicates that during forwarding, the host header will be swapped with the content of given
   * downstream or :ref:`custom <config_http_conn_man_headers_custom_request_headers>` header.
   * If header value is empty, host header is left intact. Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   * 
   * .. attention::
   * 
   * Pay attention to the potential security implications of using this option. Provided header
   * must come from trusted source.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'host_rewrite_header'?: (string);
  /**
   * Specify a set of route request mirroring policies.
   * It takes precedence over the virtual host and route config mirror policy entirely.
   * That is, policies are not merged, the most specific non-empty one becomes the mirror policies.
   */
  'request_mirror_policies'?: (_envoy_config_route_v3_RouteAction_RequestMirrorPolicy)[];
  /**
   * An internal redirect is handled, iff the number of previous internal redirects that a
   * downstream request has encountered is lower than this value, and
   * :ref:`internal_redirect_action <envoy_v3_api_field_config.route.v3.RouteAction.internal_redirect_action>`
   * is set to :ref:`HANDLE_INTERNAL_REDIRECT
   * <envoy_v3_api_enum_value_config.route.v3.RouteAction.InternalRedirectAction.HANDLE_INTERNAL_REDIRECT>`
   * In the case where a downstream request is bounced among multiple routes by internal redirect,
   * the first route that hits this threshold, or has
   * :ref:`internal_redirect_action <envoy_v3_api_field_config.route.v3.RouteAction.internal_redirect_action>`
   * set to
   * :ref:`PASS_THROUGH_INTERNAL_REDIRECT
   * <envoy_v3_api_enum_value_config.route.v3.RouteAction.InternalRedirectAction.PASS_THROUGH_INTERNAL_REDIRECT>`
   * will pass the redirect back to downstream.
   * 
   * If not specified, at most one redirect will be followed.
   */
  'max_internal_redirects'?: (_google_protobuf_UInt32Value | null);
  /**
   * Indicates that during forwarding, portions of the path that match the
   * pattern should be rewritten, even allowing the substitution of capture
   * groups from the pattern into the new path as specified by the rewrite
   * substitution string. This is useful to allow application paths to be
   * rewritten in a way that is aware of segments with variable content like
   * identifiers. The router filter will place the original path as it was
   * before the rewrite into the :ref:`x-envoy-original-path
   * <config_http_filters_router_x-envoy-original-path>` header.
   * 
   * Only one of :ref:`regex_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.regex_rewrite>`,
   * :ref:`prefix_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>`, or
   * :ref:`path_rewrite_policy <envoy_v3_api_field_config.route.v3.RouteAction.path_rewrite_policy>`]
   * may be specified.
   * 
   * Examples using Google's `RE2 <https://github.com/google/re2>`_ engine:
   * 
   * * The path pattern ``^/service/([^/]+)(/.*)$`` paired with a substitution
   * string of ``\2/instance/\1`` would transform ``/service/foo/v1/api``
   * into ``/v1/api/instance/foo``.
   * 
   * * The pattern ``one`` paired with a substitution string of ``two`` would
   * transform ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/two/zzz``.
   * 
   * * The pattern ``^(.*?)one(.*)$`` paired with a substitution string of
   * ``\1two\2`` would replace only the first occurrence of ``one``,
   * transforming path ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/one/zzz``.
   * 
   * * The pattern ``(?i)/xxx/`` paired with a substitution string of ``/yyy/``
   * would do a case-insensitive match and transform path ``/aaa/XxX/bbb`` to
   * ``/aaa/yyy/bbb``.
   */
  'regex_rewrite'?: (_envoy_type_matcher_v3_RegexMatchAndSubstitute | null);
  /**
   * [#not-implemented-hide:]
   * Specifies the configuration for retry policy extension. Note that if this is set, it'll take
   * precedence over the virtual host level retry policy entirely (e.g.: policies are not merged,
   * most internal one becomes the enforced policy). :ref:`Retry policy <envoy_v3_api_field_config.route.v3.VirtualHost.retry_policy>`
   * should not be set if this field is used.
   */
  'retry_policy_typed_config'?: (_google_protobuf_Any | null);
  /**
   * If present, Envoy will try to follow an upstream redirect response instead of proxying the
   * response back to the downstream. An upstream redirect response is defined
   * by :ref:`redirect_response_codes
   * <envoy_v3_api_field_config.route.v3.InternalRedirectPolicy.redirect_response_codes>`.
   */
  'internal_redirect_policy'?: (_envoy_config_route_v3_InternalRedirectPolicy | null);
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * the result of the regex substitution executed on path value with query and fragment removed.
   * This is useful for transitioning variable content between path segment and subdomain.
   * Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   * 
   * For example with the following config:
   * 
   * .. code-block:: yaml
   * 
   * host_rewrite_path_regex:
   * pattern:
   * google_re2: {}
   * regex: "^/(.+)/.+$"
   * substitution: \1
   * 
   * Would rewrite the host header to ``envoyproxy.io`` given the path ``/envoyproxy.io/some/path``.
   */
  'host_rewrite_path_regex'?: (_envoy_type_matcher_v3_RegexMatchAndSubstitute | null);
  /**
   * Specifies the maximum stream duration for this route.
   */
  'max_stream_duration'?: (_envoy_config_route_v3_RouteAction_MaxStreamDuration | null);
  /**
   * Name of the cluster specifier plugin to use to determine the cluster for requests on this route.
   * The cluster specifier plugin name must be defined in the associated
   * :ref:`cluster specifier plugins <envoy_v3_api_field_config.route.v3.RouteConfiguration.cluster_specifier_plugins>`
   * in the :ref:`name <envoy_v3_api_field_config.core.v3.TypedExtensionConfig.name>` field.
   */
  'cluster_specifier_plugin'?: (string);
  /**
   * If set, then a host rewrite action (one of
   * :ref:`host_rewrite_literal <envoy_v3_api_field_config.route.v3.RouteAction.host_rewrite_literal>`,
   * :ref:`auto_host_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.auto_host_rewrite>`,
   * :ref:`host_rewrite_header <envoy_v3_api_field_config.route.v3.RouteAction.host_rewrite_header>`, or
   * :ref:`host_rewrite_path_regex <envoy_v3_api_field_config.route.v3.RouteAction.host_rewrite_path_regex>`)
   * causes the original value of the host header, if any, to be appended to the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` HTTP header if it is different to the last value appended.
   * This can be disabled by setting the runtime guard `envoy_reloadable_features_append_xfh_idempotent` to false.
   */
  'append_x_forwarded_host'?: (boolean);
  /**
   * Custom cluster specifier plugin configuration to use to determine the cluster for requests
   * on this route.
   */
  'inline_cluster_specifier_plugin'?: (_envoy_config_route_v3_ClusterSpecifierPlugin | null);
  /**
   * Specifies how to send request over TLS early data.
   * If absent, allows `safe HTTP requests <https://www.rfc-editor.org/rfc/rfc7231#section-4.2.1>`_ to be sent on early data.
   * [#extension-category: envoy.route.early_data_policy]
   */
  'early_data_policy'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * [#extension-category: envoy.path.rewrite]
   */
  'path_rewrite_policy'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  'cluster_specifier'?: "cluster"|"cluster_header"|"weighted_clusters"|"cluster_specifier_plugin"|"inline_cluster_specifier_plugin";
  'host_rewrite_specifier'?: "host_rewrite_literal"|"auto_host_rewrite"|"host_rewrite_header"|"host_rewrite_path_regex";
}

/**
 * [#next-free-field: 42]
 */
export interface RouteAction__Output {
  /**
   * Indicates the upstream cluster to which the request should be routed
   * to.
   */
  'cluster'?: (string);
  /**
   * Envoy will determine the cluster to route to by reading the value of the
   * HTTP header named by cluster_header from the request headers. If the
   * header is not found or the referenced cluster does not exist, Envoy will
   * return a 404 response.
   * 
   * .. attention::
   * 
   * Internally, Envoy always uses the HTTP/2 ``:authority`` header to represent the HTTP/1
   * ``Host`` header. Thus, if attempting to match on ``Host``, match on ``:authority`` instead.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'cluster_header'?: (string);
  /**
   * Multiple upstream clusters can be specified for a given route. The
   * request is routed to one of the upstream clusters based on weights
   * assigned to each cluster. See
   * :ref:`traffic splitting <config_http_conn_man_route_table_traffic_splitting_split>`
   * for additional documentation.
   */
  'weighted_clusters'?: (_envoy_config_route_v3_WeightedCluster__Output | null);
  /**
   * Optional endpoint metadata match criteria used by the subset load balancer. Only endpoints
   * in the upstream cluster with metadata matching what's set in this field will be considered
   * for load balancing. If using :ref:`weighted_clusters
   * <envoy_v3_api_field_config.route.v3.RouteAction.weighted_clusters>`, metadata will be merged, with values
   * provided there taking precedence. The filter name should be specified as ``envoy.lb``.
   */
  'metadata_match': (_envoy_config_core_v3_Metadata__Output | null);
  /**
   * Indicates that during forwarding, the matched prefix (or path) should be
   * swapped with this value. This option allows application URLs to be rooted
   * at a different path from those exposed at the reverse proxy layer. The router filter will
   * place the original path before rewrite into the :ref:`x-envoy-original-path
   * <config_http_filters_router_x-envoy-original-path>` header.
   * 
   * Only one of :ref:`regex_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.regex_rewrite>`
   * :ref:`path_rewrite_policy <envoy_v3_api_field_config.route.v3.RouteAction.path_rewrite_policy>`,
   * or :ref:`prefix_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>` may be specified.
   * 
   * .. attention::
   * 
   * Pay careful attention to the use of trailing slashes in the
   * :ref:`route's match <envoy_v3_api_field_config.route.v3.Route.match>` prefix value.
   * Stripping a prefix from a path requires multiple Routes to handle all cases. For example,
   * rewriting ``/prefix`` to ``/`` and ``/prefix/etc`` to ``/etc`` cannot be done in a single
   * :ref:`Route <envoy_v3_api_msg_config.route.v3.Route>`, as shown by the below config entries:
   * 
   * .. code-block:: yaml
   * 
   * - match:
   * prefix: "/prefix/"
   * route:
   * prefix_rewrite: "/"
   * - match:
   * prefix: "/prefix"
   * route:
   * prefix_rewrite: "/"
   * 
   * Having above entries in the config, requests to ``/prefix`` will be stripped to ``/``, while
   * requests to ``/prefix/etc`` will be stripped to ``/etc``.
   */
  'prefix_rewrite': (string);
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * this value. Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   */
  'host_rewrite_literal'?: (string);
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * the hostname of the upstream host chosen by the cluster manager. This
   * option is applicable only when the destination cluster for a route is of
   * type ``strict_dns`` or ``logical_dns``. Setting this to true with other cluster types
   * has no effect. Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   */
  'auto_host_rewrite'?: (_google_protobuf_BoolValue__Output | null);
  /**
   * Specifies the upstream timeout for the route. If not specified, the default is 15s. This
   * spans between the point at which the entire downstream request (i.e. end-of-stream) has been
   * processed and when the upstream response has been completely processed. A value of 0 will
   * disable the route's timeout.
   * 
   * .. note::
   * 
   * This timeout includes all retries. See also
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-timeout-ms`,
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`, and the
   * :ref:`retry overview <arch_overview_http_routing_retry>`.
   */
  'timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Indicates that the route has a retry policy. Note that if this is set,
   * it'll take precedence over the virtual host level retry policy entirely
   * (e.g.: policies are not merged, most internal one becomes the enforced policy).
   */
  'retry_policy': (_envoy_config_route_v3_RetryPolicy__Output | null);
  /**
   * Optionally specifies the :ref:`routing priority <arch_overview_http_routing_priority>`.
   */
  'priority': (keyof typeof _envoy_config_core_v3_RoutingPriority);
  /**
   * Specifies a set of rate limit configurations that could be applied to the
   * route.
   */
  'rate_limits': (_envoy_config_route_v3_RateLimit__Output)[];
  /**
   * Specifies if the rate limit filter should include the virtual host rate
   * limits. By default, if the route configured rate limits, the virtual host
   * :ref:`rate_limits <envoy_v3_api_field_config.route.v3.VirtualHost.rate_limits>` are not applied to the
   * request.
   * 
   * This field is deprecated. Please use :ref:`vh_rate_limits <envoy_v3_api_field_extensions.filters.http.ratelimit.v3.RateLimitPerRoute.vh_rate_limits>`
   */
  'include_vh_rate_limits': (_google_protobuf_BoolValue__Output | null);
  /**
   * Specifies a list of hash policies to use for ring hash load balancing. Each
   * hash policy is evaluated individually and the combined result is used to
   * route the request. The method of combination is deterministic such that
   * identical lists of hash policies will produce the same hash. Since a hash
   * policy examines specific parts of a request, it can fail to produce a hash
   * (i.e. if the hashed header is not present). If (and only if) all configured
   * hash policies fail to generate a hash, no hash will be produced for
   * the route. In this case, the behavior is the same as if no hash policies
   * were specified (i.e. the ring hash load balancer will choose a random
   * backend). If a hash policy has the "terminal" attribute set to true, and
   * there is already a hash generated, the hash is returned immediately,
   * ignoring the rest of the hash policy list.
   */
  'hash_policy': (_envoy_config_route_v3_RouteAction_HashPolicy__Output)[];
  /**
   * Indicates that the route has a CORS policy. This field is ignored if related cors policy is
   * found in the :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>` or
   * :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`.
   * 
   * .. attention::
   * 
   * This option has been deprecated. Please use
   * :ref:`Route.typed_per_filter_config<envoy_v3_api_field_config.route.v3.Route.typed_per_filter_config>` or
   * :ref:`WeightedCluster.ClusterWeight.typed_per_filter_config<envoy_v3_api_field_config.route.v3.WeightedCluster.ClusterWeight.typed_per_filter_config>`
   * to configure the CORS HTTP filter.
   */
  'cors': (_envoy_config_route_v3_CorsPolicy__Output | null);
  /**
   * The HTTP status code to use when configured cluster is not found.
   * The default response code is 503 Service Unavailable.
   */
  'cluster_not_found_response_code': (keyof typeof _envoy_config_route_v3_RouteAction_ClusterNotFoundResponseCode);
  /**
   * Deprecated by :ref:`grpc_timeout_header_max <envoy_v3_api_field_config.route.v3.RouteAction.MaxStreamDuration.grpc_timeout_header_max>`
   * If present, and the request is a gRPC request, use the
   * `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_,
   * or its default value (infinity) instead of
   * :ref:`timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>`, but limit the applied timeout
   * to the maximum value specified here. If configured as 0, the maximum allowed timeout for
   * gRPC requests is infinity. If not configured at all, the ``grpc-timeout`` header is not used
   * and gRPC requests time out like any other requests using
   * :ref:`timeout <envoy_v3_api_field_config.route.v3.RouteAction.timeout>` or its default.
   * This can be used to prevent unexpected upstream request timeouts due to potentially long
   * time gaps between gRPC request and response in gRPC streaming mode.
   * 
   * .. note::
   * 
   * If a timeout is specified using :ref:`config_http_filters_router_x-envoy-upstream-rq-timeout-ms`, it takes
   * precedence over `grpc-timeout header <https://github.com/grpc/grpc/blob/master/doc/PROTOCOL-HTTP2.md>`_, when
   * both are present. See also
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-timeout-ms`,
   * :ref:`config_http_filters_router_x-envoy-upstream-rq-per-try-timeout-ms`, and the
   * :ref:`retry overview <arch_overview_http_routing_retry>`.
   */
  'max_grpc_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Specifies the idle timeout for the route. If not specified, there is no per-route idle timeout,
   * although the connection manager wide :ref:`stream_idle_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   * will still apply. A value of 0 will completely disable the route's idle timeout, even if a
   * connection manager stream idle timeout is configured.
   * 
   * The idle timeout is distinct to :ref:`timeout
   * <envoy_v3_api_field_config.route.v3.RouteAction.timeout>`, which provides an upper bound
   * on the upstream response time; :ref:`idle_timeout
   * <envoy_v3_api_field_config.route.v3.RouteAction.idle_timeout>` instead bounds the amount
   * of time the request's stream may be idle.
   * 
   * After header decoding, the idle timeout will apply on downstream and
   * upstream request events. Each time an encode/decode event for headers or
   * data is processed for the stream, the timer will be reset. If the timeout
   * fires, the stream is terminated with a 408 Request Timeout error code if no
   * upstream response header has been received, otherwise a stream reset
   * occurs.
   * 
   * If the :ref:`overload action <config_overload_manager_overload_actions>` "envoy.overload_actions.reduce_timeouts"
   * is configured, this timeout is scaled according to the value for
   * :ref:`HTTP_DOWNSTREAM_STREAM_IDLE <envoy_v3_api_enum_value_config.overload.v3.ScaleTimersOverloadActionConfig.TimerType.HTTP_DOWNSTREAM_STREAM_IDLE>`.
   */
  'idle_timeout': (_google_protobuf_Duration__Output | null);
  'upgrade_configs': (_envoy_config_route_v3_RouteAction_UpgradeConfig__Output)[];
  'internal_redirect_action': (keyof typeof _envoy_config_route_v3_RouteAction_InternalRedirectAction);
  /**
   * Indicates that the route has a hedge policy. Note that if this is set,
   * it'll take precedence over the virtual host level hedge policy entirely
   * (e.g.: policies are not merged, most internal one becomes the enforced policy).
   */
  'hedge_policy': (_envoy_config_route_v3_HedgePolicy__Output | null);
  /**
   * Deprecated by :ref:`grpc_timeout_header_offset <envoy_v3_api_field_config.route.v3.RouteAction.MaxStreamDuration.grpc_timeout_header_offset>`.
   * If present, Envoy will adjust the timeout provided by the ``grpc-timeout`` header by subtracting
   * the provided duration from the header. This is useful in allowing Envoy to set its global
   * timeout to be less than that of the deadline imposed by the calling client, which makes it more
   * likely that Envoy will handle the timeout instead of having the call canceled by the client.
   * The offset will only be applied if the provided grpc_timeout is greater than the offset. This
   * ensures that the offset will only ever decrease the timeout and never set it to 0 (meaning
   * infinity).
   */
  'grpc_timeout_offset': (_google_protobuf_Duration__Output | null);
  /**
   * Indicates that during forwarding, the host header will be swapped with the content of given
   * downstream or :ref:`custom <config_http_conn_man_headers_custom_request_headers>` header.
   * If header value is empty, host header is left intact. Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   * 
   * .. attention::
   * 
   * Pay attention to the potential security implications of using this option. Provided header
   * must come from trusted source.
   * 
   * .. note::
   * 
   * If the header appears multiple times only the first value is used.
   */
  'host_rewrite_header'?: (string);
  /**
   * Specify a set of route request mirroring policies.
   * It takes precedence over the virtual host and route config mirror policy entirely.
   * That is, policies are not merged, the most specific non-empty one becomes the mirror policies.
   */
  'request_mirror_policies': (_envoy_config_route_v3_RouteAction_RequestMirrorPolicy__Output)[];
  /**
   * An internal redirect is handled, iff the number of previous internal redirects that a
   * downstream request has encountered is lower than this value, and
   * :ref:`internal_redirect_action <envoy_v3_api_field_config.route.v3.RouteAction.internal_redirect_action>`
   * is set to :ref:`HANDLE_INTERNAL_REDIRECT
   * <envoy_v3_api_enum_value_config.route.v3.RouteAction.InternalRedirectAction.HANDLE_INTERNAL_REDIRECT>`
   * In the case where a downstream request is bounced among multiple routes by internal redirect,
   * the first route that hits this threshold, or has
   * :ref:`internal_redirect_action <envoy_v3_api_field_config.route.v3.RouteAction.internal_redirect_action>`
   * set to
   * :ref:`PASS_THROUGH_INTERNAL_REDIRECT
   * <envoy_v3_api_enum_value_config.route.v3.RouteAction.InternalRedirectAction.PASS_THROUGH_INTERNAL_REDIRECT>`
   * will pass the redirect back to downstream.
   * 
   * If not specified, at most one redirect will be followed.
   */
  'max_internal_redirects': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Indicates that during forwarding, portions of the path that match the
   * pattern should be rewritten, even allowing the substitution of capture
   * groups from the pattern into the new path as specified by the rewrite
   * substitution string. This is useful to allow application paths to be
   * rewritten in a way that is aware of segments with variable content like
   * identifiers. The router filter will place the original path as it was
   * before the rewrite into the :ref:`x-envoy-original-path
   * <config_http_filters_router_x-envoy-original-path>` header.
   * 
   * Only one of :ref:`regex_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.regex_rewrite>`,
   * :ref:`prefix_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>`, or
   * :ref:`path_rewrite_policy <envoy_v3_api_field_config.route.v3.RouteAction.path_rewrite_policy>`]
   * may be specified.
   * 
   * Examples using Google's `RE2 <https://github.com/google/re2>`_ engine:
   * 
   * * The path pattern ``^/service/([^/]+)(/.*)$`` paired with a substitution
   * string of ``\2/instance/\1`` would transform ``/service/foo/v1/api``
   * into ``/v1/api/instance/foo``.
   * 
   * * The pattern ``one`` paired with a substitution string of ``two`` would
   * transform ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/two/zzz``.
   * 
   * * The pattern ``^(.*?)one(.*)$`` paired with a substitution string of
   * ``\1two\2`` would replace only the first occurrence of ``one``,
   * transforming path ``/xxx/one/yyy/one/zzz`` into ``/xxx/two/yyy/one/zzz``.
   * 
   * * The pattern ``(?i)/xxx/`` paired with a substitution string of ``/yyy/``
   * would do a case-insensitive match and transform path ``/aaa/XxX/bbb`` to
   * ``/aaa/yyy/bbb``.
   */
  'regex_rewrite': (_envoy_type_matcher_v3_RegexMatchAndSubstitute__Output | null);
  /**
   * [#not-implemented-hide:]
   * Specifies the configuration for retry policy extension. Note that if this is set, it'll take
   * precedence over the virtual host level retry policy entirely (e.g.: policies are not merged,
   * most internal one becomes the enforced policy). :ref:`Retry policy <envoy_v3_api_field_config.route.v3.VirtualHost.retry_policy>`
   * should not be set if this field is used.
   */
  'retry_policy_typed_config': (_google_protobuf_Any__Output | null);
  /**
   * If present, Envoy will try to follow an upstream redirect response instead of proxying the
   * response back to the downstream. An upstream redirect response is defined
   * by :ref:`redirect_response_codes
   * <envoy_v3_api_field_config.route.v3.InternalRedirectPolicy.redirect_response_codes>`.
   */
  'internal_redirect_policy': (_envoy_config_route_v3_InternalRedirectPolicy__Output | null);
  /**
   * Indicates that during forwarding, the host header will be swapped with
   * the result of the regex substitution executed on path value with query and fragment removed.
   * This is useful for transitioning variable content between path segment and subdomain.
   * Using this option will append the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` header if
   * :ref:`append_x_forwarded_host <envoy_v3_api_field_config.route.v3.RouteAction.append_x_forwarded_host>`
   * is set.
   * 
   * For example with the following config:
   * 
   * .. code-block:: yaml
   * 
   * host_rewrite_path_regex:
   * pattern:
   * google_re2: {}
   * regex: "^/(.+)/.+$"
   * substitution: \1
   * 
   * Would rewrite the host header to ``envoyproxy.io`` given the path ``/envoyproxy.io/some/path``.
   */
  'host_rewrite_path_regex'?: (_envoy_type_matcher_v3_RegexMatchAndSubstitute__Output | null);
  /**
   * Specifies the maximum stream duration for this route.
   */
  'max_stream_duration': (_envoy_config_route_v3_RouteAction_MaxStreamDuration__Output | null);
  /**
   * Name of the cluster specifier plugin to use to determine the cluster for requests on this route.
   * The cluster specifier plugin name must be defined in the associated
   * :ref:`cluster specifier plugins <envoy_v3_api_field_config.route.v3.RouteConfiguration.cluster_specifier_plugins>`
   * in the :ref:`name <envoy_v3_api_field_config.core.v3.TypedExtensionConfig.name>` field.
   */
  'cluster_specifier_plugin'?: (string);
  /**
   * If set, then a host rewrite action (one of
   * :ref:`host_rewrite_literal <envoy_v3_api_field_config.route.v3.RouteAction.host_rewrite_literal>`,
   * :ref:`auto_host_rewrite <envoy_v3_api_field_config.route.v3.RouteAction.auto_host_rewrite>`,
   * :ref:`host_rewrite_header <envoy_v3_api_field_config.route.v3.RouteAction.host_rewrite_header>`, or
   * :ref:`host_rewrite_path_regex <envoy_v3_api_field_config.route.v3.RouteAction.host_rewrite_path_regex>`)
   * causes the original value of the host header, if any, to be appended to the
   * :ref:`config_http_conn_man_headers_x-forwarded-host` HTTP header if it is different to the last value appended.
   * This can be disabled by setting the runtime guard `envoy_reloadable_features_append_xfh_idempotent` to false.
   */
  'append_x_forwarded_host': (boolean);
  /**
   * Custom cluster specifier plugin configuration to use to determine the cluster for requests
   * on this route.
   */
  'inline_cluster_specifier_plugin'?: (_envoy_config_route_v3_ClusterSpecifierPlugin__Output | null);
  /**
   * Specifies how to send request over TLS early data.
   * If absent, allows `safe HTTP requests <https://www.rfc-editor.org/rfc/rfc7231#section-4.2.1>`_ to be sent on early data.
   * [#extension-category: envoy.route.early_data_policy]
   */
  'early_data_policy': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * [#extension-category: envoy.path.rewrite]
   */
  'path_rewrite_policy': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  'cluster_specifier': "cluster"|"cluster_header"|"weighted_clusters"|"cluster_specifier_plugin"|"inline_cluster_specifier_plugin";
  'host_rewrite_specifier': "host_rewrite_literal"|"auto_host_rewrite"|"host_rewrite_header"|"host_rewrite_path_regex";
}
