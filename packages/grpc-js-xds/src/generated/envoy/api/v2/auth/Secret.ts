// Original file: deps/envoy-api/envoy/api/v2/auth/secret.proto

import { TlsCertificate as _envoy_api_v2_auth_TlsCertificate, TlsCertificate__Output as _envoy_api_v2_auth_TlsCertificate__Output } from '../../../../envoy/api/v2/auth/TlsCertificate';
import { TlsSessionTicketKeys as _envoy_api_v2_auth_TlsSessionTicketKeys, TlsSessionTicketKeys__Output as _envoy_api_v2_auth_TlsSessionTicketKeys__Output } from '../../../../envoy/api/v2/auth/TlsSessionTicketKeys';
import { CertificateValidationContext as _envoy_api_v2_auth_CertificateValidationContext, CertificateValidationContext__Output as _envoy_api_v2_auth_CertificateValidationContext__Output } from '../../../../envoy/api/v2/auth/CertificateValidationContext';
import { GenericSecret as _envoy_api_v2_auth_GenericSecret, GenericSecret__Output as _envoy_api_v2_auth_GenericSecret__Output } from '../../../../envoy/api/v2/auth/GenericSecret';

/**
 * [#next-free-field: 6]
 */
export interface Secret {
  /**
   * Name (FQDN, UUID, SPKI, SHA256, etc.) by which the secret can be uniquely referred to.
   */
  'name'?: (string);
  'tls_certificate'?: (_envoy_api_v2_auth_TlsCertificate);
  'session_ticket_keys'?: (_envoy_api_v2_auth_TlsSessionTicketKeys);
  'validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext);
  'generic_secret'?: (_envoy_api_v2_auth_GenericSecret);
  'type'?: "tls_certificate"|"session_ticket_keys"|"validation_context"|"generic_secret";
}

/**
 * [#next-free-field: 6]
 */
export interface Secret__Output {
  /**
   * Name (FQDN, UUID, SPKI, SHA256, etc.) by which the secret can be uniquely referred to.
   */
  'name': (string);
  'tls_certificate'?: (_envoy_api_v2_auth_TlsCertificate__Output);
  'session_ticket_keys'?: (_envoy_api_v2_auth_TlsSessionTicketKeys__Output);
  'validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext__Output);
  'generic_secret'?: (_envoy_api_v2_auth_GenericSecret__Output);
  'type': "tls_certificate"|"session_ticket_keys"|"validation_context"|"generic_secret";
}
