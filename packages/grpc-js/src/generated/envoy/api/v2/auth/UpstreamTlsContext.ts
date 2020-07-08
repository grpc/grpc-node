// Original file: deps/envoy-api/envoy/api/v2/auth/tls.proto

import { CommonTlsContext as _envoy_api_v2_auth_CommonTlsContext, CommonTlsContext__Output as _envoy_api_v2_auth_CommonTlsContext__Output } from '../../../../envoy/api/v2/auth/CommonTlsContext';
import { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface UpstreamTlsContext {
  'common_tls_context'?: (_envoy_api_v2_auth_CommonTlsContext);
  'sni'?: (string);
  'allow_renegotiation'?: (boolean);
  'max_session_keys'?: (_google_protobuf_UInt32Value);
}

export interface UpstreamTlsContext__Output {
  'common_tls_context': (_envoy_api_v2_auth_CommonTlsContext__Output);
  'sni': (string);
  'allow_renegotiation': (boolean);
  'max_session_keys': (_google_protobuf_UInt32Value__Output);
}
