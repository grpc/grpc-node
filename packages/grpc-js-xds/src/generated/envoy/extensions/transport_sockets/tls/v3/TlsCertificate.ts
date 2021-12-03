// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto

import type { DataSource as _envoy_config_core_v3_DataSource, DataSource__Output as _envoy_config_core_v3_DataSource__Output } from '../../../../../envoy/config/core/v3/DataSource';
import type { PrivateKeyProvider as _envoy_extensions_transport_sockets_tls_v3_PrivateKeyProvider, PrivateKeyProvider__Output as _envoy_extensions_transport_sockets_tls_v3_PrivateKeyProvider__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/PrivateKeyProvider';
import type { WatchedDirectory as _envoy_config_core_v3_WatchedDirectory, WatchedDirectory__Output as _envoy_config_core_v3_WatchedDirectory__Output } from '../../../../../envoy/config/core/v3/WatchedDirectory';

/**
 * [#next-free-field: 8]
 */
export interface TlsCertificate {
  /**
   * The TLS certificate chain.
   * 
   * If *certificate_chain* is a filesystem path, a watch will be added to the
   * parent directory for any file moves to support rotation. This currently
   * only applies to dynamic secrets, when the *TlsCertificate* is delivered via
   * SDS.
   */
  'certificate_chain'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * The TLS private key.
   * 
   * If *private_key* is a filesystem path, a watch will be added to the parent
   * directory for any file moves to support rotation. This currently only
   * applies to dynamic secrets, when the *TlsCertificate* is delivered via SDS.
   */
  'private_key'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * The password to decrypt the TLS private key. If this field is not set, it is assumed that the
   * TLS private key is not password encrypted.
   */
  'password'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * The OCSP response to be stapled with this certificate during the handshake.
   * The response must be DER-encoded and may only be  provided via ``filename`` or
   * ``inline_bytes``. The response may pertain to only one certificate.
   */
  'ocsp_staple'?: (_envoy_config_core_v3_DataSource | null);
  /**
   * [#not-implemented-hide:]
   */
  'signed_certificate_timestamp'?: (_envoy_config_core_v3_DataSource)[];
  /**
   * BoringSSL private key method provider. This is an alternative to :ref:`private_key
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.TlsCertificate.private_key>` field. This can't be
   * marked as ``oneof`` due to API compatibility reasons. Setting both :ref:`private_key
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.TlsCertificate.private_key>` and
   * :ref:`private_key_provider
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.TlsCertificate.private_key_provider>` fields will result in an
   * error.
   */
  'private_key_provider'?: (_envoy_extensions_transport_sockets_tls_v3_PrivateKeyProvider | null);
  /**
   * If specified, updates of file-based *certificate_chain* and *private_key*
   * sources will be triggered by this watch. The certificate/key pair will be
   * read together and validated for atomic read consistency (i.e. no
   * intervening modification occurred between cert/key read, verified by file
   * hash comparisons). This allows explicit control over the path watched, by
   * default the parent directories of the filesystem paths in
   * *certificate_chain* and *private_key* are watched if this field is not
   * specified. This only applies when a *TlsCertificate* is delivered by SDS
   * with references to filesystem paths. See the :ref:`SDS key rotation
   * <sds_key_rotation>` documentation for further details.
   */
  'watched_directory'?: (_envoy_config_core_v3_WatchedDirectory | null);
}

/**
 * [#next-free-field: 8]
 */
export interface TlsCertificate__Output {
  /**
   * The TLS certificate chain.
   * 
   * If *certificate_chain* is a filesystem path, a watch will be added to the
   * parent directory for any file moves to support rotation. This currently
   * only applies to dynamic secrets, when the *TlsCertificate* is delivered via
   * SDS.
   */
  'certificate_chain': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * The TLS private key.
   * 
   * If *private_key* is a filesystem path, a watch will be added to the parent
   * directory for any file moves to support rotation. This currently only
   * applies to dynamic secrets, when the *TlsCertificate* is delivered via SDS.
   */
  'private_key': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * The password to decrypt the TLS private key. If this field is not set, it is assumed that the
   * TLS private key is not password encrypted.
   */
  'password': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * The OCSP response to be stapled with this certificate during the handshake.
   * The response must be DER-encoded and may only be  provided via ``filename`` or
   * ``inline_bytes``. The response may pertain to only one certificate.
   */
  'ocsp_staple': (_envoy_config_core_v3_DataSource__Output | null);
  /**
   * [#not-implemented-hide:]
   */
  'signed_certificate_timestamp': (_envoy_config_core_v3_DataSource__Output)[];
  /**
   * BoringSSL private key method provider. This is an alternative to :ref:`private_key
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.TlsCertificate.private_key>` field. This can't be
   * marked as ``oneof`` due to API compatibility reasons. Setting both :ref:`private_key
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.TlsCertificate.private_key>` and
   * :ref:`private_key_provider
   * <envoy_v3_api_field_extensions.transport_sockets.tls.v3.TlsCertificate.private_key_provider>` fields will result in an
   * error.
   */
  'private_key_provider': (_envoy_extensions_transport_sockets_tls_v3_PrivateKeyProvider__Output | null);
  /**
   * If specified, updates of file-based *certificate_chain* and *private_key*
   * sources will be triggered by this watch. The certificate/key pair will be
   * read together and validated for atomic read consistency (i.e. no
   * intervening modification occurred between cert/key read, verified by file
   * hash comparisons). This allows explicit control over the path watched, by
   * default the parent directories of the filesystem paths in
   * *certificate_chain* and *private_key* are watched if this field is not
   * specified. This only applies when a *TlsCertificate* is delivered by SDS
   * with references to filesystem paths. See the :ref:`SDS key rotation
   * <sds_key_rotation>` documentation for further details.
   */
  'watched_directory': (_envoy_config_core_v3_WatchedDirectory__Output | null);
}
