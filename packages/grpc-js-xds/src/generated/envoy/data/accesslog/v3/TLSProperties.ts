// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';

export interface _envoy_data_accesslog_v3_TLSProperties_CertificateProperties {
  /**
   * SANs present in the certificate.
   */
  'subject_alt_name'?: (_envoy_data_accesslog_v3_TLSProperties_CertificateProperties_SubjectAltName)[];
  /**
   * The subject field of the certificate.
   */
  'subject'?: (string);
}

export interface _envoy_data_accesslog_v3_TLSProperties_CertificateProperties__Output {
  /**
   * SANs present in the certificate.
   */
  'subject_alt_name': (_envoy_data_accesslog_v3_TLSProperties_CertificateProperties_SubjectAltName__Output)[];
  /**
   * The subject field of the certificate.
   */
  'subject': (string);
}

export interface _envoy_data_accesslog_v3_TLSProperties_CertificateProperties_SubjectAltName {
  'uri'?: (string);
  /**
   * [#not-implemented-hide:]
   */
  'dns'?: (string);
  'san'?: "uri"|"dns";
}

export interface _envoy_data_accesslog_v3_TLSProperties_CertificateProperties_SubjectAltName__Output {
  'uri'?: (string);
  /**
   * [#not-implemented-hide:]
   */
  'dns'?: (string);
  'san': "uri"|"dns";
}

// Original file: deps/envoy-api/envoy/data/accesslog/v3/accesslog.proto

export enum _envoy_data_accesslog_v3_TLSProperties_TLSVersion {
  VERSION_UNSPECIFIED = 0,
  TLSv1 = 1,
  TLSv1_1 = 2,
  TLSv1_2 = 3,
  TLSv1_3 = 4,
}

/**
 * Properties of a negotiated TLS connection.
 * [#next-free-field: 8]
 */
export interface TLSProperties {
  /**
   * Version of TLS that was negotiated.
   */
  'tls_version'?: (_envoy_data_accesslog_v3_TLSProperties_TLSVersion | keyof typeof _envoy_data_accesslog_v3_TLSProperties_TLSVersion);
  /**
   * TLS cipher suite negotiated during handshake. The value is a
   * four-digit hex code defined by the IANA TLS Cipher Suite Registry
   * (e.g. ``009C`` for ``TLS_RSA_WITH_AES_128_GCM_SHA256``).
   * 
   * Here it is expressed as an integer.
   */
  'tls_cipher_suite'?: (_google_protobuf_UInt32Value | null);
  /**
   * SNI hostname from handshake.
   */
  'tls_sni_hostname'?: (string);
  /**
   * Properties of the local certificate used to negotiate TLS.
   */
  'local_certificate_properties'?: (_envoy_data_accesslog_v3_TLSProperties_CertificateProperties | null);
  /**
   * Properties of the peer certificate used to negotiate TLS.
   */
  'peer_certificate_properties'?: (_envoy_data_accesslog_v3_TLSProperties_CertificateProperties | null);
  /**
   * The TLS session ID.
   */
  'tls_session_id'?: (string);
  /**
   * The ``JA3`` fingerprint when ``JA3`` fingerprinting is enabled.
   */
  'ja3_fingerprint'?: (string);
}

/**
 * Properties of a negotiated TLS connection.
 * [#next-free-field: 8]
 */
export interface TLSProperties__Output {
  /**
   * Version of TLS that was negotiated.
   */
  'tls_version': (keyof typeof _envoy_data_accesslog_v3_TLSProperties_TLSVersion);
  /**
   * TLS cipher suite negotiated during handshake. The value is a
   * four-digit hex code defined by the IANA TLS Cipher Suite Registry
   * (e.g. ``009C`` for ``TLS_RSA_WITH_AES_128_GCM_SHA256``).
   * 
   * Here it is expressed as an integer.
   */
  'tls_cipher_suite': (_google_protobuf_UInt32Value__Output | null);
  /**
   * SNI hostname from handshake.
   */
  'tls_sni_hostname': (string);
  /**
   * Properties of the local certificate used to negotiate TLS.
   */
  'local_certificate_properties': (_envoy_data_accesslog_v3_TLSProperties_CertificateProperties__Output | null);
  /**
   * Properties of the peer certificate used to negotiate TLS.
   */
  'peer_certificate_properties': (_envoy_data_accesslog_v3_TLSProperties_CertificateProperties__Output | null);
  /**
   * The TLS session ID.
   */
  'tls_session_id': (string);
  /**
   * The ``JA3`` fingerprint when ``JA3`` fingerprinting is enabled.
   */
  'ja3_fingerprint': (string);
}
