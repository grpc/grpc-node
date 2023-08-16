// Original file: deps/envoy-api/envoy/config/core/v3/resolver.proto


/**
 * Configuration of DNS resolver option flags which control the behavior of the DNS resolver.
 */
export interface DnsResolverOptions {
  /**
   * Use TCP for all DNS queries instead of the default protocol UDP.
   */
  'use_tcp_for_dns_lookups'?: (boolean);
  /**
   * Do not use the default search domains; only query hostnames as-is or as aliases.
   */
  'no_default_search_domain'?: (boolean);
}

/**
 * Configuration of DNS resolver option flags which control the behavior of the DNS resolver.
 */
export interface DnsResolverOptions__Output {
  /**
   * Use TCP for all DNS queries instead of the default protocol UDP.
   */
  'use_tcp_for_dns_lookups': (boolean);
  /**
   * Do not use the default search domains; only query hostnames as-is or as aliases.
   */
  'no_default_search_domain': (boolean);
}
