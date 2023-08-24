// Original file: deps/xds/xds/type/matcher/v3/matcher.proto

import type { Matcher as _xds_type_matcher_v3_Matcher, Matcher__Output as _xds_type_matcher_v3_Matcher__Output } from '../../../../xds/type/matcher/v3/Matcher';
import type { TypedExtensionConfig as _xds_core_v3_TypedExtensionConfig, TypedExtensionConfig__Output as _xds_core_v3_TypedExtensionConfig__Output } from '../../../../xds/core/v3/TypedExtensionConfig';
import type { StringMatcher as _xds_type_matcher_v3_StringMatcher, StringMatcher__Output as _xds_type_matcher_v3_StringMatcher__Output } from '../../../../xds/type/matcher/v3/StringMatcher';

/**
 * An individual matcher.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_FieldMatcher {
  /**
   * Determines if the match succeeds.
   */
  'predicate'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate | null);
  /**
   * What to do if the match succeeds.
   */
  'on_match'?: (_xds_type_matcher_v3_Matcher_OnMatch | null);
}

/**
 * An individual matcher.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_FieldMatcher__Output {
  /**
   * Determines if the match succeeds.
   */
  'predicate': (_xds_type_matcher_v3_Matcher_MatcherList_Predicate__Output | null);
  /**
   * What to do if the match succeeds.
   */
  'on_match': (_xds_type_matcher_v3_Matcher_OnMatch__Output | null);
}

/**
 * A map of configured matchers. Used to allow using a map within a oneof.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherTree_MatchMap {
  'map'?: ({[key: string]: _xds_type_matcher_v3_Matcher_OnMatch});
}

/**
 * A map of configured matchers. Used to allow using a map within a oneof.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherTree_MatchMap__Output {
  'map': ({[key: string]: _xds_type_matcher_v3_Matcher_OnMatch__Output});
}

/**
 * A linear list of field matchers.
 * The field matchers are evaluated in order, and the first match
 * wins.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList {
  /**
   * A list of matchers. First match wins.
   */
  'matchers'?: (_xds_type_matcher_v3_Matcher_MatcherList_FieldMatcher)[];
}

/**
 * A linear list of field matchers.
 * The field matchers are evaluated in order, and the first match
 * wins.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList__Output {
  /**
   * A list of matchers. First match wins.
   */
  'matchers': (_xds_type_matcher_v3_Matcher_MatcherList_FieldMatcher__Output)[];
}

export interface _xds_type_matcher_v3_Matcher_MatcherTree {
  /**
   * Protocol-specific specification of input field to match on.
   */
  'input'?: (_xds_core_v3_TypedExtensionConfig | null);
  'exact_match_map'?: (_xds_type_matcher_v3_Matcher_MatcherTree_MatchMap | null);
  /**
   * Longest matching prefix wins.
   */
  'prefix_match_map'?: (_xds_type_matcher_v3_Matcher_MatcherTree_MatchMap | null);
  /**
   * Extension for custom matching logic.
   */
  'custom_match'?: (_xds_core_v3_TypedExtensionConfig | null);
  /**
   * Exact or prefix match maps in which to look up the input value.
   * If the lookup succeeds, the match is considered successful, and
   * the corresponding OnMatch is used.
   */
  'tree_type'?: "exact_match_map"|"prefix_match_map"|"custom_match";
}

export interface _xds_type_matcher_v3_Matcher_MatcherTree__Output {
  /**
   * Protocol-specific specification of input field to match on.
   */
  'input': (_xds_core_v3_TypedExtensionConfig__Output | null);
  'exact_match_map'?: (_xds_type_matcher_v3_Matcher_MatcherTree_MatchMap__Output | null);
  /**
   * Longest matching prefix wins.
   */
  'prefix_match_map'?: (_xds_type_matcher_v3_Matcher_MatcherTree_MatchMap__Output | null);
  /**
   * Extension for custom matching logic.
   */
  'custom_match'?: (_xds_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Exact or prefix match maps in which to look up the input value.
   * If the lookup succeeds, the match is considered successful, and
   * the corresponding OnMatch is used.
   */
  'tree_type': "exact_match_map"|"prefix_match_map"|"custom_match";
}

/**
 * What to do if a match is successful.
 */
export interface _xds_type_matcher_v3_Matcher_OnMatch {
  /**
   * Nested matcher to evaluate.
   * If the nested matcher does not match and does not specify
   * on_no_match, then this matcher is considered not to have
   * matched, even if a predicate at this level or above returned
   * true.
   */
  'matcher'?: (_xds_type_matcher_v3_Matcher | null);
  /**
   * Protocol-specific action to take.
   */
  'action'?: (_xds_core_v3_TypedExtensionConfig | null);
  'on_match'?: "matcher"|"action";
}

/**
 * What to do if a match is successful.
 */
export interface _xds_type_matcher_v3_Matcher_OnMatch__Output {
  /**
   * Nested matcher to evaluate.
   * If the nested matcher does not match and does not specify
   * on_no_match, then this matcher is considered not to have
   * matched, even if a predicate at this level or above returned
   * true.
   */
  'matcher'?: (_xds_type_matcher_v3_Matcher__Output | null);
  /**
   * Protocol-specific action to take.
   */
  'action'?: (_xds_core_v3_TypedExtensionConfig__Output | null);
  'on_match': "matcher"|"action";
}

/**
 * Predicate to determine if a match is successful.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_Predicate {
  /**
   * A single predicate to evaluate.
   */
  'single_predicate'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate_SinglePredicate | null);
  /**
   * A list of predicates to be OR-ed together.
   */
  'or_matcher'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate_PredicateList | null);
  /**
   * A list of predicates to be AND-ed together.
   */
  'and_matcher'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate_PredicateList | null);
  /**
   * The invert of a predicate
   */
  'not_matcher'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate | null);
  'match_type'?: "single_predicate"|"or_matcher"|"and_matcher"|"not_matcher";
}

/**
 * Predicate to determine if a match is successful.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_Predicate__Output {
  /**
   * A single predicate to evaluate.
   */
  'single_predicate'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate_SinglePredicate__Output | null);
  /**
   * A list of predicates to be OR-ed together.
   */
  'or_matcher'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate_PredicateList__Output | null);
  /**
   * A list of predicates to be AND-ed together.
   */
  'and_matcher'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate_PredicateList__Output | null);
  /**
   * The invert of a predicate
   */
  'not_matcher'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate__Output | null);
  'match_type': "single_predicate"|"or_matcher"|"and_matcher"|"not_matcher";
}

/**
 * A list of two or more matchers. Used to allow using a list within a oneof.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_Predicate_PredicateList {
  'predicate'?: (_xds_type_matcher_v3_Matcher_MatcherList_Predicate)[];
}

/**
 * A list of two or more matchers. Used to allow using a list within a oneof.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_Predicate_PredicateList__Output {
  'predicate': (_xds_type_matcher_v3_Matcher_MatcherList_Predicate__Output)[];
}

/**
 * Predicate for a single input field.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_Predicate_SinglePredicate {
  /**
   * Protocol-specific specification of input field to match on.
   * [#extension-category: envoy.matching.common_inputs]
   */
  'input'?: (_xds_core_v3_TypedExtensionConfig | null);
  /**
   * Built-in string matcher.
   */
  'value_match'?: (_xds_type_matcher_v3_StringMatcher | null);
  /**
   * Extension for custom matching logic.
   * [#extension-category: envoy.matching.input_matchers]
   */
  'custom_match'?: (_xds_core_v3_TypedExtensionConfig | null);
  'matcher'?: "value_match"|"custom_match";
}

/**
 * Predicate for a single input field.
 */
export interface _xds_type_matcher_v3_Matcher_MatcherList_Predicate_SinglePredicate__Output {
  /**
   * Protocol-specific specification of input field to match on.
   * [#extension-category: envoy.matching.common_inputs]
   */
  'input': (_xds_core_v3_TypedExtensionConfig__Output | null);
  /**
   * Built-in string matcher.
   */
  'value_match'?: (_xds_type_matcher_v3_StringMatcher__Output | null);
  /**
   * Extension for custom matching logic.
   * [#extension-category: envoy.matching.input_matchers]
   */
  'custom_match'?: (_xds_core_v3_TypedExtensionConfig__Output | null);
  'matcher': "value_match"|"custom_match";
}

/**
 * A matcher, which may traverse a matching tree in order to result in a match action.
 * During matching, the tree will be traversed until a match is found, or if no match
 * is found the action specified by the most specific on_no_match will be evaluated.
 * As an on_no_match might result in another matching tree being evaluated, this process
 * might repeat several times until the final OnMatch (or no match) is decided.
 */
export interface Matcher {
  /**
   * A linear list of matchers to evaluate.
   */
  'matcher_list'?: (_xds_type_matcher_v3_Matcher_MatcherList | null);
  /**
   * A match tree to evaluate.
   */
  'matcher_tree'?: (_xds_type_matcher_v3_Matcher_MatcherTree | null);
  /**
   * Optional OnMatch to use if the matcher failed.
   * If specified, the OnMatch is used, and the matcher is considered
   * to have matched.
   * If not specified, the matcher is considered not to have matched.
   */
  'on_no_match'?: (_xds_type_matcher_v3_Matcher_OnMatch | null);
  'matcher_type'?: "matcher_list"|"matcher_tree";
}

/**
 * A matcher, which may traverse a matching tree in order to result in a match action.
 * During matching, the tree will be traversed until a match is found, or if no match
 * is found the action specified by the most specific on_no_match will be evaluated.
 * As an on_no_match might result in another matching tree being evaluated, this process
 * might repeat several times until the final OnMatch (or no match) is decided.
 */
export interface Matcher__Output {
  /**
   * A linear list of matchers to evaluate.
   */
  'matcher_list'?: (_xds_type_matcher_v3_Matcher_MatcherList__Output | null);
  /**
   * A match tree to evaluate.
   */
  'matcher_tree'?: (_xds_type_matcher_v3_Matcher_MatcherTree__Output | null);
  /**
   * Optional OnMatch to use if the matcher failed.
   * If specified, the OnMatch is used, and the matcher is considered
   * to have matched.
   * If not specified, the matcher is considered not to have matched.
   */
  'on_no_match': (_xds_type_matcher_v3_Matcher_OnMatch__Output | null);
  'matcher_type': "matcher_list"|"matcher_tree";
}
