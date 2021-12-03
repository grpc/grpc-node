// Original file: deps/envoy-api/envoy/config/core/v3/udp_socket_config.proto

import type { UInt64Value as _google_protobuf_UInt64Value, UInt64Value__Output as _google_protobuf_UInt64Value__Output } from '../../../../google/protobuf/UInt64Value';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import type { Long } from '@grpc/proto-loader';

/**
 * Generic UDP socket configuration.
 */
export interface UdpSocketConfig {
  /**
   * The maximum size of received UDP datagrams. Using a larger size will cause Envoy to allocate
   * more memory per socket. Received datagrams above this size will be dropped. If not set
   * defaults to 1500 bytes.
   */
  'max_rx_datagram_size'?: (_google_protobuf_UInt64Value | null);
  /**
   * Configures whether Generic Receive Offload (GRO)
   * <https://en.wikipedia.org/wiki/Large_receive_offload>_ is preferred when reading from the
   * UDP socket. The default is context dependent and is documented where UdpSocketConfig is used.
   * This option affects performance but not functionality. If GRO is not supported by the operating
   * system, non-GRO receive will be used.
   */
  'prefer_gro'?: (_google_protobuf_BoolValue | null);
}

/**
 * Generic UDP socket configuration.
 */
export interface UdpSocketConfig__Output {
  /**
   * The maximum size of received UDP datagrams. Using a larger size will cause Envoy to allocate
   * more memory per socket. Received datagrams above this size will be dropped. If not set
   * defaults to 1500 bytes.
   */
  'max_rx_datagram_size': (_google_protobuf_UInt64Value__Output | null);
  /**
   * Configures whether Generic Receive Offload (GRO)
   * <https://en.wikipedia.org/wiki/Large_receive_offload>_ is preferred when reading from the
   * UDP socket. The default is context dependent and is documented where UdpSocketConfig is used.
   * This option affects performance but not functionality. If GRO is not supported by the operating
   * system, non-GRO receive will be used.
   */
  'prefer_gro': (_google_protobuf_BoolValue__Output | null);
}
