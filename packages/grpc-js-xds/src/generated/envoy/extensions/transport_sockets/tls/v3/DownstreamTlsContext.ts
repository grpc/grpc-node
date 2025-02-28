// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/tls.proto

import type { CommonTlsContext as _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext, CommonTlsContext__Output as _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/CommonTlsContext';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../../google/protobuf/BoolValue';
import type { TlsSessionTicketKeys as _envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys, TlsSessionTicketKeys__Output as _envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/TlsSessionTicketKeys';
import type { SdsSecretConfig as _envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig, SdsSecretConfig__Output as _envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/SdsSecretConfig';
import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../../google/protobuf/Duration';

// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/tls.proto

export const _envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy = {
  /**
   * OCSP responses are optional. If an OCSP response is absent
   * or expired, the associated certificate will be used for
   * connections without an OCSP staple.
   */
  LENIENT_STAPLING: 'LENIENT_STAPLING',
  /**
   * OCSP responses are optional. If an OCSP response is absent,
   * the associated certificate will be used without an
   * OCSP staple. If a response is provided but is expired,
   * the associated certificate will not be used for
   * subsequent connections. If no suitable certificate is found,
   * the connection is rejected.
   */
  STRICT_STAPLING: 'STRICT_STAPLING',
  /**
   * OCSP responses are required. Configuration will fail if
   * a certificate is provided without an OCSP response. If a
   * response expires, the associated certificate will not be
   * used connections. If no suitable certificate is found, the
   * connection is rejected.
   */
  MUST_STAPLE: 'MUST_STAPLE',
} as const;

export type _envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy =
  /**
   * OCSP responses are optional. If an OCSP response is absent
   * or expired, the associated certificate will be used for
   * connections without an OCSP staple.
   */
  | 'LENIENT_STAPLING'
  | 0
  /**
   * OCSP responses are optional. If an OCSP response is absent,
   * the associated certificate will be used without an
   * OCSP staple. If a response is provided but is expired,
   * the associated certificate will not be used for
   * subsequent connections. If no suitable certificate is found,
   * the connection is rejected.
   */
  | 'STRICT_STAPLING'
  | 1
  /**
   * OCSP responses are required. Configuration will fail if
   * a certificate is provided without an OCSP response. If a
   * response expires, the associated certificate will not be
   * used connections. If no suitable certificate is found, the
   * connection is rejected.
   */
  | 'MUST_STAPLE'
  | 2

export type _envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy__Output = typeof _envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy[keyof typeof _envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy]

/**
 * [#next-free-field: 11]
 */
export interface DownstreamTlsContext {
  /**
   * Common TLS context settings.
   */
  'common_tls_context'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext | null);
  /**
   * If specified, Envoy will reject connections without a valid client
   * certificate.
   */
  'require_client_certificate'?: (_google_protobuf_BoolValue | null);
  /**
   * If specified, Envoy will reject connections without a valid and matching SNI.
   * [#not-implemented-hide:]
   */
  'require_sni'?: (_google_protobuf_BoolValue | null);
  /**
   * TLS session ticket key settings.
   */
  'session_ticket_keys'?: (_envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys | null);
  /**
   * Config for fetching TLS session ticket keys via SDS API.
   */
  'session_ticket_keys_sds_secret_config'?: (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig | null);
  /**
   * If specified, ``session_timeout`` will change the maximum lifetime (in seconds) of the TLS session.
   * Currently this value is used as a hint for the `TLS session ticket lifetime (for TLSv1.2) <https://tools.ietf.org/html/rfc5077#section-5.6>`_.
   * Only seconds can be specified (fractional seconds are ignored).
   */
  'session_timeout'?: (_google_protobuf_Duration | null);
  /**
   * Config for controlling stateless TLS session resumption: setting this to true will cause the TLS
   * server to not issue TLS session tickets for the purposes of stateless TLS session resumption.
   * If set to false, the TLS server will issue TLS session tickets and encrypt/decrypt them using
   * the keys specified through either :ref:`session_ticket_keys <envoy_v3_api_field_extensions.transport_sockets.tls.v3.DownstreamTlsContext.session_ticket_keys>`
   * or :ref:`session_ticket_keys_sds_secret_config <envoy_v3_api_field_extensions.transport_sockets.tls.v3.DownstreamTlsContext.session_ticket_keys_sds_secret_config>`.
   * If this config is set to false and no keys are explicitly configured, the TLS server will issue
   * TLS session tickets and encrypt/decrypt them using an internally-generated and managed key, with the
   * implication that sessions cannot be resumed across hot restarts or on different hosts.
   */
  'disable_stateless_session_resumption'?: (boolean);
  /**
   * Config for whether to use certificates if they do not have
   * an accompanying OCSP response or if the response expires at runtime.
   * Defaults to LENIENT_STAPLING
   */
  'ocsp_staple_policy'?: (_envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy);
  /**
   * Multiple certificates are allowed in Downstream transport socket to serve different SNI.
   * If the client provides SNI but no such cert matched, it will decide to full scan certificates or not based on this config.
   * Defaults to false. See more details in :ref:`Multiple TLS certificates <arch_overview_ssl_cert_select>`.
   */
  'full_scan_certs_on_sni_mismatch'?: (_google_protobuf_BoolValue | null);
  /**
   * If set to true, the TLS server will not maintain a session cache of TLS sessions. (This is
   * relevant only for TLSv1.2 and earlier.)
   */
  'disable_stateful_session_resumption'?: (boolean);
  'session_ticket_keys_type'?: "session_ticket_keys"|"session_ticket_keys_sds_secret_config"|"disable_stateless_session_resumption";
}

/**
 * [#next-free-field: 11]
 */
export interface DownstreamTlsContext__Output {
  /**
   * Common TLS context settings.
   */
  'common_tls_context': (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext__Output | null);
  /**
   * If specified, Envoy will reject connections without a valid client
   * certificate.
   */
  'require_client_certificate': (_google_protobuf_BoolValue__Output | null);
  /**
   * If specified, Envoy will reject connections without a valid and matching SNI.
   * [#not-implemented-hide:]
   */
  'require_sni': (_google_protobuf_BoolValue__Output | null);
  /**
   * TLS session ticket key settings.
   */
  'session_ticket_keys'?: (_envoy_extensions_transport_sockets_tls_v3_TlsSessionTicketKeys__Output | null);
  /**
   * Config for fetching TLS session ticket keys via SDS API.
   */
  'session_ticket_keys_sds_secret_config'?: (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig__Output | null);
  /**
   * If specified, ``session_timeout`` will change the maximum lifetime (in seconds) of the TLS session.
   * Currently this value is used as a hint for the `TLS session ticket lifetime (for TLSv1.2) <https://tools.ietf.org/html/rfc5077#section-5.6>`_.
   * Only seconds can be specified (fractional seconds are ignored).
   */
  'session_timeout': (_google_protobuf_Duration__Output | null);
  /**
   * Config for controlling stateless TLS session resumption: setting this to true will cause the TLS
   * server to not issue TLS session tickets for the purposes of stateless TLS session resumption.
   * If set to false, the TLS server will issue TLS session tickets and encrypt/decrypt them using
   * the keys specified through either :ref:`session_ticket_keys <envoy_v3_api_field_extensions.transport_sockets.tls.v3.DownstreamTlsContext.session_ticket_keys>`
   * or :ref:`session_ticket_keys_sds_secret_config <envoy_v3_api_field_extensions.transport_sockets.tls.v3.DownstreamTlsContext.session_ticket_keys_sds_secret_config>`.
   * If this config is set to false and no keys are explicitly configured, the TLS server will issue
   * TLS session tickets and encrypt/decrypt them using an internally-generated and managed key, with the
   * implication that sessions cannot be resumed across hot restarts or on different hosts.
   */
  'disable_stateless_session_resumption'?: (boolean);
  /**
   * Config for whether to use certificates if they do not have
   * an accompanying OCSP response or if the response expires at runtime.
   * Defaults to LENIENT_STAPLING
   */
  'ocsp_staple_policy': (_envoy_extensions_transport_sockets_tls_v3_DownstreamTlsContext_OcspStaplePolicy__Output);
  /**
   * Multiple certificates are allowed in Downstream transport socket to serve different SNI.
   * If the client provides SNI but no such cert matched, it will decide to full scan certificates or not based on this config.
   * Defaults to false. See more details in :ref:`Multiple TLS certificates <arch_overview_ssl_cert_select>`.
   */
  'full_scan_certs_on_sni_mismatch': (_google_protobuf_BoolValue__Output | null);
  /**
   * If set to true, the TLS server will not maintain a session cache of TLS sessions. (This is
   * relevant only for TLSv1.2 and earlier.)
   */
  'disable_stateful_session_resumption': (boolean);
  'session_ticket_keys_type'?: "session_ticket_keys"|"session_ticket_keys_sds_secret_config"|"disable_stateless_session_resumption";
}
