// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/secret.proto

import type { TlsCertificate as _envoy_extensions_transport_sockets_tls_v3_TlsCertificate, TlsCertificate__Output as _envoy_extensions_transport_sockets_tls_v3_TlsCertificate__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/TlsCertificate';
import type { TlsSessionTicketKeys as _envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys, TlsSessionTicketKeys__Output as _envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/TlsSessionTicketKeys';
import type { CertificateValidationContext as _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext, CertificateValidationContext__Output as _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/CertificateValidationContext';
import type { GenericSecret as _envoy_extensions_transport_sockets_tls_v3_GenericSecret, GenericSecret__Output as _envoy_extensions_transport_sockets_tls_v3_GenericSecret__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/GenericSecret';

/**
 * [#next-free-field: 6]
 */
export interface Secret {
  /**
   * Name (FQDN, UUID, SPKI, SHA256, etc.) by which the secret can be uniquely referred to.
   */
  'name'?: (string);
  'tls_certificate'?: (_envoy_extensions_transport_sockets_tls_v3_TlsCertificate | null);
  'session_ticket_keys'?: (_envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys | null);
  'validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext | null);
  'generic_secret'?: (_envoy_extensions_transport_sockets_tls_v3_GenericSecret | null);
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
  'tls_certificate'?: (_envoy_extensions_transport_sockets_tls_v3_TlsCertificate__Output | null);
  'session_ticket_keys'?: (_envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys__Output | null);
  'validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext__Output | null);
  'generic_secret'?: (_envoy_extensions_transport_sockets_tls_v3_GenericSecret__Output | null);
  'type': "tls_certificate"|"session_ticket_keys"|"validation_context"|"generic_secret";
}
