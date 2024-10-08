// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto


// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

export const _envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol = {
  /**
   * Envoy will choose the optimal TLS version.
   */
  TLS_AUTO: 'TLS_AUTO',
  /**
   * TLS 1.0
   */
  TLSv1_0: 'TLSv1_0',
  /**
   * TLS 1.1
   */
  TLSv1_1: 'TLSv1_1',
  /**
   * TLS 1.2
   */
  TLSv1_2: 'TLSv1_2',
  /**
   * TLS 1.3
   */
  TLSv1_3: 'TLSv1_3',
} as const;

export type _envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol =
  /**
   * Envoy will choose the optimal TLS version.
   */
  | 'TLS_AUTO'
  | 0
  /**
   * TLS 1.0
   */
  | 'TLSv1_0'
  | 1
  /**
   * TLS 1.1
   */
  | 'TLSv1_1'
  | 2
  /**
   * TLS 1.2
   */
  | 'TLSv1_2'
  | 3
  /**
   * TLS 1.3
   */
  | 'TLSv1_3'
  | 4

export type _envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol__Output = typeof _envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol[keyof typeof _envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol]

/**
 * [#next-free-field: 6]
 */
export interface TlsParameters {
  /**
   * Minimum TLS protocol version. By default, it's ``TLSv1_2`` for both clients and servers.
   * 
   * TLS protocol versions below TLSv1_2 require setting compatible ciphers with the
   * ``cipher_suites`` setting as the default ciphers no longer include compatible ciphers.
   * 
   * .. attention::
   * 
   * Using TLS protocol versions below TLSv1_2 has serious security considerations and risks.
   */
  'tls_minimum_protocol_version'?: (_envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol);
  /**
   * Maximum TLS protocol version. By default, it's ``TLSv1_2`` for clients and ``TLSv1_3`` for
   * servers.
   */
  'tls_maximum_protocol_version'?: (_envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol);
  /**
   * If specified, the TLS listener will only support the specified `cipher list
   * <https://commondatastorage.googleapis.com/chromium-boringssl-docs/ssl.h.html#Cipher-suite-configuration>`_
   * when negotiating TLS 1.0-1.2 (this setting has no effect when negotiating TLS 1.3).
   * 
   * If not specified, a default list will be used. Defaults are different for server (downstream) and
   * client (upstream) TLS configurations.
   * Defaults will change over time in response to security considerations; If you care, configure
   * it instead of using the default.
   * 
   * In non-FIPS builds, the default server cipher list is:
   * 
   * .. code-block:: none
   * 
   * [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305]
   * [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305]
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default server cipher list is:
   * 
   * .. code-block:: none
   * 
   * ECDHE-ECDSA-AES128-GCM-SHA256
   * ECDHE-RSA-AES128-GCM-SHA256
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * 
   * In non-FIPS builds, the default client cipher list is:
   * 
   * .. code-block:: none
   * 
   * [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305]
   * [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305]
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default client cipher list is:
   * 
   * .. code-block:: none
   * 
   * ECDHE-ECDSA-AES128-GCM-SHA256
   * ECDHE-RSA-AES128-GCM-SHA256
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   */
  'cipher_suites'?: (string)[];
  /**
   * If specified, the TLS connection will only support the specified ECDH
   * curves. If not specified, the default curves will be used.
   * 
   * In non-FIPS builds, the default curves are:
   * 
   * .. code-block:: none
   * 
   * X25519
   * P-256
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default curve is:
   * 
   * .. code-block:: none
   * 
   * P-256
   */
  'ecdh_curves'?: (string)[];
  /**
   * If specified, the TLS connection will only support the specified signature algorithms.
   * The list is ordered by preference.
   * If not specified, the default signature algorithms defined by BoringSSL will be used.
   * 
   * Default signature algorithms selected by BoringSSL (may be out of date):
   * 
   * .. code-block:: none
   * 
   * ecdsa_secp256r1_sha256
   * rsa_pss_rsae_sha256
   * rsa_pkcs1_sha256
   * ecdsa_secp384r1_sha384
   * rsa_pss_rsae_sha384
   * rsa_pkcs1_sha384
   * rsa_pss_rsae_sha512
   * rsa_pkcs1_sha512
   * rsa_pkcs1_sha1
   * 
   * Signature algorithms supported by BoringSSL (may be out of date):
   * 
   * .. code-block:: none
   * 
   * rsa_pkcs1_sha256
   * rsa_pkcs1_sha384
   * rsa_pkcs1_sha512
   * ecdsa_secp256r1_sha256
   * ecdsa_secp384r1_sha384
   * ecdsa_secp521r1_sha512
   * rsa_pss_rsae_sha256
   * rsa_pss_rsae_sha384
   * rsa_pss_rsae_sha512
   * ed25519
   * rsa_pkcs1_sha1
   * ecdsa_sha1
   */
  'signature_algorithms'?: (string)[];
}

/**
 * [#next-free-field: 6]
 */
export interface TlsParameters__Output {
  /**
   * Minimum TLS protocol version. By default, it's ``TLSv1_2`` for both clients and servers.
   * 
   * TLS protocol versions below TLSv1_2 require setting compatible ciphers with the
   * ``cipher_suites`` setting as the default ciphers no longer include compatible ciphers.
   * 
   * .. attention::
   * 
   * Using TLS protocol versions below TLSv1_2 has serious security considerations and risks.
   */
  'tls_minimum_protocol_version': (_envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol__Output);
  /**
   * Maximum TLS protocol version. By default, it's ``TLSv1_2`` for clients and ``TLSv1_3`` for
   * servers.
   */
  'tls_maximum_protocol_version': (_envoy_extensions_transport_sockets_tls_v3_TlsParameters_TlsProtocol__Output);
  /**
   * If specified, the TLS listener will only support the specified `cipher list
   * <https://commondatastorage.googleapis.com/chromium-boringssl-docs/ssl.h.html#Cipher-suite-configuration>`_
   * when negotiating TLS 1.0-1.2 (this setting has no effect when negotiating TLS 1.3).
   * 
   * If not specified, a default list will be used. Defaults are different for server (downstream) and
   * client (upstream) TLS configurations.
   * Defaults will change over time in response to security considerations; If you care, configure
   * it instead of using the default.
   * 
   * In non-FIPS builds, the default server cipher list is:
   * 
   * .. code-block:: none
   * 
   * [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305]
   * [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305]
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default server cipher list is:
   * 
   * .. code-block:: none
   * 
   * ECDHE-ECDSA-AES128-GCM-SHA256
   * ECDHE-RSA-AES128-GCM-SHA256
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * 
   * In non-FIPS builds, the default client cipher list is:
   * 
   * .. code-block:: none
   * 
   * [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305]
   * [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305]
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default client cipher list is:
   * 
   * .. code-block:: none
   * 
   * ECDHE-ECDSA-AES128-GCM-SHA256
   * ECDHE-RSA-AES128-GCM-SHA256
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   */
  'cipher_suites': (string)[];
  /**
   * If specified, the TLS connection will only support the specified ECDH
   * curves. If not specified, the default curves will be used.
   * 
   * In non-FIPS builds, the default curves are:
   * 
   * .. code-block:: none
   * 
   * X25519
   * P-256
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default curve is:
   * 
   * .. code-block:: none
   * 
   * P-256
   */
  'ecdh_curves': (string)[];
  /**
   * If specified, the TLS connection will only support the specified signature algorithms.
   * The list is ordered by preference.
   * If not specified, the default signature algorithms defined by BoringSSL will be used.
   * 
   * Default signature algorithms selected by BoringSSL (may be out of date):
   * 
   * .. code-block:: none
   * 
   * ecdsa_secp256r1_sha256
   * rsa_pss_rsae_sha256
   * rsa_pkcs1_sha256
   * ecdsa_secp384r1_sha384
   * rsa_pss_rsae_sha384
   * rsa_pkcs1_sha384
   * rsa_pss_rsae_sha512
   * rsa_pkcs1_sha512
   * rsa_pkcs1_sha1
   * 
   * Signature algorithms supported by BoringSSL (may be out of date):
   * 
   * .. code-block:: none
   * 
   * rsa_pkcs1_sha256
   * rsa_pkcs1_sha384
   * rsa_pkcs1_sha512
   * ecdsa_secp256r1_sha256
   * ecdsa_secp384r1_sha384
   * ecdsa_secp521r1_sha512
   * rsa_pss_rsae_sha256
   * rsa_pss_rsae_sha384
   * rsa_pss_rsae_sha512
   * ed25519
   * rsa_pkcs1_sha1
   * ecdsa_sha1
   */
  'signature_algorithms': (string)[];
}
