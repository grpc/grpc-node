// Original file: deps/envoy-api/envoy/api/v2/auth/tls.proto

import { CommonTlsContext as _envoy_api_v2_auth_CommonTlsContext, CommonTlsContext__Output as _envoy_api_v2_auth_CommonTlsContext__Output } from '../../../../envoy/api/v2/auth/CommonTlsContext';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { TlsSessionTicketKeys as _envoy_api_v2_auth_TlsSessionTicketKeys, TlsSessionTicketKeys__Output as _envoy_api_v2_auth_TlsSessionTicketKeys__Output } from '../../../../envoy/api/v2/auth/TlsSessionTicketKeys';
import { SdsSecretConfig as _envoy_api_v2_auth_SdsSecretConfig, SdsSecretConfig__Output as _envoy_api_v2_auth_SdsSecretConfig__Output } from '../../../../envoy/api/v2/auth/SdsSecretConfig';
import { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';

export interface DownstreamTlsContext {
  'common_tls_context'?: (_envoy_api_v2_auth_CommonTlsContext);
  'require_client_certificate'?: (_google_protobuf_BoolValue);
  'require_sni'?: (_google_protobuf_BoolValue);
  'session_ticket_keys'?: (_envoy_api_v2_auth_TlsSessionTicketKeys);
  'session_ticket_keys_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig);
  'session_timeout'?: (_google_protobuf_Duration);
  'disable_stateless_session_resumption'?: (boolean);
  'session_ticket_keys_type'?: "session_ticket_keys"|"session_ticket_keys_sds_secret_config"|"disable_stateless_session_resumption";
}

export interface DownstreamTlsContext__Output {
  'common_tls_context': (_envoy_api_v2_auth_CommonTlsContext__Output);
  'require_client_certificate': (_google_protobuf_BoolValue__Output);
  'require_sni': (_google_protobuf_BoolValue__Output);
  'session_ticket_keys'?: (_envoy_api_v2_auth_TlsSessionTicketKeys__Output);
  'session_ticket_keys_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig__Output);
  'session_timeout': (_google_protobuf_Duration__Output);
  'disable_stateless_session_resumption'?: (boolean);
  'session_ticket_keys_type': "session_ticket_keys"|"session_ticket_keys_sds_secret_config"|"disable_stateless_session_resumption";
}
