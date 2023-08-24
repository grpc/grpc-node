// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../../google/protobuf/Any';
import type { ExtensionConfigSource as _envoy_config_core_v3_ExtensionConfigSource, ExtensionConfigSource__Output as _envoy_config_core_v3_ExtensionConfigSource__Output } from '../../../../../../envoy/config/core/v3/ExtensionConfigSource';

/**
 * [#next-free-field: 7]
 */
export interface HttpFilter {
  /**
   * The name of the filter configuration. It also serves as a resource name in ExtensionConfigDS.
   */
  'name'?: (string);
  /**
   * Filter specific configuration which depends on the filter being instantiated. See the supported
   * filters for further documentation.
   * 
   * To support configuring a :ref:`match tree <arch_overview_matching_api>`, use an
   * :ref:`ExtensionWithMatcher <envoy_v3_api_msg_extensions.common.matching.v3.ExtensionWithMatcher>`
   * with the desired HTTP filter.
   * [#extension-category: envoy.filters.http]
   */
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Configuration source specifier for an extension configuration discovery service.
   * In case of a failure and without the default configuration, the HTTP listener responds with code 500.
   * Extension configs delivered through this mechanism are not expected to require warming (see https://github.com/envoyproxy/envoy/issues/12061).
   * 
   * To support configuring a :ref:`match tree <arch_overview_matching_api>`, use an
   * :ref:`ExtensionWithMatcher <envoy_v3_api_msg_extensions.common.matching.v3.ExtensionWithMatcher>`
   * with the desired HTTP filter. This works for both the default filter configuration as well
   * as for filters provided via the API.
   */
  'config_discovery'?: (_envoy_config_core_v3_ExtensionConfigSource | null);
  /**
   * If true, clients that do not support this filter may ignore the
   * filter but otherwise accept the config.
   * Otherwise, clients that do not support this filter must reject the config.
   */
  'is_optional'?: (boolean);
  'config_type'?: "typed_config"|"config_discovery";
}

/**
 * [#next-free-field: 7]
 */
export interface HttpFilter__Output {
  /**
   * The name of the filter configuration. It also serves as a resource name in ExtensionConfigDS.
   */
  'name': (string);
  /**
   * Filter specific configuration which depends on the filter being instantiated. See the supported
   * filters for further documentation.
   * 
   * To support configuring a :ref:`match tree <arch_overview_matching_api>`, use an
   * :ref:`ExtensionWithMatcher <envoy_v3_api_msg_extensions.common.matching.v3.ExtensionWithMatcher>`
   * with the desired HTTP filter.
   * [#extension-category: envoy.filters.http]
   */
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Configuration source specifier for an extension configuration discovery service.
   * In case of a failure and without the default configuration, the HTTP listener responds with code 500.
   * Extension configs delivered through this mechanism are not expected to require warming (see https://github.com/envoyproxy/envoy/issues/12061).
   * 
   * To support configuring a :ref:`match tree <arch_overview_matching_api>`, use an
   * :ref:`ExtensionWithMatcher <envoy_v3_api_msg_extensions.common.matching.v3.ExtensionWithMatcher>`
   * with the desired HTTP filter. This works for both the default filter configuration as well
   * as for filters provided via the API.
   */
  'config_discovery'?: (_envoy_config_core_v3_ExtensionConfigSource__Output | null);
  /**
   * If true, clients that do not support this filter may ignore the
   * filter but otherwise accept the config.
   * Otherwise, clients that do not support this filter must reject the config.
   */
  'is_optional': (boolean);
  'config_type': "typed_config"|"config_discovery";
}
