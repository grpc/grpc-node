// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../google/protobuf/Any';

/**
 * BoringSSL private key method configuration. The private key methods are used for external
 * (potentially asynchronous) signing and decryption operations. Some use cases for private key
 * methods would be TPM support and TLS acceleration.
 */
export interface PrivateKeyProvider {
  /**
   * Private key method provider name. The name must match a
   * supported private key method provider type.
   */
  'provider_name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * If the private key provider isn't available (eg. the required hardware capability doesn't existed),
   * Envoy will fallback to the BoringSSL default implementation when the ``fallback`` is true.
   * The default value is ``false``.
   */
  'fallback'?: (boolean);
  /**
   * Private key method provider specific configuration.
   */
  'config_type'?: "typed_config";
}

/**
 * BoringSSL private key method configuration. The private key methods are used for external
 * (potentially asynchronous) signing and decryption operations. Some use cases for private key
 * methods would be TPM support and TLS acceleration.
 */
export interface PrivateKeyProvider__Output {
  /**
   * Private key method provider name. The name must match a
   * supported private key method provider type.
   */
  'provider_name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * If the private key provider isn't available (eg. the required hardware capability doesn't existed),
   * Envoy will fallback to the BoringSSL default implementation when the ``fallback`` is true.
   * The default value is ``false``.
   */
  'fallback': (boolean);
  /**
   * Private key method provider specific configuration.
   */
  'config_type'?: "typed_config";
}
