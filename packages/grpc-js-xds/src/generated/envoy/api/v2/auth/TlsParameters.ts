// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto


// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

export enum _envoy_api_v2_auth_TlsParameters_TlsProtocol {
  /**
   * Envoy will choose the optimal TLS version.
   */
  TLS_AUTO = 0,
  /**
   * TLS 1.0
   */
  TLSv1_0 = 1,
  /**
   * TLS 1.1
   */
  TLSv1_1 = 2,
  /**
   * TLS 1.2
   */
  TLSv1_2 = 3,
  /**
   * TLS 1.3
   */
  TLSv1_3 = 4,
}

export interface TlsParameters {
  /**
   * Minimum TLS protocol version. By default, it's ``TLSv1_2`` for clients and ``TLSv1_0`` for
   * servers.
   */
  'tls_minimum_protocol_version'?: (_envoy_api_v2_auth_TlsParameters_TlsProtocol | keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  /**
   * Maximum TLS protocol version. By default, it's ``TLSv1_3`` for servers in non-FIPS builds, and
   * ``TLSv1_2`` for clients and for servers using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`.
   */
  'tls_maximum_protocol_version'?: (_envoy_api_v2_auth_TlsParameters_TlsProtocol | keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  /**
   * If specified, the TLS listener will only support the specified `cipher list
   * <https://commondatastorage.googleapis.com/chromium-boringssl-docs/ssl.h.html#Cipher-suite-configuration>`_
   * when negotiating TLS 1.0-1.2 (this setting has no effect when negotiating TLS 1.3). If not
   * specified, the default list will be used.
   * 
   * In non-FIPS builds, the default cipher list is:
   * 
   * .. code-block:: none
   * 
   * [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305]
   * [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305]
   * ECDHE-ECDSA-AES128-SHA
   * ECDHE-RSA-AES128-SHA
   * AES128-GCM-SHA256
   * AES128-SHA
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * ECDHE-ECDSA-AES256-SHA
   * ECDHE-RSA-AES256-SHA
   * AES256-GCM-SHA384
   * AES256-SHA
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default cipher list is:
   * 
   * .. code-block:: none
   * 
   * ECDHE-ECDSA-AES128-GCM-SHA256
   * ECDHE-RSA-AES128-GCM-SHA256
   * ECDHE-ECDSA-AES128-SHA
   * ECDHE-RSA-AES128-SHA
   * AES128-GCM-SHA256
   * AES128-SHA
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * ECDHE-ECDSA-AES256-SHA
   * ECDHE-RSA-AES256-SHA
   * AES256-GCM-SHA384
   * AES256-SHA
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
}

export interface TlsParameters__Output {
  /**
   * Minimum TLS protocol version. By default, it's ``TLSv1_2`` for clients and ``TLSv1_0`` for
   * servers.
   */
  'tls_minimum_protocol_version': (keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  /**
   * Maximum TLS protocol version. By default, it's ``TLSv1_3`` for servers in non-FIPS builds, and
   * ``TLSv1_2`` for clients and for servers using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`.
   */
  'tls_maximum_protocol_version': (keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  /**
   * If specified, the TLS listener will only support the specified `cipher list
   * <https://commondatastorage.googleapis.com/chromium-boringssl-docs/ssl.h.html#Cipher-suite-configuration>`_
   * when negotiating TLS 1.0-1.2 (this setting has no effect when negotiating TLS 1.3). If not
   * specified, the default list will be used.
   * 
   * In non-FIPS builds, the default cipher list is:
   * 
   * .. code-block:: none
   * 
   * [ECDHE-ECDSA-AES128-GCM-SHA256|ECDHE-ECDSA-CHACHA20-POLY1305]
   * [ECDHE-RSA-AES128-GCM-SHA256|ECDHE-RSA-CHACHA20-POLY1305]
   * ECDHE-ECDSA-AES128-SHA
   * ECDHE-RSA-AES128-SHA
   * AES128-GCM-SHA256
   * AES128-SHA
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * ECDHE-ECDSA-AES256-SHA
   * ECDHE-RSA-AES256-SHA
   * AES256-GCM-SHA384
   * AES256-SHA
   * 
   * In builds using :ref:`BoringSSL FIPS <arch_overview_ssl_fips>`, the default cipher list is:
   * 
   * .. code-block:: none
   * 
   * ECDHE-ECDSA-AES128-GCM-SHA256
   * ECDHE-RSA-AES128-GCM-SHA256
   * ECDHE-ECDSA-AES128-SHA
   * ECDHE-RSA-AES128-SHA
   * AES128-GCM-SHA256
   * AES128-SHA
   * ECDHE-ECDSA-AES256-GCM-SHA384
   * ECDHE-RSA-AES256-GCM-SHA384
   * ECDHE-ECDSA-AES256-SHA
   * ECDHE-RSA-AES256-SHA
   * AES256-GCM-SHA384
   * AES256-SHA
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
}
