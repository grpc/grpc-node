// Original file: deps/envoy-api/envoy/type/matcher/v3/node.proto

import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';
import type { StructMatcher as _envoy_type_matcher_v3_StructMatcher, StructMatcher__Output as _envoy_type_matcher_v3_StructMatcher__Output } from '../../../../envoy/type/matcher/v3/StructMatcher';

/**
 * Specifies the way to match a Node.
 * The match follows AND semantics.
 */
export interface NodeMatcher {
  /**
   * Specifies match criteria on the node id.
   */
  'node_id'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * Specifies match criteria on the node metadata.
   */
  'node_metadatas'?: (_envoy_type_matcher_v3_StructMatcher)[];
}

/**
 * Specifies the way to match a Node.
 * The match follows AND semantics.
 */
export interface NodeMatcher__Output {
  /**
   * Specifies match criteria on the node id.
   */
  'node_id': (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * Specifies match criteria on the node metadata.
   */
  'node_metadatas': (_envoy_type_matcher_v3_StructMatcher__Output)[];
}
