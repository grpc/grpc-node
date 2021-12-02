// Original file: deps/envoy-api/envoy/config/listener/v3/udp_listener_config.proto

import type { UdpSocketConfig as _envoy_config_core_v3_UdpSocketConfig, UdpSocketConfig__Output as _envoy_config_core_v3_UdpSocketConfig__Output } from '../../../../envoy/config/core/v3/UdpSocketConfig';
import type { QuicProtocolOptions as _envoy_config_listener_v3_QuicProtocolOptions, QuicProtocolOptions__Output as _envoy_config_listener_v3_QuicProtocolOptions__Output } from '../../../../envoy/config/listener/v3/QuicProtocolOptions';

/**
 * [#next-free-field: 8]
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
   * 
   * .. warning::
   * QUIC support is currently alpha and should be used with caution. Please
   * see :ref:`here <arch_overview_http3>` for details.
   */
  'quic_options'?: (_envoy_config_listener_v3_QuicProtocolOptions | null);
}

/**
 * [#next-free-field: 8]
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
   * 
   * .. warning::
   * QUIC support is currently alpha and should be used with caution. Please
   * see :ref:`here <arch_overview_http3>` for details.
   */
  'quic_options': (_envoy_config_listener_v3_QuicProtocolOptions__Output | null);
}
