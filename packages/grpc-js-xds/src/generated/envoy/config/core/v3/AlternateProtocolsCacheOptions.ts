// Original file: deps/envoy-api/envoy/config/core/v3/protocol.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Configures the alternate protocols cache which tracks alternate protocols that can be used to
 * make an HTTP connection to an origin server. See https://tools.ietf.org/html/rfc7838 for
 * HTTP Alternative Services and https://datatracker.ietf.org/doc/html/draft-ietf-dnsop-svcb-https-04
 * for the "HTTPS" DNS resource record.
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
   */
  'key_value_store_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
}

/**
 * Configures the alternate protocols cache which tracks alternate protocols that can be used to
 * make an HTTP connection to an origin server. See https://tools.ietf.org/html/rfc7838 for
 * HTTP Alternative Services and https://datatracker.ietf.org/doc/html/draft-ietf-dnsop-svcb-https-04
 * for the "HTTPS" DNS resource record.
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
   */
  'key_value_store_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
}
