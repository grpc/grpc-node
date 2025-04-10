// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

import type { Permission as _envoy_config_rbac_v3_Permission, Permission__Output as _envoy_config_rbac_v3_Permission__Output } from '../../../../envoy/config/rbac/v3/Permission';
import type { Principal as _envoy_config_rbac_v3_Principal, Principal__Output as _envoy_config_rbac_v3_Principal__Output } from '../../../../envoy/config/rbac/v3/Principal';
import type { Expr as _google_api_expr_v1alpha1_Expr, Expr__Output as _google_api_expr_v1alpha1_Expr__Output } from '../../../../google/api/expr/v1alpha1/Expr';
import type { CheckedExpr as _google_api_expr_v1alpha1_CheckedExpr, CheckedExpr__Output as _google_api_expr_v1alpha1_CheckedExpr__Output } from '../../../../google/api/expr/v1alpha1/CheckedExpr';

/**
 * Policy specifies a role and the principals that are assigned/denied the role.
 * A policy matches if and only if at least one of its permissions match the
 * action taking place AND at least one of its principals match the downstream
 * AND the condition is true if specified.
 */
export interface Policy {
  /**
   * Required. The set of permissions that define a role. Each permission is
   * matched with OR semantics. To match all actions for this policy, a single
   * Permission with the ``any`` field set to true should be used.
   */
  'permissions'?: (_envoy_config_rbac_v3_Permission)[];
  /**
   * Required. The set of principals that are assigned/denied the role based on
   * “action”. Each principal is matched with OR semantics. To match all
   * downstreams for this policy, a single Principal with the ``any`` field set to
   * true should be used.
   */
  'principals'?: (_envoy_config_rbac_v3_Principal)[];
  /**
   * An optional symbolic expression specifying an access control
   * :ref:`condition <arch_overview_condition>`. The condition is combined
   * with the permissions and the principals as a clause with AND semantics.
   * Only be used when checked_condition is not used.
   */
  'condition'?: (_google_api_expr_v1alpha1_Expr | null);
  /**
   * [#not-implemented-hide:]
   * An optional symbolic expression that has been successfully type checked.
   * Only be used when condition is not used.
   */
  'checked_condition'?: (_google_api_expr_v1alpha1_CheckedExpr | null);
}

/**
 * Policy specifies a role and the principals that are assigned/denied the role.
 * A policy matches if and only if at least one of its permissions match the
 * action taking place AND at least one of its principals match the downstream
 * AND the condition is true if specified.
 */
export interface Policy__Output {
  /**
   * Required. The set of permissions that define a role. Each permission is
   * matched with OR semantics. To match all actions for this policy, a single
   * Permission with the ``any`` field set to true should be used.
   */
  'permissions': (_envoy_config_rbac_v3_Permission__Output)[];
  /**
   * Required. The set of principals that are assigned/denied the role based on
   * “action”. Each principal is matched with OR semantics. To match all
   * downstreams for this policy, a single Principal with the ``any`` field set to
   * true should be used.
   */
  'principals': (_envoy_config_rbac_v3_Principal__Output)[];
  /**
   * An optional symbolic expression specifying an access control
   * :ref:`condition <arch_overview_condition>`. The condition is combined
   * with the permissions and the principals as a clause with AND semantics.
   * Only be used when checked_condition is not used.
   */
  'condition': (_google_api_expr_v1alpha1_Expr__Output | null);
  /**
   * [#not-implemented-hide:]
   * An optional symbolic expression that has been successfully type checked.
   * Only be used when condition is not used.
   */
  'checked_condition': (_google_api_expr_v1alpha1_CheckedExpr__Output | null);
}
