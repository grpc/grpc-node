// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/tls.proto

import type { CommonTlsContext as _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext, CommonTlsContext__Output as _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/CommonTlsContext';
import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../../google/protobuf/UInt32Value';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../../google/protobuf/BoolValue';

/**
 * [#next-free-field: 6]
 */
export interface UpstreamTlsContext {
  /**
   * Common TLS context settings.
   * 
   * .. attention::
   * 
   * Server certificate verification is not enabled by default. Configure
   * :ref:`trusted_ca<envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.trusted_ca>` to enable
   * verification.
   */
  'common_tls_context'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext | null);
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
  'max_session_keys'?: (_google_protobuf_UInt32Value | null);
  /**
   * This field is used to control the enforcement, whereby the handshake will fail if the keyUsage extension
   * is present and incompatible with the TLS usage. Currently, the default value is false (i.e., enforcement off)
   * but it is expected to be changed to true by default in a future release.
   * ``ssl.was_key_usage_invalid`` in :ref:`listener metrics <config_listener_stats>` will be set for certificate
   * configurations that would fail if this option were set to true.
   */
  'enforce_rsa_key_usage'?: (_google_protobuf_BoolValue | null);
}

/**
 * [#next-free-field: 6]
 */
export interface UpstreamTlsContext__Output {
  /**
   * Common TLS context settings.
   * 
   * .. attention::
   * 
   * Server certificate verification is not enabled by default. Configure
   * :ref:`trusted_ca<envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.trusted_ca>` to enable
   * verification.
   */
  'common_tls_context': (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext__Output | null);
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
  'max_session_keys': (_google_protobuf_UInt32Value__Output | null);
  /**
   * This field is used to control the enforcement, whereby the handshake will fail if the keyUsage extension
   * is present and incompatible with the TLS usage. Currently, the default value is false (i.e., enforcement off)
   * but it is expected to be changed to true by default in a future release.
   * ``ssl.was_key_usage_invalid`` in :ref:`listener metrics <config_listener_stats>` will be set for certificate
   * configurations that would fail if this option were set to true.
   */
  'enforce_rsa_key_usage': (_google_protobuf_BoolValue__Output | null);
}
