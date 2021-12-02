// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

/**
 * QUIC protocol options which apply to both downstream and upstream connections.
 */
export interface QuicProtocolOptions {
  /**
   * Maximum number of streams that the client can negotiate per connection. 100
   * if not specified.
   */
  'max_concurrent_streams'?: (_google_protobuf_UInt32Value | null);
  /**
   * `Initial stream-level flow-control receive window
   * <https://tools.ietf.org/html/draft-ietf-quic-transport-34#section-4.1>`_ size. Valid values range from
   * 1 to 16777216 (2^24, maximum supported by QUICHE) and defaults to 65536 (2^16).
   * 
   * NOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. If configured smaller than it, we will use 16384 instead.
   * QUICHE IETF Quic implementation supports 1 bytes window. We only support increasing the default window size now, so it's also the minimum.
   * 
   * This field also acts as a soft limit on the number of bytes Envoy will buffer per-stream in the
   * QUIC stream send and receive buffers. Once the buffer reaches this pointer, watermark callbacks will fire to
   * stop the flow of data to the stream buffers.
   */
  'initial_stream_window_size'?: (_google_protobuf_UInt32Value | null);
  /**
   * Similar to *initial_stream_window_size*, but for connection-level
   * flow-control. Valid values rage from 1 to 25165824 (24MB, maximum supported by QUICHE) and defaults to 65536 (2^16).
   * window. Currently, this has the same minimum/default as *initial_stream_window_size*.
   * 
   * NOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. We only support increasing the default
   * window size now, so it's also the minimum.
   */
  'initial_connection_window_size'?: (_google_protobuf_UInt32Value | null);
}

/**
 * QUIC protocol options which apply to both downstream and upstream connections.
 */
export interface QuicProtocolOptions__Output {
  /**
   * Maximum number of streams that the client can negotiate per connection. 100
   * if not specified.
   */
  'max_concurrent_streams': (_google_protobuf_UInt32Value__Output | null);
  /**
   * `Initial stream-level flow-control receive window
   * <https://tools.ietf.org/html/draft-ietf-quic-transport-34#section-4.1>`_ size. Valid values range from
   * 1 to 16777216 (2^24, maximum supported by QUICHE) and defaults to 65536 (2^16).
   * 
   * NOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. If configured smaller than it, we will use 16384 instead.
   * QUICHE IETF Quic implementation supports 1 bytes window. We only support increasing the default window size now, so it's also the minimum.
   * 
   * This field also acts as a soft limit on the number of bytes Envoy will buffer per-stream in the
   * QUIC stream send and receive buffers. Once the buffer reaches this pointer, watermark callbacks will fire to
   * stop the flow of data to the stream buffers.
   */
  'initial_stream_window_size': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Similar to *initial_stream_window_size*, but for connection-level
   * flow-control. Valid values rage from 1 to 25165824 (24MB, maximum supported by QUICHE) and defaults to 65536 (2^16).
   * window. Currently, this has the same minimum/default as *initial_stream_window_size*.
   * 
   * NOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. We only support increasing the default
   * window size now, so it's also the minimum.
   */
  'initial_connection_window_size': (_google_protobuf_UInt32Value__Output | null);
}
