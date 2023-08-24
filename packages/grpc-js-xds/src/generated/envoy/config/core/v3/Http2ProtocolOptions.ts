// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { KeepaliveSettings as _envoy_config_core_v3_KeepaliveSettings, KeepaliveSettings__Output as _envoy_config_core_v3_KeepaliveSettings__Output } from '../../../../envoy/config/core/v3/KeepaliveSettings';

/**
 * Defines a parameter to be sent in the SETTINGS frame.
 * See `RFC7540, sec. 6.5.1 <https://tools.ietf.org/html/rfc7540#section-6.5.1>`_ for details.
 */
export interface _envoy_config_core_v3_Http2ProtocolOptions_SettingsParameter {
  /**
   * The 16 bit parameter identifier.
   */
  'identifier'?: (_google_protobuf_UInt32Value | null);
  /**
   * The 32 bit parameter value.
   */
  'value'?: (_google_protobuf_UInt32Value | null);
}

/**
 * Defines a parameter to be sent in the SETTINGS frame.
 * See `RFC7540, sec. 6.5.1 <https://tools.ietf.org/html/rfc7540#section-6.5.1>`_ for details.
 */
export interface _envoy_config_core_v3_Http2ProtocolOptions_SettingsParameter__Output {
  /**
   * The 16 bit parameter identifier.
   */
  'identifier': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The 32 bit parameter value.
   */
  'value': (_google_protobuf_UInt32Value__Output | null);
}

/**
 * [#next-free-field: 17]
 */
export interface Http2ProtocolOptions {
  /**
   * `Maximum table size <https://httpwg.org/specs/rfc7541.html#rfc.section.4.2>`_
   * (in octets) that the encoder is permitted to use for the dynamic HPACK table. Valid values
   * range from 0 to 4294967295 (2^32 - 1) and defaults to 4096. 0 effectively disables header
   * compression.
   */
  'hpack_table_size'?: (_google_protobuf_UInt32Value | null);
  /**
   * `Maximum concurrent streams <https://httpwg.org/specs/rfc7540.html#rfc.section.5.1.2>`_
   * allowed for peer on one HTTP/2 connection. Valid values range from 1 to 2147483647 (2^31 - 1)
   * and defaults to 2147483647.
   * 
   * For upstream connections, this also limits how many streams Envoy will initiate concurrently
   * on a single connection. If the limit is reached, Envoy may queue requests or establish
   * additional connections (as allowed per circuit breaker limits).
   * 
   * This acts as an upper bound: Envoy will lower the max concurrent streams allowed on a given
   * connection based on upstream settings. Config dumps will reflect the configured upper bound,
   * not the per-connection negotiated limits.
   */
  'max_concurrent_streams'?: (_google_protobuf_UInt32Value | null);
  /**
   * `Initial stream-level flow-control window
   * <https://httpwg.org/specs/rfc7540.html#rfc.section.6.9.2>`_ size. Valid values range from 65535
   * (2^16 - 1, HTTP/2 default) to 2147483647 (2^31 - 1, HTTP/2 maximum) and defaults to 268435456
   * (256 * 1024 * 1024).
   * 
   * NOTE: 65535 is the initial window size from HTTP/2 spec. We only support increasing the default
   * window size now, so it's also the minimum.
   * 
   * This field also acts as a soft limit on the number of bytes Envoy will buffer per-stream in the
   * HTTP/2 codec buffers. Once the buffer reaches this pointer, watermark callbacks will fire to
   * stop the flow of data to the codec buffers.
   */
  'initial_stream_window_size'?: (_google_protobuf_UInt32Value | null);
  /**
   * Similar to ``initial_stream_window_size``, but for connection-level flow-control
   * window. Currently, this has the same minimum/maximum/default as ``initial_stream_window_size``.
   */
  'initial_connection_window_size'?: (_google_protobuf_UInt32Value | null);
  /**
   * Allows proxying Websocket and other upgrades over H2 connect.
   */
  'allow_connect'?: (boolean);
  /**
   * [#not-implemented-hide:] Hiding until envoy has full metadata support.
   * Still under implementation. DO NOT USE.
   * 
   * Allows metadata. See [metadata
   * docs](https://github.com/envoyproxy/envoy/blob/main/source/docs/h2_metadata.md) for more
   * information.
   */
  'allow_metadata'?: (boolean);
  /**
   * Limit the number of pending outbound downstream frames of all types (frames that are waiting to
   * be written into the socket). Exceeding this limit triggers flood mitigation and connection is
   * terminated. The ``http2.outbound_flood`` stat tracks the number of terminated connections due
   * to flood mitigation. The default limit is 10000.
   */
  'max_outbound_frames'?: (_google_protobuf_UInt32Value | null);
  /**
   * Limit the number of pending outbound downstream frames of types PING, SETTINGS and RST_STREAM,
   * preventing high memory utilization when receiving continuous stream of these frames. Exceeding
   * this limit triggers flood mitigation and connection is terminated. The
   * ``http2.outbound_control_flood`` stat tracks the number of terminated connections due to flood
   * mitigation. The default limit is 1000.
   */
  'max_outbound_control_frames'?: (_google_protobuf_UInt32Value | null);
  /**
   * Limit the number of consecutive inbound frames of types HEADERS, CONTINUATION and DATA with an
   * empty payload and no end stream flag. Those frames have no legitimate use and are abusive, but
   * might be a result of a broken HTTP/2 implementation. The `http2.inbound_empty_frames_flood``
   * stat tracks the number of connections terminated due to flood mitigation.
   * Setting this to 0 will terminate connection upon receiving first frame with an empty payload
   * and no end stream flag. The default limit is 1.
   */
  'max_consecutive_inbound_frames_with_empty_payload'?: (_google_protobuf_UInt32Value | null);
  /**
   * Limit the number of inbound PRIORITY frames allowed per each opened stream. If the number
   * of PRIORITY frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * ``max_inbound_priority_frames_per_stream`` * (1 + ``opened_streams``)
   * 
   * the connection is terminated. For downstream connections the ``opened_streams`` is incremented when
   * Envoy receives complete response headers from the upstream server. For upstream connection the
   * ``opened_streams`` is incremented when Envoy send the HEADERS frame for a new stream. The
   * ``http2.inbound_priority_frames_flood`` stat tracks
   * the number of connections terminated due to flood mitigation. The default limit is 100.
   */
  'max_inbound_priority_frames_per_stream'?: (_google_protobuf_UInt32Value | null);
  /**
   * Limit the number of inbound WINDOW_UPDATE frames allowed per DATA frame sent. If the number
   * of WINDOW_UPDATE frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * 5 + 2 * (``opened_streams`` +
   * ``max_inbound_window_update_frames_per_data_frame_sent`` * ``outbound_data_frames``)
   * 
   * the connection is terminated. For downstream connections the ``opened_streams`` is incremented when
   * Envoy receives complete response headers from the upstream server. For upstream connections the
   * ``opened_streams`` is incremented when Envoy sends the HEADERS frame for a new stream. The
   * ``http2.inbound_priority_frames_flood`` stat tracks the number of connections terminated due to
   * flood mitigation. The default max_inbound_window_update_frames_per_data_frame_sent value is 10.
   * Setting this to 1 should be enough to support HTTP/2 implementations with basic flow control,
   * but more complex implementations that try to estimate available bandwidth require at least 2.
   */
  'max_inbound_window_update_frames_per_data_frame_sent'?: (_google_protobuf_UInt32Value | null);
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
   * 
   * This is overridden by HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`
   * iff present.
   * 
   * This is deprecated in favor of :ref:`override_stream_error_on_invalid_http_message
   * <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.override_stream_error_on_invalid_http_message>`
   * 
   * See `RFC7540, sec. 8.1 <https://tools.ietf.org/html/rfc7540#section-8.1>`_ for details.
   */
  'stream_error_on_invalid_http_messaging'?: (boolean);
  /**
   * [#not-implemented-hide:]
   * Specifies SETTINGS frame parameters to be sent to the peer, with two exceptions:
   * 
   * 1. SETTINGS_ENABLE_PUSH (0x2) is not configurable as HTTP/2 server push is not supported by
   * Envoy.
   * 
   * 2. SETTINGS_ENABLE_CONNECT_PROTOCOL (0x8) is only configurable through the named field
   * 'allow_connect'.
   * 
   * Note that custom parameters specified through this field can not also be set in the
   * corresponding named parameters:
   * 
   * .. code-block:: text
   * 
   * ID    Field Name
   * ----------------
   * 0x1   hpack_table_size
   * 0x3   max_concurrent_streams
   * 0x4   initial_stream_window_size
   * 
   * Collisions will trigger config validation failure on load/update. Likewise, inconsistencies
   * between custom parameters with the same identifier will trigger a failure.
   * 
   * See `IANA HTTP/2 Settings
   * <https://www.iana.org/assignments/http2-parameters/http2-parameters.xhtml#settings>`_ for
   * standardized identifiers.
   */
  'custom_settings_parameters'?: (_envoy_config_core_v3_Http2ProtocolOptions_SettingsParameter)[];
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
   * 
   * This overrides any HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`
   * 
   * See `RFC7540, sec. 8.1 <https://tools.ietf.org/html/rfc7540#section-8.1>`_ for details.
   */
  'override_stream_error_on_invalid_http_message'?: (_google_protobuf_BoolValue | null);
  /**
   * Send HTTP/2 PING frames to verify that the connection is still healthy. If the remote peer
   * does not respond within the configured timeout, the connection will be aborted.
   */
  'connection_keepalive'?: (_envoy_config_core_v3_KeepaliveSettings | null);
  /**
   * [#not-implemented-hide:] Hiding so that the field can be removed after oghttp2 is rolled out.
   * If set, force use of a particular HTTP/2 codec: oghttp2 if true, nghttp2 if false.
   * If unset, HTTP/2 codec is selected based on envoy.reloadable_features.http2_use_oghttp2.
   */
  'use_oghttp2_codec'?: (_google_protobuf_BoolValue | null);
}

/**
 * [#next-free-field: 17]
 */
export interface Http2ProtocolOptions__Output {
  /**
   * `Maximum table size <https://httpwg.org/specs/rfc7541.html#rfc.section.4.2>`_
   * (in octets) that the encoder is permitted to use for the dynamic HPACK table. Valid values
   * range from 0 to 4294967295 (2^32 - 1) and defaults to 4096. 0 effectively disables header
   * compression.
   */
  'hpack_table_size': (_google_protobuf_UInt32Value__Output | null);
  /**
   * `Maximum concurrent streams <https://httpwg.org/specs/rfc7540.html#rfc.section.5.1.2>`_
   * allowed for peer on one HTTP/2 connection. Valid values range from 1 to 2147483647 (2^31 - 1)
   * and defaults to 2147483647.
   * 
   * For upstream connections, this also limits how many streams Envoy will initiate concurrently
   * on a single connection. If the limit is reached, Envoy may queue requests or establish
   * additional connections (as allowed per circuit breaker limits).
   * 
   * This acts as an upper bound: Envoy will lower the max concurrent streams allowed on a given
   * connection based on upstream settings. Config dumps will reflect the configured upper bound,
   * not the per-connection negotiated limits.
   */
  'max_concurrent_streams': (_google_protobuf_UInt32Value__Output | null);
  /**
   * `Initial stream-level flow-control window
   * <https://httpwg.org/specs/rfc7540.html#rfc.section.6.9.2>`_ size. Valid values range from 65535
   * (2^16 - 1, HTTP/2 default) to 2147483647 (2^31 - 1, HTTP/2 maximum) and defaults to 268435456
   * (256 * 1024 * 1024).
   * 
   * NOTE: 65535 is the initial window size from HTTP/2 spec. We only support increasing the default
   * window size now, so it's also the minimum.
   * 
   * This field also acts as a soft limit on the number of bytes Envoy will buffer per-stream in the
   * HTTP/2 codec buffers. Once the buffer reaches this pointer, watermark callbacks will fire to
   * stop the flow of data to the codec buffers.
   */
  'initial_stream_window_size': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Similar to ``initial_stream_window_size``, but for connection-level flow-control
   * window. Currently, this has the same minimum/maximum/default as ``initial_stream_window_size``.
   */
  'initial_connection_window_size': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Allows proxying Websocket and other upgrades over H2 connect.
   */
  'allow_connect': (boolean);
  /**
   * [#not-implemented-hide:] Hiding until envoy has full metadata support.
   * Still under implementation. DO NOT USE.
   * 
   * Allows metadata. See [metadata
   * docs](https://github.com/envoyproxy/envoy/blob/main/source/docs/h2_metadata.md) for more
   * information.
   */
  'allow_metadata': (boolean);
  /**
   * Limit the number of pending outbound downstream frames of all types (frames that are waiting to
   * be written into the socket). Exceeding this limit triggers flood mitigation and connection is
   * terminated. The ``http2.outbound_flood`` stat tracks the number of terminated connections due
   * to flood mitigation. The default limit is 10000.
   */
  'max_outbound_frames': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Limit the number of pending outbound downstream frames of types PING, SETTINGS and RST_STREAM,
   * preventing high memory utilization when receiving continuous stream of these frames. Exceeding
   * this limit triggers flood mitigation and connection is terminated. The
   * ``http2.outbound_control_flood`` stat tracks the number of terminated connections due to flood
   * mitigation. The default limit is 1000.
   */
  'max_outbound_control_frames': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Limit the number of consecutive inbound frames of types HEADERS, CONTINUATION and DATA with an
   * empty payload and no end stream flag. Those frames have no legitimate use and are abusive, but
   * might be a result of a broken HTTP/2 implementation. The `http2.inbound_empty_frames_flood``
   * stat tracks the number of connections terminated due to flood mitigation.
   * Setting this to 0 will terminate connection upon receiving first frame with an empty payload
   * and no end stream flag. The default limit is 1.
   */
  'max_consecutive_inbound_frames_with_empty_payload': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Limit the number of inbound PRIORITY frames allowed per each opened stream. If the number
   * of PRIORITY frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * ``max_inbound_priority_frames_per_stream`` * (1 + ``opened_streams``)
   * 
   * the connection is terminated. For downstream connections the ``opened_streams`` is incremented when
   * Envoy receives complete response headers from the upstream server. For upstream connection the
   * ``opened_streams`` is incremented when Envoy send the HEADERS frame for a new stream. The
   * ``http2.inbound_priority_frames_flood`` stat tracks
   * the number of connections terminated due to flood mitigation. The default limit is 100.
   */
  'max_inbound_priority_frames_per_stream': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Limit the number of inbound WINDOW_UPDATE frames allowed per DATA frame sent. If the number
   * of WINDOW_UPDATE frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * 5 + 2 * (``opened_streams`` +
   * ``max_inbound_window_update_frames_per_data_frame_sent`` * ``outbound_data_frames``)
   * 
   * the connection is terminated. For downstream connections the ``opened_streams`` is incremented when
   * Envoy receives complete response headers from the upstream server. For upstream connections the
   * ``opened_streams`` is incremented when Envoy sends the HEADERS frame for a new stream. The
   * ``http2.inbound_priority_frames_flood`` stat tracks the number of connections terminated due to
   * flood mitigation. The default max_inbound_window_update_frames_per_data_frame_sent value is 10.
   * Setting this to 1 should be enough to support HTTP/2 implementations with basic flow control,
   * but more complex implementations that try to estimate available bandwidth require at least 2.
   */
  'max_inbound_window_update_frames_per_data_frame_sent': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
   * 
   * This is overridden by HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`
   * iff present.
   * 
   * This is deprecated in favor of :ref:`override_stream_error_on_invalid_http_message
   * <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.override_stream_error_on_invalid_http_message>`
   * 
   * See `RFC7540, sec. 8.1 <https://tools.ietf.org/html/rfc7540#section-8.1>`_ for details.
   */
  'stream_error_on_invalid_http_messaging': (boolean);
  /**
   * [#not-implemented-hide:]
   * Specifies SETTINGS frame parameters to be sent to the peer, with two exceptions:
   * 
   * 1. SETTINGS_ENABLE_PUSH (0x2) is not configurable as HTTP/2 server push is not supported by
   * Envoy.
   * 
   * 2. SETTINGS_ENABLE_CONNECT_PROTOCOL (0x8) is only configurable through the named field
   * 'allow_connect'.
   * 
   * Note that custom parameters specified through this field can not also be set in the
   * corresponding named parameters:
   * 
   * .. code-block:: text
   * 
   * ID    Field Name
   * ----------------
   * 0x1   hpack_table_size
   * 0x3   max_concurrent_streams
   * 0x4   initial_stream_window_size
   * 
   * Collisions will trigger config validation failure on load/update. Likewise, inconsistencies
   * between custom parameters with the same identifier will trigger a failure.
   * 
   * See `IANA HTTP/2 Settings
   * <https://www.iana.org/assignments/http2-parameters/http2-parameters.xhtml#settings>`_ for
   * standardized identifiers.
   */
  'custom_settings_parameters': (_envoy_config_core_v3_Http2ProtocolOptions_SettingsParameter__Output)[];
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
   * 
   * This overrides any HCM :ref:`stream_error_on_invalid_http_messaging
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.stream_error_on_invalid_http_message>`
   * 
   * See `RFC7540, sec. 8.1 <https://tools.ietf.org/html/rfc7540#section-8.1>`_ for details.
   */
  'override_stream_error_on_invalid_http_message': (_google_protobuf_BoolValue__Output | null);
  /**
   * Send HTTP/2 PING frames to verify that the connection is still healthy. If the remote peer
   * does not respond within the configured timeout, the connection will be aborted.
   */
  'connection_keepalive': (_envoy_config_core_v3_KeepaliveSettings__Output | null);
  /**
   * [#not-implemented-hide:] Hiding so that the field can be removed after oghttp2 is rolled out.
   * If set, force use of a particular HTTP/2 codec: oghttp2 if true, nghttp2 if false.
   * If unset, HTTP/2 codec is selected based on envoy.reloadable_features.http2_use_oghttp2.
   */
  'use_oghttp2_codec': (_google_protobuf_BoolValue__Output | null);
}
