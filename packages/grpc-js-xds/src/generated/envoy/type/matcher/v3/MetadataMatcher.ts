// Original file: deps/envoy-api/envoy/type/matcher/v3/metadata.proto

import type { ValueMatcher as _envoy_type_matcher_v3_ValueMatcher, ValueMatcher__Output as _envoy_type_matcher_v3_ValueMatcher__Output } from '../../../../envoy/type/matcher/v3/ValueMatcher';

/**
 * Specifies the segment in a path to retrieve value from Metadata.
 * Note: Currently it's not supported to retrieve a value from a list in Metadata. This means that
 * if the segment key refers to a list, it has to be the last segment in a path.
 */
export interface _envoy_type_matcher_v3_MetadataMatcher_PathSegment {
  /**
   * If specified, use the key to retrieve the value in a Struct.
   */
  'key'?: (string);
  'segment'?: "key";
}

/**
 * Specifies the segment in a path to retrieve value from Metadata.
 * Note: Currently it's not supported to retrieve a value from a list in Metadata. This means that
 * if the segment key refers to a list, it has to be the last segment in a path.
 */
export interface _envoy_type_matcher_v3_MetadataMatcher_PathSegment__Output {
  /**
   * If specified, use the key to retrieve the value in a Struct.
   */
  'key'?: (string);
  'segment': "key";
}

/**
 * [#next-major-version: MetadataMatcher should use StructMatcher]
 */
export interface MetadataMatcher {
  /**
   * The filter name to retrieve the Struct from the Metadata.
   */
  'filter'?: (string);
  /**
   * The path to retrieve the Value from the Struct.
   */
  'path'?: (_envoy_type_matcher_v3_MetadataMatcher_PathSegment)[];
  /**
   * The MetadataMatcher is matched if the value retrieved by path is matched to this value.
   */
  'value'?: (_envoy_type_matcher_v3_ValueMatcher | null);
  /**
   * If true, the match result will be inverted.
   */
  'invert'?: (boolean);
}

/**
 * [#next-major-version: MetadataMatcher should use StructMatcher]
 */
export interface MetadataMatcher__Output {
  /**
   * The filter name to retrieve the Struct from the Metadata.
   */
  'filter': (string);
  /**
   * The path to retrieve the Value from the Struct.
   */
  'path': (_envoy_type_matcher_v3_MetadataMatcher_PathSegment__Output)[];
  /**
   * The MetadataMatcher is matched if the value retrieved by path is matched to this value.
   */
  'value': (_envoy_type_matcher_v3_ValueMatcher__Output | null);
  /**
   * If true, the match result will be inverted.
   */
  'invert': (boolean);
}
