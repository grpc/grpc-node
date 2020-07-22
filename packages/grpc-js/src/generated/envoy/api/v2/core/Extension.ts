// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { BuildVersion as _envoy_api_v2_core_BuildVersion, BuildVersion__Output as _envoy_api_v2_core_BuildVersion__Output } from '../../../../envoy/api/v2/core/BuildVersion';

/**
 * Version and identification for an Envoy extension.
 * [#next-free-field: 6]
 */
export interface Extension {
  /**
   * This is the name of the Envoy filter as specified in the Envoy
   * configuration, e.g. envoy.filters.http.router, com.acme.widget.
   */
  'name'?: (string);
  /**
   * Category of the extension.
   * Extension category names use reverse DNS notation. For instance "envoy.filters.listener"
   * for Envoy's built-in listener filters or "com.acme.filters.http" for HTTP filters from
   * acme.com vendor.
   * [#comment:TODO(yanavlasov): Link to the doc with existing envoy category names.]
   */
  'category'?: (string);
  /**
   * [#not-implemented-hide:] Type descriptor of extension configuration proto.
   * [#comment:TODO(yanavlasov): Link to the doc with existing configuration protos.]
   * [#comment:TODO(yanavlasov): Add tests when PR #9391 lands.]
   */
  'type_descriptor'?: (string);
  /**
   * The version is a property of the extension and maintained independently
   * of other extensions and the Envoy API.
   * This field is not set when extension did not provide version information.
   */
  'version'?: (_envoy_api_v2_core_BuildVersion);
  /**
   * Indicates that the extension is present but was disabled via dynamic configuration.
   */
  'disabled'?: (boolean);
}

/**
 * Version and identification for an Envoy extension.
 * [#next-free-field: 6]
 */
export interface Extension__Output {
  /**
   * This is the name of the Envoy filter as specified in the Envoy
   * configuration, e.g. envoy.filters.http.router, com.acme.widget.
   */
  'name': (string);
  /**
   * Category of the extension.
   * Extension category names use reverse DNS notation. For instance "envoy.filters.listener"
   * for Envoy's built-in listener filters or "com.acme.filters.http" for HTTP filters from
   * acme.com vendor.
   * [#comment:TODO(yanavlasov): Link to the doc with existing envoy category names.]
   */
  'category': (string);
  /**
   * [#not-implemented-hide:] Type descriptor of extension configuration proto.
   * [#comment:TODO(yanavlasov): Link to the doc with existing configuration protos.]
   * [#comment:TODO(yanavlasov): Add tests when PR #9391 lands.]
   */
  'type_descriptor': (string);
  /**
   * The version is a property of the extension and maintained independently
   * of other extensions and the Envoy API.
   * This field is not set when extension did not provide version information.
   */
  'version'?: (_envoy_api_v2_core_BuildVersion__Output);
  /**
   * Indicates that the extension is present but was disabled via dynamic configuration.
   */
  'disabled': (boolean);
}
