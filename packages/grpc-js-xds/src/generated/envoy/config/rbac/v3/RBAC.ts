// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

import type { Policy as _envoy_config_rbac_v3_Policy, Policy__Output as _envoy_config_rbac_v3_Policy__Output } from '../../../../envoy/config/rbac/v3/Policy';
import type { TypedExtensionConfig as _envoy_config_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _envoy_config_core_v3_TypedExtensionConfig__Output } from '../../../../envoy/config/core/v3/TypedExtensionConfig';

// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

/**
 * Should we do safe-list or block-list style access control?
 */
export const _envoy_config_rbac_v3_RBAC_Action = {
  /**
   * The policies grant access to principals. The rest are denied. This is safe-list style
   * access control. This is the default type.
   */
  ALLOW: 'ALLOW',
  /**
   * The policies deny access to principals. The rest are allowed. This is block-list style
   * access control.
   */
  DENY: 'DENY',
  /**
   * The policies set the ``access_log_hint`` dynamic metadata key based on if requests match.
   * All requests are allowed.
   */
  LOG: 'LOG',
} as const;

/**
 * Should we do safe-list or block-list style access control?
 */
export type _envoy_config_rbac_v3_RBAC_Action =
  /**
   * The policies grant access to principals. The rest are denied. This is safe-list style
   * access control. This is the default type.
   */
  | 'ALLOW'
  | 0
  /**
   * The policies deny access to principals. The rest are allowed. This is block-list style
   * access control.
   */
  | 'DENY'
  | 1
  /**
   * The policies set the ``access_log_hint`` dynamic metadata key based on if requests match.
   * All requests are allowed.
   */
  | 'LOG'
  | 2

/**
 * Should we do safe-list or block-list style access control?
 */
export type _envoy_config_rbac_v3_RBAC_Action__Output = typeof _envoy_config_rbac_v3_RBAC_Action[keyof typeof _envoy_config_rbac_v3_RBAC_Action]

// Original file: deps/envoy-api/envoy/config/rbac/v3/rbac.proto

/**
 * Deny and allow here refer to RBAC decisions, not actions.
 */
export const _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition = {
  /**
   * Never audit.
   */
  NONE: 'NONE',
  /**
   * Audit when RBAC denies the request.
   */
  ON_DENY: 'ON_DENY',
  /**
   * Audit when RBAC allows the request.
   */
  ON_ALLOW: 'ON_ALLOW',
  /**
   * Audit whether RBAC allows or denies the request.
   */
  ON_DENY_AND_ALLOW: 'ON_DENY_AND_ALLOW',
} as const;

/**
 * Deny and allow here refer to RBAC decisions, not actions.
 */
export type _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition =
  /**
   * Never audit.
   */
  | 'NONE'
  | 0
  /**
   * Audit when RBAC denies the request.
   */
  | 'ON_DENY'
  | 1
  /**
   * Audit when RBAC allows the request.
   */
  | 'ON_ALLOW'
  | 2
  /**
   * Audit whether RBAC allows or denies the request.
   */
  | 'ON_DENY_AND_ALLOW'
  | 3

/**
 * Deny and allow here refer to RBAC decisions, not actions.
 */
export type _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition__Output = typeof _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition[keyof typeof _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition]

/**
 * [#not-implemented-hide:]
 */
export interface _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditLoggerConfig {
  /**
   * Typed logger configuration.
   * 
   * [#extension-category: envoy.rbac.audit_loggers]
   */
  'audit_logger'?: (_envoy_config_core_v3_TypedExtensionConfig | null);
  /**
   * If true, when the logger is not supported, the data plane will not NACK but simply ignore it.
   */
  'is_optional'?: (boolean);
}

/**
 * [#not-implemented-hide:]
 */
export interface _envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditLoggerConfig__Output {
  /**
   * Typed logger configuration.
   * 
   * [#extension-category: envoy.rbac.audit_loggers]
   */
  'audit_logger': (_envoy_config_core_v3_TypedExtensionConfig__Output | null);
  /**
   * If true, when the logger is not supported, the data plane will not NACK but simply ignore it.
   */
  'is_optional': (boolean);
}

export interface _envoy_config_rbac_v3_RBAC_AuditLoggingOptions {
  /**
   * Condition for the audit logging to happen.
   * If this condition is met, all the audit loggers configured here will be invoked.
   * 
   * [#not-implemented-hide:]
   */
  'audit_condition'?: (_envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition);
  /**
   * Configurations for RBAC-based authorization audit loggers.
   * 
   * [#not-implemented-hide:]
   */
  'logger_configs'?: (_envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditLoggerConfig)[];
}

export interface _envoy_config_rbac_v3_RBAC_AuditLoggingOptions__Output {
  /**
   * Condition for the audit logging to happen.
   * If this condition is met, all the audit loggers configured here will be invoked.
   * 
   * [#not-implemented-hide:]
   */
  'audit_condition': (_envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditCondition__Output);
  /**
   * Configurations for RBAC-based authorization audit loggers.
   * 
   * [#not-implemented-hide:]
   */
  'logger_configs': (_envoy_config_rbac_v3_RBAC_AuditLoggingOptions_AuditLoggerConfig__Output)[];
}

/**
 * Role Based Access Control (RBAC) provides service-level and method-level access control for a
 * service. Requests are allowed or denied based on the ``action`` and whether a matching policy is
 * found. For instance, if the action is ALLOW and a matching policy is found the request should be
 * allowed.
 * 
 * RBAC can also be used to make access logging decisions by communicating with access loggers
 * through dynamic metadata. When the action is LOG and at least one policy matches, the
 * ``access_log_hint`` value in the shared key namespace 'envoy.common' is set to ``true`` indicating
 * the request should be logged.
 * 
 * Here is an example of RBAC configuration. It has two policies:
 * 
 * * Service account ``cluster.local/ns/default/sa/admin`` has full access to the service, and so
 * does "cluster.local/ns/default/sa/superuser".
 * 
 * * Any user can read (``GET``) the service at paths with prefix ``/products``, so long as the
 * destination port is either 80 or 443.
 * 
 * .. code-block:: yaml
 * 
 * action: ALLOW
 * policies:
 * "service-admin":
 * permissions:
 * - any: true
 * principals:
 * - authenticated:
 * principal_name:
 * exact: "cluster.local/ns/default/sa/admin"
 * - authenticated:
 * principal_name:
 * exact: "cluster.local/ns/default/sa/superuser"
 * "product-viewer":
 * permissions:
 * - and_rules:
 * rules:
 * - header:
 * name: ":method"
 * string_match:
 * exact: "GET"
 * - url_path:
 * path: { prefix: "/products" }
 * - or_rules:
 * rules:
 * - destination_port: 80
 * - destination_port: 443
 * principals:
 * - any: true
 */
export interface RBAC {
  /**
   * The action to take if a policy matches. Every action either allows or denies a request,
   * and can also carry out action-specific operations.
   * 
   * Actions:
   * 
   * * ``ALLOW``: Allows the request if and only if there is a policy that matches
   * the request.
   * * ``DENY``: Allows the request if and only if there are no policies that
   * match the request.
   * * ``LOG``: Allows all requests. If at least one policy matches, the dynamic
   * metadata key ``access_log_hint`` is set to the value ``true`` under the shared
   * key namespace ``envoy.common``. If no policies match, it is set to ``false``.
   * Other actions do not modify this key.
   */
  'action'?: (_envoy_config_rbac_v3_RBAC_Action);
  /**
   * Maps from policy name to policy. A match occurs when at least one policy matches the request.
   * The policies are evaluated in lexicographic order of the policy name.
   */
  'policies'?: ({[key: string]: _envoy_config_rbac_v3_Policy});
  /**
   * Audit logging options that include the condition for audit logging to happen
   * and audit logger configurations.
   * 
   * [#not-implemented-hide:]
   */
  'audit_logging_options'?: (_envoy_config_rbac_v3_RBAC_AuditLoggingOptions | null);
}

/**
 * Role Based Access Control (RBAC) provides service-level and method-level access control for a
 * service. Requests are allowed or denied based on the ``action`` and whether a matching policy is
 * found. For instance, if the action is ALLOW and a matching policy is found the request should be
 * allowed.
 * 
 * RBAC can also be used to make access logging decisions by communicating with access loggers
 * through dynamic metadata. When the action is LOG and at least one policy matches, the
 * ``access_log_hint`` value in the shared key namespace 'envoy.common' is set to ``true`` indicating
 * the request should be logged.
 * 
 * Here is an example of RBAC configuration. It has two policies:
 * 
 * * Service account ``cluster.local/ns/default/sa/admin`` has full access to the service, and so
 * does "cluster.local/ns/default/sa/superuser".
 * 
 * * Any user can read (``GET``) the service at paths with prefix ``/products``, so long as the
 * destination port is either 80 or 443.
 * 
 * .. code-block:: yaml
 * 
 * action: ALLOW
 * policies:
 * "service-admin":
 * permissions:
 * - any: true
 * principals:
 * - authenticated:
 * principal_name:
 * exact: "cluster.local/ns/default/sa/admin"
 * - authenticated:
 * principal_name:
 * exact: "cluster.local/ns/default/sa/superuser"
 * "product-viewer":
 * permissions:
 * - and_rules:
 * rules:
 * - header:
 * name: ":method"
 * string_match:
 * exact: "GET"
 * - url_path:
 * path: { prefix: "/products" }
 * - or_rules:
 * rules:
 * - destination_port: 80
 * - destination_port: 443
 * principals:
 * - any: true
 */
export interface RBAC__Output {
  /**
   * The action to take if a policy matches. Every action either allows or denies a request,
   * and can also carry out action-specific operations.
   * 
   * Actions:
   * 
   * * ``ALLOW``: Allows the request if and only if there is a policy that matches
   * the request.
   * * ``DENY``: Allows the request if and only if there are no policies that
   * match the request.
   * * ``LOG``: Allows all requests. If at least one policy matches, the dynamic
   * metadata key ``access_log_hint`` is set to the value ``true`` under the shared
   * key namespace ``envoy.common``. If no policies match, it is set to ``false``.
   * Other actions do not modify this key.
   */
  'action': (_envoy_config_rbac_v3_RBAC_Action__Output);
  /**
   * Maps from policy name to policy. A match occurs when at least one policy matches the request.
   * The policies are evaluated in lexicographic order of the policy name.
   */
  'policies': ({[key: string]: _envoy_config_rbac_v3_Policy__Output});
  /**
   * Audit logging options that include the condition for audit logging to happen
   * and audit logger configurations.
   * 
   * [#not-implemented-hide:]
   */
  'audit_logging_options': (_envoy_config_rbac_v3_RBAC_AuditLoggingOptions__Output | null);
}
