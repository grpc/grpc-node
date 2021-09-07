// Original file: deps/envoy-api/envoy/config/listener/v3/udp_listener_config.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface UdpListenerConfig {
  /**
   * Used to look up UDP listener factory, matches "raw_udp_listener" or
   * "quic_listener" to create a specific udp listener.
   * If not specified, treat as "raw_udp_listener".
   */
  'udp_listener_name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Used to create a specific listener factory. To some factory, e.g.
   * "raw_udp_listener", config is not needed.
   */
  'config_type'?: "typed_config";
}

export interface UdpListenerConfig__Output {
  /**
   * Used to look up UDP listener factory, matches "raw_udp_listener" or
   * "quic_listener" to create a specific udp listener.
   * If not specified, treat as "raw_udp_listener".
   */
  'udp_listener_name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Used to create a specific listener factory. To some factory, e.g.
   * "raw_udp_listener", config is not needed.
   */
  'config_type': "typed_config";
}
