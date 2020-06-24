// Original file: deps/envoy-api/envoy/api/v2/auth/tls.proto

import { TlsParameters as _envoy_api_v2_auth_TlsParameters, TlsParameters__Output as _envoy_api_v2_auth_TlsParameters__Output } from '../../../../envoy/api/v2/auth/TlsParameters';
import { TlsCertificate as _envoy_api_v2_auth_TlsCertificate, TlsCertificate__Output as _envoy_api_v2_auth_TlsCertificate__Output } from '../../../../envoy/api/v2/auth/TlsCertificate';
import { SdsSecretConfig as _envoy_api_v2_auth_SdsSecretConfig, SdsSecretConfig__Output as _envoy_api_v2_auth_SdsSecretConfig__Output } from '../../../../envoy/api/v2/auth/SdsSecretConfig';
import { CertificateValidationContext as _envoy_api_v2_auth_CertificateValidationContext, CertificateValidationContext__Output as _envoy_api_v2_auth_CertificateValidationContext__Output } from '../../../../envoy/api/v2/auth/CertificateValidationContext';

export interface _envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext {
  'default_validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext);
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig);
}

export interface _envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext__Output {
  'default_validation_context': (_envoy_api_v2_auth_CertificateValidationContext__Output);
  'validation_context_sds_secret_config': (_envoy_api_v2_auth_SdsSecretConfig__Output);
}

export interface CommonTlsContext {
  'tls_params'?: (_envoy_api_v2_auth_TlsParameters);
  'tls_certificates'?: (_envoy_api_v2_auth_TlsCertificate)[];
  'tls_certificate_sds_secret_configs'?: (_envoy_api_v2_auth_SdsSecretConfig)[];
  'validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext);
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig);
  'combined_validation_context'?: (_envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext);
  'alpn_protocols'?: (string)[];
  'validation_context_type'?: "validation_context"|"validation_context_sds_secret_config"|"combined_validation_context";
}

export interface CommonTlsContext__Output {
  'tls_params': (_envoy_api_v2_auth_TlsParameters__Output);
  'tls_certificates': (_envoy_api_v2_auth_TlsCertificate__Output)[];
  'tls_certificate_sds_secret_configs': (_envoy_api_v2_auth_SdsSecretConfig__Output)[];
  'validation_context'?: (_envoy_api_v2_auth_CertificateValidationContext__Output);
  'validation_context_sds_secret_config'?: (_envoy_api_v2_auth_SdsSecretConfig__Output);
  'combined_validation_context'?: (_envoy_api_v2_auth_CommonTlsContext_CombinedCertificateValidationContext__Output);
  'alpn_protocols': (string)[];
  'validation_context_type': "validation_context"|"validation_context_sds_secret_config"|"combined_validation_context";
}
