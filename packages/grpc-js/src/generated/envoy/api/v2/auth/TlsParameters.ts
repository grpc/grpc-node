// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto


// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

export enum _envoy_api_v2_auth_TlsParameters_TlsProtocol {
  TLS_AUTO = 0,
  TLSv1_0 = 1,
  TLSv1_1 = 2,
  TLSv1_2 = 3,
  TLSv1_3 = 4,
}

export interface TlsParameters {
  'tls_minimum_protocol_version'?: (_envoy_api_v2_auth_TlsParameters_TlsProtocol | keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  'tls_maximum_protocol_version'?: (_envoy_api_v2_auth_TlsParameters_TlsProtocol | keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  'cipher_suites'?: (string)[];
  'ecdh_curves'?: (string)[];
}

export interface TlsParameters__Output {
  'tls_minimum_protocol_version': (keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  'tls_maximum_protocol_version': (keyof typeof _envoy_api_v2_auth_TlsParameters_TlsProtocol);
  'cipher_suites': (string)[];
  'ecdh_curves': (string)[];
}
