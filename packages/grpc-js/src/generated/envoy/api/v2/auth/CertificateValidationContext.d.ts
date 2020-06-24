// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

export enum _envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification {
  VERIFY_TRUST_CHAIN = 0,
  ACCEPT_UNTRUSTED = 1,
}

export interface CertificateValidationContext {
  'trusted_ca'?: (_envoy_api_v2_core_DataSource);
  'verify_certificate_spki'?: (string)[];
  'verify_certificate_hash'?: (string)[];
  'verify_subject_alt_name'?: (string)[];
  'match_subject_alt_names'?: (_envoy_type_matcher_StringMatcher)[];
  'require_ocsp_staple'?: (_google_protobuf_BoolValue);
  'require_signed_certificate_timestamp'?: (_google_protobuf_BoolValue);
  'crl'?: (_envoy_api_v2_core_DataSource);
  'allow_expired_certificate'?: (boolean);
  'trust_chain_verification'?: (_envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification | keyof typeof _envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification);
}

export interface CertificateValidationContext__Output {
  'trusted_ca': (_envoy_api_v2_core_DataSource__Output);
  'verify_certificate_spki': (string)[];
  'verify_certificate_hash': (string)[];
  'verify_subject_alt_name': (string)[];
  'match_subject_alt_names': (_envoy_type_matcher_StringMatcher__Output)[];
  'require_ocsp_staple': (_google_protobuf_BoolValue__Output);
  'require_signed_certificate_timestamp': (_google_protobuf_BoolValue__Output);
  'crl': (_envoy_api_v2_core_DataSource__Output);
  'allow_expired_certificate': (boolean);
  'trust_chain_verification': (keyof typeof _envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification);
}
