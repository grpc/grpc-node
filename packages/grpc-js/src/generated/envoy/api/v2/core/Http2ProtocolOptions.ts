// Original file: deps/envoy-api/envoy/api/v2/core/protocol.proto

import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * Defines a parameter to be sent in the SETTINGS frame.
 * See `RFC7540, sec. 6.5.1 <https://tools.ietf.org/html/rfc7540#section-6.5.1>`_ for details.
 */
export interface _envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter {
  /**
   * The 16 bit parameter identifier.
   */
  'identifier'?: (_google_protobuf_UInt32Value);
  /**
   * The 32 bit parameter value.
   */
  'value'?: (_google_protobuf_UInt32Value);
}

/**
 * Defines a parameter to be sent in the SETTINGS frame.
 * See `RFC7540, sec. 6.5.1 <https://tools.ietf.org/html/rfc7540#section-6.5.1>`_ for details.
 */
export interface _envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter__Output {
  /**
   * The 16 bit parameter identifier.
   */
  'identifier'?: (_google_protobuf_UInt32Value__Output);
  /**
   * The 32 bit parameter value.
   */
  'value'?: (_google_protobuf_UInt32Value__Output);
}

/**
 * [#next-free-field: 14]
 */
export interface Http2ProtocolOptions {
  /**
   * `Maximum table size <https://httpwg.org/specs/rfc7541.html#rfc.section.4.2>`_
   * (in octets) that the encoder is permitted to use for the dynamic HPACK table. Valid values
   * range from 0 to 4294967295 (2^32 - 1) and defaults to 4096. 0 effectively disables header
   * compression.
   */
  'hpack_table_size'?: (_google_protobuf_UInt32Value);
  /**
   * `Maximum concurrent streams <https://httpwg.org/specs/rfc7540.html#rfc.section.5.1.2>`_
   * allowed for peer on one HTTP/2 connection. Valid values range from 1 to 2147483647 (2^31 - 1)
   * and defaults to 2147483647.
   * 
   * For upstream connections, this also limits how many streams Envoy will initiate concurrently
   * on a single connection. If the limit is reached, Envoy may queue requests or establish
   * additional connections (as allowed per circuit breaker limits).
   */
  'max_concurrent_streams'?: (_google_protobuf_UInt32Value);
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
  'initial_stream_window_size'?: (_google_protobuf_UInt32Value);
  /**
   * Similar to *initial_stream_window_size*, but for connection-level flow-control
   * window. Currently, this has the same minimum/maximum/default as *initial_stream_window_size*.
   */
  'initial_connection_window_size'?: (_google_protobuf_UInt32Value);
  /**
   * Allows proxying Websocket and other upgrades over H2 connect.
   */
  'allow_connect'?: (boolean);
  /**
   * [#not-implemented-hide:] Hiding until envoy has full metadata support.
   * Still under implementation. DO NOT USE.
   * 
   * Allows metadata. See [metadata
   * docs](https://github.com/envoyproxy/envoy/blob/master/source/docs/h2_metadata.md) for more
   * information.
   */
  'allow_metadata'?: (boolean);
  /**
   * Limit the number of pending outbound downstream frames of all types (frames that are waiting to
   * be written into the socket). Exceeding this limit triggers flood mitigation and connection is
   * terminated. The ``http2.outbound_flood`` stat tracks the number of terminated connections due
   * to flood mitigation. The default limit is 10000.
   * [#comment:TODO: implement same limits for upstream outbound frames as well.]
   */
  'max_outbound_frames'?: (_google_protobuf_UInt32Value);
  /**
   * Limit the number of pending outbound downstream frames of types PING, SETTINGS and RST_STREAM,
   * preventing high memory utilization when receiving continuous stream of these frames. Exceeding
   * this limit triggers flood mitigation and connection is terminated. The
   * ``http2.outbound_control_flood`` stat tracks the number of terminated connections due to flood
   * mitigation. The default limit is 1000.
   * [#comment:TODO: implement same limits for upstream outbound frames as well.]
   */
  'max_outbound_control_frames'?: (_google_protobuf_UInt32Value);
  /**
   * Limit the number of consecutive inbound frames of types HEADERS, CONTINUATION and DATA with an
   * empty payload and no end stream flag. Those frames have no legitimate use and are abusive, but
   * might be a result of a broken HTTP/2 implementation. The `http2.inbound_empty_frames_flood``
   * stat tracks the number of connections terminated due to flood mitigation.
   * Setting this to 0 will terminate connection upon receiving first frame with an empty payload
   * and no end stream flag. The default limit is 1.
   * [#comment:TODO: implement same limits for upstream inbound frames as well.]
   */
  'max_consecutive_inbound_frames_with_empty_payload'?: (_google_protobuf_UInt32Value);
  /**
   * Limit the number of inbound PRIORITY frames allowed per each opened stream. If the number
   * of PRIORITY frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * max_inbound_priority_frames_per_stream * (1 + inbound_streams)
   * 
   * the connection is terminated. The ``http2.inbound_priority_frames_flood`` stat tracks
   * the number of connections terminated due to flood mitigation. The default limit is 100.
   * [#comment:TODO: implement same limits for upstream inbound frames as well.]
   */
  'max_inbound_priority_frames_per_stream'?: (_google_protobuf_UInt32Value);
  /**
   * Limit the number of inbound WINDOW_UPDATE frames allowed per DATA frame sent. If the number
   * of WINDOW_UPDATE frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * 1 + 2 * (inbound_streams +
   * max_inbound_window_update_frames_per_data_frame_sent * outbound_data_frames)
   * 
   * the connection is terminated. The ``http2.inbound_priority_frames_flood`` stat tracks
   * the number of connections terminated due to flood mitigation. The default limit is 10.
   * Setting this to 1 should be enough to support HTTP/2 implementations with basic flow control,
   * but more complex implementations that try to estimate available bandwidth require at least 2.
   * [#comment:TODO: implement same limits for upstream inbound frames as well.]
   */
  'max_inbound_window_update_frames_per_data_frame_sent'?: (_google_protobuf_UInt32Value);
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
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
  'custom_settings_parameters'?: (_envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter)[];
}

/**
 * [#next-free-field: 14]
 */
export interface Http2ProtocolOptions__Output {
  /**
   * `Maximum table size <https://httpwg.org/specs/rfc7541.html#rfc.section.4.2>`_
   * (in octets) that the encoder is permitted to use for the dynamic HPACK table. Valid values
   * range from 0 to 4294967295 (2^32 - 1) and defaults to 4096. 0 effectively disables header
   * compression.
   */
  'hpack_table_size'?: (_google_protobuf_UInt32Value__Output);
  /**
   * `Maximum concurrent streams <https://httpwg.org/specs/rfc7540.html#rfc.section.5.1.2>`_
   * allowed for peer on one HTTP/2 connection. Valid values range from 1 to 2147483647 (2^31 - 1)
   * and defaults to 2147483647.
   * 
   * For upstream connections, this also limits how many streams Envoy will initiate concurrently
   * on a single connection. If the limit is reached, Envoy may queue requests or establish
   * additional connections (as allowed per circuit breaker limits).
   */
  'max_concurrent_streams'?: (_google_protobuf_UInt32Value__Output);
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
  'initial_stream_window_size'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Similar to *initial_stream_window_size*, but for connection-level flow-control
   * window. Currently, this has the same minimum/maximum/default as *initial_stream_window_size*.
   */
  'initial_connection_window_size'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Allows proxying Websocket and other upgrades over H2 connect.
   */
  'allow_connect': (boolean);
  /**
   * [#not-implemented-hide:] Hiding until envoy has full metadata support.
   * Still under implementation. DO NOT USE.
   * 
   * Allows metadata. See [metadata
   * docs](https://github.com/envoyproxy/envoy/blob/master/source/docs/h2_metadata.md) for more
   * information.
   */
  'allow_metadata': (boolean);
  /**
   * Limit the number of pending outbound downstream frames of all types (frames that are waiting to
   * be written into the socket). Exceeding this limit triggers flood mitigation and connection is
   * terminated. The ``http2.outbound_flood`` stat tracks the number of terminated connections due
   * to flood mitigation. The default limit is 10000.
   * [#comment:TODO: implement same limits for upstream outbound frames as well.]
   */
  'max_outbound_frames'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Limit the number of pending outbound downstream frames of types PING, SETTINGS and RST_STREAM,
   * preventing high memory utilization when receiving continuous stream of these frames. Exceeding
   * this limit triggers flood mitigation and connection is terminated. The
   * ``http2.outbound_control_flood`` stat tracks the number of terminated connections due to flood
   * mitigation. The default limit is 1000.
   * [#comment:TODO: implement same limits for upstream outbound frames as well.]
   */
  'max_outbound_control_frames'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Limit the number of consecutive inbound frames of types HEADERS, CONTINUATION and DATA with an
   * empty payload and no end stream flag. Those frames have no legitimate use and are abusive, but
   * might be a result of a broken HTTP/2 implementation. The `http2.inbound_empty_frames_flood``
   * stat tracks the number of connections terminated due to flood mitigation.
   * Setting this to 0 will terminate connection upon receiving first frame with an empty payload
   * and no end stream flag. The default limit is 1.
   * [#comment:TODO: implement same limits for upstream inbound frames as well.]
   */
  'max_consecutive_inbound_frames_with_empty_payload'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Limit the number of inbound PRIORITY frames allowed per each opened stream. If the number
   * of PRIORITY frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * max_inbound_priority_frames_per_stream * (1 + inbound_streams)
   * 
   * the connection is terminated. The ``http2.inbound_priority_frames_flood`` stat tracks
   * the number of connections terminated due to flood mitigation. The default limit is 100.
   * [#comment:TODO: implement same limits for upstream inbound frames as well.]
   */
  'max_inbound_priority_frames_per_stream'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Limit the number of inbound WINDOW_UPDATE frames allowed per DATA frame sent. If the number
   * of WINDOW_UPDATE frames received over the lifetime of connection exceeds the value calculated
   * using this formula::
   * 
   * 1 + 2 * (inbound_streams +
   * max_inbound_window_update_frames_per_data_frame_sent * outbound_data_frames)
   * 
   * the connection is terminated. The ``http2.inbound_priority_frames_flood`` stat tracks
   * the number of connections terminated due to flood mitigation. The default limit is 10.
   * Setting this to 1 should be enough to support HTTP/2 implementations with basic flow control,
   * but more complex implementations that try to estimate available bandwidth require at least 2.
   * [#comment:TODO: implement same limits for upstream inbound frames as well.]
   */
  'max_inbound_window_update_frames_per_data_frame_sent'?: (_google_protobuf_UInt32Value__Output);
  /**
   * Allows invalid HTTP messaging and headers. When this option is disabled (default), then
   * the whole HTTP/2 connection is terminated upon receiving invalid HEADERS frame. However,
   * when this option is enabled, only the offending stream is terminated.
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
  'custom_settings_parameters': (_envoy_api_v2_core_Http2ProtocolOptions_SettingsParameter__Output)[];
}
