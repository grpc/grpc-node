// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * [#next-free-field: 9]
 */
export interface _envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat {
  /**
   * Formats the header by proper casing words: the first character and any character following
   * a special character will be capitalized if it's an alpha character. For example,
   * "content-type" becomes "Content-Type", and "foo$b#$are" becomes "Foo$B#$Are".
   * Note that while this results in most headers following conventional casing, certain headers
   * are not covered. For example, the "TE" header will be formatted as "Te".
   */
  'proper_case_words'?: (_envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords | null);
  /**
   * Configuration for stateful formatter extensions that allow using received headers to
   * affect the output of encoding headers. E.g., preserving case during proxying.
   * [#extension-category: envoy.http.stateful_header_formatters]
   */
  'stateful_formatter'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  'header_format'?: "proper_case_words"|"stateful_formatter";
}

/**
 * [#next-free-field: 9]
 */
export interface _envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat__Output {
  /**
   * Formats the header by proper casing words: the first character and any character following
   * a special character will be capitalized if it's an alpha character. For example,
   * "content-type" becomes "Content-Type", and "foo$b#$are" becomes "Foo$B#$Are".
   * Note that while this results in most headers following conventional casing, certain headers
   * are not covered. For example, the "TE" header will be formatted as "Te".
   */
  'proper_case_words'?: (_envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords__Output | null);
  /**
   * Configuration for stateful formatter extensions that allow using received headers to
   * affect the output of encoding headers. E.g., preserving case during proxying.
   * [#extension-category: envoy.http.stateful_header_formatters]
   */
  'stateful_formatter'?: (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  'header_format': "proper_case_words"|"stateful_formatter";
}

export interface _envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords {
}

export interface _envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords__Output {
}

/**
 * [#next-free-field: 8]
 */
export interface Http1ProtocolOptions {
  /**
   * Handle HTTP requests with absolute URLs in the requests. These requests
   * are generally sent by clients to forward/explicit proxies. This allows clients to configure
   * envoy as their HTTP proxy. In Unix, for example, this is typically done by setting the
   * *http_proxy* environment variable.
   */
  'allow_absolute_url'?: (_google_protobuf_BoolValue | null);
  /**
   * Handle incoming HTTP/1.0 and HTTP 0.9 requests.
   * This is off by default, and not fully standards compliant. There is support for pre-HTTP/1.1
   * style connect logic, dechunking, and handling lack of client host iff
   * *default_host_for_http_10* is configured.
   */
  'accept_http_10'?: (boolean);
  /**
   * A default host for HTTP/1.0 requests. This is highly suggested if *accept_http_10* is true as
   * Envoy does not otherwise support HTTP/1.0 without a Host header.
   * This is a no-op if *accept_http_10* is not true.
   */
  'default_host_for_http_10'?: (string);
  /**
   * Describes how the keys for response headers should be formatted. By default, all header keys
   * are lower cased.
   */
  'header_key_format'?: (_envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat | null);
  /**
   * Enables trailers for HTTP/1. By default the HTTP/1 codec drops proxied trailers.
   * 
   * .. attention::
   * 
   * Note that this only happens when Envoy is chunk encoding which occurs when:
   * - The request is HTTP/1.1.
   * - Is neither a HEAD only request nor a HTTP Upgrade.
   * - Not a response to a HEAD request.
   * - The content length header is not present.
   */
  'enable_trailers'?: (boolean);
  /**
   * Allows Envoy to process requests/responses with both `Content-Length` and `Transfer-Encoding`
   * headers set. By default such messages are rejected, but if option is enabled - Envoy will
   * remove Content-Length header and process message.
   * See `RFC7230, sec. 3.3.3 <https://tools.ietf.org/html/rfc7230#section-3.3.3>` for details.
   * 
   * .. attention::
   * Enabling this option might lead to request smuggling vulnerability, especially if traffic
   * is proxied via multiple layers of proxies.
   */
  'allow_chunked_length'?: (boolean);
  /**
   * Allows invalid HTTP messaging. When this option is false, then Envoy will terminate
   * HTTP/1.1 connections upon receiving an invalid HTTP message. However,
   * when this option is true, then Envoy will leave the HTTP/1.1 connection
   * open where possible.
   * If set, this overrides any HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`.
   */
  'override_stream_error_on_invalid_http_message'?: (_google_protobuf_BoolValue | null);
}

/**
 * [#next-free-field: 8]
 */
export interface Http1ProtocolOptions__Output {
  /**
   * Handle HTTP requests with absolute URLs in the requests. These requests
   * are generally sent by clients to forward/explicit proxies. This allows clients to configure
   * envoy as their HTTP proxy. In Unix, for example, this is typically done by setting the
   * *http_proxy* environment variable.
   */
  'allow_absolute_url': (_google_protobuf_BoolValue__Output | null);
  /**
   * Handle incoming HTTP/1.0 and HTTP 0.9 requests.
   * This is off by default, and not fully standards compliant. There is support for pre-HTTP/1.1
   * style connect logic, dechunking, and handling lack of client host iff
   * *default_host_for_http_10* is configured.
   */
  'accept_http_10': (boolean);
  /**
   * A default host for HTTP/1.0 requests. This is highly suggested if *accept_http_10* is true as
   * Envoy does not otherwise support HTTP/1.0 without a Host header.
   * This is a no-op if *accept_http_10* is not true.
   */
  'default_host_for_http_10': (string);
  /**
   * Describes how the keys for response headers should be formatted. By default, all header keys
   * are lower cased.
   */
  'header_key_format': (_envoy_config_core_v3_Http1ProtocolOptions_HeaderKeyFormat__Output | null);
  /**
   * Enables trailers for HTTP/1. By default the HTTP/1 codec drops proxied trailers.
   * 
   * .. attention::
   * 
   * Note that this only happens when Envoy is chunk encoding which occurs when:
   * - The request is HTTP/1.1.
   * - Is neither a HEAD only request nor a HTTP Upgrade.
   * - Not a response to a HEAD request.
   * - The content length header is not present.
   */
  'enable_trailers': (boolean);
  /**
   * Allows Envoy to process requests/responses with both `Content-Length` and `Transfer-Encoding`
   * headers set. By default such messages are rejected, but if option is enabled - Envoy will
   * remove Content-Length header and process message.
   * See `RFC7230, sec. 3.3.3 <https://tools.ietf.org/html/rfc7230#section-3.3.3>` for details.
   * 
   * .. attention::
   * Enabling this option might lead to request smuggling vulnerability, especially if traffic
   * is proxied via multiple layers of proxies.
   */
  'allow_chunked_length': (boolean);
  /**
   * Allows invalid HTTP messaging. When this option is false, then Envoy will terminate
   * HTTP/1.1 connections upon receiving an invalid HTTP message. However,
   * when this option is true, then Envoy will leave the HTTP/1.1 connection
   * open where possible.
   * If set, this overrides any HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`.
   */
  'override_stream_error_on_invalid_http_message': (_google_protobuf_BoolValue__Output | null);
}
