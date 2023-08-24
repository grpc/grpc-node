// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { RequestMethod as _envoy_config_core_v3_RequestMethod } from '../../../../envoy/config/core/v3/RequestMethod';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Long } from '@grpc/proto-loader';

/**
 * [#next-free-field: 16]
 */
export interface HTTPRequestProperties {
  /**
   * The request method (RFC 7231/2616).
   */
  'request_method'?: (_envoy_config_core_v3_RequestMethod | keyof typeof _envoy_config_core_v3_RequestMethod);
  /**
   * The scheme portion of the incoming request URI.
   */
  'scheme'?: (string);
  /**
   * HTTP/2 ``:authority`` or HTTP/1.1 ``Host`` header value.
   */
  'authority'?: (string);
  /**
   * The port of the incoming request URI
   * (unused currently, as port is composed onto authority).
   */
  'port'?: (_google_protobuf_UInt32Value | null);
  /**
   * The path portion from the incoming request URI.
   */
  'path'?: (string);
  /**
   * Value of the ``User-Agent`` request header.
   */
  'user_agent'?: (string);
  /**
   * Value of the ``Referer`` request header.
   */
  'referer'?: (string);
  /**
   * Value of the ``X-Forwarded-For`` request header.
   */
  'forwarded_for'?: (string);
  /**
   * Value of the ``X-Request-Id`` request header
   * 
   * This header is used by Envoy to uniquely identify a request.
   * It will be generated for all external requests and internal requests that
   * do not already have a request ID.
   */
  'request_id'?: (string);
  /**
   * Value of the ``X-Envoy-Original-Path`` request header.
   */
  'original_path'?: (string);
  /**
   * Size of the HTTP request headers in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include overhead from framing or encoding at other networking layers.
   */
  'request_headers_bytes'?: (number | string | Long);
  /**
   * Size of the HTTP request body in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include overhead from framing or encoding at other networking layers.
   */
  'request_body_bytes'?: (number | string | Long);
  /**
   * Map of additional headers that have been configured to be logged.
   */
  'request_headers'?: ({[key: string]: string});
  /**
   * Number of header bytes sent to the upstream by the http stream, including protocol overhead.
   * 
   * This value accumulates during upstream retries.
   */
  'upstream_header_bytes_sent'?: (number | string | Long);
  /**
   * Number of header bytes received from the downstream by the http stream, including protocol overhead.
   */
  'downstream_header_bytes_received'?: (number | string | Long);
}

/**
 * [#next-free-field: 16]
 */
export interface HTTPRequestProperties__Output {
  /**
   * The request method (RFC 7231/2616).
   */
  'request_method': (keyof typeof _envoy_config_core_v3_RequestMethod);
  /**
   * The scheme portion of the incoming request URI.
   */
  'scheme': (string);
  /**
   * HTTP/2 ``:authority`` or HTTP/1.1 ``Host`` header value.
   */
  'authority': (string);
  /**
   * The port of the incoming request URI
   * (unused currently, as port is composed onto authority).
   */
  'port': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The path portion from the incoming request URI.
   */
  'path': (string);
  /**
   * Value of the ``User-Agent`` request header.
   */
  'user_agent': (string);
  /**
   * Value of the ``Referer`` request header.
   */
  'referer': (string);
  /**
   * Value of the ``X-Forwarded-For`` request header.
   */
  'forwarded_for': (string);
  /**
   * Value of the ``X-Request-Id`` request header
   * 
   * This header is used by Envoy to uniquely identify a request.
   * It will be generated for all external requests and internal requests that
   * do not already have a request ID.
   */
  'request_id': (string);
  /**
   * Value of the ``X-Envoy-Original-Path`` request header.
   */
  'original_path': (string);
  /**
   * Size of the HTTP request headers in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include overhead from framing or encoding at other networking layers.
   */
  'request_headers_bytes': (string);
  /**
   * Size of the HTTP request body in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include overhead from framing or encoding at other networking layers.
   */
  'request_body_bytes': (string);
  /**
   * Map of additional headers that have been configured to be logged.
   */
  'request_headers': ({[key: string]: string});
  /**
   * Number of header bytes sent to the upstream by the http stream, including protocol overhead.
   * 
   * This value accumulates during upstream retries.
   */
  'upstream_header_bytes_sent': (string);
  /**
   * Number of header bytes received from the downstream by the http stream, including protocol overhead.
   */
  'downstream_header_bytes_received': (string);
}
