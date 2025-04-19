// Original file: deps/envoy-api/envoy/extensions/filters/http/rbac/v3/rbac.proto

import type { RBAC as _envoy_config_rbac_v3_RBAC, RBAC__Output as _envoy_config_rbac_v3_RBAC__Output } from '../../../../../../envoy/config/rbac/v3/RBAC';
import type { Matcher as _xds_type_matcher_v3_Matcher, Matcher__Output as _xds_type_matcher_v3_Matcher__Output } from '../../../../../../xds/type/matcher/v3/Matcher';

/**
 * RBAC filter config.
 * [#next-free-field: 8]
 */
export interface RBAC {
  /**
   * Specify the RBAC rules to be applied globally.
   * If absent, no enforcing RBAC policy will be applied.
   * If present and empty, DENY.
   * If both rules and matcher are configured, rules will be ignored.
   */
  'rules'?: (_envoy_config_rbac_v3_RBAC | null);
  /**
   * Shadow rules are not enforced by the filter (i.e., returning a 403)
   * but will emit stats and logs and can be used for rule testing.
   * If absent, no shadow RBAC policy will be applied.
   * If both shadow rules and shadow matcher are configured, shadow rules will be ignored.
   */
  'shadow_rules'?: (_envoy_config_rbac_v3_RBAC | null);
  /**
   * If specified, shadow rules will emit stats with the given prefix.
   * This is useful to distinguish the stat when there are more than 1 RBAC filter configured with
   * shadow rules.
   */
  'shadow_rules_stat_prefix'?: (string);
  /**
   * The match tree to use when resolving RBAC action for incoming requests. Requests do not
   * match any matcher will be denied.
   * If absent, no enforcing RBAC matcher will be applied.
   * If present and empty, deny all requests.
   */
  'matcher'?: (_xds_type_matcher_v3_Matcher | null);
  /**
   * The match tree to use for emitting stats and logs which can be used for rule testing for
   * incoming requests.
   * If absent, no shadow matcher will be applied.
   */
  'shadow_matcher'?: (_xds_type_matcher_v3_Matcher | null);
  /**
   * If specified, rules will emit stats with the given prefix.
   * This is useful to distinguish the stat when there are more than 1 RBAC filter configured with
   * rules.
   */
  'rules_stat_prefix'?: (string);
  /**
   * If track_per_rule_stats is true, counters will be published for each rule and shadow rule.
   */
  'track_per_rule_stats'?: (boolean);
}

/**
 * RBAC filter config.
 * [#next-free-field: 8]
 */
export interface RBAC__Output {
  /**
   * Specify the RBAC rules to be applied globally.
   * If absent, no enforcing RBAC policy will be applied.
   * If present and empty, DENY.
   * If both rules and matcher are configured, rules will be ignored.
   */
  'rules': (_envoy_config_rbac_v3_RBAC__Output | null);
  /**
   * Shadow rules are not enforced by the filter (i.e., returning a 403)
   * but will emit stats and logs and can be used for rule testing.
   * If absent, no shadow RBAC policy will be applied.
   * If both shadow rules and shadow matcher are configured, shadow rules will be ignored.
   */
  'shadow_rules': (_envoy_config_rbac_v3_RBAC__Output | null);
  /**
   * If specified, shadow rules will emit stats with the given prefix.
   * This is useful to distinguish the stat when there are more than 1 RBAC filter configured with
   * shadow rules.
   */
  'shadow_rules_stat_prefix': (string);
  /**
   * The match tree to use when resolving RBAC action for incoming requests. Requests do not
   * match any matcher will be denied.
   * If absent, no enforcing RBAC matcher will be applied.
   * If present and empty, deny all requests.
   */
  'matcher': (_xds_type_matcher_v3_Matcher__Output | null);
  /**
   * The match tree to use for emitting stats and logs which can be used for rule testing for
   * incoming requests.
   * If absent, no shadow matcher will be applied.
   */
  'shadow_matcher': (_xds_type_matcher_v3_Matcher__Output | null);
  /**
   * If specified, rules will emit stats with the given prefix.
   * This is useful to distinguish the stat when there are more than 1 RBAC filter configured with
   * rules.
   */
  'rules_stat_prefix': (string);
  /**
   * If track_per_rule_stats is true, counters will be published for each rule and shadow rule.
   */
  'track_per_rule_stats': (boolean);
}
