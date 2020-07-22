// Original file: deps/envoy-api/envoy/api/v2/auth/tls.proto

import { TlsParameters as _envoy_api_v2_auth_TlsParameters, TlsParameters__Output as _envoy_api_v2_auth_TlsParameters__Output } from '../../../../envoy/api/v2/auth/TlsParameters';
import { TlsCertificate as _envoy_api_v2_auth_TlsCertificate, TlsCertificate__Output as _envoy_api_v2_auth_TlsCertificate__Output } from '../../../../envoy/api/v2/auth/TlsCertificate';
import { CertificateValidationContext as _envoy_api_v2_auth_CertificateValidationContext, CertificateValidationContext__Output as _envoy_api_v2_auth_CertificateValidationContext__Output } from '../../../../envoy/api/v2/auth/CertificateValidationContext';
import { SdsSecretConfig as _envoy_api_v2_auth_SdsSecretConfig, SdsSecretConfig__Output as _envoy_api_v2_auth_SdsSecretConfig__Output } from '../../../../envoy/api/v2/auth/SdsSecretConfig';

export interface _envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext {
  /**
   * How to validate peer certificates.
   */
  'default_validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext);
  /**
   * Config for fetching validation context via SDS API.
   */
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig);
}

export interface _envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext__Output {
  /**
   * How to validate peer certificates.
   */
  'default_validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext__Output);
  /**
   * Config for fetching validation context via SDS API.
   */
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig__Output);
}

/**
 * TLS context shared by both client and server TLS contexts.
 * [#next-free-field: 9]
 */
export interface CommonTlsContext {
  /**
   * TLS protocol versions, cipher suites etc.
   */
  'tls_params'?: (_envoy_api_v2_auth_TlsParameters);
  /**
   * :ref:`Multiple TLS certificates <arch_overview_ssl_cert_select>` can be associated with the
   * same context to allow both RSA and ECDSA certificates.
   * 
   * Only a single TLS certificate is supported in client contexts. In server contexts, the first
   * RSA certificate is used for clients that only support RSA and the first ECDSA certificate is
   * used for clients that support ECDSA.
   */
  'tls_certificates'?: (_envoy_api_v2_auth_TlsCertificate)[];
  /**
   * How to validate peer certificates.
   */
  'validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext);
  /**
   * Supplies the list of ALPN protocols that the listener should expose. In
   * practice this is likely to be set to one of two values (see the
   * :ref:`codec_type
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.codec_type>`
   * parameter in the HTTP connection manager for more information):
   * 
   * * "h2,http/1.1" If the listener is going to support both HTTP/2 and HTTP/1.1.
   * * "http/1.1" If the listener is only going to support HTTP/1.1.
   * 
   * There is no default for this parameter. If empty, Envoy will not expose ALPN.
   */
  'alpn_protocols'?: (string)[];
  /**
   * Configs for fetching TLS certificates via SDS API.
   */
  'tls_certificate_sds_secret_configs'?: (_envoy_api_v2_auth_SdsSecretConfig)[];
  /**
   * Config for fetching validation context via SDS API.
   */
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig);
  /**
   * Combined certificate validation context holds a default CertificateValidationContext
   * and SDS config. When SDS server returns dynamic CertificateValidationContext, both dynamic
   * and default CertificateValidationContext are merged into a new CertificateValidationContext
   * for validation. This merge is done by Message::MergeFrom(), so dynamic
   * CertificateValidationContext overwrites singular fields in default
   * CertificateValidationContext, and concatenates repeated fields to default
   * CertificateValidationContext, and logical OR is applied to boolean fields.
   */
  'combined_validation_context'?: (_envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext);
  'validation_context_type'?: "validation_context"|"validation_context_sds_secret_config"|"combined_validation_context";
}

/**
 * TLS context shared by both client and server TLS contexts.
 * [#next-free-field: 9]
 */
export interface CommonTlsContext__Output {
  /**
   * TLS protocol versions, cipher suites etc.
   */
  'tls_params'?: (_envoy_api_v2_auth_TlsParameters__Output);
  /**
   * :ref:`Multiple TLS certificates <arch_overview_ssl_cert_select>` can be associated with the
   * same context to allow both RSA and ECDSA certificates.
   * 
   * Only a single TLS certificate is supported in client contexts. In server contexts, the first
   * RSA certificate is used for clients that only support RSA and the first ECDSA certificate is
   * used for clients that support ECDSA.
   */
  'tls_certificates': (_envoy_api_v2_auth_TlsCertificate__Output)[];
  /**
   * How to validate peer certificates.
   */
  'validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext__Output);
  /**
   * Supplies the list of ALPN protocols that the listener should expose. In
   * practice this is likely to be set to one of two values (see the
   * :ref:`codec_type
   * <envoy_api_field_config.filter.network.http_connection_manager.v2.HttpConnectionManager.codec_type>`
   * parameter in the HTTP connection manager for more information):
   * 
   * * "h2,http/1.1" If the listener is going to support both HTTP/2 and HTTP/1.1.
   * * "http/1.1" If the listener is only going to support HTTP/1.1.
   * 
   * There is no default for this parameter. If empty, Envoy will not expose ALPN.
   */
  'alpn_protocols': (string)[];
  /**
   * Configs for fetching TLS certificates via SDS API.
   */
  'tls_certificate_sds_secret_configs': (_envoy_api_v2_auth_SdsSecretConfig__Output)[];
  /**
   * Config for fetching validation context via SDS API.
   */
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig__Output);
  /**
   * Combined certificate validation context holds a default CertificateValidationContext
   * and SDS config. When SDS server returns dynamic CertificateValidationContext, both dynamic
   * and default CertificateValidationContext are merged into a new CertificateValidationContext
   * for validation. This merge is done by Message::MergeFrom(), so dynamic
   * CertificateValidationContext overwrites singular fields in default
   * CertificateValidationContext, and concatenates repeated fields to default
   * CertificateValidationContext, and logical OR is applied to boolean fields.
   */
  'combined_validation_context'?: (_envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext__Output);
  'validation_context_type': "validation_context"|"validation_context_sds_secret_config"|"combined_validation_context";
}
