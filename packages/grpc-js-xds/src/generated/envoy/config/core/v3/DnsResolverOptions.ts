// Original file: deps/envoy-api/envoy/config/core/v3/resolver.proto


/**
 * Configuration of DNS resolver option flags which control the behavior of the DNS resolver.
 */
export interface DnsResolverOptions {
  /**
   * Use TCP for all DNS queries instead of the default protocol UDP.
   * Setting this value causes failure if the
   * ``envoy.restart_features.use_apple_api_for_dns_lookups`` runtime value is true during
   * server startup. Apple's API only uses UDP for DNS resolution.
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
   * Setting this value causes failure if the
   * ``envoy.restart_features.use_apple_api_for_dns_lookups`` runtime value is true during
   * server startup. Apple's API only uses UDP for DNS resolution.
   */
  'use_tcp_for_dns_lookups': (boolean);
  /**
   * Do not use the default search domains; only query hostnames as-is or as aliases.
   */
  'no_default_search_domain': (boolean);
}
