// Original file: deps/envoy-api/envoy/api/v2/auth/tls.proto

import { CommonTlsContext as _envoy_api_v2_auth_CommonTlsContext, CommonTlsContext__Output as _envoy_api_v2_auth_CommonTlsContext__Output } from '../../../../envoy/api/v2/auth/CommonTlsContext';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface UpstreamTlsContext {
  /**
   * Common TLS context settings.
   * 
   * .. attention::
   * 
   * Server certificate verification is not enabled by default. Configure
   * :ref:`trusted_ca<envoy_api_field_auth.CertificateValidationContext.trusted_ca>` to enable
   * verification.
   */
  'common_tls_context'?: (_envoy_api_v2_auth_CommonTlsContext);
  /**
   * SNI string to use when creating TLS backend connections.
   */
  'sni'?: (string);
  /**
   * If true, server-initiated TLS renegotiation will be allowed.
   * 
   * .. attention::
   * 
   * TLS renegotiation is considered insecure and shouldn't be used unless absolutely necessary.
   */
  'allow_renegotiation'?: (boolean);
  /**
   * Maximum number of session keys (Pre-Shared Keys for TLSv1.3+, Session IDs and Session Tickets
   * for TLSv1.2 and older) to store for the purpose of session resumption.
   * 
   * Defaults to 1, setting this to 0 disables session resumption.
   */
  'max_session_keys'?: (_google_protobuf_UInt32Value);
}

export interface UpstreamTlsContext__Output {
  /**
   * Common TLS context settings.
   * 
   * .. attention::
   * 
   * Server certificate verification is not enabled by default. Configure
   * :ref:`trusted_ca<envoy_api_field_auth.CertificateValidationContext.trusted_ca>` to enable
   * verification.
   */
  'common_tls_context'?: (_envoy_api_v2_auth_CommonTlsContext__Output);
  /**
   * SNI string to use when creating TLS backend connections.
   */
  'sni': (string);
  /**
   * If true, server-initiated TLS renegotiation will be allowed.
   * 
   * .. attention::
   * 
   * TLS renegotiation is considered insecure and shouldn't be used unless absolutely necessary.
   */
  'allow_renegotiation': (boolean);
  /**
   * Maximum number of session keys (Pre-Shared Keys for TLSv1.3+, Session IDs and Session Tickets
   * for TLSv1.2 and older) to store for the purpose of session resumption.
   * 
   * Defaults to 1, setting this to 0 disables session resumption.
   */
  'max_session_keys'?: (_google_protobuf_UInt32Value__Output);
}
