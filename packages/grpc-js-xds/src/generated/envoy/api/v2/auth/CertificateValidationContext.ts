// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

import { DataSource as _envoy_api_v2_core_DataSource, DataSource__Output as _envoy_api_v2_core_DataSource__Output } from '../../../../envoy/api/v2/core/DataSource';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';
import { StringMatcher as _envoy_type_matcher_StringMatcher, StringMatcher__Output as _envoy_type_matcher_StringMatcher__Output } from '../../../../envoy/type/matcher/StringMatcher';

// Original file: deps/envoy-api/envoy/api/v2/auth/common.proto

/**
 * Peer certificate verification mode.
 */
export enum _envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification {
  /**
   * Perform default certificate verification (e.g., against CA / verification lists)
   */
  VERIFY_TRUST_CHAIN = 0,
  /**
   * Connections where the certificate fails verification will be permitted.
   * For HTTP connections, the result of certificate verification can be used in route matching. (
   * see :ref:`validated <envoy_api_field_route.RouteMatch.TlsContextMatchOptions.validated>` ).
   */
  ACCEPT_UNTRUSTED = 1,
}

/**
 * [#next-free-field: 11]
 */
export interface CertificateValidationContext {
  /**
   * TLS certificate data containing certificate authority certificates to use in verifying
   * a presented peer certificate (e.g. server certificate for clusters or client certificate
   * for listeners). If not specified and a peer certificate is presented it will not be
   * verified. By default, a client certificate is optional, unless one of the additional
   * options (:ref:`require_client_certificate
   * <envoy_api_field_auth.DownstreamTlsContext.require_client_certificate>`,
   * :ref:`verify_certificate_spki
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_spki>`,
   * :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>`, or
   * :ref:`match_subject_alt_names
   * <envoy_api_field_auth.CertificateValidationContext.match_subject_alt_names>`) is also
   * specified.
   * 
   * It can optionally contain certificate revocation lists, in which case Envoy will verify
   * that the presented peer certificate has not been revoked by one of the included CRLs.
   * 
   * See :ref:`the TLS overview <arch_overview_ssl_enabling_verification>` for a list of common
   * system CA locations.
   */
  'trusted_ca'?: (_envoy_api_v2_core_DataSource);
  /**
   * An optional list of hex-encoded SHA-256 hashes. If specified, Envoy will verify that
   * the SHA-256 of the DER-encoded presented certificate matches one of the specified values.
   * 
   * A hex-encoded SHA-256 of the certificate can be generated with the following command:
   * 
   * .. code-block:: bash
   * 
   * $ openssl x509 -in path/to/client.crt -outform DER | openssl dgst -sha256 | cut -d" " -f2
   * df6ff72fe9116521268f6f2dd4966f51df479883fe7037b39f75916ac3049d1a
   * 
   * A long hex-encoded and colon-separated SHA-256 (a.k.a. "fingerprint") of the certificate
   * can be generated with the following command:
   * 
   * .. code-block:: bash
   * 
   * $ openssl x509 -in path/to/client.crt -noout -fingerprint -sha256 | cut -d"=" -f2
   * DF:6F:F7:2F:E9:11:65:21:26:8F:6F:2D:D4:96:6F:51:DF:47:98:83:FE:70:37:B3:9F:75:91:6A:C3:04:9D:1A
   * 
   * Both of those formats are acceptable.
   * 
   * When both:
   * :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_spki>` are specified,
   * a hash matching value from either of the lists will result in the certificate being accepted.
   */
  'verify_certificate_hash'?: (string)[];
  /**
   * An optional list of base64-encoded SHA-256 hashes. If specified, Envoy will verify that the
   * SHA-256 of the DER-encoded Subject Public Key Information (SPKI) of the presented certificate
   * matches one of the specified values.
   * 
   * A base64-encoded SHA-256 of the Subject Public Key Information (SPKI) of the certificate
   * can be generated with the following command:
   * 
   * .. code-block:: bash
   * 
   * $ openssl x509 -in path/to/client.crt -noout -pubkey
   * | openssl pkey -pubin -outform DER
   * | openssl dgst -sha256 -binary
   * | openssl enc -base64
   * NvqYIYSbgK2vCJpQhObf77vv+bQWtc5ek5RIOwPiC9A=
   * 
   * This is the format used in HTTP Public Key Pinning.
   * 
   * When both:
   * :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_spki>` are specified,
   * a hash matching value from either of the lists will result in the certificate being accepted.
   * 
   * .. attention::
   * 
   * This option is preferred over :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>`,
   * because SPKI is tied to a private key, so it doesn't change when the certificate
   * is renewed using the same private key.
   */
  'verify_certificate_spki'?: (string)[];
  /**
   * An optional list of Subject Alternative Names. If specified, Envoy will verify that the
   * Subject Alternative Name of the presented certificate matches one of the specified values.
   * 
   * .. attention::
   * 
   * Subject Alternative Names are easily spoofable and verifying only them is insecure,
   * therefore this option must be used together with :ref:`trusted_ca
   * <envoy_api_field_auth.CertificateValidationContext.trusted_ca>`.
   */
  'verify_subject_alt_name'?: (string)[];
  /**
   * [#not-implemented-hide:] Must present a signed time-stamped OCSP response.
   */
  'require_ocsp_staple'?: (_google_protobuf_BoolValue);
  /**
   * [#not-implemented-hide:] Must present signed certificate time-stamp.
   */
  'require_signed_certificate_timestamp'?: (_google_protobuf_BoolValue);
  /**
   * An optional `certificate revocation list
   * <https://en.wikipedia.org/wiki/Certificate_revocation_list>`_
   * (in PEM format). If specified, Envoy will verify that the presented peer
   * certificate has not been revoked by this CRL. If this DataSource contains
   * multiple CRLs, all of them will be used.
   */
  'crl'?: (_envoy_api_v2_core_DataSource);
  /**
   * If specified, Envoy will not reject expired certificates.
   */
  'allow_expired_certificate'?: (boolean);
  /**
   * An optional list of Subject Alternative name matchers. Envoy will verify that the
   * Subject Alternative Name of the presented certificate matches one of the specified matches.
   * 
   * When a certificate has wildcard DNS SAN entries, to match a specific client, it should be
   * configured with exact match type in the :ref:`string matcher <envoy_api_msg_type.matcher.StringMatcher>`.
   * For example if the certificate has "\*.example.com" as DNS SAN entry, to allow only "api.example.com",
   * it should be configured as shown below.
   * 
   * .. code-block:: yaml
   * 
   * match_subject_alt_names:
   * exact: "api.example.com"
   * 
   * .. attention::
   * 
   * Subject Alternative Names are easily spoofable and verifying only them is insecure,
   * therefore this option must be used together with :ref:`trusted_ca
   * <envoy_api_field_auth.CertificateValidationContext.trusted_ca>`.
   */
  'match_subject_alt_names'?: (_envoy_type_matcher_StringMatcher)[];
  /**
   * Certificate trust chain verification mode.
   */
  'trust_chain_verification'?: (_envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification | keyof typeof _envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification);
}

/**
 * [#next-free-field: 11]
 */
export interface CertificateValidationContext__Output {
  /**
   * TLS certificate data containing certificate authority certificates to use in verifying
   * a presented peer certificate (e.g. server certificate for clusters or client certificate
   * for listeners). If not specified and a peer certificate is presented it will not be
   * verified. By default, a client certificate is optional, unless one of the additional
   * options (:ref:`require_client_certificate
   * <envoy_api_field_auth.DownstreamTlsContext.require_client_certificate>`,
   * :ref:`verify_certificate_spki
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_spki>`,
   * :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>`, or
   * :ref:`match_subject_alt_names
   * <envoy_api_field_auth.CertificateValidationContext.match_subject_alt_names>`) is also
   * specified.
   * 
   * It can optionally contain certificate revocation lists, in which case Envoy will verify
   * that the presented peer certificate has not been revoked by one of the included CRLs.
   * 
   * See :ref:`the TLS overview <arch_overview_ssl_enabling_verification>` for a list of common
   * system CA locations.
   */
  'trusted_ca'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * An optional list of hex-encoded SHA-256 hashes. If specified, Envoy will verify that
   * the SHA-256 of the DER-encoded presented certificate matches one of the specified values.
   * 
   * A hex-encoded SHA-256 of the certificate can be generated with the following command:
   * 
   * .. code-block:: bash
   * 
   * $ openssl x509 -in path/to/client.crt -outform DER | openssl dgst -sha256 | cut -d" " -f2
   * df6ff72fe9116521268f6f2dd4966f51df479883fe7037b39f75916ac3049d1a
   * 
   * A long hex-encoded and colon-separated SHA-256 (a.k.a. "fingerprint") of the certificate
   * can be generated with the following command:
   * 
   * .. code-block:: bash
   * 
   * $ openssl x509 -in path/to/client.crt -noout -fingerprint -sha256 | cut -d"=" -f2
   * DF:6F:F7:2F:E9:11:65:21:26:8F:6F:2D:D4:96:6F:51:DF:47:98:83:FE:70:37:B3:9F:75:91:6A:C3:04:9D:1A
   * 
   * Both of those formats are acceptable.
   * 
   * When both:
   * :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_spki>` are specified,
   * a hash matching value from either of the lists will result in the certificate being accepted.
   */
  'verify_certificate_hash': (string)[];
  /**
   * An optional list of base64-encoded SHA-256 hashes. If specified, Envoy will verify that the
   * SHA-256 of the DER-encoded Subject Public Key Information (SPKI) of the presented certificate
   * matches one of the specified values.
   * 
   * A base64-encoded SHA-256 of the Subject Public Key Information (SPKI) of the certificate
   * can be generated with the following command:
   * 
   * .. code-block:: bash
   * 
   * $ openssl x509 -in path/to/client.crt -noout -pubkey
   * | openssl pkey -pubin -outform DER
   * | openssl dgst -sha256 -binary
   * | openssl enc -base64
   * NvqYIYSbgK2vCJpQhObf77vv+bQWtc5ek5RIOwPiC9A=
   * 
   * This is the format used in HTTP Public Key Pinning.
   * 
   * When both:
   * :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_spki>` are specified,
   * a hash matching value from either of the lists will result in the certificate being accepted.
   * 
   * .. attention::
   * 
   * This option is preferred over :ref:`verify_certificate_hash
   * <envoy_api_field_auth.CertificateValidationContext.verify_certificate_hash>`,
   * because SPKI is tied to a private key, so it doesn't change when the certificate
   * is renewed using the same private key.
   */
  'verify_certificate_spki': (string)[];
  /**
   * An optional list of Subject Alternative Names. If specified, Envoy will verify that the
   * Subject Alternative Name of the presented certificate matches one of the specified values.
   * 
   * .. attention::
   * 
   * Subject Alternative Names are easily spoofable and verifying only them is insecure,
   * therefore this option must be used together with :ref:`trusted_ca
   * <envoy_api_field_auth.CertificateValidationContext.trusted_ca>`.
   */
  'verify_subject_alt_name': (string)[];
  /**
   * [#not-implemented-hide:] Must present a signed time-stamped OCSP response.
   */
  'require_ocsp_staple'?: (_google_protobuf_BoolValue__Output);
  /**
   * [#not-implemented-hide:] Must present signed certificate time-stamp.
   */
  'require_signed_certificate_timestamp'?: (_google_protobuf_BoolValue__Output);
  /**
   * An optional `certificate revocation list
   * <https://en.wikipedia.org/wiki/Certificate_revocation_list>`_
   * (in PEM format). If specified, Envoy will verify that the presented peer
   * certificate has not been revoked by this CRL. If this DataSource contains
   * multiple CRLs, all of them will be used.
   */
  'crl'?: (_envoy_api_v2_core_DataSource__Output);
  /**
   * If specified, Envoy will not reject expired certificates.
   */
  'allow_expired_certificate': (boolean);
  /**
   * An optional list of Subject Alternative name matchers. Envoy will verify that the
   * Subject Alternative Name of the presented certificate matches one of the specified matches.
   * 
   * When a certificate has wildcard DNS SAN entries, to match a specific client, it should be
   * configured with exact match type in the :ref:`string matcher <envoy_api_msg_type.matcher.StringMatcher>`.
   * For example if the certificate has "\*.example.com" as DNS SAN entry, to allow only "api.example.com",
   * it should be configured as shown below.
   * 
   * .. code-block:: yaml
   * 
   * match_subject_alt_names:
   * exact: "api.example.com"
   * 
   * .. attention::
   * 
   * Subject Alternative Names are easily spoofable and verifying only them is insecure,
   * therefore this option must be used together with :ref:`trusted_ca
   * <envoy_api_field_auth.CertificateValidationContext.trusted_ca>`.
   */
  'match_subject_alt_names': (_envoy_type_matcher_StringMatcher__Output)[];
  /**
   * Certificate trust chain verification mode.
   */
  'trust_chain_verification': (keyof typeof _envoy_api_v2_auth_CertificateValidationContext_TrustChainVerification);
}
