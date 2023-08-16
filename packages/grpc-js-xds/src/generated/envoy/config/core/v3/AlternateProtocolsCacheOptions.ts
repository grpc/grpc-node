// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Allows pre-populating the cache with HTTP/3 alternate protocols entries with a 7 day lifetime.
 * This will cause Envoy to attempt HTTP/3 to those upstreams, even if the upstreams have not
 * advertised HTTP/3 support. These entries will be overwritten by alt-svc
 * response headers or cached values.
 * As with regular cached entries, if the origin response would result in clearing an existing
 * alternate protocol cache entry, pre-populated entries will also be cleared.
 * Adding a cache entry with hostname=foo.com port=123 is the equivalent of getting
 * response headers
 * alt-svc: h3=:"123"; ma=86400" in a response to a request to foo.com:123
 */
export interface _envoy_config_core_v3_AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry {
  /**
   * The host name for the alternate protocol entry.
   */
  'hostname'?: (string);
  /**
   * The port for the alternate protocol entry.
   */
  'port'?: (number);
}

/**
 * Allows pre-populating the cache with HTTP/3 alternate protocols entries with a 7 day lifetime.
 * This will cause Envoy to attempt HTTP/3 to those upstreams, even if the upstreams have not
 * advertised HTTP/3 support. These entries will be overwritten by alt-svc
 * response headers or cached values.
 * As with regular cached entries, if the origin response would result in clearing an existing
 * alternate protocol cache entry, pre-populated entries will also be cleared.
 * Adding a cache entry with hostname=foo.com port=123 is the equivalent of getting
 * response headers
 * alt-svc: h3=:"123"; ma=86400" in a response to a request to foo.com:123
 */
export interface _envoy_config_core_v3_AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry__Output {
  /**
   * The host name for the alternate protocol entry.
   */
  'hostname': (string);
  /**
   * The port for the alternate protocol entry.
   */
  'port': (number);
}

/**
 * Configures the alternate protocols cache which tracks alternate protocols that can be used to
 * make an HTTP connection to an origin server. See https://tools.ietf.org/html/rfc7838 for
 * HTTP Alternative Services and https://datatracker.ietf.org/doc/html/draft-ietf-dnsop-svcb-https-04
 * for the "HTTPS" DNS resource record.
 * [#next-free-field: 6]
 */
export interface AlternateProtocolsCacheOptions {
  /**
   * The name of the cache. Multiple named caches allow independent alternate protocols cache
   * configurations to operate within a single Envoy process using different configurations. All
   * alternate protocols cache options with the same name *must* be equal in all fields when
   * referenced from different configuration components. Configuration will fail to load if this is
   * not the case.
   */
  'name'?: (string);
  /**
   * The maximum number of entries that the cache will hold. If not specified defaults to 1024.
   * 
   * .. note:
   * 
   * The implementation is approximate and enforced independently on each worker thread, thus
   * it is possible for the maximum entries in the cache to go slightly above the configured
   * value depending on timing. This is similar to how other circuit breakers work.
   */
  'max_entries'?: (_google_protobuf_UInt32Value | null);
  /**
   * Allows configuring a persistent
   * :ref:`key value store <envoy_v3_api_msg_config.common.key_value.v3.KeyValueStoreConfig>` to flush
   * alternate protocols entries to disk.
   * This function is currently only supported if concurrency is 1
   * Cached entries will take precedence over pre-populated entries below.
   */
  'key_value_store_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Allows pre-populating the cache with entries, as described above.
   */
  'prepopulated_entries'?: (_envoy_config_core_v3_AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry)[];
  /**
   * Optional list of hostnames suffixes for which Alt-Svc entries can be shared. For example, if
   * this list contained the value ``.c.example.com``, then an Alt-Svc entry for ``foo.c.example.com``
   * could be shared with ``bar.c.example.com`` but would not be shared with ``baz.example.com``. On
   * the other hand, if the list contained the value ``.example.com`` then all three hosts could share
   * Alt-Svc entries. Each entry must start with ``.``. If a hostname matches multiple suffixes, the
   * first listed suffix will be used.
   * 
   * Since lookup in this list is O(n), it is recommended that the number of suffixes be limited.
   * [#not-implemented-hide:]
   */
  'canonical_suffixes'?: (string)[];
}

/**
 * Configures the alternate protocols cache which tracks alternate protocols that can be used to
 * make an HTTP connection to an origin server. See https://tools.ietf.org/html/rfc7838 for
 * HTTP Alternative Services and https://datatracker.ietf.org/doc/html/draft-ietf-dnsop-svcb-https-04
 * for the "HTTPS" DNS resource record.
 * [#next-free-field: 6]
 */
export interface AlternateProtocolsCacheOptions__Output {
  /**
   * The name of the cache. Multiple named caches allow independent alternate protocols cache
   * configurations to operate within a single Envoy process using different configurations. All
   * alternate protocols cache options with the same name *must* be equal in all fields when
   * referenced from different configuration components. Configuration will fail to load if this is
   * not the case.
   */
  'name': (string);
  /**
   * The maximum number of entries that the cache will hold. If not specified defaults to 1024.
   * 
   * .. note:
   * 
   * The implementation is approximate and enforced independently on each worker thread, thus
   * it is possible for the maximum entries in the cache to go slightly above the configured
   * value depending on timing. This is similar to how other circuit breakers work.
   */
  'max_entries': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Allows configuring a persistent
   * :ref:`key value store <envoy_v3_api_msg_config.common.key_value.v3.KeyValueStoreConfig>` to flush
   * alternate protocols entries to disk.
   * This function is currently only supported if concurrency is 1
   * Cached entries will take precedence over pre-populated entries below.
   */
  'key_value_store_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Allows pre-populating the cache with entries, as described above.
   */
  'prepopulated_entries': (_envoy_config_core_v3_AlternateProtocolsCacheOptions_AlternateProtocolsCacheEntry__Output)[];
  /**
   * Optional list of hostnames suffixes for which Alt-Svc entries can be shared. For example, if
   * this list contained the value ``.c.example.com``, then an Alt-Svc entry for ``foo.c.example.com``
   * could be shared with ``bar.c.example.com`` but would not be shared with ``baz.example.com``. On
   * the other hand, if the list contained the value ``.example.com`` then all three hosts could share
   * Alt-Svc entries. Each entry must start with ``.``. If a hostname matches multiple suffixes, the
   * first listed suffix will be used.
   * 
   * Since lookup in this list is O(n), it is recommended that the number of suffixes be limited.
   * [#not-implemented-hide:]
   */
  'canonical_suffixes': (string)[];
}
