// Original file: deps/envoy-api/envoy/api/v2/listener/udp_listener_config.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface UdpListenerConfig {
  /**
   * Used to look up UDP listener factory, matches "raw_udp_listener" or
   * "quic_listener" to create a specific udp listener.
   * If not specified, treat as "raw_udp_listener".
   */
  'udp_listener_name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Used to create a specific listener factory. To some factory, e.g.
   * "raw_udp_listener", config is not needed.
   */
  'config_type'?: "config"|"typed_config";
}

export interface UdpListenerConfig__Output {
  /**
   * Used to look up UDP listener factory, matches "raw_udp_listener" or
   * "quic_listener" to create a specific udp listener.
   * If not specified, treat as "raw_udp_listener".
   */
  'udp_listener_name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Used to create a specific listener factory. To some factory, e.g.
   * "raw_udp_listener", config is not needed.
   */
  'config_type': "config"|"typed_config";
}
