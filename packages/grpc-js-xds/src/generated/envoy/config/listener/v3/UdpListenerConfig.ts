// Original file: deps/envoy-api/envoy/config/listener/v3/udp_listener_config.proto

import type { UdpSocketConfig as _envoy_config_core_v3_UdpSocketConfig, UdpSocketConfig__Output as _envoy_config_core_v3_UdpSocketConfig__Output } from '../../../../envoy/config/core/v3/UdpSocketConfig';
import type { QuicProtocolOptions as _envoy_config_listener_v3_QuicProtocolOptions, QuicProtocolOptions__Output as _envoy_config_listener_v3_QuicProtocolOptions__Output } from '../../../../envoy/config/listener/v3/QuicProtocolOptions';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * [#next-free-field: 9]
 */
export interface UdpListenerConfig {
  /**
   * UDP socket configuration for the listener. The default for
   * :ref:`prefer_gro <envoy_v3_api_field_config.core.v3.UdpSocketConfig.prefer_gro>` is false for
   * listener sockets. If receiving a large amount of datagrams from a small number of sources, it
   * may be worthwhile to enable this option after performance testing.
   */
  'downstream_socket_config'?: (_envoy_config_core_v3_UdpSocketConfig | null);
  /**
   * Configuration for QUIC protocol. If empty, QUIC will not be enabled on this listener. Set
   * to the default object to enable QUIC without modifying any additional options.
   */
  'quic_options'?: (_envoy_config_listener_v3_QuicProtocolOptions | null);
  /**
   * Configuration for the UDP packet writer. If empty, HTTP/3 will use GSO if available
   * (:ref:`UdpDefaultWriterFactory <envoy_v3_api_msg_extensions.udp_packet_writer.v3.UdpGsoBatchWriterFactory>`)
   * or the default kernel sendmsg if not,
   * (:ref:`UdpDefaultWriterFactory <envoy_v3_api_msg_extensions.udp_packet_writer.v3.UdpDefaultWriterFactory>`)
   * and raw UDP will use kernel sendmsg.
   * [#extension-category: envoy.udp_packet_writer]
   */
  'udp_packet_packet_writer_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
}

/**
 * [#next-free-field: 9]
 */
export interface UdpListenerConfig__Output {
  /**
   * UDP socket configuration for the listener. The default for
   * :ref:`prefer_gro <envoy_v3_api_field_config.core.v3.UdpSocketConfig.prefer_gro>` is false for
   * listener sockets. If receiving a large amount of datagrams from a small number of sources, it
   * may be worthwhile to enable this option after performance testing.
   */
  'downstream_socket_config': (_envoy_config_core_v3_UdpSocketConfig__Output | null);
  /**
   * Configuration for QUIC protocol. If empty, QUIC will not be enabled on this listener. Set
   * to the default object to enable QUIC without modifying any additional options.
   */
  'quic_options': (_envoy_config_listener_v3_QuicProtocolOptions__Output | null);
  /**
   * Configuration for the UDP packet writer. If empty, HTTP/3 will use GSO if available
   * (:ref:`UdpDefaultWriterFactory <envoy_v3_api_msg_extensions.udp_packet_writer.v3.UdpGsoBatchWriterFactory>`)
   * or the default kernel sendmsg if not,
   * (:ref:`UdpDefaultWriterFactory <envoy_v3_api_msg_extensions.udp_packet_writer.v3.UdpDefaultWriterFactory>`)
   * and raw UDP will use kernel sendmsg.
   * [#extension-category: envoy.udp_packet_writer]
   */
  'udp_packet_packet_writer_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
}
