// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { Long } from '@grpc/proto-loader';

/**
 * [#next-free-field: 9]
 */
export interface HTTPResponseProperties {
  /**
   * The HTTP response code returned by Envoy.
   */
  'response_code'?: (_google_protobuf_UInt32Value | null);
  /**
   * Size of the HTTP response headers in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include protocol overhead or overhead from framing or encoding at other networking layers.
   */
  'response_headers_bytes'?: (number | string | Long);
  /**
   * Size of the HTTP response body in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include overhead from framing or encoding at other networking layers.
   */
  'response_body_bytes'?: (number | string | Long);
  /**
   * Map of additional headers configured to be logged.
   */
  'response_headers'?: ({[key: string]: string});
  /**
   * Map of trailers configured to be logged.
   */
  'response_trailers'?: ({[key: string]: string});
  /**
   * The HTTP response code details.
   */
  'response_code_details'?: (string);
  /**
   * Number of header bytes received from the upstream by the http stream, including protocol overhead.
   */
  'upstream_header_bytes_received'?: (number | string | Long);
  /**
   * Number of header bytes sent to the downstream by the http stream, including protocol overhead.
   */
  'downstream_header_bytes_sent'?: (number | string | Long);
}

/**
 * [#next-free-field: 9]
 */
export interface HTTPResponseProperties__Output {
  /**
   * The HTTP response code returned by Envoy.
   */
  'response_code': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Size of the HTTP response headers in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include protocol overhead or overhead from framing or encoding at other networking layers.
   */
  'response_headers_bytes': (string);
  /**
   * Size of the HTTP response body in bytes.
   * 
   * This value is captured from the OSI layer 7 perspective, i.e. it does not
   * include overhead from framing or encoding at other networking layers.
   */
  'response_body_bytes': (string);
  /**
   * Map of additional headers configured to be logged.
   */
  'response_headers': ({[key: string]: string});
  /**
   * Map of trailers configured to be logged.
   */
  'response_trailers': ({[key: string]: string});
  /**
   * The HTTP response code details.
   */
  'response_code_details': (string);
  /**
   * Number of header bytes received from the upstream by the http stream, including protocol overhead.
   */
  'upstream_header_bytes_received': (string);
  /**
   * Number of header bytes sent to the downstream by the http stream, including protocol overhead.
   */
  'downstream_header_bytes_sent': (string);
}
