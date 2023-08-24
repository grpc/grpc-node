// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * Config for keepalive probes in a QUIC connection.
 * Note that QUIC keep-alive probing packets work differently from HTTP/2 keep-alive PINGs in a sense that the probing packet
 * itself doesn't timeout waiting for a probing response. Quic has a shorter idle timeout than TCP, so it doesn't rely on such probing to discover dead connections. If the peer fails to respond, the connection will idle timeout eventually. Thus, they are configured differently from :ref:`connection_keepalive <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.connection_keepalive>`.
 */
export interface QuicKeepAliveSettings {
  /**
   * The max interval for a connection to send keep-alive probing packets (with PING or PATH_RESPONSE). The value should be smaller than :ref:`connection idle_timeout <envoy_v3_api_field_config.listener.v3.QuicProtocolOptions.idle_timeout>` to prevent idle timeout while not less than 1s to avoid throttling the connection or flooding the peer with probes.
   * 
   * If :ref:`initial_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.initial_interval>` is absent or zero, a client connection will use this value to start probing.
   * 
   * If zero, disable keepalive probing.
   * If absent, use the QUICHE default interval to probe.
   */
  'max_interval'?: (_google_protobuf_Duration | null);
  /**
   * The interval to send the first few keep-alive probing packets to prevent connection from hitting the idle timeout. Subsequent probes will be sent, each one with an interval exponentially longer than previous one, till it reaches :ref:`max_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.max_interval>`. And the probes afterwards will always use :ref:`max_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.max_interval>`.
   * 
   * The value should be smaller than :ref:`connection idle_timeout <envoy_v3_api_field_config.listener.v3.QuicProtocolOptions.idle_timeout>` to prevent idle timeout and smaller than max_interval to take effect.
   * 
   * If absent or zero, disable keepalive probing for a server connection. For a client connection, if :ref:`max_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.max_interval>`  is also zero, do not keepalive, otherwise use max_interval or QUICHE default to probe all the time.
   */
  'initial_interval'?: (_google_protobuf_Duration | null);
}

/**
 * Config for keepalive probes in a QUIC connection.
 * Note that QUIC keep-alive probing packets work differently from HTTP/2 keep-alive PINGs in a sense that the probing packet
 * itself doesn't timeout waiting for a probing response. Quic has a shorter idle timeout than TCP, so it doesn't rely on such probing to discover dead connections. If the peer fails to respond, the connection will idle timeout eventually. Thus, they are configured differently from :ref:`connection_keepalive <envoy_v3_api_field_config.core.v3.Http2ProtocolOptions.connection_keepalive>`.
 */
export interface QuicKeepAliveSettings__Output {
  /**
   * The max interval for a connection to send keep-alive probing packets (with PING or PATH_RESPONSE). The value should be smaller than :ref:`connection idle_timeout <envoy_v3_api_field_config.listener.v3.QuicProtocolOptions.idle_timeout>` to prevent idle timeout while not less than 1s to avoid throttling the connection or flooding the peer with probes.
   * 
   * If :ref:`initial_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.initial_interval>` is absent or zero, a client connection will use this value to start probing.
   * 
   * If zero, disable keepalive probing.
   * If absent, use the QUICHE default interval to probe.
   */
  'max_interval': (_google_protobuf_Duration__Output | null);
  /**
   * The interval to send the first few keep-alive probing packets to prevent connection from hitting the idle timeout. Subsequent probes will be sent, each one with an interval exponentially longer than previous one, till it reaches :ref:`max_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.max_interval>`. And the probes afterwards will always use :ref:`max_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.max_interval>`.
   * 
   * The value should be smaller than :ref:`connection idle_timeout <envoy_v3_api_field_config.listener.v3.QuicProtocolOptions.idle_timeout>` to prevent idle timeout and smaller than max_interval to take effect.
   * 
   * If absent or zero, disable keepalive probing for a server connection. For a client connection, if :ref:`max_interval <envoy_v3_api_field_config.core.v3.QuicKeepAliveSettings.max_interval>`  is also zero, do not keepalive, otherwise use max_interval or QUICHE default to probe all the time.
   */
  'initial_interval': (_google_protobuf_Duration__Output | null);
}
