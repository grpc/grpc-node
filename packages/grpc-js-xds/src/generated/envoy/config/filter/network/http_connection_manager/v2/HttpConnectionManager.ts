// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

import { Rds as _envoy_config_filter_network_http_connection_manager_v2_Rds, Rds__Output as _envoy_config_filter_network_http_connection_manager_v2_Rds__Output } from '../../../../../../envoy/config/filter/network/http_connection_manager/v2/Rds';
import { RouteConfiguration as _envoy_api_v2_RouteConfiguration, RouteConfiguration__Output as _envoy_api_v2_RouteConfiguration__Output } from '../../../../../../envoy/api/v2/RouteConfiguration';
import { HttpFilter as _envoy_config_filter_network_http_connection_manager_v2_HttpFilter, HttpFilter__Output as _envoy_config_filter_network_http_connection_manager_v2_HttpFilter__Output } from '../../../../../../envoy/config/filter/network/http_connection_manager/v2/HttpFilter';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../../../google/protobuf/BoolValue';
import { Http1ProtocolOptions as _envoy_api_v2_core_Http1ProtocolOptions, Http1ProtocolOptions__Output as _envoy_api_v2_core_Http1ProtocolOptions__Output } from '../../../../../../envoy/api/v2/core/Http1ProtocolOptions';
import { Http2ProtocolOptions as _envoy_api_v2_core_Http2ProtocolOptions, Http2ProtocolOptions__Output as _envoy_api_v2_core_Http2ProtocolOptions__Output } from '../../../../../../envoy/api/v2/core/Http2ProtocolOptions';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../../../google/protobuf/Duration';
import { AccessLog as _envoy_config_filter_accesslog_v2_AccessLog, AccessLog__Output as _envoy_config_filter_accesslog_v2_AccessLog__Output } from '../../../../../../envoy/config/filter/accesslog/v2/AccessLog';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../../google/protobuf/UInt32Value';
import { ScopedRoutes as _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes, ScopedRoutes__Output as _envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes__Output } from '../../../../../../envoy/config/filter/network/http_connection_manager/v2/ScopedRoutes';
import { HttpProtocolOptions as _envoy_api_v2_core_HttpProtocolOptions, HttpProtocolOptions__Output as _envoy_api_v2_core_HttpProtocolOptions__Output } from '../../../../../../envoy/api/v2/core/HttpProtocolOptions';
import { RequestIDExtension as _envoy_config_filter_network_http_connection_manager_v2_RequestIDExtension, RequestIDExtension__Output as _envoy_config_filter_network_http_connection_manager_v2_RequestIDExtension__Output } from '../../../../../../envoy/config/filter/network/http_connection_manager/v2/RequestIDExtension';
import { Percent as _envoy_type_Percent, Percent__Output as _envoy_type_Percent__Output } from '../../../../../../envoy/type/Percent';
import { CustomTag as _envoy_type_tracing_v2_CustomTag, CustomTag__Output as _envoy_type_tracing_v2_CustomTag__Output } from '../../../../../../envoy/type/tracing/v2/CustomTag';
import { _envoy_config_trace_v2_Tracing_Http, _envoy_config_trace_v2_Tracing_Http__Output } from '../../../../../../envoy/config/trace/v2/Tracing';

// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

export enum _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_CodecType {
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

// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

/**
 * How to handle the :ref:`config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP
 * header.
 */
export enum _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ForwardClientCertDetails {
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

export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_InternalAddressConfig {
  /**
   * Whether unix socket addresses should be considered internal.
   */
  'unix_sockets'?: (boolean);
}

export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_InternalAddressConfig__Output {
  /**
   * Whether unix socket addresses should be considered internal.
   */
  'unix_sockets': (boolean);
}

// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

export enum _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing_OperationName {
  /**
   * The HTTP listener is used for ingress/incoming requests.
   */
  INGRESS = 0,
  /**
   * The HTTP listener is used for egress/outgoing requests.
   */
  EGRESS = 1,
}

// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

export enum _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ServerHeaderTransformation {
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
export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_SetCurrentClientCertDetails {
  /**
   * Whether to forward the subject of the client cert. Defaults to false.
   */
  'subject'?: (_google_protobuf_BoolValue);
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
export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_SetCurrentClientCertDetails__Output {
  /**
   * Whether to forward the subject of the client cert. Defaults to false.
   */
  'subject'?: (_google_protobuf_BoolValue__Output);
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
export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing {
  /**
   * The span name will be derived from this field. If
   * :ref:`traffic_direction <envoy_api_field_Listener.traffic_direction>` is
   * specified on the parent listener, then it is used instead of this field.
   * 
   * .. attention::
   * This field has been deprecated in favor of `traffic_direction`.
   */
  'operation_name'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing_OperationName | keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing_OperationName);
  /**
   * A list of header names used to create tags for the active span. The header name is used to
   * populate the tag name, and the header value is used to populate the tag value. The tag is
   * created if the specified header name is present in the request's headers.
   * 
   * .. attention::
   * This field has been deprecated in favor of :ref:`custom_tags
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.tracing.custom_tags>`.
   */
  'request_headers_for_tags'?: (string)[];
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be force
   * traced if the :ref:`x-client-trace-id <config_http_conn_man_headers_x-client-trace-id>`
   * header is set. This field is a direct analog for the runtime variable
   * 'tracing.client_sampling' in the :ref:`HTTP Connection Manager
   * <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'client_sampling'?: (_envoy_type_Percent);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be randomly
   * selected for trace generation, if not requested by the client or not forced. This field is
   * a direct analog for the runtime variable 'tracing.random_sampling' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'random_sampling'?: (_envoy_type_Percent);
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
  'overall_sampling'?: (_envoy_type_Percent);
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
  'max_path_tag_length'?: (_google_protobuf_UInt32Value);
  /**
   * A list of custom tags with unique tag name to create tags for the active span.
   */
  'custom_tags'?: (_envoy_type_tracing_v2_CustomTag)[];
  /**
   * Configuration for an external tracing provider.
   * If not specified, no tracing will be performed.
   * 
   * .. attention::
   * Please be aware that *envoy.tracers.opencensus* provider can only be configured once
   * in Envoy lifetime.
   * Any attempts to reconfigure it or to use different configurations for different HCM filters
   * will be rejected.
   * Such a constraint is inherent to OpenCensus itself. It cannot be overcome without changes
   * on OpenCensus side.
   */
  'provider'?: (_envoy_config_trace_v2_Tracing_Http);
}

/**
 * [#next-free-field: 10]
 */
export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing__Output {
  /**
   * The span name will be derived from this field. If
   * :ref:`traffic_direction <envoy_api_field_Listener.traffic_direction>` is
   * specified on the parent listener, then it is used instead of this field.
   * 
   * .. attention::
   * This field has been deprecated in favor of `traffic_direction`.
   */
  'operation_name': (keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing_OperationName);
  /**
   * A list of header names used to create tags for the active span. The header name is used to
   * populate the tag name, and the header value is used to populate the tag value. The tag is
   * created if the specified header name is present in the request's headers.
   * 
   * .. attention::
   * This field has been deprecated in favor of :ref:`custom_tags
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.tracing.custom_tags>`.
   */
  'request_headers_for_tags': (string)[];
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be force
   * traced if the :ref:`x-client-trace-id <config_http_conn_man_headers_x-client-trace-id>`
   * header is set. This field is a direct analog for the runtime variable
   * 'tracing.client_sampling' in the :ref:`HTTP Connection Manager
   * <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'client_sampling'?: (_envoy_type_Percent__Output);
  /**
   * Target percentage of requests managed by this HTTP connection manager that will be randomly
   * selected for trace generation, if not requested by the client or not forced. This field is
   * a direct analog for the runtime variable 'tracing.random_sampling' in the
   * :ref:`HTTP Connection Manager <config_http_conn_man_runtime>`.
   * Default: 100%
   */
  'random_sampling'?: (_envoy_type_Percent__Output);
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
  'overall_sampling'?: (_envoy_type_Percent__Output);
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
  'max_path_tag_length'?: (_google_protobuf_UInt32Value__Output);
  /**
   * A list of custom tags with unique tag name to create tags for the active span.
   */
  'custom_tags': (_envoy_type_tracing_v2_CustomTag__Output)[];
  /**
   * Configuration for an external tracing provider.
   * If not specified, no tracing will be performed.
   * 
   * .. attention::
   * Please be aware that *envoy.tracers.opencensus* provider can only be configured once
   * in Envoy lifetime.
   * Any attempts to reconfigure it or to use different configurations for different HCM filters
   * will be rejected.
   * Such a constraint is inherent to OpenCensus itself. It cannot be overcome without changes
   * on OpenCensus side.
   */
  'provider'?: (_envoy_config_trace_v2_Tracing_Http__Output);
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
export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_UpgradeConfig {
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
  'filters'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpFilter)[];
  /**
   * Determines if upgrades are enabled or disabled by default. Defaults to true.
   * This can be overridden on a per-route basis with :ref:`cluster
   * <envoy_api_field_route.RouteAction.upgrade_configs>` as documented in the
   * :ref:`upgrade documentation <arch_overview_upgrades>`.
   */
  'enabled'?: (_google_protobuf_BoolValue);
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
export interface _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_UpgradeConfig__Output {
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
  'filters': (_envoy_config_filter_network_http_connection_manager_v2_HttpFilter__Output)[];
  /**
   * Determines if upgrades are enabled or disabled by default. Defaults to true.
   * This can be overridden on a per-route basis with :ref:`cluster
   * <envoy_api_field_route.RouteAction.upgrade_configs>` as documented in the
   * :ref:`upgrade documentation <arch_overview_upgrades>`.
   */
  'enabled'?: (_google_protobuf_BoolValue__Output);
}

/**
 * [#next-free-field: 37]
 */
export interface HttpConnectionManager {
  /**
   * Supplies the type of codec that the connection manager should use.
   */
  'codec_type'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_CodecType | keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_CodecType);
  /**
   * The human readable prefix to use when emitting statistics for the
   * connection manager. See the :ref:`statistics documentation <config_http_conn_man_stats>` for
   * more information.
   */
  'stat_prefix'?: (string);
  /**
   * The connection manager’s route table will be dynamically loaded via the RDS API.
   */
  'rds'?: (_envoy_config_filter_network_http_connection_manager_v2_Rds);
  /**
   * The route table for the connection manager is static and is specified in this property.
   */
  'route_config'?: (_envoy_api_v2_RouteConfiguration);
  /**
   * A list of individual HTTP filters that make up the filter chain for
   * requests made to the connection manager. :ref:`Order matters <arch_overview_http_filters_ordering>`
   * as the filters are processed sequentially as request events happen.
   */
  'http_filters'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpFilter)[];
  /**
   * Whether the connection manager manipulates the :ref:`config_http_conn_man_headers_user-agent`
   * and :ref:`config_http_conn_man_headers_downstream-service-cluster` headers. See the linked
   * documentation for more information. Defaults to false.
   */
  'add_user_agent'?: (_google_protobuf_BoolValue);
  /**
   * Presence of the object defines whether the connection manager
   * emits :ref:`tracing <arch_overview_tracing>` data to the :ref:`configured tracing provider
   * <envoy_api_msg_config.trace.v2.Tracing>`.
   */
  'tracing'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing);
  /**
   * Additional HTTP/1 settings that are passed to the HTTP/1 codec.
   */
  'http_protocol_options'?: (_envoy_api_v2_core_Http1ProtocolOptions);
  /**
   * Additional HTTP/2 settings that are passed directly to the HTTP/2 codec.
   */
  'http2_protocol_options'?: (_envoy_api_v2_core_Http2ProtocolOptions);
  /**
   * An optional override that the connection manager will write to the server
   * header in responses. If not set, the default is *envoy*.
   */
  'server_name'?: (string);
  /**
   * The idle timeout for connections managed by the connection manager. The
   * idle timeout is defined as the period in which there are no active
   * requests. If not set, there is no idle timeout. When the idle timeout is
   * reached the connection will be closed. If the connection is an HTTP/2
   * connection a drain sequence will occur prior to closing the connection.
   * This field is deprecated. Use :ref:`idle_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.common_http_protocol_options>`
   * instead.
   */
  'idle_timeout'?: (_google_protobuf_Duration);
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
  'drain_timeout'?: (_google_protobuf_Duration);
  /**
   * Configuration for :ref:`HTTP access logs <arch_overview_access_logs>`
   * emitted by the connection manager.
   */
  'access_log'?: (_envoy_config_filter_accesslog_v2_AccessLog)[];
  /**
   * If set to true, the connection manager will use the real remote address
   * of the client connection when determining internal versus external origin and manipulating
   * various headers. If set to false or absent, the connection manager will use the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header. See the documentation for
   * :ref:`config_http_conn_man_headers_x-forwarded-for`,
   * :ref:`config_http_conn_man_headers_x-envoy-internal`, and
   * :ref:`config_http_conn_man_headers_x-envoy-external-address` for more information.
   */
  'use_remote_address'?: (_google_protobuf_BoolValue);
  /**
   * Whether the connection manager will generate the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if it does not exist. This defaults to
   * true. Generating a random UUID4 is expensive so in high throughput scenarios where this feature
   * is not desired it can be disabled.
   */
  'generate_request_id'?: (_google_protobuf_BoolValue);
  /**
   * How to handle the :ref:`config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP
   * header.
   */
  'forward_client_cert_details'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ForwardClientCertDetails | keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ForwardClientCertDetails);
  /**
   * This field is valid only when :ref:`forward_client_cert_details
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.forward_client_cert_details>`
   * is APPEND_FORWARD or SANITIZE_SET and the client connection is mTLS. It specifies the fields in
   * the client certificate to be forwarded. Note that in the
   * :ref:`config_http_conn_man_headers_x-forwarded-client-cert` header, *Hash* is always set, and
   * *By* is always set when the client certificate presents the URI type Subject Alternative Name
   * value.
   */
  'set_current_client_cert_details'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_SetCurrentClientCertDetails);
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
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.use_remote_address>`
   * is true and represent_ipv4_remote_address_as_ipv4_mapped_ipv6 is true and the remote address is
   * an IPv4 address, the address will be mapped to IPv6 before it is appended to *x-forwarded-for*.
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
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.use_remote_address>`
   * will also suppress XFF addition, it has consequences for logging and other
   * Envoy uses of the remote address, so *skip_xff_append* should be used
   * when only an elision of XFF addition is intended.
   */
  'skip_xff_append'?: (boolean);
  /**
   * Via header value to append to request and response headers. If this is
   * empty, no via header will be appended.
   */
  'via'?: (string);
  'upgrade_configs'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_UpgradeConfig)[];
  /**
   * The stream idle timeout for connections managed by the connection manager.
   * If not specified, this defaults to 5 minutes. The default value was selected
   * so as not to interfere with any smaller configured timeouts that may have
   * existed in configurations prior to the introduction of this feature, while
   * introducing robustness to TCP connections that terminate without a FIN.
   * 
   * This idle timeout applies to new streams and is overridable by the
   * :ref:`route-level idle_timeout
   * <envoy_api_field_route.RouteAction.idle_timeout>`. Even on a stream in
   * which the override applies, prior to receipt of the initial request
   * headers, the :ref:`stream_idle_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.stream_idle_timeout>`
   * applies. Each time an encode/decode event for headers or data is processed
   * for the stream, the timer will be reset. If the timeout fires, the stream
   * is terminated with a 408 Request Timeout error code if no upstream response
   * header has been received, otherwise a stream reset occurs.
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
  'stream_idle_timeout'?: (_google_protobuf_Duration);
  /**
   * Configures what network addresses are considered internal for stats and header sanitation
   * purposes. If unspecified, only RFC1918 IP addresses will be considered internal.
   * See the documentation for :ref:`config_http_conn_man_headers_x-envoy-internal` for more
   * information about internal/external addresses.
   */
  'internal_address_config'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_InternalAddressConfig);
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
  'delayed_close_timeout'?: (_google_protobuf_Duration);
  /**
   * The amount of time that Envoy will wait for the entire request to be received.
   * The timer is activated when the request is initiated, and is disarmed when the last byte of the
   * request is sent upstream (i.e. all decoding filters have processed the request), OR when the
   * response is initiated. If not specified or set to 0, this timeout is disabled.
   */
  'request_timeout'?: (_google_protobuf_Duration);
  /**
   * The maximum request headers size for incoming connections.
   * If unconfigured, the default max request headers allowed is 60 KiB.
   * Requests that exceed this limit will receive a 431 response.
   * The max configurable limit is 96 KiB, based on current implementation
   * constraints.
   */
  'max_request_headers_kb'?: (_google_protobuf_UInt32Value);
  /**
   * Should paths be normalized according to RFC 3986 before any processing of
   * requests by HTTP filters or routing? This affects the upstream *:path* header
   * as well. For paths that fail this check, Envoy will respond with 400 to
   * paths that are malformed. This defaults to false currently but will default
   * true in the future. When not specified, this value may be overridden by the
   * runtime variable
   * :ref:`http_connection_manager.normalize_path<config_http_conn_man_runtime_normalize_path>`.
   * See `Normalization and Comparison <https://tools.ietf.org/html/rfc3986#section-6>`
   * for details of normalization.
   * Note that Envoy does not perform
   * `case normalization <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`
   */
  'normalize_path'?: (_google_protobuf_BoolValue);
  /**
   * A route table will be dynamically assigned to each request based on request attributes
   * (e.g., the value of a header). The "routing scopes" (i.e., route tables) and "scope keys" are
   * specified in this message.
   */
  'scoped_routes'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes);
  /**
   * Whether the connection manager will keep the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if passed for a request that is edge
   * (Edge request is the request from external clients to front Envoy) and not reset it, which
   * is the current Envoy behaviour. This defaults to false.
   */
  'preserve_external_request_id'?: (boolean);
  /**
   * Determines if adjacent slashes in the path are merged into one before any processing of
   * requests by HTTP filters or routing. This affects the upstream *:path* header as well. Without
   * setting this option, incoming requests with path `//dir///file` will not match against route
   * with `prefix` match set to `/dir`. Defaults to `false`. Note that slash merging is not part of
   * `HTTP spec <https://tools.ietf.org/html/rfc3986>` and is provided for convenience.
   */
  'merge_slashes'?: (boolean);
  /**
   * Defines the action to be applied to the Server header on the response path.
   * By default, Envoy will overwrite the header with the value specified in
   * server_name.
   */
  'server_header_transformation'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ServerHeaderTransformation | keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ServerHeaderTransformation);
  /**
   * Additional settings for HTTP requests handled by the connection manager. These will be
   * applicable to both HTTP1 and HTTP2 requests.
   */
  'common_http_protocol_options'?: (_envoy_api_v2_core_HttpProtocolOptions);
  /**
   * The configuration of the request ID extension. This includes operations such as
   * generation, validation, and associated tracing operations.
   * 
   * If not set, Envoy uses the default UUID-based behavior:
   * 
   * 1. Request ID is propagated using *x-request-id* header.
   * 
   * 2. Request ID is a universally unique identifier (UUID).
   * 
   * 3. Tracing decision (sampled, forced, etc) is set in 14th byte of the UUID.
   */
  'request_id_extension'?: (_envoy_config_filter_network_http_connection_manager_v2_RequestIDExtension);
  'route_specifier'?: "rds"|"route_config"|"scoped_routes";
}

/**
 * [#next-free-field: 37]
 */
export interface HttpConnectionManager__Output {
  /**
   * Supplies the type of codec that the connection manager should use.
   */
  'codec_type': (keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_CodecType);
  /**
   * The human readable prefix to use when emitting statistics for the
   * connection manager. See the :ref:`statistics documentation <config_http_conn_man_stats>` for
   * more information.
   */
  'stat_prefix': (string);
  /**
   * The connection manager’s route table will be dynamically loaded via the RDS API.
   */
  'rds'?: (_envoy_config_filter_network_http_connection_manager_v2_Rds__Output);
  /**
   * The route table for the connection manager is static and is specified in this property.
   */
  'route_config'?: (_envoy_api_v2_RouteConfiguration__Output);
  /**
   * A list of individual HTTP filters that make up the filter chain for
   * requests made to the connection manager. :ref:`Order matters <arch_overview_http_filters_ordering>`
   * as the filters are processed sequentially as request events happen.
   */
  'http_filters': (_envoy_config_filter_network_http_connection_manager_v2_HttpFilter__Output)[];
  /**
   * Whether the connection manager manipulates the :ref:`config_http_conn_man_headers_user-agent`
   * and :ref:`config_http_conn_man_headers_downstream-service-cluster` headers. See the linked
   * documentation for more information. Defaults to false.
   */
  'add_user_agent'?: (_google_protobuf_BoolValue__Output);
  /**
   * Presence of the object defines whether the connection manager
   * emits :ref:`tracing <arch_overview_tracing>` data to the :ref:`configured tracing provider
   * <envoy_api_msg_config.trace.v2.Tracing>`.
   */
  'tracing'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_Tracing__Output);
  /**
   * Additional HTTP/1 settings that are passed to the HTTP/1 codec.
   */
  'http_protocol_options'?: (_envoy_api_v2_core_Http1ProtocolOptions__Output);
  /**
   * Additional HTTP/2 settings that are passed directly to the HTTP/2 codec.
   */
  'http2_protocol_options'?: (_envoy_api_v2_core_Http2ProtocolOptions__Output);
  /**
   * An optional override that the connection manager will write to the server
   * header in responses. If not set, the default is *envoy*.
   */
  'server_name': (string);
  /**
   * The idle timeout for connections managed by the connection manager. The
   * idle timeout is defined as the period in which there are no active
   * requests. If not set, there is no idle timeout. When the idle timeout is
   * reached the connection will be closed. If the connection is an HTTP/2
   * connection a drain sequence will occur prior to closing the connection.
   * This field is deprecated. Use :ref:`idle_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.common_http_protocol_options>`
   * instead.
   */
  'idle_timeout'?: (_google_protobuf_Duration__Output);
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
  'drain_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Configuration for :ref:`HTTP access logs <arch_overview_access_logs>`
   * emitted by the connection manager.
   */
  'access_log': (_envoy_config_filter_accesslog_v2_AccessLog__Output)[];
  /**
   * If set to true, the connection manager will use the real remote address
   * of the client connection when determining internal versus external origin and manipulating
   * various headers. If set to false or absent, the connection manager will use the
   * :ref:`config_http_conn_man_headers_x-forwarded-for` HTTP header. See the documentation for
   * :ref:`config_http_conn_man_headers_x-forwarded-for`,
   * :ref:`config_http_conn_man_headers_x-envoy-internal`, and
   * :ref:`config_http_conn_man_headers_x-envoy-external-address` for more information.
   */
  'use_remote_address'?: (_google_protobuf_BoolValue__Output);
  /**
   * Whether the connection manager will generate the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if it does not exist. This defaults to
   * true. Generating a random UUID4 is expensive so in high throughput scenarios where this feature
   * is not desired it can be disabled.
   */
  'generate_request_id'?: (_google_protobuf_BoolValue__Output);
  /**
   * How to handle the :ref:`config_http_conn_man_headers_x-forwarded-client-cert` (XFCC) HTTP
   * header.
   */
  'forward_client_cert_details': (keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ForwardClientCertDetails);
  /**
   * This field is valid only when :ref:`forward_client_cert_details
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.forward_client_cert_details>`
   * is APPEND_FORWARD or SANITIZE_SET and the client connection is mTLS. It specifies the fields in
   * the client certificate to be forwarded. Note that in the
   * :ref:`config_http_conn_man_headers_x-forwarded-client-cert` header, *Hash* is always set, and
   * *By* is always set when the client certificate presents the URI type Subject Alternative Name
   * value.
   */
  'set_current_client_cert_details'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_SetCurrentClientCertDetails__Output);
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
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.use_remote_address>`
   * is true and represent_ipv4_remote_address_as_ipv4_mapped_ipv6 is true and the remote address is
   * an IPv4 address, the address will be mapped to IPv6 before it is appended to *x-forwarded-for*.
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
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.use_remote_address>`
   * will also suppress XFF addition, it has consequences for logging and other
   * Envoy uses of the remote address, so *skip_xff_append* should be used
   * when only an elision of XFF addition is intended.
   */
  'skip_xff_append': (boolean);
  /**
   * Via header value to append to request and response headers. If this is
   * empty, no via header will be appended.
   */
  'via': (string);
  'upgrade_configs': (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_UpgradeConfig__Output)[];
  /**
   * The stream idle timeout for connections managed by the connection manager.
   * If not specified, this defaults to 5 minutes. The default value was selected
   * so as not to interfere with any smaller configured timeouts that may have
   * existed in configurations prior to the introduction of this feature, while
   * introducing robustness to TCP connections that terminate without a FIN.
   * 
   * This idle timeout applies to new streams and is overridable by the
   * :ref:`route-level idle_timeout
   * <envoy_api_field_route.RouteAction.idle_timeout>`. Even on a stream in
   * which the override applies, prior to receipt of the initial request
   * headers, the :ref:`stream_idle_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.stream_idle_timeout>`
   * applies. Each time an encode/decode event for headers or data is processed
   * for the stream, the timer will be reset. If the timeout fires, the stream
   * is terminated with a 408 Request Timeout error code if no upstream response
   * header has been received, otherwise a stream reset occurs.
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
  'stream_idle_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Configures what network addresses are considered internal for stats and header sanitation
   * purposes. If unspecified, only RFC1918 IP addresses will be considered internal.
   * See the documentation for :ref:`config_http_conn_man_headers_x-envoy-internal` for more
   * information about internal/external addresses.
   */
  'internal_address_config'?: (_envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_InternalAddressConfig__Output);
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
  'delayed_close_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * The amount of time that Envoy will wait for the entire request to be received.
   * The timer is activated when the request is initiated, and is disarmed when the last byte of the
   * request is sent upstream (i.e. all decoding filters have processed the request), OR when the
   * response is initiated. If not specified or set to 0, this timeout is disabled.
   */
  'request_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * The maximum request headers size for incoming connections.
   * If unconfigured, the default max request headers allowed is 60 KiB.
   * Requests that exceed this limit will receive a 431 response.
   * The max configurable limit is 96 KiB, based on current implementation
   * constraints.
   */
  'max_request_headers_kb'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Should paths be normalized according to RFC 3986 before any processing of
   * requests by HTTP filters or routing? This affects the upstream *:path* header
   * as well. For paths that fail this check, Envoy will respond with 400 to
   * paths that are malformed. This defaults to false currently but will default
   * true in the future. When not specified, this value may be overridden by the
   * runtime variable
   * :ref:`http_connection_manager.normalize_path<config_http_conn_man_runtime_normalize_path>`.
   * See `Normalization and Comparison <https://tools.ietf.org/html/rfc3986#section-6>`
   * for details of normalization.
   * Note that Envoy does not perform
   * `case normalization <https://tools.ietf.org/html/rfc3986#section-6.2.2.1>`
   */
  'normalize_path'?: (_google_protobuf_BoolValue__Output);
  /**
   * A route table will be dynamically assigned to each request based on request attributes
   * (e.g., the value of a header). The "routing scopes" (i.e., route tables) and "scope keys" are
   * specified in this message.
   */
  'scoped_routes'?: (_envoy_config_filter_network_http_connection_manager_v2_ScopedRoutes__Output);
  /**
   * Whether the connection manager will keep the :ref:`x-request-id
   * <config_http_conn_man_headers_x-request-id>` header if passed for a request that is edge
   * (Edge request is the request from external clients to front Envoy) and not reset it, which
   * is the current Envoy behaviour. This defaults to false.
   */
  'preserve_external_request_id': (boolean);
  /**
   * Determines if adjacent slashes in the path are merged into one before any processing of
   * requests by HTTP filters or routing. This affects the upstream *:path* header as well. Without
   * setting this option, incoming requests with path `//dir///file` will not match against route
   * with `prefix` match set to `/dir`. Defaults to `false`. Note that slash merging is not part of
   * `HTTP spec <https://tools.ietf.org/html/rfc3986>` and is provided for convenience.
   */
  'merge_slashes': (boolean);
  /**
   * Defines the action to be applied to the Server header on the response path.
   * By default, Envoy will overwrite the header with the value specified in
   * server_name.
   */
  'server_header_transformation': (keyof typeof _envoy_config_filter_network_http_connection_manager_v2_HttpConnectionManager_ServerHeaderTransformation);
  /**
   * Additional settings for HTTP requests handled by the connection manager. These will be
   * applicable to both HTTP1 and HTTP2 requests.
   */
  'common_http_protocol_options'?: (_envoy_api_v2_core_HttpProtocolOptions__Output);
  /**
   * The configuration of the request ID extension. This includes operations such as
   * generation, validation, and associated tracing operations.
   * 
   * If not set, Envoy uses the default UUID-based behavior:
   * 
   * 1. Request ID is propagated using *x-request-id* header.
   * 
   * 2. Request ID is a universally unique identifier (UUID).
   * 
   * 3. Tracing decision (sampled, forced, etc) is set in 14th byte of the UUID.
   */
  'request_id_extension'?: (_envoy_config_filter_network_http_connection_manager_v2_RequestIDExtension__Output);
  'route_specifier': "rds"|"route_config"|"scoped_routes";
}
