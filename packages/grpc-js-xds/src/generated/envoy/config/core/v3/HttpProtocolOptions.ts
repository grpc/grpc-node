// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

/**
 * Action to take when Envoy receives client request with header names containing underscore
 * characters.
 * Underscore character is allowed in header names by the RFC-7230 and this behavior is implemented
 * as a security measure due to systems that treat '_' and '-' as interchangeable. Envoy by default allows client request headers with underscore
 * characters.
 */
export enum _envoy_config_core_v3_HttpProtocolOptions_HeadersWithUnderscoresAction {
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
   * Drop the client header with name containing underscores. The header is dropped before the filter chain is
   * invoked and as such filters will not see dropped headers. The
   * "httpN.dropped_headers_with_underscores" is incremented for each dropped header.
   */
  DROP_HEADER = 2,
}

/**
 * [#next-free-field: 7]
 */
export interface HttpProtocolOptions {
  /**
   * The idle timeout for connections. The idle timeout is defined as the
   * period in which there are no active requests. When the
   * idle timeout is reached the connection will be closed. If the connection is an HTTP/2
   * downstream connection a drain sequence will occur prior to closing the connection, see
   * :ref:`drain_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.drain_timeout>`.
   * Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive.
   * If not specified, this defaults to 1 hour. To disable idle timeouts explicitly set this to 0.
   * 
   * .. warning::
   * Disabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP
   * FIN packets, etc.
   * 
   * If the :ref:`overload action <config_overload_manager_overload_actions>` "envoy.overload_actions.reduce_timeouts"
   * is configured, this timeout is scaled for downstream connections according to the value for
   * :ref:`HTTP_DOWNSTREAM_CONNECTION_IDLE <envoy_v3_api_enum_value_config.overload.v3.ScaleTimersOverloadActionConfig.TimerType.HTTP_DOWNSTREAM_CONNECTION_IDLE>`.
   */
  'idle_timeout'?: (_google_protobuf_Duration | null);
  /**
   * The maximum number of headers. If unconfigured, the default
   * maximum number of request headers allowed is 100. Requests that exceed this limit will receive
   * a 431 response for HTTP/1.x and cause a stream reset for HTTP/2.
   */
  'max_headers_count'?: (_google_protobuf_UInt32Value | null);
  /**
   * The maximum duration of a connection. The duration is defined as a period since a connection
   * was established. If not set, there is no max duration. When max_connection_duration is reached
   * and if there are no active streams, the connection will be closed. If the connection is a
   * downstream connection and there are any active streams, the drain sequence will kick-in,
   * and the connection will be force-closed after the drain period. See :ref:`drain_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.drain_timeout>`.
   */
  'max_connection_duration'?: (_google_protobuf_Duration | null);
  /**
   * Total duration to keep alive an HTTP request/response stream. If the time limit is reached the stream will be
   * reset independent of any other timeouts. If not specified, this value is not set.
   */
  'max_stream_duration'?: (_google_protobuf_Duration | null);
  /**
   * Action to take when a client request with a header name containing underscore characters is received.
   * If this setting is not specified, the value defaults to ALLOW.
   * Note: upstream responses are not affected by this setting.
   * Note: this only affects client headers. It does not affect headers added
   * by Envoy filters and does not have any impact if added to cluster config.
   */
  'headers_with_underscores_action'?: (_envoy_config_core_v3_HttpProtocolOptions_HeadersWithUnderscoresAction | keyof typeof _envoy_config_core_v3_HttpProtocolOptions_HeadersWithUnderscoresAction);
  /**
   * Optional maximum requests for both upstream and downstream connections.
   * If not specified, there is no limit.
   * Setting this parameter to 1 will effectively disable keep alive.
   * For HTTP/2 and HTTP/3, due to concurrent stream processing, the limit is approximate.
   */
  'max_requests_per_connection'?: (_google_protobuf_UInt32Value | null);
}

/**
 * [#next-free-field: 7]
 */
export interface HttpProtocolOptions__Output {
  /**
   * The idle timeout for connections. The idle timeout is defined as the
   * period in which there are no active requests. When the
   * idle timeout is reached the connection will be closed. If the connection is an HTTP/2
   * downstream connection a drain sequence will occur prior to closing the connection, see
   * :ref:`drain_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.drain_timeout>`.
   * Note that request based timeouts mean that HTTP/2 PINGs will not keep the connection alive.
   * If not specified, this defaults to 1 hour. To disable idle timeouts explicitly set this to 0.
   * 
   * .. warning::
   * Disabling this timeout has a highly likelihood of yielding connection leaks due to lost TCP
   * FIN packets, etc.
   * 
   * If the :ref:`overload action <config_overload_manager_overload_actions>` "envoy.overload_actions.reduce_timeouts"
   * is configured, this timeout is scaled for downstream connections according to the value for
   * :ref:`HTTP_DOWNSTREAM_CONNECTION_IDLE <envoy_v3_api_enum_value_config.overload.v3.ScaleTimersOverloadActionConfig.TimerType.HTTP_DOWNSTREAM_CONNECTION_IDLE>`.
   */
  'idle_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * The maximum number of headers. If unconfigured, the default
   * maximum number of request headers allowed is 100. Requests that exceed this limit will receive
   * a 431 response for HTTP/1.x and cause a stream reset for HTTP/2.
   */
  'max_headers_count': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The maximum duration of a connection. The duration is defined as a period since a connection
   * was established. If not set, there is no max duration. When max_connection_duration is reached
   * and if there are no active streams, the connection will be closed. If the connection is a
   * downstream connection and there are any active streams, the drain sequence will kick-in,
   * and the connection will be force-closed after the drain period. See :ref:`drain_timeout
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.drain_timeout>`.
   */
  'max_connection_duration': (_google_protobuf_Duration__Output | null);
  /**
   * Total duration to keep alive an HTTP request/response stream. If the time limit is reached the stream will be
   * reset independent of any other timeouts. If not specified, this value is not set.
   */
  'max_stream_duration': (_google_protobuf_Duration__Output | null);
  /**
   * Action to take when a client request with a header name containing underscore characters is received.
   * If this setting is not specified, the value defaults to ALLOW.
   * Note: upstream responses are not affected by this setting.
   * Note: this only affects client headers. It does not affect headers added
   * by Envoy filters and does not have any impact if added to cluster config.
   */
  'headers_with_underscores_action': (keyof typeof _envoy_config_core_v3_HttpProtocolOptions_HeadersWithUnderscoresAction);
  /**
   * Optional maximum requests for both upstream and downstream connections.
   * If not specified, there is no limit.
   * Setting this parameter to 1 will effectively disable keep alive.
   * For HTTP/2 and HTTP/3, due to concurrent stream processing, the limit is approximate.
   */
  'max_requests_per_connection': (_google_protobuf_UInt32Value__Output | null);
}
