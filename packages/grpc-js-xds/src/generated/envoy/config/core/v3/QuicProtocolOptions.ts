// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { QuicKeepAliveSettings as _envoy_config_core_v3_QuicKeepAliveSettings, QuicKeepAliveSettings__Output as _envoy_config_core_v3_QuicKeepAliveSettings__Output } from '../../../../envoy/config/core/v3/QuicKeepAliveSettings';

/**
 * QUIC protocol options which apply to both downstream and upstream connections.
 * [#next-free-field: 6]
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
   * Similar to ``initial_stream_window_size``, but for connection-level
   * flow-control. Valid values rage from 1 to 25165824 (24MB, maximum supported by QUICHE) and defaults to 65536 (2^16).
   * window. Currently, this has the same minimum/default as ``initial_stream_window_size``.
   * 
   * NOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. We only support increasing the default
   * window size now, so it's also the minimum.
   */
  'initial_connection_window_size'?: (_google_protobuf_UInt32Value | null);
  /**
   * The number of timeouts that can occur before port migration is triggered for QUIC clients.
   * This defaults to 1. If set to 0, port migration will not occur on path degrading.
   * Timeout here refers to QUIC internal path degrading timeout mechanism, such as PTO.
   * This has no effect on server sessions.
   */
  'num_timeouts_to_trigger_port_migration'?: (_google_protobuf_UInt32Value | null);
  /**
   * Probes the peer at the configured interval to solicit traffic, i.e. ACK or PATH_RESPONSE, from the peer to push back connection idle timeout.
   * If absent, use the default keepalive behavior of which a client connection sends PINGs every 15s, and a server connection doesn't do anything.
   */
  'connection_keepalive'?: (_envoy_config_core_v3_QuicKeepAliveSettings | null);
}

/**
 * QUIC protocol options which apply to both downstream and upstream connections.
 * [#next-free-field: 6]
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
   * Similar to ``initial_stream_window_size``, but for connection-level
   * flow-control. Valid values rage from 1 to 25165824 (24MB, maximum supported by QUICHE) and defaults to 65536 (2^16).
   * window. Currently, this has the same minimum/default as ``initial_stream_window_size``.
   * 
   * NOTE: 16384 (2^14) is the minimum window size supported in Google QUIC. We only support increasing the default
   * window size now, so it's also the minimum.
   */
  'initial_connection_window_size': (_google_protobuf_UInt32Value__Output | null);
  /**
   * The number of timeouts that can occur before port migration is triggered for QUIC clients.
   * This defaults to 1. If set to 0, port migration will not occur on path degrading.
   * Timeout here refers to QUIC internal path degrading timeout mechanism, such as PTO.
   * This has no effect on server sessions.
   */
  'num_timeouts_to_trigger_port_migration': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Probes the peer at the configured interval to solicit traffic, i.e. ACK or PATH_RESPONSE, from the peer to push back connection idle timeout.
   * If absent, use the default keepalive behavior of which a client connection sends PINGs every 15s, and a server connection doesn't do anything.
   */
  'connection_keepalive': (_envoy_config_core_v3_QuicKeepAliveSettings__Output | null);
}
