// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { PrivateKeyProvider as _envoy_api_v2_auth_PrivateKeyProvider, PrivateKeyProvider__Output as _envoy_api_v2_auth_PrivateKeyProvider__Output } from '../../../../envoy/api/v2/auth/PrivateKeyProvider';

export interface TlsCertificate {
  'certificate_chain'?: (_envoy_api_v2_core_DataSource);
  'private_key'?: (_envoy_api_v2_core_DataSource);
  'password'?: (_envoy_api_v2_core_DataSource);
  'ocsp_staple'?: (_envoy_api_v2_core_DataSource);
  'signed_certificate_timestamp'?: (_envoy_api_v2_core_DataSource)[];
  'private_key_provider'?: (_envoy_api_v2_auth_PrivateKeyProvider);
}

export interface TlsCertificate__Output {
  'certificate_chain': (_envoy_api_v2_core_DataSource__Output);
  'private_key': (_envoy_api_v2_core_DataSource__Output);
  'password': (_envoy_api_v2_core_DataSource__Output);
  'ocsp_staple': (_envoy_api_v2_core_DataSource__Output);
  'signed_certificate_timestamp': (_envoy_api_v2_core_DataSource__Output)[];
  'private_key_provider': (_envoy_api_v2_auth_PrivateKeyProvider__Output);
}
