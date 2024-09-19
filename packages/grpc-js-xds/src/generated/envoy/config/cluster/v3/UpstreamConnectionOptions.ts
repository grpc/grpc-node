// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

import type { TcpKeepalive as _envoy_config_core_v3_TcpKeepalive, TcpKeepalive__Output as _envoy_config_core_v3_TcpKeepalive__Output } from '../../../../envoy/config/core/v3/TcpKeepalive';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

export const _envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion = {
  /**
   * respect the native ranking of destination ip addresses returned from dns
   * resolution
   */
  DEFAULT: 'DEFAULT',
  V4: 'V4',
  V6: 'V6',
} as const;

export type _envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion =
  /**
   * respect the native ranking of destination ip addresses returned from dns
   * resolution
   */
  | 'DEFAULT'
  | 0
  | 'V4'
  | 1
  | 'V6'
  | 2

export type _envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion__Output = typeof _envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion[keyof typeof _envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion]

export interface _envoy_config_cluster_v3_UpstreamConnectionOptions_HappyEyeballsConfig {
  /**
   * Specify the IP address family to attempt connection first in happy
   * eyeballs algorithm according to RFC8305#section-4.
   */
  'first_address_family_version'?: (_envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion);
  /**
   * Specify the number of addresses of the first_address_family_version being
   * attempted for connection before the other address family.
   */
  'first_address_family_count'?: (_google_protobuf_UInt32Value | null);
}

export interface _envoy_config_cluster_v3_UpstreamConnectionOptions_HappyEyeballsConfig__Output {
  /**
   * Specify the IP address family to attempt connection first in happy
   * eyeballs algorithm according to RFC8305#section-4.
   */
  'first_address_family_version': (_envoy_config_cluster_v3_UpstreamConnectionOptions_FirstAddressFamilyVersion__Output);
  /**
   * Specify the number of addresses of the first_address_family_version being
   * attempted for connection before the other address family.
   */
  'first_address_family_count': (_google_protobuf_UInt32Value__Output | null);
}

export interface UpstreamConnectionOptions {
  /**
   * If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.
   */
  'tcp_keepalive'?: (_envoy_config_core_v3_TcpKeepalive | null);
  /**
   * If enabled, associates the interface name of the local address with the upstream connection.
   * This can be used by extensions during processing of requests. The association mechanism is
   * implementation specific. Defaults to false due to performance concerns.
   */
  'set_local_interface_name_on_upstream_connections'?: (boolean);
  /**
   * Configurations for happy eyeballs algorithm.
   * Add configs for first_address_family_version and first_address_family_count
   * when sorting destination ip addresses.
   */
  'happy_eyeballs_config'?: (_envoy_config_cluster_v3_UpstreamConnectionOptions_HappyEyeballsConfig | null);
}

export interface UpstreamConnectionOptions__Output {
  /**
   * If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.
   */
  'tcp_keepalive': (_envoy_config_core_v3_TcpKeepalive__Output | null);
  /**
   * If enabled, associates the interface name of the local address with the upstream connection.
   * This can be used by extensions during processing of requests. The association mechanism is
   * implementation specific. Defaults to false due to performance concerns.
   */
  'set_local_interface_name_on_upstream_connections': (boolean);
  /**
   * Configurations for happy eyeballs algorithm.
   * Add configs for first_address_family_version and first_address_family_count
   * when sorting destination ip addresses.
   */
  'happy_eyeballs_config': (_envoy_config_cluster_v3_UpstreamConnectionOptions_HappyEyeballsConfig__Output | null);
}
