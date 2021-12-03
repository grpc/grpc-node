// Original file: deps/envoy-api/envoy/config/route/v3/route.proto

import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

/**
 * Configuration for a cluster specifier plugin.
 */
export interface ClusterSpecifierPlugin {
  /**
   * The name of the plugin and its opaque configuration.
   */
  'extension'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
}

/**
 * Configuration for a cluster specifier plugin.
 */
export interface ClusterSpecifierPlugin__Output {
  /**
   * The name of the plugin and its opaque configuration.
   */
  'extension': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
}
