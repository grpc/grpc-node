// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto

import type { TcpKeepalive as _envoy_config_core_v3_TcpKeepalive, TcpKeepalive__Output as _envoy_config_core_v3_TcpKeepalive__Output } from '../../../../envoy/config/core/v3/TcpKeepalive';

export interface UpstreamConnectionOptions {
  /**
   * If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.
   */
  'tcp_keepalive'?: (_envoy_config_core_v3_TcpKeepalive | null);
}

export interface UpstreamConnectionOptions__Output {
  /**
   * If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.
   */
  'tcp_keepalive': (_envoy_config_core_v3_TcpKeepalive__Output | null);
}
