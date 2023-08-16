// Original file: deps/envoy-api/envoy/config/core/v3/resolver.proto

import type { Address as _envoy_config_core_v3_Address, Address__Output as _envoy_config_core_v3_Address__Output } from '../../../../envoy/config/core/v3/Address';
import type { DnsResolverOptions as _envoy_config_core_v3_DnsResolverOptions, DnsResolverOptions__Output as _envoy_config_core_v3_DnsResolverOptions__Output } from '../../../../envoy/config/core/v3/DnsResolverOptions';

/**
 * DNS resolution configuration which includes the underlying dns resolver addresses and options.
 */
export interface DnsResolutionConfig {
  /**
   * A list of dns resolver addresses. If specified, the DNS client library will perform resolution
   * via the underlying DNS resolvers. Otherwise, the default system resolvers
   * (e.g., /etc/resolv.conf) will be used.
   */
  'resolvers'?: (_envoy_config_core_v3_Address)[];
  /**
   * Configuration of DNS resolver option flags which control the behavior of the DNS resolver.
   */
  'dns_resolver_options'?: (_envoy_config_core_v3_DnsResolverOptions | null);
}

/**
 * DNS resolution configuration which includes the underlying dns resolver addresses and options.
 */
export interface DnsResolutionConfig__Output {
  /**
   * A list of dns resolver addresses. If specified, the DNS client library will perform resolution
   * via the underlying DNS resolvers. Otherwise, the default system resolvers
   * (e.g., /etc/resolv.conf) will be used.
   */
  'resolvers': (_envoy_config_core_v3_Address__Output)[];
  /**
   * Configuration of DNS resolver option flags which control the behavior of the DNS resolver.
   */
  'dns_resolver_options': (_envoy_config_core_v3_DnsResolverOptions__Output | null);
}
