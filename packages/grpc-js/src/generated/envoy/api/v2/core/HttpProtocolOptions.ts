// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

/**
 * Action to take when Envoy receives client request with header names containing underscore
 * characters.
 * Underscore character is allowed in header names by the RFC-7230 and this behavior is implemented
 * as a security measure due to systems that treat '_' and '-' as interchangeable. Envoy by default allows client request headers with underscore
 * characters.
 */
export enum _envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction {
  /**
   * Allow headers with underscores. This is the default behavior.
   */
  ALLOW = 0,
  /**
   * Reject client request. HTTP/1 requests are rejected with the 400 status. HTTP/2 requests
   * end with the stream reset. The "httpN.requests_rejected_with_underscores_in_headers" counter
   * is incremented for each rejected request.
   */
  REJECT_REQUEST = 1,
  /**
   * Drop the header with name containing underscores. The header is dropped before the filter chain is
   * invoked and as such filters will not see dropped headers. The
   * "httpN.dropped_headers_with_underscores" is incremented for each dropped header.
   */
  DROP_HEADER = 2,
}

/**
 * [#next-free-field: 6]
 */
export interface HttpProtocolOptions {
  /**
   * The idle timeout for connections. The idle timeout is defined as the
   * period in which there are no active requests. When the
   * idle timeout is reached the connection will be closed. If the connection is an HTTP/2
   * downstream connection a drain sequence will occur prior to closing the connection, see
   * :ref:`drain_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.drain_timeout>`.
   * Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive.
   * If not specified, this defaults to 1 hour. To disable idle timeouts explicitly set this to 0.
   * 
   * .. warning::
   * Disabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP
   * FIN packets, etc.
   */
  'idle_timeout'?: (_google_protobuf_Duration);
  /**
   * The maximum number of headers. If unconfigured, the default
   * maximum number of request headers allowed is 100. Requests that exceed this limit will receive
   * a 431 response for HTTP/1.x and cause a stream reset for HTTP/2.
   */
  'max_headers_count'?: (_google_protobuf_UInt32Value);
  /**
   * The maximum duration of a connection. The duration is defined as a period since a connection
   * was established. If not set, there is no max duration. When max_connection_duration is reached
   * the connection will be closed. Drain sequence will occur prior to closing the connection if
   * if's applicable. See :ref:`drain_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.drain_timeout>`.
   * Note: not implemented for upstream connections.
   */
  'max_connection_duration'?: (_google_protobuf_Duration);
  /**
   * Total duration to keep alive an HTTP request/response stream. If the time limit is reached the stream will be
   * reset independent of any other timeouts. If not specified, this value is not set.
   */
  'max_stream_duration'?: (_google_protobuf_Duration);
  /**
   * Action to take when a client request with a header name containing underscore characters is received.
   * If this setting is not specified, the value defaults to ALLOW.
   * Note: upstream responses are not affected by this setting.
   */
  'headers_with_underscores_action'?: (_envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction | keyof typeof _envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction);
}

/**
 * [#next-free-field: 6]
 */
export interface HttpProtocolOptions__Output {
  /**
   * The idle timeout for connections. The idle timeout is defined as the
   * period in which there are no active requests. When the
   * idle timeout is reached the connection will be closed. If the connection is an HTTP/2
   * downstream connection a drain sequence will occur prior to closing the connection, see
   * :ref:`drain_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.drain_timeout>`.
   * Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive.
   * If not specified, this defaults to 1 hour. To disable idle timeouts explicitly set this to 0.
   * 
   * .. warning::
   * Disabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP
   * FIN packets, etc.
   */
  'idle_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * The maximum number of headers. If unconfigured, the default
   * maximum number of request headers allowed is 100. Requests that exceed this limit will receive
   * a 431 response for HTTP/1.x and cause a stream reset for HTTP/2.
   */
  'max_headers_count'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The maximum duration of a connection. The duration is defined as a period since a connection
   * was established. If not set, there is no max duration. When max_connection_duration is reached
   * the connection will be closed. Drain sequence will occur prior to closing the connection if
   * if's applicable. See :ref:`drain_timeout
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.drain_timeout>`.
   * Note: not implemented for upstream connections.
   */
  'max_connection_duration'?: (_google_protobuf_Duration__Output);
  /**
   * Total duration to keep alive an HTTP request/response stream. If the time limit is reached the stream will be
   * reset independent of any other timeouts. If not specified, this value is not set.
   */
  'max_stream_duration'?: (_google_protobuf_Duration__Output);
  /**
   * Action to take when a client request with a header name containing underscore characters is received.
   * If this setting is not specified, the value defaults to ALLOW.
   * Note: upstream responses are not affected by this setting.
   */
  'headers_with_underscores_action': (keyof typeof _envoy_api_v2_core_HttpProtocolOptions_HeadersWithUnderscoresAction);
}
