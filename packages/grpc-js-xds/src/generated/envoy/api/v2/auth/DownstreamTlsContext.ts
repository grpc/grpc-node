// Original file: deps/envoy-api/envoy/api/v2/auth/tls.proto

import { CommonTlsContext as _envoy_api_v2_auth_CommonTlsContext, CommonTlsContext__Output as _envoy_api_v2_auth_CommonTlsContext__Output } from '../../../../envoy/api/v2/auth/CommonTlsContext';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { TlsSessionTicketKeys as _envoy_api_v2_auth_TlsSessionTicketKeys, TlsSessionTicketKeys__Output as _envoy_api_v2_auth_TlsSessionTicketKeys__Output } from '../../../../envoy/api/v2/auth/TlsSessionTicketKeys';
import { SdsSecretConfig as _envoy_api_v2_auth_SdsSecretConfig, SdsSecretConfig__Output as _envoy_api_v2_auth_SdsSecretConfig__Output } from '../../../../envoy/api/v2/auth/SdsSecretConfig';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

/**
 * [#next-free-field: 8]
 */
export interface DownstreamTlsContext {
  /**
   * Common TLS context settings.
   */
  'common_tls_context'?: (_envoy_api_v2_auth_CommonTlsContext);
  /**
   * If specified, Envoy will reject connections without a valid client
   * certificate.
   */
  'require_client_certificate'?: (_google_protobuf_BoolValue);
  /**
   * If specified, Envoy will reject connections without a valid and matching SNI.
   * [#not-implemented-hide:]
   */
  'require_sni'?: (_google_protobuf_BoolValue);
  /**
   * TLS session ticket key settings.
   */
  'session_ticket_keys'?: (_envoy_api_v2_auth_TlsSessionTicketKeys);
  /**
   * Config for fetching TLS session ticket keys via SDS API.
   */
  'session_ticket_keys_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig);
  /**
   * If specified, session_timeout will change maximum lifetime (in seconds) of TLS session
   * Currently this value is used as a hint to `TLS session ticket lifetime (for TLSv1.2)
   * <https://tools.ietf.org/html/rfc5077#section-5.6>`
   * only seconds could be specified (fractional seconds are going to be ignored).
   */
  'session_timeout'?: (_google_protobuf_Duration);
  /**
   * Config for controlling stateless TLS session resumption: setting this to true will cause the TLS
   * server to not issue TLS session tickets for the purposes of stateless TLS session resumption.
   * If set to false, the TLS server will issue TLS session tickets and encrypt/decrypt them using
   * the keys specified through either :ref:`session_ticket_keys <envoy_api_field_auth.DownstreamTlsContext.session_ticket_keys>`
   * or :ref:`session_ticket_keys_sds_secret_config <envoy_api_field_auth.DownstreamTlsContext.session_ticket_keys_sds_secret_config>`.
   * If this config is set to false and no keys are explicitly configured, the TLS server will issue
   * TLS session tickets and encrypt/decrypt them using an internally-generated and managed key, with the
   * implication that sessions cannot be resumed across hot restarts or on different hosts.
   */
  'disable_stateless_session_resumption'?: (boolean);
  'session_ticket_keys_type'?: "session_ticket_keys"|"session_ticket_keys_sds_secret_config"|"disable_stateless_session_resumption";
}

/**
 * [#next-free-field: 8]
 */
export interface DownstreamTlsContext__Output {
  /**
   * Common TLS context settings.
   */
  'common_tls_context'?: (_envoy_api_v2_auth_CommonTlsContext__Output);
  /**
   * If specified, Envoy will reject connections without a valid client
   * certificate.
   */
  'require_client_certificate'?: (_google_protobuf_BoolValue__Output);
  /**
   * If specified, Envoy will reject connections without a valid and matching SNI.
   * [#not-implemented-hide:]
   */
  'require_sni'?: (_google_protobuf_BoolValue__Output);
  /**
   * TLS session ticket key settings.
   */
  'session_ticket_keys'?: (_envoy_api_v2_auth_TlsSessionTicketKeys__Output);
  /**
   * Config for fetching TLS session ticket keys via SDS API.
   */
  'session_ticket_keys_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig__Output);
  /**
   * If specified, session_timeout will change maximum lifetime (in seconds) of TLS session
   * Currently this value is used as a hint to `TLS session ticket lifetime (for TLSv1.2)
   * <https://tools.ietf.org/html/rfc5077#section-5.6>`
   * only seconds could be specified (fractional seconds are going to be ignored).
   */
  'session_timeout'?: (_google_protobuf_Duration__Output);
  /**
   * Config for controlling stateless TLS session resumption: setting this to true will cause the TLS
   * server to not issue TLS session tickets for the purposes of stateless TLS session resumption.
   * If set to false, the TLS server will issue TLS session tickets and encrypt/decrypt them using
   * the keys specified through either :ref:`session_ticket_keys <envoy_api_field_auth.DownstreamTlsContext.session_ticket_keys>`
   * or :ref:`session_ticket_keys_sds_secret_config <envoy_api_field_auth.DownstreamTlsContext.session_ticket_keys_sds_secret_config>`.
   * If this config is set to false and no keys are explicitly configured, the TLS server will issue
   * TLS session tickets and encrypt/decrypt them using an internally-generated and managed key, with the
   * implication that sessions cannot be resumed across hot restarts or on different hosts.
   */
  'disable_stateless_session_resumption'?: (boolean);
  'session_ticket_keys_type': "session_ticket_keys"|"session_ticket_keys_sds_secret_config"|"disable_stateless_session_resumption";
}
