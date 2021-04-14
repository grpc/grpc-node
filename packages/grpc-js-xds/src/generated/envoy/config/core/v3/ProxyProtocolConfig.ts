// Original file: deps/envoy-api/envoy/config/core/v3/proxy_protocol.proto


// Original file: deps/envoy-api/envoy/config/core/v3/proxy_protocol.proto

export enum _envoy_config_core_v3_ProxyProtocolConfig_Version {
  /**
   * PROXY protocol version 1. Human readable format.
   */
  V1 = 0,
  /**
   * PROXY protocol version 2. Binary format.
   */
  V2 = 1,
}

export interface ProxyProtocolConfig {
  /**
   * The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details
   */
  'version'?: (_envoy_config_core_v3_ProxyProtocolConfig_Version | keyof typeof _envoy_config_core_v3_ProxyProtocolConfig_Version);
}

export interface ProxyProtocolConfig__Output {
  /**
   * The PROXY protocol version to use. See https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt for details
   */
  'version': (keyof typeof _envoy_config_core_v3_ProxyProtocolConfig_Version);
}
