// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/tls.proto

import type { TlsParameters as _envoy_extensions_transport_sockets_tls_v3_TlsParameters, TlsParameters__Output as _envoy_extensions_transport_sockets_tls_v3_TlsParameters__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/TlsParameters';
import type { TlsCertificate as _envoy_extensions_transport_sockets_tls_v3_TlsCertificate, TlsCertificate__Output as _envoy_extensions_transport_sockets_tls_v3_TlsCertificate__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/TlsCertificate';
import type { CertificateValidationContext as _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext, CertificateValidationContext__Output as _envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/CertificateValidationContext';
import type { SdsSecretConfig as _envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig, SdsSecretConfig__Output as _envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/SdsSecretConfig';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../../envoy/config/core/v3/TypedExtensionConfig';
import type { CertificateProviderPluginInstance as _envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance, CertificateProviderPluginInstance__Output as _envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/CertificateProviderPluginInstance';
import type { TlsKeyLog as _envoy_extensions_transport_sockets_tls_v3_TlsKeyLog, TlsKeyLog__Output as _envoy_extensions_transport_sockets_tls_v3_TlsKeyLog__Output } from '../../../../../envoy/extensions/transport_sockets/tls/v3/TlsKeyLog';

/**
 * Config for Certificate provider to get certificates. This provider should allow certificates to be
 * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
 * 
 * DEPRECATED: This message is not currently used, but if we ever do need it, we will want to
 * move it out of CommonTlsContext and into common.proto, similar to the existing
 * CertificateProviderPluginInstance message.
 * 
 * [#not-implemented-hide:]
 */
export interface _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider {
  /**
   * opaque name used to specify certificate instances or types. For example, "ROOTCA" to specify
   * a root-certificate (validation context) or "TLS" to specify a new tls-certificate.
   */
  'name'?: (string);
  'typed_config'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Provider specific config.
   * Note: an implementation is expected to dedup multiple instances of the same config
   * to maintain a single certificate-provider instance. The sharing can happen, for
   * example, among multiple clusters or between the tls_certificate and validation_context
   * certificate providers of a cluster.
   * This config could be supplied inline or (in future) a named xDS resource.
   */
  'config'?: "typed_config";
}

/**
 * Config for Certificate provider to get certificates. This provider should allow certificates to be
 * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
 * 
 * DEPRECATED: This message is not currently used, but if we ever do need it, we will want to
 * move it out of CommonTlsContext and into common.proto, similar to the existing
 * CertificateProviderPluginInstance message.
 * 
 * [#not-implemented-hide:]
 */
export interface _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider__Output {
  /**
   * opaque name used to specify certificate instances or types. For example, "ROOTCA" to specify
   * a root-certificate (validation context) or "TLS" to specify a new tls-certificate.
   */
  'name': (string);
  'typed_config'?: (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Provider specific config.
   * Note: an implementation is expected to dedup multiple instances of the same config
   * to maintain a single certificate-provider instance. The sharing can happen, for
   * example, among multiple clusters or between the tls_certificate and validation_context
   * certificate providers of a cluster.
   * This config could be supplied inline or (in future) a named xDS resource.
   */
  'config'?: "typed_config";
}

/**
 * Similar to CertificateProvider above, but allows the provider instances to be configured on
 * the client side instead of being sent from the control plane.
 * 
 * DEPRECATED: This message was moved outside of CommonTlsContext
 * and now lives in common.proto.
 * 
 * [#not-implemented-hide:]
 */
export interface _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance {
  /**
   * Provider instance name. This name must be defined in the client's configuration (e.g., a
   * bootstrap file) to correspond to a provider instance (i.e., the same data in the typed_config
   * field that would be sent in the CertificateProvider message if the config was sent by the
   * control plane). If not present, defaults to "default".
   * 
   * Instance names should generally be defined not in terms of the underlying provider
   * implementation (e.g., "file_watcher") but rather in terms of the function of the
   * certificates (e.g., "foo_deployment_identity").
   */
  'instance_name'?: (string);
  /**
   * Opaque name used to specify certificate instances or types. For example, "ROOTCA" to specify
   * a root-certificate (validation context) or "example.com" to specify a certificate for a
   * particular domain. Not all provider instances will actually use this field, so the value
   * defaults to the empty string.
   */
  'certificate_name'?: (string);
}

/**
 * Similar to CertificateProvider above, but allows the provider instances to be configured on
 * the client side instead of being sent from the control plane.
 * 
 * DEPRECATED: This message was moved outside of CommonTlsContext
 * and now lives in common.proto.
 * 
 * [#not-implemented-hide:]
 */
export interface _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance__Output {
  /**
   * Provider instance name. This name must be defined in the client's configuration (e.g., a
   * bootstrap file) to correspond to a provider instance (i.e., the same data in the typed_config
   * field that would be sent in the CertificateProvider message if the config was sent by the
   * control plane). If not present, defaults to "default".
   * 
   * Instance names should generally be defined not in terms of the underlying provider
   * implementation (e.g., "file_watcher") but rather in terms of the function of the
   * certificates (e.g., "foo_deployment_identity").
   */
  'instance_name': (string);
  /**
   * Opaque name used to specify certificate instances or types. For example, "ROOTCA" to specify
   * a root-certificate (validation context) or "example.com" to specify a certificate for a
   * particular domain. Not all provider instances will actually use this field, so the value
   * defaults to the empty string.
   */
  'certificate_name': (string);
}

export interface _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CombinedCertificateValidationContext {
  /**
   * How to validate peer certificates.
   */
  'default_validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext | null);
  /**
   * Config for fetching validation context via SDS API. Note SDS API allows certificates to be
   * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
   */
  'validation_context_sds_secret_config'?: (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig | null);
  /**
   * Certificate provider for fetching CA certs. This will populate the
   * ``default_validation_context.trusted_ca`` field.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider | null);
  /**
   * Certificate provider instance for fetching CA certs. This will populate the
   * ``default_validation_context.trusted_ca`` field.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider_instance'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance | null);
}

export interface _envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CombinedCertificateValidationContext__Output {
  /**
   * How to validate peer certificates.
   */
  'default_validation_context': (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext__Output | null);
  /**
   * Config for fetching validation context via SDS API. Note SDS API allows certificates to be
   * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
   */
  'validation_context_sds_secret_config': (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig__Output | null);
  /**
   * Certificate provider for fetching CA certs. This will populate the
   * ``default_validation_context.trusted_ca`` field.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider': (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider__Output | null);
  /**
   * Certificate provider instance for fetching CA certs. This will populate the
   * ``default_validation_context.trusted_ca`` field.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider_instance': (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance__Output | null);
}

/**
 * TLS context shared by both client and server TLS contexts.
 * [#next-free-field: 16]
 */
export interface CommonTlsContext {
  /**
   * TLS protocol versions, cipher suites etc.
   */
  'tls_params'?: (_envoy_extensions_transport_sockets_tls_v3_TlsParameters | null);
  /**
   * Only a single TLS certificate is supported in client contexts. In server contexts,
   * :ref:`Multiple TLS certificates <arch_overview_ssl_cert_select>` can be associated with the
   * same context to allow both RSA and ECDSA certificates and support SNI-based selection.
   * 
   * If ``tls_certificate_provider_instance`` is set, this field is ignored.
   * If this field is set, ``tls_certificate_sds_secret_configs`` is ignored.
   */
  'tls_certificates'?: (_envoy_extensions_transport_sockets_tls_v3_TlsCertificate)[];
  /**
   * How to validate peer certificates.
   */
  'validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext | null);
  /**
   * Supplies the list of ALPN protocols that the listener should expose. In
   * practice this is likely to be set to one of two values (see the
   * :ref:`codec_type
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.codec_type>`
   * parameter in the HTTP connection manager for more information):
   * 
   * * "h2,http/1.1" If the listener is going to support both HTTP/2 and HTTP/1.1.
   * * "http/1.1" If the listener is only going to support HTTP/1.1.
   * 
   * There is no default for this parameter. If empty, Envoy will not expose ALPN.
   */
  'alpn_protocols'?: (string)[];
  /**
   * Configs for fetching TLS certificates via SDS API. Note SDS API allows certificates to be
   * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
   * 
   * The same number and types of certificates as :ref:`tls_certificates <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CommonTlsContext.tls_certificates>`
   * are valid in the the certificates fetched through this setting.
   * 
   * If ``tls_certificates`` or ``tls_certificate_provider_instance`` are set, this field
   * is ignored.
   */
  'tls_certificate_sds_secret_configs'?: (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig)[];
  /**
   * Config for fetching validation context via SDS API. Note SDS API allows certificates to be
   * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
   */
  'validation_context_sds_secret_config'?: (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig | null);
  /**
   * Combined certificate validation context holds a default CertificateValidationContext
   * and SDS config. When SDS server returns dynamic CertificateValidationContext, both dynamic
   * and default CertificateValidationContext are merged into a new CertificateValidationContext
   * for validation. This merge is done by Message::MergeFrom(), so dynamic
   * CertificateValidationContext overwrites singular fields in default
   * CertificateValidationContext, and concatenates repeated fields to default
   * CertificateValidationContext, and logical OR is applied to boolean fields.
   */
  'combined_validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CombinedCertificateValidationContext | null);
  /**
   * Certificate provider for fetching TLS certificates.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'tls_certificate_certificate_provider'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider | null);
  /**
   * Certificate provider for fetching validation context.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider | null);
  /**
   * Certificate provider instance for fetching TLS certificates.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'tls_certificate_certificate_provider_instance'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance | null);
  /**
   * Certificate provider instance for fetching validation context.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider_instance'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance | null);
  /**
   * Custom TLS handshaker. If empty, defaults to native TLS handshaking
   * behavior.
   */
  'custom_handshaker'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * Certificate provider instance for fetching TLS certs.
   * 
   * If this field is set, ``tls_certificates`` and ``tls_certificate_provider_instance``
   * are ignored.
   * [#not-implemented-hide:]
   */
  'tls_certificate_provider_instance'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance | null);
  /**
   * TLS key log configuration
   */
  'key_log'?: (_envoy_extensions_transport_sockets_tls_v3_TlsKeyLog | null);
  'validation_context_type'?: "validation_context"|"validation_context_sds_secret_config"|"combined_validation_context"|"validation_context_certificate_provider"|"validation_context_certificate_provider_instance";
}

/**
 * TLS context shared by both client and server TLS contexts.
 * [#next-free-field: 16]
 */
export interface CommonTlsContext__Output {
  /**
   * TLS protocol versions, cipher suites etc.
   */
  'tls_params': (_envoy_extensions_transport_sockets_tls_v3_TlsParameters__Output | null);
  /**
   * Only a single TLS certificate is supported in client contexts. In server contexts,
   * :ref:`Multiple TLS certificates <arch_overview_ssl_cert_select>` can be associated with the
   * same context to allow both RSA and ECDSA certificates and support SNI-based selection.
   * 
   * If ``tls_certificate_provider_instance`` is set, this field is ignored.
   * If this field is set, ``tls_certificate_sds_secret_configs`` is ignored.
   */
  'tls_certificates': (_envoy_extensions_transport_sockets_tls_v3_TlsCertificate__Output)[];
  /**
   * How to validate peer certificates.
   */
  'validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CertificateValidationContext__Output | null);
  /**
   * Supplies the list of ALPN protocols that the listener should expose. In
   * practice this is likely to be set to one of two values (see the
   * :ref:`codec_type
   * <envoy_v3_api_field_extensions.filters.network.http_connection_manager.v3.HttpConnectionManager.codec_type>`
   * parameter in the HTTP connection manager for more information):
   * 
   * * "h2,http/1.1" If the listener is going to support both HTTP/2 and HTTP/1.1.
   * * "http/1.1" If the listener is only going to support HTTP/1.1.
   * 
   * There is no default for this parameter. If empty, Envoy will not expose ALPN.
   */
  'alpn_protocols': (string)[];
  /**
   * Configs for fetching TLS certificates via SDS API. Note SDS API allows certificates to be
   * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
   * 
   * The same number and types of certificates as :ref:`tls_certificates <envoy_v3_api_field_extensions.transport_sockets.tls.v3.CommonTlsContext.tls_certificates>`
   * are valid in the the certificates fetched through this setting.
   * 
   * If ``tls_certificates`` or ``tls_certificate_provider_instance`` are set, this field
   * is ignored.
   */
  'tls_certificate_sds_secret_configs': (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig__Output)[];
  /**
   * Config for fetching validation context via SDS API. Note SDS API allows certificates to be
   * fetched/refreshed over the network asynchronously with respect to the TLS handshake.
   */
  'validation_context_sds_secret_config'?: (_envoy_extensions_transport_sockets_tls_v3_SdsSecretConfig__Output | null);
  /**
   * Combined certificate validation context holds a default CertificateValidationContext
   * and SDS config. When SDS server returns dynamic CertificateValidationContext, both dynamic
   * and default CertificateValidationContext are merged into a new CertificateValidationContext
   * for validation. This merge is done by Message::MergeFrom(), so dynamic
   * CertificateValidationContext overwrites singular fields in default
   * CertificateValidationContext, and concatenates repeated fields to default
   * CertificateValidationContext, and logical OR is applied to boolean fields.
   */
  'combined_validation_context'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CombinedCertificateValidationContext__Output | null);
  /**
   * Certificate provider for fetching TLS certificates.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'tls_certificate_certificate_provider': (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider__Output | null);
  /**
   * Certificate provider for fetching validation context.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProvider__Output | null);
  /**
   * Certificate provider instance for fetching TLS certificates.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'tls_certificate_certificate_provider_instance': (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance__Output | null);
  /**
   * Certificate provider instance for fetching validation context.
   * [#not-implemented-hide:]
   * @deprecated
   */
  'validation_context_certificate_provider_instance'?: (_envoy_extensions_transport_sockets_tls_v3_CommonTlsContext_CertificateProviderInstance__Output | null);
  /**
   * Custom TLS handshaker. If empty, defaults to native TLS handshaking
   * behavior.
   */
  'custom_handshaker': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Certificate provider instance for fetching TLS certs.
   * 
   * If this field is set, ``tls_certificates`` and ``tls_certificate_provider_instance``
   * are ignored.
   * [#not-implemented-hide:]
   */
  'tls_certificate_provider_instance': (_envoy_extensions_transport_sockets_tls_v3_CertificateProviderPluginInstance__Output | null);
  /**
   * TLS key log configuration
   */
  'key_log': (_envoy_extensions_transport_sockets_tls_v3_TlsKeyLog__Output | null);
  'validation_context_type'?: "validation_context"|"validation_context_sds_secret_config"|"combined_validation_context"|"validation_context_certificate_provider"|"validation_context_certificate_provider_instance";
}
