// Original file: deps/envoy-api/envoy/config/route/v3/route_components.proto

import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Configuration for a cluster specifier plugin.
 */
export interface ClusterSpecifierPlugin {
  /**
   * The name of the plugin and its opaque configuration.
   */
  'extension'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * If is_optional is not set or is set to false and the plugin defined by this message is not a
   * supported type, the containing resource is NACKed. If is_optional is set to true, the resource
   * would not be NACKed for this reason. In this case, routes referencing this plugin's name would
   * not be treated as an illegal configuration, but would result in a failure if the route is
   * selected.
   */
  'is_optional'?: (boolean);
}

/**
 * Configuration for a cluster specifier plugin.
 */
export interface ClusterSpecifierPlugin__Output {
  /**
   * The name of the plugin and its opaque configuration.
   */
  'extension': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * If is_optional is not set or is set to false and the plugin defined by this message is not a
   * supported type, the containing resource is NACKed. If is_optional is set to true, the resource
   * would not be NACKed for this reason. In this case, routes referencing this plugin's name would
   * not be treated as an illegal configuration, but would result in a failure if the route is
   * selected.
   */
  'is_optional': (boolean);
}
