// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../../envoy/config/core/v3/DataSource';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../../google/protobuf/BoolValue';
import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../../envoy/type/matcher/v3/StringMatcher';
import type { WatchedDirectory as _envoy_config_core_v3_WatchedDirectory, WatchedDirectory__Output as _envoy_config_core_v3_WatchedDirectory__Output } from '../../../../../envoy/config/core/v3/WatchedDirectory';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { CertificateProviderPluginInstance as _envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance, CertificateProviderPluginInstance__Output as _envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/CertificateProviderPluginInstance';

// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

/**
 * Peer certificate verification mode.
 */
export enum _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext_TrustChainVerification {
  /**
   * Perform default certificate verification (e.g., against CA / verification lists)
   */
  VERIFY_TRUST_CHAIN = 0,
  /**
   * Connections where the certificate fails verification will be permitted.
   * For HTTP connections, the result of certificate verification can be used in route matching. (
   * see :ref:`validated <envoy_v3_api_field_config.route.v3.RouteMatch.TlsContextMatchOptions.validated>` ).
   */
  ACCEPT_UNTRUSTED = 1,
}

/**
 * [#next-free-field: 14]
 */
export interface CertificateValidationContext {
  /**
   * TLS certificate data containing certificate authority certificates to use in verifying
   * a presented peer certificate (e.g. server certificate for clusters or client certificate
   * for listeners). If not specified and a peer certificate is presented it will not be
   * verified. By default, a client certificate is optional, unless one of the additional
   * options (:ref:`require_client_certificate
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.DownstreamTlsContext.require_client_certificate>`,
   * :ref:`verify_certificate_spki
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_spki>`,
   * :ref:`verify_certificate_hash
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>`, or
   * :ref:`match_subject_alt_names
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.match_subject_alt_names>`) is also
   * specified.
   * 
   * It can optionally contain certificate revocation lists, in which case Envoy will verify
   * that the presented peer certificate has not been revoked by one of the included CRLs. Note
   * that if a CRL is provided for any certificate authority in a trust chain, a CRL must be
   * provided for all certificate authorities in that chain. Failure to do so will result in
   * verification failure for both revoked and unrevoked certificates from that chain.
   * 
   * See :ref:`the TLS overview <arch_overview_ssl_enabling_verification>` for a list of common
   * system CA locations.
   * 
   * If *trusted_ca* is a filesystem path, a watch will be added to the parent
   * directory for any file moves to support rotation. This currently only
   * applies to dynamic secrets, when the *CertificateValidationContext* is
   * delivered via SDS.
   * 
   * Only one of *trusted_ca* and *ca_certificate_provider_instance* may be specified.
   * 
   * [#next-major-version: This field and watched_directory below should ideally be moved into a
   * separate sub-message, since there's no point in specifying the latter field without this one.]
   */
  'trusted_ca'?: (_envoy_config_core_v3_DataSource | null);
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
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_spki>` are specified,
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
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_spki>` are specified,
   * a hash matching value from either of the lists will result in the certificate being accepted.
   * 
   * .. attention::
   * 
   * This option is preferred over :ref:`verify_certificate_hash
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>`,
   * because SPKI is tied to a private key, so it doesn't change when the certificate
   * is renewed using the same private key.
   */
  'verify_certificate_spki'?: (string)[];
  /**
   * [#not-implemented-hide:] Must present signed certificate time-stamp.
   */
  'require_signed_certificate_timestamp'?: (_google_protobuf_BoolValue | null);
  /**
   * An optional `certificate revocation list
   * <https://en.wikipedia.org/wiki/Certificate_revocation_list>`_
   * (in PEM format). If specified, Envoy will verify that the presented peer
   * certificate has not been revoked by this CRL. If this DataSource contains
   * multiple CRLs, all of them will be used. Note that if a CRL is provided
   * for any certificate authority in a trust chain, a CRL must be provided
   * for all certificate authorities in that chain. Failure to do so will
   * result in verification failure for both revoked and unrevoked certificates
   * from that chain.
   */
  'crl'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * If specified, Envoy will not reject expired certificates.
   */
  'allow_expired_certificate'?: (boolean);
  /**
   * An optional list of Subject Alternative name matchers. If specified, Envoy will verify that the
   * Subject Alternative Name of the presented certificate matches one of the specified matchers.
   * 
   * When a certificate has wildcard DNS SAN entries, to match a specific client, it should be
   * configured with exact match type in the :ref:`string matcher <envoy_v3_api_msg_type.matcher.v3.StringMatcher>`.
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
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.trusted_ca>`.
   */
  'match_subject_alt_names'?: (_envoy_type_matcher_v3_StringMatcher)[];
  /**
   * Certificate trust chain verification mode.
   */
  'trust_chain_verification'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext_TrustChainVerification | keyof typeof _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext_TrustChainVerification);
  /**
   * If specified, updates of a file-based *trusted_ca* source will be triggered
   * by this watch. This allows explicit control over the path watched, by
   * default the parent directory of the filesystem path in *trusted_ca* is
   * watched if this field is not specified. This only applies when a
   * *CertificateValidationContext* is delivered by SDS with references to
   * filesystem paths. See the :ref:`SDS key rotation <sds_key_rotation>`
   * documentation for further details.
   */
  'watched_directory'?: (_envoy_config_core_v3_WatchedDirectory | null);
  /**
   * The configuration of an extension specific certificate validator.
   * If specified, all validation is done by the specified validator,
   * and the behavior of all other validation settings is defined by the specified validator (and may be entirely ignored, unused, and unvalidated).
   * Refer to the documentation for the specified validator. If you do not want a custom validation algorithm, do not set this field.
   * [#extension-category: envoy.tls.cert_validator]
   */
  'custom_validator_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Certificate provider instance for fetching TLS certificates.
   * 
   * Only one of *trusted_ca* and *ca_certificate_provider_instance* may be specified.
   * [#not-implemented-hide:]
   */
  'ca_certificate_provider_instance'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance | null);
}

/**
 * [#next-free-field: 14]
 */
export interface CertificateValidationContext__Output {
  /**
   * TLS certificate data containing certificate authority certificates to use in verifying
   * a presented peer certificate (e.g. server certificate for clusters or client certificate
   * for listeners). If not specified and a peer certificate is presented it will not be
   * verified. By default, a client certificate is optional, unless one of the additional
   * options (:ref:`require_client_certificate
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.DownstreamTlsContext.require_client_certificate>`,
   * :ref:`verify_certificate_spki
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_spki>`,
   * :ref:`verify_certificate_hash
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>`, or
   * :ref:`match_subject_alt_names
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.match_subject_alt_names>`) is also
   * specified.
   * 
   * It can optionally contain certificate revocation lists, in which case Envoy will verify
   * that the presented peer certificate has not been revoked by one of the included CRLs. Note
   * that if a CRL is provided for any certificate authority in a trust chain, a CRL must be
   * provided for all certificate authorities in that chain. Failure to do so will result in
   * verification failure for both revoked and unrevoked certificates from that chain.
   * 
   * See :ref:`the TLS overview <arch_overview_ssl_enabling_verification>` for a list of common
   * system CA locations.
   * 
   * If *trusted_ca* is a filesystem path, a watch will be added to the parent
   * directory for any file moves to support rotation. This currently only
   * applies to dynamic secrets, when the *CertificateValidationContext* is
   * delivered via SDS.
   * 
   * Only one of *trusted_ca* and *ca_certificate_provider_instance* may be specified.
   * 
   * [#next-major-version: This field and watched_directory below should ideally be moved into a
   * separate sub-message, since there's no point in specifying the latter field without this one.]
   */
  'trusted_ca': (_envoy_config_core_v3_DataSource__Output | null);
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
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_spki>` are specified,
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
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>` and
   * :ref:`verify_certificate_spki
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_spki>` are specified,
   * a hash matching value from either of the lists will result in the certificate being accepted.
   * 
   * .. attention::
   * 
   * This option is preferred over :ref:`verify_certificate_hash
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.verify_certificate_hash>`,
   * because SPKI is tied to a private key, so it doesn't change when the certificate
   * is renewed using the same private key.
   */
  'verify_certificate_spki': (string)[];
  /**
   * [#not-implemented-hide:] Must present signed certificate time-stamp.
   */
  'require_signed_certificate_timestamp': (_google_protobuf_BoolValue__Output | null);
  /**
   * An optional `certificate revocation list
   * <https://en.wikipedia.org/wiki/Certificate_revocation_list>`_
   * (in PEM format). If specified, Envoy will verify that the presented peer
   * certificate has not been revoked by this CRL. If this DataSource contains
   * multiple CRLs, all of them will be used. Note that if a CRL is provided
   * for any certificate authority in a trust chain, a CRL must be provided
   * for all certificate authorities in that chain. Failure to do so will
   * result in verification failure for both revoked and unrevoked certificates
   * from that chain.
   */
  'crl': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * If specified, Envoy will not reject expired certificates.
   */
  'allow_expired_certificate': (boolean);
  /**
   * An optional list of Subject Alternative name matchers. If specified, Envoy will verify that the
   * Subject Alternative Name of the presented certificate matches one of the specified matchers.
   * 
   * When a certificate has wildcard DNS SAN entries, to match a specific client, it should be
   * configured with exact match type in the :ref:`string matcher <envoy_v3_api_msg_type.matcher.v3.StringMatcher>`.
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
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CertificateValidationContext.trusted_ca>`.
   */
  'match_subject_alt_names': (_envoy_type_matcher_v3_StringMatcher__Output)[];
  /**
   * Certificate trust chain verification mode.
   */
  'trust_chain_verification': (keyof typeof _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext_TrustChainVerification);
  /**
   * If specified, updates of a file-based *trusted_ca* source will be triggered
   * by this watch. This allows explicit control over the path watched, by
   * default the parent directory of the filesystem path in *trusted_ca* is
   * watched if this field is not specified. This only applies when a
   * *CertificateValidationContext* is delivered by SDS with references to
   * filesystem paths. See the :ref:`SDS key rotation <sds_key_rotation>`
   * documentation for further details.
   */
  'watched_directory': (_envoy_config_core_v3_WatchedDirectory__Output | null);
  /**
   * The configuration of an extension specific certificate validator.
   * If specified, all validation is done by the specified validator,
   * and the behavior of all other validation settings is defined by the specified validator (and may be entirely ignored, unused, and unvalidated).
   * Refer to the documentation for the specified validator. If you do not want a custom validation algorithm, do not set this field.
   * [#extension-category: envoy.tls.cert_validator]
   */
  'custom_validator_config': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Certificate provider instance for fetching TLS certificates.
   * 
   * Only one of *trusted_ca* and *ca_certificate_provider_instance* may be specified.
   * [#not-implemented-hide:]
   */
  'ca_certificate_provider_instance': (_envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance__Output | null);
}
