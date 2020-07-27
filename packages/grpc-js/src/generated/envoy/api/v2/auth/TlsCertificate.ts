// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { PrivateKeyProvider as _envoy_api_v2_auth_PrivateKeyProvider, PrivateKeyProvider__Output as _envoy_api_v2_auth_PrivateKeyProvider__Output } from '../../../../envoy/api/v2/auth/PrivateKeyProvider';

/**
 * [#next-free-field: 7]
 */
export interface TlsCertificate {
  /**
   * The TLS certificate chain.
   */
  'certificate_chain'?: (_envoy_api_v2_core_DataSource);
  /**
   * The TLS private key.
   */
  'private_key'?: (_envoy_api_v2_core_DataSource);
  /**
   * The password to decrypt the TLS private key. If this field is not set, it is assumed that the
   * TLS private key is not password encrypted.
   */
  'password'?: (_envoy_api_v2_core_DataSource);
  /**
   * [#not-implemented-hide:]
   */
  'ocsp_staple'?: (_envoy_api_v2_core_DataSource);
  /**
   * [#not-implemented-hide:]
   */
  'signed_certificate_timestamp'?: (_envoy_api_v2_core_DataSource)[];
  /**
   * BoringSSL private key method provider. This is an alternative to :ref:`private_key
   * <envoy_api_field_auth.TlsCertificate.private_key>` field. This can't be
   * marked as ``oneof`` due to API compatibility reasons. Setting both :ref:`private_key
   * <envoy_api_field_auth.TlsCertificate.private_key>` and
   * :ref:`private_key_provider
   * <envoy_api_field_auth.TlsCertificate.private_key_provider>` fields will result in an
   * error.
   */
  'private_key_provider'?: (_envoy_api_v2_auth_PrivateKeyProvider);
}

/**
 * [#next-free-field: 7]
 */
export interface TlsCertificate__Output {
  /**
   * The TLS certificate chain.
   */
  'certificate_chain'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * The TLS private key.
   */
  'private_key'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * The password to decrypt the TLS private key. If this field is not set, it is assumed that the
   * TLS private key is not password encrypted.
   */
  'password'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * [#not-implemented-hide:]
   */
  'ocsp_staple'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * [#not-implemented-hide:]
   */
  'signed_certificate_timestamp': (_envoy_api_v2_core_DataSource__Output)[];
  /**
   * BoringSSL private key method provider. This is an alternative to :ref:`private_key
   * <envoy_api_field_auth.TlsCertificate.private_key>` field. This can't be
   * marked as ``oneof`` due to API compatibility reasons. Setting both :ref:`private_key
   * <envoy_api_field_auth.TlsCertificate.private_key>` and
   * :ref:`private_key_provider
   * <envoy_api_field_auth.TlsCertificate.private_key_provider>` fields will result in an
   * error.
   */
  'private_key_provider'?: (_envoy_api_v2_auth_PrivateKeyProvider__Output);
}
