// Original file: deps/envoy-api/envoy/config/core/v3/proxy_protocol.proto

import type { ProxyProtocolPassThroughTLVs as _envoy_config_core_v3_ProxyProtocolPassThroughTLVs, ProxyProtocolPassThroughTLVs__Output as _envoy_config_core_v3_ProxyProtocolPassThroughTLVs__Output } from '../../../../envoy/config/core/v3/ProxyProtocolPassThroughTLVs';

// Original file: deps/envoy-api/envoy/config/core/v3/proxy_protocol.proto

export const _envoy_config_core_v3_ProxyProtocolConfig_Version = {
  /**
   * PROXY protocol version 1. Human readable format.
   */
  V1: 'V1',
  /**
   * PROXY protocol version 2. Binary format.
   */
  V2: 'V2',
} as const;

export type _envoy_config_core_v3_ProxyProtocolConfig_Version =
  /**
   * PROXY protocol version 1. Human readable format.
   */
  | 'V1'
  | 0
  /**
   * PROXY protocol version 2. Binary format.
   */
  | 'V2'
  | 1

export type _envoy_config_core_v3_ProxyProtocolConfig_Version__Output = typeof _envoy_config_core_v3_ProxyProtocolConfig_Version[keyof typeof _envoy_config_core_v3_ProxyProtocolConfig_Version]

export interface ProxyProtocolConfig {
  /**
   * The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details
   */
  'version'?: (_envoy_config_core_v3_ProxyProtocolConfig_Version);
  /**
   * This config controls which TLVs can be passed to upstream if it is Proxy Protocol
   * V2 header. If there is no setting for this field, no TLVs will be passed through.
   */
  'pass_through_tlvs'?: (_envoy_config_core_v3_ProxyProtocolPassThroughTLVs | null);
}

export interface ProxyProtocolConfig__Output {
  /**
   * The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details
   */
  'version': (_envoy_config_core_v3_ProxyProtocolConfig_Version__Output);
  /**
   * This config controls which TLVs can be passed to upstream if it is Proxy Protocol
   * V2 header. If there is no setting for this field, no TLVs will be passed through.
   */
  'pass_through_tlvs': (_envoy_config_core_v3_ProxyProtocolPassThroughTLVs__Output | null);
}
