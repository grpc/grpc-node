// Original file: deps/envoy-api/envoy/extensions/filters/network/http_connection_manager/v3/http_connection_manager.proto

import type { HttpConnectionManager as _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager, HttpConnectionManager__Output as _envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager__Output } from '../../../../../../envoy/extensions/filters/network/http_connection_manager/v3/HttpConnectionManager';

/**
 * [#protodoc-title: Envoy Mobile HTTP connection manager]
 * HTTP connection manager for use in Envoy mobile.
 * [#extension: envoy.filters.network.envoy_mobile_http_connection_manager]
 */
export interface EnvoyMobileHttpConnectionManager {
  /**
   * The configuration for the underlying HttpConnectionManager which will be
   * instantiated for Envoy mobile.
   */
  'config'?: (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager | null);
}

/**
 * [#protodoc-title: Envoy Mobile HTTP connection manager]
 * HTTP connection manager for use in Envoy mobile.
 * [#extension: envoy.filters.network.envoy_mobile_http_connection_manager]
 */
export interface EnvoyMobileHttpConnectionManager__Output {
  /**
   * The configuration for the underlying HttpConnectionManager which will be
   * instantiated for Envoy mobile.
   */
  'config': (_envoy_extensions_filters_network_http_connection_manager_v3_HttpConnectionManager__Output | null);
}
