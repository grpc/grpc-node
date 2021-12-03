// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { ListStringMatcher as _envoy_type_matcher_v3_ListStringMatcher, ListStringMatcher__Output as _envoy_type_matcher_v3_ListStringMatcher__Output } from '../../../../envoy/type/matcher/v3/ListStringMatcher';

/**
 * Configuration for disabling stat instantiation.
 */
export interface StatsMatcher {
  /**
   * If `reject_all` is true, then all stats are disabled. If `reject_all` is false, then all
   * stats are enabled.
   */
  'reject_all'?: (boolean);
  /**
   * Exclusive match. All stats are enabled except for those matching one of the supplied
   * StringMatcher protos.
   */
  'exclusion_list'?: (_envoy_type_matcher_v3_ListStringMatcher | null);
  /**
   * Inclusive match. No stats are enabled except for those matching one of the supplied
   * StringMatcher protos.
   */
  'inclusion_list'?: (_envoy_type_matcher_v3_ListStringMatcher | null);
  'stats_matcher'?: "reject_all"|"exclusion_list"|"inclusion_list";
}

/**
 * Configuration for disabling stat instantiation.
 */
export interface StatsMatcher__Output {
  /**
   * If `reject_all` is true, then all stats are disabled. If `reject_all` is false, then all
   * stats are enabled.
   */
  'reject_all'?: (boolean);
  /**
   * Exclusive match. All stats are enabled except for those matching one of the supplied
   * StringMatcher protos.
   */
  'exclusion_list'?: (_envoy_type_matcher_v3_ListStringMatcher__Output | null);
  /**
   * Inclusive match. No stats are enabled except for those matching one of the supplied
   * StringMatcher protos.
   */
  'inclusion_list'?: (_envoy_type_matcher_v3_ListStringMatcher__Output | null);
  'stats_matcher': "reject_all"|"exclusion_list"|"inclusion_list";
}
