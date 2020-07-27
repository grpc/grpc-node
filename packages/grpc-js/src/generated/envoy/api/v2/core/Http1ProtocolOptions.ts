// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat {
  /**
   * Formats the header by proper casing words: the first character and any character following
   * a special character will be capitalized if it's an alpha character. For example,
   * "content-type" becomes "Content-Type", and "foo$b#$are" becomes "Foo$B#$Are".
   * Note that while this results in most headers following conventional casing, certain headers
   * are not covered. For example, the "TE" header will be formatted as "Te".
   */
  'proper_case_words'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords);
  'header_format'?: "proper_case_words";
}

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat__Output {
  /**
   * Formats the header by proper casing words: the first character and any character following
   * a special character will be capitalized if it's an alpha character. For example,
   * "content-type" becomes "Content-Type", and "foo$b#$are" becomes "Foo$B#$Are".
   * Note that while this results in most headers following conventional casing, certain headers
   * are not covered. For example, the "TE" header will be formatted as "Te".
   */
  'proper_case_words'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords__Output);
  'header_format': "proper_case_words";
}

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords {
}

export interface _envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat_ProperCaseWords__Output {
}

/**
 * [#next-free-field: 6]
 */
export interface Http1ProtocolOptions {
  /**
   * Handle HTTP requests with absolute URLs in the requests. These requests
   * are generally sent by clients to forward/explicit proxies. This allows clients to configure
   * envoy as their HTTP proxy. In Unix, for example, this is typically done by setting the
   * *http_proxy* environment variable.
   */
  'allow_absolute_url'?: (_google_protobuf_BoolValue);
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
  'header_key_format'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat);
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
}

/**
 * [#next-free-field: 6]
 */
export interface Http1ProtocolOptions__Output {
  /**
   * Handle HTTP requests with absolute URLs in the requests. These requests
   * are generally sent by clients to forward/explicit proxies. This allows clients to configure
   * envoy as their HTTP proxy. In Unix, for example, this is typically done by setting the
   * *http_proxy* environment variable.
   */
  'allow_absolute_url'?: (_google_protobuf_BoolValue__Output);
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
  'header_key_format'?: (_envoy_api_v2_core_Http1ProtocolOptions_HeaderKeyFormat__Output);
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
}
