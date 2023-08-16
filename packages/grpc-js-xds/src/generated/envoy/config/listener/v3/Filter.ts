// Original file: deps/envoy-api/envoy/config/listener/v3/listener_components.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';
import type { ExtensionConfigSource as _envoy_config_core_v3_ExtensionConfigSource, ExtensionConfigSource__Output as _envoy_config_core_v3_ExtensionConfigSource__Output } from '../../../../envoy/config/core/v3/ExtensionConfigSource';

/**
 * [#next-free-field: 6]
 */
export interface Filter {
  /**
   * The name of the filter configuration.
   */
  'name'?: (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   * [#extension-category: envoy.filters.network]
   */
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Configuration source specifier for an extension configuration discovery
   * service. In case of a failure and without the default configuration, the
   * listener closes the connections.
   * [#not-implemented-hide:]
   */
  'config_discovery'?: (_envoy_config_core_v3_ExtensionConfigSource | null);
  'config_type'?: "typed_config"|"config_discovery";
}

/**
 * [#next-free-field: 6]
 */
export interface Filter__Output {
  /**
   * The name of the filter configuration.
   */
  'name': (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   * [#extension-category: envoy.filters.network]
   */
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Configuration source specifier for an extension configuration discovery
   * service. In case of a failure and without the default configuration, the
   * listener closes the connections.
   * [#not-implemented-hide:]
   */
  'config_discovery'?: (_envoy_config_core_v3_ExtensionConfigSource__Output | null);
  'config_type': "typed_config"|"config_discovery";
}
