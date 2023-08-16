// Original file: deps/envoy-api/envoy/config/core/v3/proxy_protocol.proto


// Original file: deps/envoy-api/envoy/config/core/v3/proxy_protocol.proto

export enum _envoy_config_core_v3_ProxyProtocolPassThroughTLVs_PassTLVsMatchType {
  /**
   * Pass all TLVs.
   */
  INCLUDE_ALL = 0,
  /**
   * Pass specific TLVs defined in tlv_type.
   */
  INCLUDE = 1,
}

export interface ProxyProtocolPassThroughTLVs {
  /**
   * The strategy to pass through TLVs. Default is INCLUDE_ALL.
   * If INCLUDE_ALL is set, all TLVs will be passed through no matter the tlv_type field.
   */
  'match_type'?: (_envoy_config_core_v3_ProxyProtocolPassThroughTLVs_PassTLVsMatchType | keyof typeof _envoy_config_core_v3_ProxyProtocolPassThroughTLVs_PassTLVsMatchType);
  /**
   * The TLV types that are applied based on match_type.
   * TLV type is defined as uint8_t in proxy protocol. See `the spec
   * <https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt>`_ for details.
   */
  'tlv_type'?: (number)[];
}

export interface ProxyProtocolPassThroughTLVs__Output {
  /**
   * The strategy to pass through TLVs. Default is INCLUDE_ALL.
   * If INCLUDE_ALL is set, all TLVs will be passed through no matter the tlv_type field.
   */
  'match_type': (keyof typeof _envoy_config_core_v3_ProxyProtocolPassThroughTLVs_PassTLVsMatchType);
  /**
   * The TLV types that are applied based on match_type.
   * TLV type is defined as uint8_t in proxy protocol. See `the spec
   * <https://www.haproxy.org/download/2.1/doc/proxy-protocol.txt>`_ for details.
   */
  'tlv_type': (number)[];
}
