// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

import type { _envoy_config_rbac_v3_RBAC_Action, _envoy_config_rbac_v3_RBAC_Action__Output } from '../../../../envoy/config/rbac/v3/RBAC';

/**
 * Action defines the result of allowance or denial when a request matches the matcher.
 */
export interface Action {
  /**
   * The name indicates the policy name.
   */
  'name'?: (string);
  /**
   * The action to take if the matcher matches. Every action either allows or denies a request,
   * and can also carry out action-specific operations.
   * 
   * Actions:
   * 
   * * ``ALLOW``: If the request gets matched on ALLOW, it is permitted.
   * * ``DENY``: If the request gets matched on DENY, it is not permitted.
   * * ``LOG``: If the request gets matched on LOG, it is permitted. Besides, the
   * dynamic metadata key ``access_log_hint`` under the shared key namespace
   * ``envoy.common`` will be set to the value ``true``.
   * * If the request cannot get matched, it will fallback to ``DENY``.
   * 
   * Log behavior:
   * 
   * If the RBAC matcher contains at least one LOG action, the dynamic
   * metadata key ``access_log_hint`` will be set based on if the request
   * get matched on the LOG action.
   */
  'action'?: (_envoy_config_rbac_v3_RBAC_Action);
}

/**
 * Action defines the result of allowance or denial when a request matches the matcher.
 */
export interface Action__Output {
  /**
   * The name indicates the policy name.
   */
  'name': (string);
  /**
   * The action to take if the matcher matches. Every action either allows or denies a request,
   * and can also carry out action-specific operations.
   * 
   * Actions:
   * 
   * * ``ALLOW``: If the request gets matched on ALLOW, it is permitted.
   * * ``DENY``: If the request gets matched on DENY, it is not permitted.
   * * ``LOG``: If the request gets matched on LOG, it is permitted. Besides, the
   * dynamic metadata key ``access_log_hint`` under the shared key namespace
   * ``envoy.common`` will be set to the value ``true``.
   * * If the request cannot get matched, it will fallback to ``DENY``.
   * 
   * Log behavior:
   * 
   * If the RBAC matcher contains at least one LOG action, the dynamic
   * metadata key ``access_log_hint`` will be set based on if the request
   * get matched on the LOG action.
   */
  'action': (_envoy_config_rbac_v3_RBAC_Action__Output);
}
