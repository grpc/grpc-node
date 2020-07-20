// Original file: deps/envoy-api/envoy/api/v2/cluster.proto

import { TcpKeepalive as _envoy_api_v2_core_TcpKeepalive, TcpKeepalive__Output as _envoy_api_v2_core_TcpKeepalive__Output } from '../../../envoy/api/v2/core/TcpKeepalive';

export interface UpstreamConnectionOptions {
  /**
   * If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.
   */
  'tcp_keepalive'?: (_envoy_api_v2_core_TcpKeepalive);
}

export interface UpstreamConnectionOptions__Output {
  /**
   * If set then set SO_KEEPALIVE on the socket to enable TCP Keepalives.
   */
  'tcp_keepalive'?: (_envoy_api_v2_core_TcpKeepalive__Output);
}
