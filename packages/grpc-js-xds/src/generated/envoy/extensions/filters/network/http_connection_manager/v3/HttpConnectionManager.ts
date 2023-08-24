// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { Rds as _envoy_extensions_filters_network_http_connection_manager_v3_Rds, Rds__Output as _envoy_extensions_filters_network_http_connection_manager_v3_Rds__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/Rds';
import type { RouteConfiguration as _envoy_config_route_v3_RouteConfiguration, RouteConfiguration__Output as _envoy_config_route_v3_RouteConfiguration__Output } from '../../../../../../envoy/config/route/v3/RouteConfiguration';
import type { HttpFilter as _envoy_extensions_filters_network_http_connection_manager_v3_HttpFilter, HttpFilter__Output as _envoy_extensions_filters_network_http_connection_manager_v3_HttpFilter__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/HttpFilter';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../../../google/protobuf/BoolValue';
import type { Http1ProtocolOptions as _envoy_config_core_v3_Http1ProtocolOptions, Http1ProtocolOptions__Output as _envoy_config_core_v3_Http1ProtocolOptions__Output } from '../../../../../../envoy/config/core/v3/Http1ProtocolOptions';
import type { Http2ProtocolOptions as _envoy_config_core_v3_Http2ProtocolOptions, Http2ProtocolOptions__Output as _envoy_config_core_v3_Http2ProtocolOptions__Output } from '../../../../../../envoy/config/core/v3/Http2ProtocolOptions';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../../../google/protobuf/Duration';
import type { AccessLog as _envoy_config_accesslog_v3_AccessLog, AccessLog__Output as _envoy_config_accesslog_v3_AccessLog__Output } from '../../../../../../envoy/config/accesslog/v3/AccessLog';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../../google/protobuf/UInt32Value';
import type { ScopedRoutes as _envoy_extensions_filters_network_http_connection_manager_v3_ScopedRoutes, ScopedRoutes__Output as _envoy_extensions_filters_network_http_connection_manager_v3_ScopedRoutes__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/ScopedRoutes';
import type { HttpProtocolOptions as _envoy_config_core_v3_HttpProtocolOptions, HttpProtocolOptions__Output as _envoy_config_core_v3_HttpProtocolOptions__Output } from '../../../../../../envoy/config/core/v3/HttpProtocolOptions';
import type { RequestIDExtension as _envoy_extensions_filters_network_http_connection_manager_v3_RequestIDExtension, RequestIDExtension__Output as _envoy_extensions_filters_network_http_connection_manager_v3_RequestIDExtension__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/RequestIDExtension';
import type { LocalReplyConfig as _envoy_extensions_filters_network_http_connection_manager_v3_LocalReplyConfig, LocalReplyConfig__Output as _envoy_extensions_filters_network_http_connection_manager_v3_LocalReplyConfig__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/LocalReplyConfig';
import type { Http3ProtocolOptions as _envoy_config_core_v3_Http3ProtocolOptions, Http3ProtocolOptions__Output as _envoy_config_core_v3_Http3ProtocolOptions__Output } from '../../../../../../envoy/config/core/v3/Http3ProtocolOptions';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { SchemeHeaderTransformation as _envoy_config_core_v3_SchemeHeaderTransformation, SchemeHeaderTransformation__Output as _envoy_config_core_v3_SchemeHeaderTransformation__Output } from '../../../../../../envoy/config/core/v3/SchemeHeaderTransformation';
import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../../../envoy/type/v3/Percent';
import type { CustomTag as _envoy_type_tracing_v3_CustomTag, CustomTag__Output as _envoy_type_tracing_v3_CustomTag__Output } from '../../../../../../envoy/type/tracing/v3/CustomTag';
import type { _envoy_config_trace_v3_Tracing_Http, _envoy_config_trace_v3_Tracing_Http__Output } from '../../../../../../envoy/config/trace/v3/Tracing';
import type { CidrRange as _envoy_config_core_v3_CidrRange, CidrRange__Output as _envoy_config_core_v3_CidrRange__Output } from '../../../../../../envoy/config/core/v3/CidrRange';
import type { PathTransformation as _envoy_type_http_v3_PathTransformation, PathTransformation__Output as _envoy_type_http_v3_PathTransformation__Output } from '../../../../../../envoy/type/http/v3/PathTransformation';

// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

export enum _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_CodecType {
  /**
   * For every new connection, the connection manager will determine which
   * codec to use. This mode supports both ALPN for TLS listeners as well as
   * protocol inference for plaintext listeners. If ALPN data is available, it
   * is preferred, otherwise protocol inference is used. In almost all cases,
   * this is the right option to choose for this setting.
   */
  AUTO = 0,
  /**
   * The connection manager will assume that the client is speaking HTTP/1.1.
   */
  HTTP1 = 1,
  /**
   * The connection manager will assume that the client is speaking HTTP/2
   * (Envoy does not require HTTP/2 to take place over TLS or to use ALPN.
   * Prior knowledge is allowed).
   */
  HTTP2 = 2,
  /**
   * [#not-implemented-hide:] QUIC implementation is not production ready yet. Use this enum with
   * caution to prevent accidental execution of QUIC code. I.e. `!= HTTP2` is no longer sufficient
   * to distinguish HTTP1 and HTTP2 traffic.
   */
  HTTP3 = 3,
}

// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

/**
 * How to handle the :ref:`config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP
 * header.
 */
export enum _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ForwardClientCertDetails {
  /**
   * Do not send the XFCC header to the next hop. This is the default value.
   */
  SANITIZE = 0,
  /**
   * When the client connection is mTLS (Mutual TLS), forward the XFCC header
   * in the request.
   */
  FORWARD_ONLY = 1,
  /**
   * When the client connection is mTLS, append the client certificate
   * information to the request’s XFCC header and forward it.
   */
  APPEND_FORWARD = 2,
  /**
   * When the client connection is mTLS, reset the XFCC header with the client
   * certificate information and send it to the next hop.
   */
  SANITIZE_SET = 3,
  /**
   * Always forward the XFCC header in the request, regardless of whether the
   * client connection is mTLS.
   */
  ALWAYS_FORWARD_ONLY = 4,
}

export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_HcmAccessLogOptions {
  /**
   * The interval to flush the above access logs. By default, the HCM will flush exactly one access log
   * on stream close, when the HTTP request is complete. If this field is set, the HCM will flush access
   * logs periodically at the specified interval. This is especially useful in the case of long-lived
   * requests, such as CONNECT and Websockets. Final access logs can be detected via the
   * `requestComplete()` method of `StreamInfo` in access log filters, or thru the `%DURATION%` substitution
   * string.
   * The interval must be at least 1 millisecond.
   */
  'access_log_flush_interval'?: (_google_protobuf_Duration | null);
  /**
   * If set to true, HCM will flush an access log when a new HTTP request is received, after request
   * headers have been evaluated, before iterating through the HTTP filter chain.
   * This log record, if enabled, does not depend on periodic log records or request completion log.
   * Details related to upstream cluster, such as upstream host, will not be available for this log.
   */
  'flush_access_log_on_new_request'?: (boolean);
  /**
   * If true, the HCM will flush an access log when a tunnel is successfully established. For example,
   * this could be when an upstream has successfully returned 101 Switching Protocols, or when the proxy
   * has returned 200 to a CONNECT request.
   */
  'flush_log_on_tunnel_successfully_established'?: (boolean);
}

export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_HcmAccessLogOptions__Output {
  /**
   * The interval to flush the above access logs. By default, the HCM will flush exactly one access log
   * on stream close, when the HTTP request is complete. If this field is set, the HCM will flush access
   * logs periodically at the specified interval. This is especially useful in the case of long-lived
   * requests, such as CONNECT and Websockets. Final access logs can be detected via the
   * `requestComplete()` method of `StreamInfo` in access log filters, or thru the `%DURATION%` substitution
   * string.
   * The interval must be at least 1 millisecond.
   */
  'access_log_flush_interval': (_google_protobuf_Duration__Output | null);
  /**
   * If set to true, HCM will flush an access log when a new HTTP request is received, after request
   * headers have been evaluated, before iterating through the HTTP filter chain.
   * This log record, if enabled, does not depend on periodic log records or request completion log.
   * Details related to upstream cluster, such as upstream host, will not be available for this log.
   */
  'flush_access_log_on_new_request': (boolean);
  /**
   * If true, the HCM will flush an access log when a tunnel is successfully established. For example,
   * this could be when an upstream has successfully returned 101 Switching Protocols, or when the proxy
   * has returned 200 to a CONNECT request.
   */
  'flush_log_on_tunnel_successfully_established': (boolean);
}

export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_InternalAddressConfig {
  /**
   * Whether unix socket addresses should be considered internal.
   */
  'unix_sockets'?: (boolean);
  /**
   * List of CIDR ranges that are treated as internal. If unset, then RFC1918 / RFC4193
   * IP addresses will be considered internal.
   */
  'cidr_ranges'?: (_envoy_config_core_v3_CidrRange)[];
}

export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_InternalAddressConfig__Output {
  /**
   * Whether unix socket addresses should be considered internal.
   */
  'unix_sockets': (boolean);
  /**
   * List of CIDR ranges that are treated as internal. If unset, then RFC1918 / RFC4193
   * IP addresses will be considered internal.
   */
  'cidr_ranges': (_envoy_config_core_v3_CidrRange__Output)[];
}

// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

export enum _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_Tracing_OperationName {
  /**
   * The HTTP listener is used for ingress/incoming requests.
   */
  INGRESS = 0,
  /**
   * The HTTP listener is used for egress/outgoing requests.
   */
  EGRESS = 1,
}

/**
 * [#not-implemented-hide:] Transformations that apply to path headers. Transformations are applied
 * before any processing of requests by HTTP filters, routing, and matching. Only the normalized
 * path will be visible internally if a transformation is enabled. Any path rewrites that the
 * router performs (e.g. :ref:`regex_rewrite
 * <envoy_v3_api_field_config.route.v3.RouteAction.regex_rewrite>` or :ref:`prefix_rewrite
 * <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>`) will apply to the ``:path`` header
 * destined for the upstream.
 * 
 * Note: access logging and tracing will show the original ``:path`` header.
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathNormalizationOptions {
  /**
   * [#not-implemented-hide:] Normalization applies internally before any processing of requests by
   * HTTP filters, routing, and matching *and* will affect the forwarded ``:path`` header. Defaults
   * to :ref:`NormalizePathRFC3986
   * <envoy_v3_api_msg_type.http.v3.PathTransformation.Operation.NormalizePathRFC3986>`. When not
   * specified, this value may be overridden by the runtime variable
   * :ref:`http_connection_manager.normalize_path<config_http_conn_man_runtime_normalize_path>`.
   * Envoy will respond with 400 to paths that are malformed (e.g. for paths that fail RFC 3986
   * normalization due to disallowed characters.)
   */
  'forwarding_transformation'?: (_envoy_type_http_v3_PathTransformation | null);
  /**
   * [#not-implemented-hide:] Normalization only applies internally before any processing of
   * requests by HTTP filters, routing, and matching. These will be applied after full
   * transformation is applied. The ``:path`` header before this transformation will be restored in
   * the router filter and sent upstream unless it was mutated by a filter. Defaults to no
   * transformations.
   * Multiple actions can be applied in the same Transformation, forming a sequential
   * pipeline. The transformations will be performed in the order that they appear. Envoy will
   * respond with 400 to paths that are malformed (e.g. for paths that fail RFC 3986
   * normalization due to disallowed characters.)
   */
  'http_filter_transformation'?: (_envoy_type_http_v3_PathTransformation | null);
}

/**
 * [#not-implemented-hide:] Transformations that apply to path headers. Transformations are applied
 * before any processing of requests by HTTP filters, routing, and matching. Only the normalized
 * path will be visible internally if a transformation is enabled. Any path rewrites that the
 * router performs (e.g. :ref:`regex_rewrite
 * <envoy_v3_api_field_config.route.v3.RouteAction.regex_rewrite>` or :ref:`prefix_rewrite
 * <envoy_v3_api_field_config.route.v3.RouteAction.prefix_rewrite>`) will apply to the ``:path`` header
 * destined for the upstream.
 * 
 * Note: access logging and tracing will show the original ``:path`` header.
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathNormalizationOptions__Output {
  /**
   * [#not-implemented-hide:] Normalization applies internally before any processing of requests by
   * HTTP filters, routing, and matching *and* will affect the forwarded ``:path`` header. Defaults
   * to :ref:`NormalizePathRFC3986
   * <envoy_v3_api_msg_type.http.v3.PathTransformation.Operation.NormalizePathRFC3986>`. When not
   * specified, this value may be overridden by the runtime variable
   * :ref:`http_connection_manager.normalize_path<config_http_conn_man_runtime_normalize_path>`.
   * Envoy will respond with 400 to paths that are malformed (e.g. for paths that fail RFC 3986
   * normalization due to disallowed characters.)
   */
  'forwarding_transformation': (_envoy_type_http_v3_PathTransformation__Output | null);
  /**
   * [#not-implemented-hide:] Normalization only applies internally before any processing of
   * requests by HTTP filters, routing, and matching. These will be applied after full
   * transformation is applied. The ``:path`` header before this transformation will be restored in
   * the router filter and sent upstream unless it was mutated by a filter. Defaults to no
   * transformations.
   * Multiple actions can be applied in the same Transformation, forming a sequential
   * pipeline. The transformations will be performed in the order that they appear. Envoy will
   * respond with 400 to paths that are malformed (e.g. for paths that fail RFC 3986
   * normalization due to disallowed characters.)
   */
  'http_filter_transformation': (_envoy_type_http_v3_PathTransformation__Output | null);
}

// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

/**
 * Determines the action for request that contain %2F, %2f, %5C or %5c sequences in the URI path.
 * This operation occurs before URL normalization and the merge slashes transformations if they were enabled.
 */
export enum _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathWithEscapedSlashesAction {
  /**
   * Default behavior specific to implementation (i.e. Envoy) of this configuration option.
   * Envoy, by default, takes the KEEP_UNCHANGED action.
   * NOTE: the implementation may change the default behavior at-will.
   */
  IMPLEMENTATION_SPECIFIC_DEFAULT = 0,
  /**
   * Keep escaped slashes.
   */
  KEEP_UNCHANGED = 1,
  /**
   * Reject client request with the 400 status. gRPC requests will be rejected with the INTERNAL (13) error code.
   * The "httpN.downstream_rq_failed_path_normalization" counter is incremented for each rejected request.
   */
  REJECT_REQUEST = 2,
  /**
   * Unescape %2F and %5C sequences and redirect request to the new path if these sequences were present.
   * Redirect occurs after path normalization and merge slashes transformations if they were configured.
   * NOTE: gRPC requests will be rejected with the INTERNAL (13) error code.
   * This option minimizes possibility of path confusion exploits by forcing request with unescaped slashes to
   * traverse all parties: downstream client, intermediate proxies, Envoy and upstream server.
   * The "httpN.downstream_rq_redirected_with_normalized_path" counter is incremented for each
   * redirected request.
   */
  UNESCAPE_AND_REDIRECT = 3,
  /**
   * Unescape %2F and %5C sequences.
   * Note: this option should not be enabled if intermediaries perform path based access control as
   * it may lead to path confusion vulnerabilities.
   */
  UNESCAPE_AND_FORWARD = 4,
}

/**
 * Configures the manner in which the Proxy-Status HTTP response header is
 * populated.
 * 
 * See the [Proxy-Status
 * RFC](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-proxy-status-08).
 * [#comment:TODO: Update this with the non-draft URL when finalized.]
 * 
 * The Proxy-Status header is a string of the form:
 * 
 * "<server_name>; error=<error_type>; details=<details>"
 * [#next-free-field: 7]
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ProxyStatusConfig {
  /**
   * If true, the details field of the Proxy-Status header is not populated with stream_info.response_code_details.
   * This value defaults to ``false``, i.e. the ``details`` field is populated by default.
   */
  'remove_details'?: (boolean);
  /**
   * If true, the details field of the Proxy-Status header will not contain
   * connection termination details. This value defaults to ``false``, i.e. the
   * ``details`` field will contain connection termination details by default.
   */
  'remove_connection_termination_details'?: (boolean);
  /**
   * If true, the details field of the Proxy-Status header will not contain an
   * enumeration of the Envoy ResponseFlags. This value defaults to ``false``,
   * i.e. the ``details`` field will contain a list of ResponseFlags by default.
   */
  'remove_response_flags'?: (boolean);
  /**
   * If true, overwrites the existing Status header with the response code
   * recommended by the Proxy-Status spec.
   * This value defaults to ``false``, i.e. the HTTP response code is not
   * overwritten.
   */
  'set_recommended_response_code'?: (boolean);
  /**
   * If ``use_node_id`` is set, Proxy-Status headers will use the Envoy's node
   * ID as the name of the proxy.
   */
  'use_node_id'?: (boolean);
  /**
   * If ``literal_proxy_name`` is set, Proxy-Status headers will use this
   * value as the name of the proxy.
   */
  'literal_proxy_name'?: (string);
  /**
   * The name of the proxy as it appears at the start of the Proxy-Status
   * header.
   * 
   * If neither of these values are set, this value defaults to ``server_name``,
   * which itself defaults to "envoy".
   */
  'proxy_name'?: "use_node_id"|"literal_proxy_name";
}

/**
 * Configures the manner in which the Proxy-Status HTTP response header is
 * populated.
 * 
 * See the [Proxy-Status
 * RFC](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-proxy-status-08).
 * [#comment:TODO: Update this with the non-draft URL when finalized.]
 * 
 * The Proxy-Status header is a string of the form:
 * 
 * "<server_name>; error=<error_type>; details=<details>"
 * [#next-free-field: 7]
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ProxyStatusConfig__Output {
  /**
   * If true, the details field of the Proxy-Status header is not populated with stream_info.response_code_details.
   * This value defaults to ``false``, i.e. the ``details`` field is populated by default.
   */
  'remove_details': (boolean);
  /**
   * If true, the details field of the Proxy-Status header will not contain
   * connection termination details. This value defaults to ``false``, i.e. the
   * ``details`` field will contain connection termination details by default.
   */
  'remove_connection_termination_details': (boolean);
  /**
   * If true, the details field of the Proxy-Status header will not contain an
   * enumeration of the Envoy ResponseFlags. This value defaults to ``false``,
   * i.e. the ``details`` field will contain a list of ResponseFlags by default.
   */
  'remove_response_flags': (boolean);
  /**
   * If true, overwrites the existing Status header with the response code
   * recommended by the Proxy-Status spec.
   * This value defaults to ``false``, i.e. the HTTP response code is not
   * overwritten.
   */
  'set_recommended_response_code': (boolean);
  /**
   * If ``use_node_id`` is set, Proxy-Status headers will use the Envoy's node
   * ID as the name of the proxy.
   */
  'use_node_id'?: (boolean);
  /**
   * If ``literal_proxy_name`` is set, Proxy-Status headers will use this
   * value as the name of the proxy.
   */
  'literal_proxy_name'?: (string);
  /**
   * The name of the proxy as it appears at the start of the Proxy-Status
   * header.
   * 
   * If neither of these values are set, this value defaults to ``server_name``,
   * which itself defaults to "envoy".
   */
  'proxy_name': "use_node_id"|"literal_proxy_name";
}

// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

export enum _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ServerHeaderTransformation {
  /**
   * Overwrite any Server header with the contents of server_name.
   */
  OVERWRITE = 0,
  /**
   * If no Server header is present, append Server server_name
   * If a Server header is present, pass it through.
   */
  APPEND_IF_ABSENT = 1,
  /**
   * Pass through the value of the server header, and do not append a header
   * if none is present.
   */
  PASS_THROUGH = 2,
}

/**
 * [#next-free-field: 7]
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_SetCurrentClientCertDetails {
  /**
   * Whether to forward the subject of the client cert. Defaults to false.
   */
  'subject'?: (_google_protobuf_BoolValue | null);
  /**
   * Whether to forward the entire client cert in URL encoded PEM format. This will appear in the
   * XFCC header comma separated from other values with the value Cert="PEM".
   * Defaults to false.
   */
  'cert'?: (boolean);
  /**
   * Whether to forward the entire client cert chain (including the leaf cert) in URL encoded PEM
   * format. This will appear in the XFCC header comma separated from other values with the value
   * Chain="PEM".
   * Defaults to false.
   */
  'chain'?: (boolean);
  /**
   * Whether to forward the DNS type Subject Alternative Names of the client cert.
   * Defaults to false.
   */
  'dns'?: (boolean);
  /**
   * Whether to forward the URI type Subject Alternative Name of the client cert. Defaults to
   * false.
   */
  'uri'?: (boolean);
}

/**
 * [#next-free-field: 7]
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_SetCurrentClientCertDetails__Output {
  /**
   * Whether to forward the subject of the client cert. Defaults to false.
   */
  'subject': (_google_protobuf_BoolValue__Output | null);
  /**
   * Whether to forward the entire client cert in URL encoded PEM format. This will appear in the
   * XFCC header comma separated from other values with the value Cert="PEM".
   * Defaults to false.
   */
  'cert': (boolean);
  /**
   * Whether to forward the entire client cert chain (including the leaf cert) in URL encoded PEM
   * format. This will appear in the XFCC header comma separated from other values with the value
   * Chain="PEM".
   * Defaults to false.
   */
  'chain': (boolean);
  /**
   * Whether to forward the DNS type Subject Alternative Names of the client cert.
   * Defaults to false.
   */
  'dns': (boolean);
  /**
   * Whether to forward the URI type Subject Alternative Name of the client cert. Defaults to
   * false.
   */
  'uri': (boolean);
}

/**
 * [#next-free-field: 10]
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_Tracing {
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be force
   * traced if the :ref:`x-client-trace-id <config_http_conn_man_headers_x-client-trace-id>`
   * header is set. This field is a direct analog for the runtime variable
   * 'tracing.client_enabled' in the :ref:`HTTP Connection Manager
   * <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'client_sampling'?: (_envoy_type_v3_Percent | null);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be randomly
   * selected for trace generation, if not requested by the client or not forced. This field is
   * a direct analog for the runtime variable 'tracing.random_sampling' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'random_sampling'?: (_envoy_type_v3_Percent | null);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be traced
   * after all other sampling checks have been applied (client-directed, force tracing, random
   * sampling). This field functions as an upper limit on the total configured sampling rate. For
   * instance, setting client_sampling to 100% but overall_sampling to 1% will result in only 1%
   * of client requests with the appropriate headers to be force traced. This field is a direct
   * analog for the runtime variable 'tracing.global_enabled' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'overall_sampling'?: (_envoy_type_v3_Percent | null);
  /**
   * Whether to annotate spans with additional data. If true, spans will include logs for stream
   * events.
   */
  'verbose'?: (boolean);
  /**
   * Maximum length of the request path to extract and include in the HttpUrl tag. Used to
   * truncate lengthy request paths to meet the needs of a tracing backend.
   * Default: 256
   */
  'max_path_tag_length'?: (_google_protobuf_UInt32Value | null);
  /**
   * A list of custom tags with unique tag name to create tags for the active span.
   */
  'custom_tags'?: (_envoy_type_tracing_v3_CustomTag)[];
  /**
   * Configuration for an external tracing provider.
   * If not specified, no tracing will be performed.
   * 
   * .. attention::
   * Please be aware that ``envoy.tracers.opencensus`` provider can only be configured once
   * in Envoy lifetime.
   * Any attempts to reconfigure it or to use different configurations for different HCM filters
   * will be rejected.
   * Such a constraint is inherent to OpenCensus itself. It cannot be overcome without changes
   * on OpenCensus side.
   */
  'provider'?: (_envoy_config_trace_v3_Tracing_Http | null);
}

/**
 * [#next-free-field: 10]
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_Tracing__Output {
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be force
   * traced if the :ref:`x-client-trace-id <config_http_conn_man_headers_x-client-trace-id>`
   * header is set. This field is a direct analog for the runtime variable
   * 'tracing.client_enabled' in the :ref:`HTTP Connection Manager
   * <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'client_sampling': (_envoy_type_v3_Percent__Output | null);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be randomly
   * selected for trace generation, if not requested by the client or not forced. This field is
   * a direct analog for the runtime variable 'tracing.random_sampling' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'random_sampling': (_envoy_type_v3_Percent__Output | null);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be traced
   * after all other sampling checks have been applied (client-directed, force tracing, random
   * sampling). This field functions as an upper limit on the total configured sampling rate. For
   * instance, setting client_sampling to 100% but overall_sampling to 1% will result in only 1%
   * of client requests with the appropriate headers to be force traced. This field is a direct
   * analog for the runtime variable 'tracing.global_enabled' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'overall_sampling': (_envoy_type_v3_Percent__Output | null);
  /**
   * Whether to annotate spans with additional data. If true, spans will include logs for stream
   * events.
   */
  'verbose': (boolean);
  /**
   * Maximum length of the request path to extract and include in the HttpUrl tag. Used to
   * truncate lengthy request paths to meet the needs of a tracing backend.
   * Default: 256
   */
  'max_path_tag_length': (_google_protobuf_UInt32Value__Output | null);
  /**
   * A list of custom tags with unique tag name to create tags for the active span.
   */
  'custom_tags': (_envoy_type_tracing_v3_CustomTag__Output)[];
  /**
   * Configuration for an external tracing provider.
   * If not specified, no tracing will be performed.
   * 
   * .. attention::
   * Please be aware that ``envoy.tracers.opencensus`` provider can only be configured once
   * in Envoy lifetime.
   * Any attempts to reconfigure it or to use different configurations for different HCM filters
   * will be rejected.
   * Such a constraint is inherent to OpenCensus itself. It cannot be overcome without changes
   * on OpenCensus side.
   */
  'provider': (_envoy_config_trace_v3_Tracing_Http__Output | null);
}

/**
 * The configuration for HTTP upgrades.
 * For each upgrade type desired, an UpgradeConfig must be added.
 * 
 * .. warning::
 * 
 * The current implementation of upgrade headers does not handle
 * multi-valued upgrade headers. Support for multi-valued headers may be
 * added in the future if needed.
 * 
 * .. warning::
 * The current implementation of upgrade headers does not work with HTTP/2
 * upstreams.
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_UpgradeConfig {
  /**
   * The case-insensitive name of this upgrade, e.g. "websocket".
   * For each upgrade type present in upgrade_configs, requests with
   * Upgrade: [upgrade_type]
   * will be proxied upstream.
   */
  'upgrade_type'?: (string);
  /**
   * If present, this represents the filter chain which will be created for
   * this type of upgrade. If no filters are present, the filter chain for
   * HTTP connections will be used for this upgrade type.
   */
  'filters'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpFilter)[];
  /**
   * Determines if upgrades are enabled or disabled by default. Defaults to true.
   * This can be overridden on a per-route basis with :ref:`cluster
   * <envoy_v3_api_field_config.route.v3.RouteAction.upgrade_configs>` as documented in the
   * :ref:`upgrade documentation <arch_overview_upgrades>`.
   */
  'enabled'?: (_google_protobuf_BoolValue | null);
}

/**
 * The configuration for HTTP upgrades.
 * For each upgrade type desired, an UpgradeConfig must be added.
 * 
 * .. warning::
 * 
 * The current implementation of upgrade headers does not handle
 * multi-valued upgrade headers. Support for multi-valued headers may be
 * added in the future if needed.
 * 
 * .. warning::
 * The current implementation of upgrade headers does not work with HTTP/2
 * upstreams.
 */
export interface _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_UpgradeConfig__Output {
  /**
   * The case-insensitive name of this upgrade, e.g. "websocket".
   * For each upgrade type present in upgrade_configs, requests with
   * Upgrade: [upgrade_type]
   * will be proxied upstream.
   */
  'upgrade_type': (string);
  /**
   * If present, this represents the filter chain which will be created for
   * this type of upgrade. If no filters are present, the filter chain for
   * HTTP connections will be used for this upgrade type.
   */
  'filters': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpFilter__Output)[];
  /**
   * Determines if upgrades are enabled or disabled by default. Defaults to true.
   * This can be overridden on a per-route basis with :ref:`cluster
   * <envoy_v3_api_field_config.route.v3.RouteAction.upgrade_configs>` as documented in the
   * :ref:`upgrade documentation <arch_overview_upgrades>`.
   */
  'enabled': (_google_protobuf_BoolValue__Output | null);
}

/**
 * [#next-free-field: 57]
 */
export interface HttpConnectionManager {
  /**
   * Supplies the type of codec that the connection manager should use.
   */
  'codec_type'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_CodecType | keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_CodecType);
  /**
   * The human readable prefix to use when emitting statistics for the
   * connection manager. See the :ref:`statistics documentation <config_http_conn_man_stats>` for
   * more information.
   */
  'stat_prefix'?: (string);
  /**
   * The connection manager’s route table will be dynamically loaded via the RDS API.
   */
  'rds'?: (_envoy_extensions_filters_network_http_connection_manager_v3_Rds | null);
  /**
   * The route table for the connection manager is static and is specified in this property.
   */
  'route_config'?: (_envoy_config_route_v3_RouteConfiguration | null);
  /**
   * A list of individual HTTP filters that make up the filter chain for
   * requests made to the connection manager. :ref:`Order matters <arch_overview_http_filters_ordering>`
   * as the filters are processed sequentially as request events happen.
   */
  'http_filters'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpFilter)[];
  /**
   * Whether the connection manager manipulates the :ref:`config_http_conn_man_headers_user-agent`
   * and :ref:`config_http_conn_man_headers_downstream-service-cluster` headers. See the linked
   * documentation for more information. Defaults to false.
   */
  'add_user_agent'?: (_google_protobuf_BoolValue | null);
  /**
   * Presence of the object defines whether the connection manager
   * emits :ref:`tracing <arch_overview_tracing>` data to the :ref:`configured tracing provider
   * <envoy_v3_api_msg_config.trace.v3.Tracing>`.
   */
  'tracing'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_Tracing | null);
  /**
   * Additional HTTP/1 settings that are passed to the HTTP/1 codec.
   * [#comment:TODO: The following fields are ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present:
   * 1. :ref:`allow_chunked_length <envoy_v3_api_field_config.core.v3.Http1ProtocolOptions.allow_chunked_length>`]
   */
  'http_protocol_options'?: (_envoy_config_core_v3_Http1ProtocolOptions | null);
  /**
   * Additional HTTP/2 settings that are passed directly to the HTTP/2 codec.
   */
  'http2_protocol_options'?: (_envoy_config_core_v3_Http2ProtocolOptions | null);
  /**
   * An optional override that the connection manager will write to the server
   * header in responses. If not set, the default is ``envoy``.
   */
  'server_name'?: (string);
  /**
   * The time that Envoy will wait between sending an HTTP/2 “shutdown
   * notification” (GOAWAY frame with max stream ID) and a final GOAWAY frame.
   * This is used so that Envoy provides a grace period for new streams that
   * race with the final GOAWAY frame. During this grace period, Envoy will
   * continue to accept new streams. After the grace period, a final GOAWAY
   * frame is sent and Envoy will start refusing new streams. Draining occurs
   * both when a connection hits the idle timeout or during general server
   * draining. The default grace period is 5000 milliseconds (5 seconds) if this
   * option is not specified.
   */
  'drain_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Configuration for :ref:`HTTP access logs <arch_overview_access_logs>`
   * emitted by the connection manager.
   */
  'access_log'?: (_envoy_config_accesslog_v3_AccessLog)[];
  /**
   * If set to true, the connection manager will use the real remote address
   * of the client connection when determining internal versus external origin and manipulating
   * various headers. If set to false or absent, the connection manager will use the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header. See the documentation for
   * :ref:`config_http_conn_man_headers_x-forwarded-for`,
   * :ref:`config_http_conn_man_headers_x-envoy-internal`, and
   * :ref:`config_http_conn_man_headers_x-envoy-external-address` for more information.
   */
  'use_remote_address'?: (_google_protobuf_BoolValue | null);
  /**
   * Whether the connection manager will generate the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if it does not exist. This defaults to
   * true. Generating a random UUID4 is expensive so in high throughput scenarios where this feature
   * is not desired it can be disabled.
   */
  'generate_request_id'?: (_google_protobuf_BoolValue | null);
  /**
   * How to handle the :ref:`config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP
   * header.
   */
  'forward_client_cert_details'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ForwardClientCertDetails | keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ForwardClientCertDetails);
  /**
   * This field is valid only when :ref:`forward_client_cert_details
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.forward_client_cert_details>`
   * is APPEND_FORWARD or SANITIZE_SET and the client connection is mTLS. It specifies the fields in
   * the client certificate to be forwarded. Note that in the
   * :ref:`config_http_conn_man_headers_x-forwarded-client-cert` header, ``Hash`` is always set, and
   * ``By`` is always set when the client certificate presents the URI type Subject Alternative Name
   * value.
   */
  'set_current_client_cert_details'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_SetCurrentClientCertDetails | null);
  /**
   * If proxy_100_continue is true, Envoy will proxy incoming "Expect:
   * 100-continue" headers upstream, and forward "100 Continue" responses
   * downstream. If this is false or not set, Envoy will instead strip the
   * "Expect: 100-continue" header, and send a "100 Continue" response itself.
   */
  'proxy_100_continue'?: (boolean);
  /**
   * The number of additional ingress proxy hops from the right side of the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header to trust when
   * determining the origin client's IP address. The default is zero if this option
   * is not specified. See the documentation for
   * :ref:`config_http_conn_man_headers_x-forwarded-for` for more information.
   */
  'xff_num_trusted_hops'?: (number);
  /**
   * If
   * :ref:`use_remote_address
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.use_remote_address>`
   * is true and represent_ipv4_remote_address_as_ipv4_mapped_ipv6 is true and the remote address is
   * an IPv4 address, the address will be mapped to IPv6 before it is appended to ``x-forwarded-for``.
   * This is useful for testing compatibility of upstream services that parse the header value. For
   * example, 50.0.0.1 is represented as ::FFFF:50.0.0.1. See `IPv4-Mapped IPv6 Addresses
   * <https://tools.ietf.org/html/rfc4291#section-2.5.5.2>`_ for details. This will also affect the
   * :ref:`config_http_conn_man_headers_x-envoy-external-address` header. See
   * :ref:`http_connection_manager.represent_ipv4_remote_address_as_ipv4_mapped_ipv6
   * <config_http_conn_man_runtime_represent_ipv4_remote_address_as_ipv4_mapped_ipv6>` for runtime
   * control.
   * [#not-implemented-hide:]
   */
  'represent_ipv4_remote_address_as_ipv4_mapped_ipv6'?: (boolean);
  /**
   * If set, Envoy will not append the remote address to the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header. This may be used in
   * conjunction with HTTP filters that explicitly manipulate XFF after the HTTP connection manager
   * has mutated the request headers. While :ref:`use_remote_address
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.use_remote_address>`
   * will also suppress XFF addition, it has consequences for logging and other
   * Envoy uses of the remote address, so ``skip_xff_append`` should be used
   * when only an elision of XFF addition is intended.
   */
  'skip_xff_append'?: (boolean);
  /**
   * Via header value to append to request and response headers. If this is
   * empty, no via header will be appended.
   */
  'via'?: (string);
  'upgrade_configs'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_UpgradeConfig)[];
  /**
   * The stream idle timeout for connections managed by the connection manager.
   * If not specified, this defaults to 5 minutes. The default value was selected
   * so as not to interfere with any smaller configured timeouts that may have
   * existed in configurations prior to the introduction of this feature, while
   * introducing robustness to TCP connections that terminate without a FIN.
   * 
   * This idle timeout applies to new streams and is overridable by the
   * :ref:`route-level idle_timeout
   * <envoy_v3_api_field_config.route.v3.RouteAction.idle_timeout>`. Even on a stream in
   * which the override applies, prior to receipt of the initial request
   * headers, the :ref:`stream_idle_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   * applies. Each time an encode/decode event for headers or data is processed
   * for the stream, the timer will be reset. If the timeout fires, the stream
   * is terminated with a 408 Request Timeout error code if no upstream response
   * header has been received, otherwise a stream reset occurs.
   * 
   * This timeout also specifies the amount of time that Envoy will wait for the peer to open enough
   * window to write any remaining stream data once the entirety of stream data (local end stream is
   * true) has been buffered pending available window. In other words, this timeout defends against
   * a peer that does not release enough window to completely write the stream, even though all
   * data has been proxied within available flow control windows. If the timeout is hit in this
   * case, the :ref:`tx_flush_timeout <config_http_conn_man_stats_per_codec>` counter will be
   * incremented. Note that :ref:`max_stream_duration
   * <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.max_stream_duration>` does not apply to
   * this corner case.
   * 
   * If the :ref:`overload action <config_overload_manager_overload_actions>` "envoy.overload_actions.reduce_timeouts"
   * is configured, this timeout is scaled according to the value for
   * :ref:`HTTP_DOWNSTREAM_STREAM_IDLE <envoy_v3_api_enum_value_config.overload.v3.ScaleTimersOverloadActionConfig.TimerType.HTTP_DOWNSTREAM_STREAM_IDLE>`.
   * 
   * Note that it is possible to idle timeout even if the wire traffic for a stream is non-idle, due
   * to the granularity of events presented to the connection manager. For example, while receiving
   * very large request headers, it may be the case that there is traffic regularly arriving on the
   * wire while the connection manage is only able to observe the end-of-headers event, hence the
   * stream may still idle timeout.
   * 
   * A value of 0 will completely disable the connection manager stream idle
   * timeout, although per-route idle timeout overrides will continue to apply.
   */
  'stream_idle_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Configures what network addresses are considered internal for stats and header sanitation
   * purposes. If unspecified, only RFC1918 IP addresses will be considered internal.
   * See the documentation for :ref:`config_http_conn_man_headers_x-envoy-internal` for more
   * information about internal/external addresses.
   */
  'internal_address_config'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_InternalAddressConfig | null);
  /**
   * The delayed close timeout is for downstream connections managed by the HTTP connection manager.
   * It is defined as a grace period after connection close processing has been locally initiated
   * during which Envoy will wait for the peer to close (i.e., a TCP FIN/RST is received by Envoy
   * from the downstream connection) prior to Envoy closing the socket associated with that
   * connection.
   * NOTE: This timeout is enforced even when the socket associated with the downstream connection
   * is pending a flush of the write buffer. However, any progress made writing data to the socket
   * will restart the timer associated with this timeout. This means that the total grace period for
   * a socket in this state will be
   * <total_time_waiting_for_write_buffer_flushes>+<delayed_close_timeout>.
   * 
   * Delaying Envoy's connection close and giving the peer the opportunity to initiate the close
   * sequence mitigates a race condition that exists when downstream clients do not drain/process
   * data in a connection's receive buffer after a remote close has been detected via a socket
   * write(). This race leads to such clients failing to process the response code sent by Envoy,
   * which could result in erroneous downstream processing.
   * 
   * If the timeout triggers, Envoy will close the connection's socket.
   * 
   * The default timeout is 1000 ms if this option is not specified.
   * 
   * .. NOTE::
   * To be useful in avoiding the race condition described above, this timeout must be set
   * to *at least* <max round trip time expected between clients and Envoy>+<100ms to account for
   * a reasonable "worst" case processing time for a full iteration of Envoy's event loop>.
   * 
   * .. WARNING::
   * A value of 0 will completely disable delayed close processing. When disabled, the downstream
   * connection's socket will be closed immediately after the write flush is completed or will
   * never close if the write flush does not complete.
   */
  'delayed_close_timeout'?: (_google_protobuf_Duration | null);
  /**
   * The amount of time that Envoy will wait for the entire request to be received.
   * The timer is activated when the request is initiated, and is disarmed when the last byte of the
   * request is sent upstream (i.e. all decoding filters have processed the request), OR when the
   * response is initiated. If not specified or set to 0, this timeout is disabled.
   */
  'request_timeout'?: (_google_protobuf_Duration | null);
  /**
   * The maximum request headers size for incoming connections.
   * If unconfigured, the default max request headers allowed is 60 KiB.
   * Requests that exceed this limit will receive a 431 response.
   */
  'max_request_headers_kb'?: (_google_protobuf_UInt32Value | null);
  /**
   * Should paths be normalized according to RFC 3986 before any processing of
   * requests by HTTP filters or routing? This affects the upstream ``:path`` header
   * as well. For paths that fail this check, Envoy will respond with 400 to
   * paths that are malformed. This defaults to false currently but will default
   * true in the future. When not specified, this value may be overridden by the
   * runtime variable
   * :ref:`http_connection_manager.normalize_path<config_http_conn_man_runtime_normalize_path>`.
   * See `Normalization and Comparison <https://tools.ietf.org/html/rfc3986#section-6>`_
   * for details of normalization.
   * Note that Envoy does not perform
   * `case normalization <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`_
   * [#comment:TODO: This field is ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present.]
   */
  'normalize_path'?: (_google_protobuf_BoolValue | null);
  /**
   * A route table will be dynamically assigned to each request based on request attributes
   * (e.g., the value of a header). The "routing scopes" (i.e., route tables) and "scope keys" are
   * specified in this message.
   */
  'scoped_routes'?: (_envoy_extensions_filters_network_http_connection_manager_v3_ScopedRoutes | null);
  /**
   * Whether the connection manager will keep the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if passed for a request that is edge
   * (Edge request is the request from external clients to front Envoy) and not reset it, which
   * is the current Envoy behaviour. This defaults to false.
   */
  'preserve_external_request_id'?: (boolean);
  /**
   * Determines if adjacent slashes in the path are merged into one before any processing of
   * requests by HTTP filters or routing. This affects the upstream ``:path`` header as well. Without
   * setting this option, incoming requests with path ``//dir///file`` will not match against route
   * with ``prefix`` match set to ``/dir``. Defaults to ``false``. Note that slash merging is not part of
   * `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
   * [#comment:TODO: This field is ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present.]
   */
  'merge_slashes'?: (boolean);
  /**
   * Defines the action to be applied to the Server header on the response path.
   * By default, Envoy will overwrite the header with the value specified in
   * server_name.
   */
  'server_header_transformation'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ServerHeaderTransformation | keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ServerHeaderTransformation);
  /**
   * Additional settings for HTTP requests handled by the connection manager. These will be
   * applicable to both HTTP1 and HTTP2 requests.
   */
  'common_http_protocol_options'?: (_envoy_config_core_v3_HttpProtocolOptions | null);
  /**
   * The configuration of the request ID extension. This includes operations such as
   * generation, validation, and associated tracing operations. If empty, the
   * :ref:`UuidRequestIdConfig <envoy_v3_api_msg_extensions.request_id.uuid.v3.UuidRequestIdConfig>`
   * default extension is used with default parameters. See the documentation for that extension
   * for details on what it does. Customizing the configuration for the default extension can be
   * achieved by configuring it explicitly here. For example, to disable trace reason packing,
   * the following configuration can be used:
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.extensions.filters.network.http_connection_manager.v3.RequestIDExtension
   * 
   * typed_config:
   * "@type": type.googleapis.com/envoy.extensions.request_id.uuid.v3.UuidRequestIdConfig
   * pack_trace_reason: false
   * 
   * [#extension-category: envoy.request_id]
   */
  'request_id_extension'?: (_envoy_extensions_filters_network_http_connection_manager_v3_RequestIDExtension | null);
  /**
   * If set, Envoy will always set :ref:`x-request-id <config_http_conn_man_headers_x-request-id>` header in response.
   * If this is false or not set, the request ID is returned in responses only if tracing is forced using
   * :ref:`x-envoy-force-trace <config_http_conn_man_headers_x-envoy-force-trace>` header.
   */
  'always_set_request_id_in_response'?: (boolean);
  /**
   * The configuration to customize local reply returned by Envoy. It can customize status code,
   * body text and response content type. If not specified, status code and text body are hard
   * coded in Envoy, the response content type is plain text.
   */
  'local_reply_config'?: (_envoy_extensions_filters_network_http_connection_manager_v3_LocalReplyConfig | null);
  /**
   * Determines if the port part should be removed from host/authority header before any processing
   * of request by HTTP filters or routing. The port would be removed only if it is equal to the :ref:`listener's<envoy_v3_api_field_config.listener.v3.Listener.address>`
   * local port. This affects the upstream host header unless the method is
   * CONNECT in which case if no filter adds a port the original port will be restored before headers are
   * sent upstream.
   * Without setting this option, incoming requests with host ``example:443`` will not match against
   * route with :ref:`domains<envoy_v3_api_field_config.route.v3.VirtualHost.domains>` match set to ``example``. Defaults to ``false``. Note that port removal is not part
   * of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
   * Only one of ``strip_matching_host_port`` or ``strip_any_host_port`` can be set.
   */
  'strip_matching_host_port'?: (boolean);
  /**
   * Governs Envoy's behavior when receiving invalid HTTP from downstream.
   * If this option is false (default), Envoy will err on the conservative side handling HTTP
   * errors, terminating both HTTP/1.1 and HTTP/2 connections when receiving an invalid request.
   * If this option is set to true, Envoy will be more permissive, only resetting the invalid
   * stream in the case of HTTP/2 and leaving the connection open where possible (if the entire
   * request is read for HTTP/1.1)
   * In general this should be true for deployments receiving trusted traffic (L2 Envoys,
   * company-internal mesh) and false when receiving untrusted traffic (edge deployments).
   * 
   * If different behaviors for invalid_http_message for HTTP/1 and HTTP/2 are
   * desired, one should use the new HTTP/1 option :ref:`override_stream_error_on_invalid_http_message
   * <envoy_v3_api_field_config.core.v3.Http1ProtocolOptions.override_stream_error_on_invalid_http_message>` or the new HTTP/2 option
   * :ref:`override_stream_error_on_invalid_http_message
   * <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.override_stream_error_on_invalid_http_message>`
   * ``not`` the deprecated but similarly named :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.stream_error_on_invalid_http_messaging>`
   */
  'stream_error_on_invalid_http_message'?: (_google_protobuf_BoolValue | null);
  /**
   * The amount of time that Envoy will wait for the request headers to be received. The timer is
   * activated when the first byte of the headers is received, and is disarmed when the last byte of
   * the headers has been received. If not specified or set to 0, this timeout is disabled.
   */
  'request_headers_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Determines if the port part should be removed from host/authority header before any processing
   * of request by HTTP filters or routing.
   * This affects the upstream host header unless the method is CONNECT in
   * which case if no filter adds a port the original port will be restored before headers are sent upstream.
   * Without setting this option, incoming requests with host ``example:443`` will not match against
   * route with :ref:`domains<envoy_v3_api_field_config.route.v3.VirtualHost.domains>` match set to ``example``. Defaults to ``false``. Note that port removal is not part
   * of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
   * Only one of ``strip_matching_host_port`` or ``strip_any_host_port`` can be set.
   */
  'strip_any_host_port'?: (boolean);
  /**
   * [#not-implemented-hide:] Path normalization configuration. This includes
   * configurations for transformations (e.g. RFC 3986 normalization or merge
   * adjacent slashes) and the policy to apply them. The policy determines
   * whether transformations affect the forwarded ``:path`` header. RFC 3986 path
   * normalization is enabled by default and the default policy is that the
   * normalized header will be forwarded. See :ref:`PathNormalizationOptions
   * <envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.PathNormalizationOptions>`
   * for details.
   */
  'path_normalization_options'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathNormalizationOptions | null);
  /**
   * Additional HTTP/3 settings that are passed directly to the HTTP/3 codec.
   * [#not-implemented-hide:]
   */
  'http3_protocol_options'?: (_envoy_config_core_v3_Http3ProtocolOptions | null);
  /**
   * Action to take when request URL path contains escaped slash sequences (%2F, %2f, %5C and %5c).
   * The default value can be overridden by the :ref:`http_connection_manager.path_with_escaped_slashes_action<config_http_conn_man_runtime_path_with_escaped_slashes_action>`
   * runtime variable.
   * The :ref:`http_connection_manager.path_with_escaped_slashes_action_sampling<config_http_conn_man_runtime_path_with_escaped_slashes_action_enabled>` runtime
   * variable can be used to apply the action to a portion of all requests.
   * [#comment:TODO: This field is ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present.]
   */
  'path_with_escaped_slashes_action'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathWithEscapedSlashesAction | keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathWithEscapedSlashesAction);
  /**
   * The configuration for the original IP detection extensions.
   * 
   * When configured the extensions will be called along with the request headers
   * and information about the downstream connection, such as the directly connected address.
   * Each extension will then use these parameters to decide the request's effective remote address.
   * If an extension fails to detect the original IP address and isn't configured to reject
   * the request, the HCM will try the remaining extensions until one succeeds or rejects
   * the request. If the request isn't rejected nor any extension succeeds, the HCM will
   * fallback to using the remote address.
   * 
   * .. WARNING::
   * Extensions cannot be used in conjunction with :ref:`use_remote_address
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.use_remote_address>`
   * nor :ref:`xff_num_trusted_hops
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.xff_num_trusted_hops>`.
   * 
   * [#extension-category: envoy.http.original_ip_detection]
   */
  'original_ip_detection_extensions'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
  /**
   * Determines if trailing dot of the host should be removed from host/authority header before any
   * processing of request by HTTP filters or routing.
   * This affects the upstream host header.
   * Without setting this option, incoming requests with host ``example.com.`` will not match against
   * route with :ref:`domains<envoy_v3_api_field_config.route.v3.VirtualHost.domains>` match set to ``example.com``. Defaults to ``false``.
   * When the incoming request contains a host/authority header that includes a port number,
   * setting this option will strip a trailing dot, if present, from the host section,
   * leaving the port as is (e.g. host value ``example.com.:443`` will be updated to ``example.com:443``).
   */
  'strip_trailing_host_dot'?: (boolean);
  /**
   * Allows for explicit transformation of the :scheme header on the request path.
   * If not set, Envoy's default :ref:`scheme  <config_http_conn_man_headers_scheme>`
   * handling applies.
   */
  'scheme_header_transformation'?: (_envoy_config_core_v3_SchemeHeaderTransformation | null);
  /**
   * Proxy-Status HTTP response header configuration.
   * If this config is set, the Proxy-Status HTTP response header field is
   * populated. By default, it is not.
   */
  'proxy_status_config'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ProxyStatusConfig | null);
  /**
   * Configuration options for Header Validation (UHV).
   * UHV is an extensible mechanism for checking validity of HTTP requests as well as providing
   * normalization for request attributes, such as URI path.
   * If the typed_header_validation_config is present it overrides the following options:
   * ``normalize_path``, ``merge_slashes``, ``path_with_escaped_slashes_action``
   * ``http_protocol_options.allow_chunked_length``, ``common_http_protocol_options.headers_with_underscores_action``.
   * 
   * The default UHV checks the following:
   * 
   * #. HTTP/1 header map validity according to `RFC 7230 section 3.2<https://datatracker.ietf.org/doc/html/rfc7230#section-3.2>`_
   * #. Syntax of HTTP/1 request target URI and response status
   * #. HTTP/2 header map validity according to `RFC 7540 section 8.1.2<https://datatracker.ietf.org/doc/html/rfc7540#section-8.1.2`_
   * #. Syntax of HTTP/2 pseudo headers
   * #. HTTP/3 header map validity according to `RFC 9114 section 4.3 <https://www.rfc-editor.org/rfc/rfc9114.html>`_
   * #. Syntax of HTTP/3 pseudo headers
   * #. Syntax of ``Content-Length`` and ``Transfer-Encoding``
   * #. Validation of HTTP/1 requests with both ``Content-Length`` and ``Transfer-Encoding`` headers
   * #. Normalization of the URI path according to `Normalization and Comparison <https://datatracker.ietf.org/doc/html/rfc3986#section-6>`_
   * without `case normalization <https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.1>`_
   * 
   * [#not-implemented-hide:]
   * [#extension-category: envoy.http.header_validators]
   */
  'typed_header_validation_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Append the `x-forwarded-port` header with the port value client used to connect to Envoy. It
   * will be ignored if the `x-forwarded-port` header has been set by any trusted proxy in front of Envoy.
   */
  'append_x_forwarded_port'?: (boolean);
  /**
   * The configuration for the early header mutation extensions.
   * 
   * When configured the extensions will be called before any routing, tracing, or any filter processing.
   * Each extension will be applied in the order they are configured.
   * If the same header is mutated by multiple extensions, then the last extension will win.
   * 
   * [#extension-category: envoy.http.early_header_mutation]
   */
  'early_header_mutation_extensions'?: (_envoy_config_core_v3_TypedExtensionConfig)[];
  /**
   * Whether the HCM will add ProxyProtocolFilterState to the Connection lifetime filter state. Defaults to `true`.
   * This should be set to `false` in cases where Envoy's view of the downstream address may not correspond to the
   * actual client address, for example, if there's another proxy in front of the Envoy.
   */
  'add_proxy_protocol_connection_state'?: (_google_protobuf_BoolValue | null);
  /**
   * .. attention::
   * This field is deprecated in favor of
   * :ref:`access_log_flush_interval
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.access_log_flush_interval>`.
   * Note that if both this field and :ref:`access_log_flush_interval
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.access_log_flush_interval>`
   * are specified, the former (deprecated field) is ignored.
   */
  'access_log_flush_interval'?: (_google_protobuf_Duration | null);
  /**
   * .. attention::
   * This field is deprecated in favor of
   * :ref:`flush_access_log_on_new_request
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.flush_access_log_on_new_request>`.
   * Note that if both this field and :ref:`flush_access_log_on_new_request
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.flush_access_log_on_new_request>`
   * are specified, the former (deprecated field) is ignored.
   */
  'flush_access_log_on_new_request'?: (boolean);
  /**
   * Additional access log options for HTTP connection manager.
   */
  'access_log_options'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_HcmAccessLogOptions | null);
  'route_specifier'?: "rds"|"route_config"|"scoped_routes";
  'strip_port_mode'?: "strip_any_host_port";
}

/**
 * [#next-free-field: 57]
 */
export interface HttpConnectionManager__Output {
  /**
   * Supplies the type of codec that the connection manager should use.
   */
  'codec_type': (keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_CodecType);
  /**
   * The human readable prefix to use when emitting statistics for the
   * connection manager. See the :ref:`statistics documentation <config_http_conn_man_stats>` for
   * more information.
   */
  'stat_prefix': (string);
  /**
   * The connection manager’s route table will be dynamically loaded via the RDS API.
   */
  'rds'?: (_envoy_extensions_filters_network_http_connection_manager_v3_Rds__Output | null);
  /**
   * The route table for the connection manager is static and is specified in this property.
   */
  'route_config'?: (_envoy_config_route_v3_RouteConfiguration__Output | null);
  /**
   * A list of individual HTTP filters that make up the filter chain for
   * requests made to the connection manager. :ref:`Order matters <arch_overview_http_filters_ordering>`
   * as the filters are processed sequentially as request events happen.
   */
  'http_filters': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpFilter__Output)[];
  /**
   * Whether the connection manager manipulates the :ref:`config_http_conn_man_headers_user-agent`
   * and :ref:`config_http_conn_man_headers_downstream-service-cluster` headers. See the linked
   * documentation for more information. Defaults to false.
   */
  'add_user_agent': (_google_protobuf_BoolValue__Output | null);
  /**
   * Presence of the object defines whether the connection manager
   * emits :ref:`tracing <arch_overview_tracing>` data to the :ref:`configured tracing provider
   * <envoy_v3_api_msg_config.trace.v3.Tracing>`.
   */
  'tracing': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_Tracing__Output | null);
  /**
   * Additional HTTP/1 settings that are passed to the HTTP/1 codec.
   * [#comment:TODO: The following fields are ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present:
   * 1. :ref:`allow_chunked_length <envoy_v3_api_field_config.core.v3.Http1ProtocolOptions.allow_chunked_length>`]
   */
  'http_protocol_options': (_envoy_config_core_v3_Http1ProtocolOptions__Output | null);
  /**
   * Additional HTTP/2 settings that are passed directly to the HTTP/2 codec.
   */
  'http2_protocol_options': (_envoy_config_core_v3_Http2ProtocolOptions__Output | null);
  /**
   * An optional override that the connection manager will write to the server
   * header in responses. If not set, the default is ``envoy``.
   */
  'server_name': (string);
  /**
   * The time that Envoy will wait between sending an HTTP/2 “shutdown
   * notification” (GOAWAY frame with max stream ID) and a final GOAWAY frame.
   * This is used so that Envoy provides a grace period for new streams that
   * race with the final GOAWAY frame. During this grace period, Envoy will
   * continue to accept new streams. After the grace period, a final GOAWAY
   * frame is sent and Envoy will start refusing new streams. Draining occurs
   * both when a connection hits the idle timeout or during general server
   * draining. The default grace period is 5000 milliseconds (5 seconds) if this
   * option is not specified.
   */
  'drain_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Configuration for :ref:`HTTP access logs <arch_overview_access_logs>`
   * emitted by the connection manager.
   */
  'access_log': (_envoy_config_accesslog_v3_AccessLog__Output)[];
  /**
   * If set to true, the connection manager will use the real remote address
   * of the client connection when determining internal versus external origin and manipulating
   * various headers. If set to false or absent, the connection manager will use the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header. See the documentation for
   * :ref:`config_http_conn_man_headers_x-forwarded-for`,
   * :ref:`config_http_conn_man_headers_x-envoy-internal`, and
   * :ref:`config_http_conn_man_headers_x-envoy-external-address` for more information.
   */
  'use_remote_address': (_google_protobuf_BoolValue__Output | null);
  /**
   * Whether the connection manager will generate the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if it does not exist. This defaults to
   * true. Generating a random UUID4 is expensive so in high throughput scenarios where this feature
   * is not desired it can be disabled.
   */
  'generate_request_id': (_google_protobuf_BoolValue__Output | null);
  /**
   * How to handle the :ref:`config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP
   * header.
   */
  'forward_client_cert_details': (keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ForwardClientCertDetails);
  /**
   * This field is valid only when :ref:`forward_client_cert_details
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.forward_client_cert_details>`
   * is APPEND_FORWARD or SANITIZE_SET and the client connection is mTLS. It specifies the fields in
   * the client certificate to be forwarded. Note that in the
   * :ref:`config_http_conn_man_headers_x-forwarded-client-cert` header, ``Hash`` is always set, and
   * ``By`` is always set when the client certificate presents the URI type Subject Alternative Name
   * value.
   */
  'set_current_client_cert_details': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_SetCurrentClientCertDetails__Output | null);
  /**
   * If proxy_100_continue is true, Envoy will proxy incoming "Expect:
   * 100-continue" headers upstream, and forward "100 Continue" responses
   * downstream. If this is false or not set, Envoy will instead strip the
   * "Expect: 100-continue" header, and send a "100 Continue" response itself.
   */
  'proxy_100_continue': (boolean);
  /**
   * The number of additional ingress proxy hops from the right side of the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header to trust when
   * determining the origin client's IP address. The default is zero if this option
   * is not specified. See the documentation for
   * :ref:`config_http_conn_man_headers_x-forwarded-for` for more information.
   */
  'xff_num_trusted_hops': (number);
  /**
   * If
   * :ref:`use_remote_address
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.use_remote_address>`
   * is true and represent_ipv4_remote_address_as_ipv4_mapped_ipv6 is true and the remote address is
   * an IPv4 address, the address will be mapped to IPv6 before it is appended to ``x-forwarded-for``.
   * This is useful for testing compatibility of upstream services that parse the header value. For
   * example, 50.0.0.1 is represented as ::FFFF:50.0.0.1. See `IPv4-Mapped IPv6 Addresses
   * <https://tools.ietf.org/html/rfc4291#section-2.5.5.2>`_ for details. This will also affect the
   * :ref:`config_http_conn_man_headers_x-envoy-external-address` header. See
   * :ref:`http_connection_manager.represent_ipv4_remote_address_as_ipv4_mapped_ipv6
   * <config_http_conn_man_runtime_represent_ipv4_remote_address_as_ipv4_mapped_ipv6>` for runtime
   * control.
   * [#not-implemented-hide:]
   */
  'represent_ipv4_remote_address_as_ipv4_mapped_ipv6': (boolean);
  /**
   * If set, Envoy will not append the remote address to the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header. This may be used in
   * conjunction with HTTP filters that explicitly manipulate XFF after the HTTP connection manager
   * has mutated the request headers. While :ref:`use_remote_address
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.use_remote_address>`
   * will also suppress XFF addition, it has consequences for logging and other
   * Envoy uses of the remote address, so ``skip_xff_append`` should be used
   * when only an elision of XFF addition is intended.
   */
  'skip_xff_append': (boolean);
  /**
   * Via header value to append to request and response headers. If this is
   * empty, no via header will be appended.
   */
  'via': (string);
  'upgrade_configs': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_UpgradeConfig__Output)[];
  /**
   * The stream idle timeout for connections managed by the connection manager.
   * If not specified, this defaults to 5 minutes. The default value was selected
   * so as not to interfere with any smaller configured timeouts that may have
   * existed in configurations prior to the introduction of this feature, while
   * introducing robustness to TCP connections that terminate without a FIN.
   * 
   * This idle timeout applies to new streams and is overridable by the
   * :ref:`route-level idle_timeout
   * <envoy_v3_api_field_config.route.v3.RouteAction.idle_timeout>`. Even on a stream in
   * which the override applies, prior to receipt of the initial request
   * headers, the :ref:`stream_idle_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_idle_timeout>`
   * applies. Each time an encode/decode event for headers or data is processed
   * for the stream, the timer will be reset. If the timeout fires, the stream
   * is terminated with a 408 Request Timeout error code if no upstream response
   * header has been received, otherwise a stream reset occurs.
   * 
   * This timeout also specifies the amount of time that Envoy will wait for the peer to open enough
   * window to write any remaining stream data once the entirety of stream data (local end stream is
   * true) has been buffered pending available window. In other words, this timeout defends against
   * a peer that does not release enough window to completely write the stream, even though all
   * data has been proxied within available flow control windows. If the timeout is hit in this
   * case, the :ref:`tx_flush_timeout <config_http_conn_man_stats_per_codec>` counter will be
   * incremented. Note that :ref:`max_stream_duration
   * <envoy_v3_api_field_config.core.v3.HttpProtocolOptions.max_stream_duration>` does not apply to
   * this corner case.
   * 
   * If the :ref:`overload action <config_overload_manager_overload_actions>` "envoy.overload_actions.reduce_timeouts"
   * is configured, this timeout is scaled according to the value for
   * :ref:`HTTP_DOWNSTREAM_STREAM_IDLE <envoy_v3_api_enum_value_config.overload.v3.ScaleTimersOverloadActionConfig.TimerType.HTTP_DOWNSTREAM_STREAM_IDLE>`.
   * 
   * Note that it is possible to idle timeout even if the wire traffic for a stream is non-idle, due
   * to the granularity of events presented to the connection manager. For example, while receiving
   * very large request headers, it may be the case that there is traffic regularly arriving on the
   * wire while the connection manage is only able to observe the end-of-headers event, hence the
   * stream may still idle timeout.
   * 
   * A value of 0 will completely disable the connection manager stream idle
   * timeout, although per-route idle timeout overrides will continue to apply.
   */
  'stream_idle_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Configures what network addresses are considered internal for stats and header sanitation
   * purposes. If unspecified, only RFC1918 IP addresses will be considered internal.
   * See the documentation for :ref:`config_http_conn_man_headers_x-envoy-internal` for more
   * information about internal/external addresses.
   */
  'internal_address_config': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_InternalAddressConfig__Output | null);
  /**
   * The delayed close timeout is for downstream connections managed by the HTTP connection manager.
   * It is defined as a grace period after connection close processing has been locally initiated
   * during which Envoy will wait for the peer to close (i.e., a TCP FIN/RST is received by Envoy
   * from the downstream connection) prior to Envoy closing the socket associated with that
   * connection.
   * NOTE: This timeout is enforced even when the socket associated with the downstream connection
   * is pending a flush of the write buffer. However, any progress made writing data to the socket
   * will restart the timer associated with this timeout. This means that the total grace period for
   * a socket in this state will be
   * <total_time_waiting_for_write_buffer_flushes>+<delayed_close_timeout>.
   * 
   * Delaying Envoy's connection close and giving the peer the opportunity to initiate the close
   * sequence mitigates a race condition that exists when downstream clients do not drain/process
   * data in a connection's receive buffer after a remote close has been detected via a socket
   * write(). This race leads to such clients failing to process the response code sent by Envoy,
   * which could result in erroneous downstream processing.
   * 
   * If the timeout triggers, Envoy will close the connection's socket.
   * 
   * The default timeout is 1000 ms if this option is not specified.
   * 
   * .. NOTE::
   * To be useful in avoiding the race condition described above, this timeout must be set
   * to *at least* <max round trip time expected between clients and Envoy>+<100ms to account for
   * a reasonable "worst" case processing time for a full iteration of Envoy's event loop>.
   * 
   * .. WARNING::
   * A value of 0 will completely disable delayed close processing. When disabled, the downstream
   * connection's socket will be closed immediately after the write flush is completed or will
   * never close if the write flush does not complete.
   */
  'delayed_close_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * The amount of time that Envoy will wait for the entire request to be received.
   * The timer is activated when the request is initiated, and is disarmed when the last byte of the
   * request is sent upstream (i.e. all decoding filters have processed the request), OR when the
   * response is initiated. If not specified or set to 0, this timeout is disabled.
   */
  'request_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * The maximum request headers size for incoming connections.
   * If unconfigured, the default max request headers allowed is 60 KiB.
   * Requests that exceed this limit will receive a 431 response.
   */
  'max_request_headers_kb': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Should paths be normalized according to RFC 3986 before any processing of
   * requests by HTTP filters or routing? This affects the upstream ``:path`` header
   * as well. For paths that fail this check, Envoy will respond with 400 to
   * paths that are malformed. This defaults to false currently but will default
   * true in the future. When not specified, this value may be overridden by the
   * runtime variable
   * :ref:`http_connection_manager.normalize_path<config_http_conn_man_runtime_normalize_path>`.
   * See `Normalization and Comparison <https://tools.ietf.org/html/rfc3986#section-6>`_
   * for details of normalization.
   * Note that Envoy does not perform
   * `case normalization <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`_
   * [#comment:TODO: This field is ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present.]
   */
  'normalize_path': (_google_protobuf_BoolValue__Output | null);
  /**
   * A route table will be dynamically assigned to each request based on request attributes
   * (e.g., the value of a header). The "routing scopes" (i.e., route tables) and "scope keys" are
   * specified in this message.
   */
  'scoped_routes'?: (_envoy_extensions_filters_network_http_connection_manager_v3_ScopedRoutes__Output | null);
  /**
   * Whether the connection manager will keep the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if passed for a request that is edge
   * (Edge request is the request from external clients to front Envoy) and not reset it, which
   * is the current Envoy behaviour. This defaults to false.
   */
  'preserve_external_request_id': (boolean);
  /**
   * Determines if adjacent slashes in the path are merged into one before any processing of
   * requests by HTTP filters or routing. This affects the upstream ``:path`` header as well. Without
   * setting this option, incoming requests with path ``//dir///file`` will not match against route
   * with ``prefix`` match set to ``/dir``. Defaults to ``false``. Note that slash merging is not part of
   * `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
   * [#comment:TODO: This field is ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present.]
   */
  'merge_slashes': (boolean);
  /**
   * Defines the action to be applied to the Server header on the response path.
   * By default, Envoy will overwrite the header with the value specified in
   * server_name.
   */
  'server_header_transformation': (keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ServerHeaderTransformation);
  /**
   * Additional settings for HTTP requests handled by the connection manager. These will be
   * applicable to both HTTP1 and HTTP2 requests.
   */
  'common_http_protocol_options': (_envoy_config_core_v3_HttpProtocolOptions__Output | null);
  /**
   * The configuration of the request ID extension. This includes operations such as
   * generation, validation, and associated tracing operations. If empty, the
   * :ref:`UuidRequestIdConfig <envoy_v3_api_msg_extensions.request_id.uuid.v3.UuidRequestIdConfig>`
   * default extension is used with default parameters. See the documentation for that extension
   * for details on what it does. Customizing the configuration for the default extension can be
   * achieved by configuring it explicitly here. For example, to disable trace reason packing,
   * the following configuration can be used:
   * 
   * .. validated-code-block:: yaml
   * :type-name: envoy.extensions.filters.network.http_connection_manager.v3.RequestIDExtension
   * 
   * typed_config:
   * "@type": type.googleapis.com/envoy.extensions.request_id.uuid.v3.UuidRequestIdConfig
   * pack_trace_reason: false
   * 
   * [#extension-category: envoy.request_id]
   */
  'request_id_extension': (_envoy_extensions_filters_network_http_connection_manager_v3_RequestIDExtension__Output | null);
  /**
   * If set, Envoy will always set :ref:`x-request-id <config_http_conn_man_headers_x-request-id>` header in response.
   * If this is false or not set, the request ID is returned in responses only if tracing is forced using
   * :ref:`x-envoy-force-trace <config_http_conn_man_headers_x-envoy-force-trace>` header.
   */
  'always_set_request_id_in_response': (boolean);
  /**
   * The configuration to customize local reply returned by Envoy. It can customize status code,
   * body text and response content type. If not specified, status code and text body are hard
   * coded in Envoy, the response content type is plain text.
   */
  'local_reply_config': (_envoy_extensions_filters_network_http_connection_manager_v3_LocalReplyConfig__Output | null);
  /**
   * Determines if the port part should be removed from host/authority header before any processing
   * of request by HTTP filters or routing. The port would be removed only if it is equal to the :ref:`listener's<envoy_v3_api_field_config.listener.v3.Listener.address>`
   * local port. This affects the upstream host header unless the method is
   * CONNECT in which case if no filter adds a port the original port will be restored before headers are
   * sent upstream.
   * Without setting this option, incoming requests with host ``example:443`` will not match against
   * route with :ref:`domains<envoy_v3_api_field_config.route.v3.VirtualHost.domains>` match set to ``example``. Defaults to ``false``. Note that port removal is not part
   * of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
   * Only one of ``strip_matching_host_port`` or ``strip_any_host_port`` can be set.
   */
  'strip_matching_host_port': (boolean);
  /**
   * Governs Envoy's behavior when receiving invalid HTTP from downstream.
   * If this option is false (default), Envoy will err on the conservative side handling HTTP
   * errors, terminating both HTTP/1.1 and HTTP/2 connections when receiving an invalid request.
   * If this option is set to true, Envoy will be more permissive, only resetting the invalid
   * stream in the case of HTTP/2 and leaving the connection open where possible (if the entire
   * request is read for HTTP/1.1)
   * In general this should be true for deployments receiving trusted traffic (L2 Envoys,
   * company-internal mesh) and false when receiving untrusted traffic (edge deployments).
   * 
   * If different behaviors for invalid_http_message for HTTP/1 and HTTP/2 are
   * desired, one should use the new HTTP/1 option :ref:`override_stream_error_on_invalid_http_message
   * <envoy_v3_api_field_config.core.v3.Http1ProtocolOptions.override_stream_error_on_invalid_http_message>` or the new HTTP/2 option
   * :ref:`override_stream_error_on_invalid_http_message
   * <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.override_stream_error_on_invalid_http_message>`
   * ``not`` the deprecated but similarly named :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.stream_error_on_invalid_http_messaging>`
   */
  'stream_error_on_invalid_http_message': (_google_protobuf_BoolValue__Output | null);
  /**
   * The amount of time that Envoy will wait for the request headers to be received. The timer is
   * activated when the first byte of the headers is received, and is disarmed when the last byte of
   * the headers has been received. If not specified or set to 0, this timeout is disabled.
   */
  'request_headers_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Determines if the port part should be removed from host/authority header before any processing
   * of request by HTTP filters or routing.
   * This affects the upstream host header unless the method is CONNECT in
   * which case if no filter adds a port the original port will be restored before headers are sent upstream.
   * Without setting this option, incoming requests with host ``example:443`` will not match against
   * route with :ref:`domains<envoy_v3_api_field_config.route.v3.VirtualHost.domains>` match set to ``example``. Defaults to ``false``. Note that port removal is not part
   * of `HTTP spec <https://tools.ietf.org/html/rfc3986>`_ and is provided for convenience.
   * Only one of ``strip_matching_host_port`` or ``strip_any_host_port`` can be set.
   */
  'strip_any_host_port'?: (boolean);
  /**
   * [#not-implemented-hide:] Path normalization configuration. This includes
   * configurations for transformations (e.g. RFC 3986 normalization or merge
   * adjacent slashes) and the policy to apply them. The policy determines
   * whether transformations affect the forwarded ``:path`` header. RFC 3986 path
   * normalization is enabled by default and the default policy is that the
   * normalized header will be forwarded. See :ref:`PathNormalizationOptions
   * <envoy_v3_api_msg_extensions.filters.network.http_connection_manager.v3.PathNormalizationOptions>`
   * for details.
   */
  'path_normalization_options': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathNormalizationOptions__Output | null);
  /**
   * Additional HTTP/3 settings that are passed directly to the HTTP/3 codec.
   * [#not-implemented-hide:]
   */
  'http3_protocol_options': (_envoy_config_core_v3_Http3ProtocolOptions__Output | null);
  /**
   * Action to take when request URL path contains escaped slash sequences (%2F, %2f, %5C and %5c).
   * The default value can be overridden by the :ref:`http_connection_manager.path_with_escaped_slashes_action<config_http_conn_man_runtime_path_with_escaped_slashes_action>`
   * runtime variable.
   * The :ref:`http_connection_manager.path_with_escaped_slashes_action_sampling<config_http_conn_man_runtime_path_with_escaped_slashes_action_enabled>` runtime
   * variable can be used to apply the action to a portion of all requests.
   * [#comment:TODO: This field is ignored when the
   * :ref:`header validation configuration <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.typed_header_validation_config>`
   * is present.]
   */
  'path_with_escaped_slashes_action': (keyof typeof _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_PathWithEscapedSlashesAction);
  /**
   * The configuration for the original IP detection extensions.
   * 
   * When configured the extensions will be called along with the request headers
   * and information about the downstream connection, such as the directly connected address.
   * Each extension will then use these parameters to decide the request's effective remote address.
   * If an extension fails to detect the original IP address and isn't configured to reject
   * the request, the HCM will try the remaining extensions until one succeeds or rejects
   * the request. If the request isn't rejected nor any extension succeeds, the HCM will
   * fallback to using the remote address.
   * 
   * .. WARNING::
   * Extensions cannot be used in conjunction with :ref:`use_remote_address
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.use_remote_address>`
   * nor :ref:`xff_num_trusted_hops
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.xff_num_trusted_hops>`.
   * 
   * [#extension-category: envoy.http.original_ip_detection]
   */
  'original_ip_detection_extensions': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
  /**
   * Determines if trailing dot of the host should be removed from host/authority header before any
   * processing of request by HTTP filters or routing.
   * This affects the upstream host header.
   * Without setting this option, incoming requests with host ``example.com.`` will not match against
   * route with :ref:`domains<envoy_v3_api_field_config.route.v3.VirtualHost.domains>` match set to ``example.com``. Defaults to ``false``.
   * When the incoming request contains a host/authority header that includes a port number,
   * setting this option will strip a trailing dot, if present, from the host section,
   * leaving the port as is (e.g. host value ``example.com.:443`` will be updated to ``example.com:443``).
   */
  'strip_trailing_host_dot': (boolean);
  /**
   * Allows for explicit transformation of the :scheme header on the request path.
   * If not set, Envoy's default :ref:`scheme  <config_http_conn_man_headers_scheme>`
   * handling applies.
   */
  'scheme_header_transformation': (_envoy_config_core_v3_SchemeHeaderTransformation__Output | null);
  /**
   * Proxy-Status HTTP response header configuration.
   * If this config is set, the Proxy-Status HTTP response header field is
   * populated. By default, it is not.
   */
  'proxy_status_config': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_ProxyStatusConfig__Output | null);
  /**
   * Configuration options for Header Validation (UHV).
   * UHV is an extensible mechanism for checking validity of HTTP requests as well as providing
   * normalization for request attributes, such as URI path.
   * If the typed_header_validation_config is present it overrides the following options:
   * ``normalize_path``, ``merge_slashes``, ``path_with_escaped_slashes_action``
   * ``http_protocol_options.allow_chunked_length``, ``common_http_protocol_options.headers_with_underscores_action``.
   * 
   * The default UHV checks the following:
   * 
   * #. HTTP/1 header map validity according to `RFC 7230 section 3.2<https://datatracker.ietf.org/doc/html/rfc7230#section-3.2>`_
   * #. Syntax of HTTP/1 request target URI and response status
   * #. HTTP/2 header map validity according to `RFC 7540 section 8.1.2<https://datatracker.ietf.org/doc/html/rfc7540#section-8.1.2`_
   * #. Syntax of HTTP/2 pseudo headers
   * #. HTTP/3 header map validity according to `RFC 9114 section 4.3 <https://www.rfc-editor.org/rfc/rfc9114.html>`_
   * #. Syntax of HTTP/3 pseudo headers
   * #. Syntax of ``Content-Length`` and ``Transfer-Encoding``
   * #. Validation of HTTP/1 requests with both ``Content-Length`` and ``Transfer-Encoding`` headers
   * #. Normalization of the URI path according to `Normalization and Comparison <https://datatracker.ietf.org/doc/html/rfc3986#section-6>`_
   * without `case normalization <https://datatracker.ietf.org/doc/html/rfc3986#section-6.2.2.1>`_
   * 
   * [#not-implemented-hide:]
   * [#extension-category: envoy.http.header_validators]
   */
  'typed_header_validation_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Append the `x-forwarded-port` header with the port value client used to connect to Envoy. It
   * will be ignored if the `x-forwarded-port` header has been set by any trusted proxy in front of Envoy.
   */
  'append_x_forwarded_port': (boolean);
  /**
   * The configuration for the early header mutation extensions.
   * 
   * When configured the extensions will be called before any routing, tracing, or any filter processing.
   * Each extension will be applied in the order they are configured.
   * If the same header is mutated by multiple extensions, then the last extension will win.
   * 
   * [#extension-category: envoy.http.early_header_mutation]
   */
  'early_header_mutation_extensions': (_envoy_config_core_v3_TypedExtensionConfig__Output)[];
  /**
   * Whether the HCM will add ProxyProtocolFilterState to the Connection lifetime filter state. Defaults to `true`.
   * This should be set to `false` in cases where Envoy's view of the downstream address may not correspond to the
   * actual client address, for example, if there's another proxy in front of the Envoy.
   */
  'add_proxy_protocol_connection_state': (_google_protobuf_BoolValue__Output | null);
  /**
   * .. attention::
   * This field is deprecated in favor of
   * :ref:`access_log_flush_interval
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.access_log_flush_interval>`.
   * Note that if both this field and :ref:`access_log_flush_interval
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.access_log_flush_interval>`
   * are specified, the former (deprecated field) is ignored.
   */
  'access_log_flush_interval': (_google_protobuf_Duration__Output | null);
  /**
   * .. attention::
   * This field is deprecated in favor of
   * :ref:`flush_access_log_on_new_request
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.flush_access_log_on_new_request>`.
   * Note that if both this field and :ref:`flush_access_log_on_new_request
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.HcmAccessLogOptions.flush_access_log_on_new_request>`
   * are specified, the former (deprecated field) is ignored.
   */
  'flush_access_log_on_new_request': (boolean);
  /**
   * Additional access log options for HTTP connection manager.
   */
  'access_log_options': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager_HcmAccessLogOptions__Output | null);
  'route_specifier': "rds"|"route_config"|"scoped_routes";
  'strip_port_mode': "strip_any_host_port";
}
