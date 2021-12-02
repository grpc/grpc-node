// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { QuicProtocolOptions as _envoy_config_core_v3_QuicProtocolOptions, QuicProtocolOptions__Output as _envoy_config_core_v3_QuicProtocolOptions__Output } from '../../../../envoy/config/core/v3/QuicProtocolOptions';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

/**
 * A message which allows using HTTP/3.
 * [#next-free-field: 6]
 */
export interface Http3ProtocolOptions {
  'quic_protocol_options'?: (_envoy_config_core_v3_QuicProtocolOptions | null);
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/3 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
   * 
   * If set, this overrides any HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`.
   */
  'override_stream_error_on_invalid_http_message'?: (_google_protobuf_BoolValue | null);
  /**
   * Allows proxying Websocket and other upgrades over HTTP/3 CONNECT using
   * the header mechanisms from the `HTTP/2 extended connect RFC
   * <https://datatracker.ietf.org/doc/html/rfc8441>`_
   * and settings `proposed for HTTP/3
   * <https://datatracker.ietf.org/doc/draft-ietf-httpbis-h3-websockets/>`_
   * Note that HTTP/3 CONNECT is not yet an RFC.
   */
  'allow_extended_connect'?: (boolean);
}

/**
 * A message which allows using HTTP/3.
 * [#next-free-field: 6]
 */
export interface Http3ProtocolOptions__Output {
  'quic_protocol_options': (_envoy_config_core_v3_QuicProtocolOptions__Output | null);
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/3 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
   * 
   * If set, this overrides any HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`.
   */
  'override_stream_error_on_invalid_http_message': (_google_protobuf_BoolValue__Output | null);
  /**
   * Allows proxying Websocket and other upgrades over HTTP/3 CONNECT using
   * the header mechanisms from the `HTTP/2 extended connect RFC
   * <https://datatracker.ietf.org/doc/html/rfc8441>`_
   * and settings `proposed for HTTP/3
   * <https://datatracker.ietf.org/doc/draft-ietf-httpbis-h3-websockets/>`_
   * Note that HTTP/3 CONNECT is not yet an RFC.
   */
  'allow_extended_connect': (boolean);
}
