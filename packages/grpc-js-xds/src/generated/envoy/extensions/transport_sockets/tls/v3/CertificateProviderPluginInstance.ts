// Original file: deps/envoy-api/envoy/extensions/transport_sockets/tls/v3/common.proto


/**
 * Indicates a certificate to be obtained from a named CertificateProvider plugin instance.
 * The plugin instances are defined in the client's bootstrap file.
 * The plugin allows certificates to be fetched/refreshed over the network asynchronously with
 * respect to the TLS handshake.
 * [#not-implemented-hide:]
 */
export interface CertificateProviderPluginInstance {
  /**
   * Provider instance name. If not present, defaults to "default".
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
 * Indicates a certificate to be obtained from a named CertificateProvider plugin instance.
 * The plugin instances are defined in the client's bootstrap file.
 * The plugin allows certificates to be fetched/refreshed over the network asynchronously with
 * respect to the TLS handshake.
 * [#not-implemented-hide:]
 */
export interface CertificateProviderPluginInstance__Output {
  /**
   * Provider instance name. If not present, defaults to "default".
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
