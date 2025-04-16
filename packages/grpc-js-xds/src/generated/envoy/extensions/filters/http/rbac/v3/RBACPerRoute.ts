// Original file: deps/envoy-api/envoy/extensions/filters/http/rbac/v3/rbac.proto

import type { RBAC as _envoy_extensions_filters_http_rbac_v3_RBAC, RBAC__Output as _envoy_extensions_filters_http_rbac_v3_RBAC__Output } from '../../../../../../envoy/extensions/filters/http/rbac/v3/RBAC';

export interface RBACPerRoute {
  /**
   * Override the global configuration of the filter with this new config.
   * If absent, the global RBAC policy will be disabled for this route.
   */
  'rbac'?: (_envoy_extensions_filters_http_rbac_v3_RBAC | null);
}

export interface RBACPerRoute__Output {
  /**
   * Override the global configuration of the filter with this new config.
   * If absent, the global RBAC policy will be disabled for this route.
   */
  'rbac': (_envoy_extensions_filters_http_rbac_v3_RBAC__Output | null);
}
