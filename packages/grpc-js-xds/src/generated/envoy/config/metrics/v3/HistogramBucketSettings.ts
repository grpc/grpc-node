// Original file: deps/envoy-api/envoy/config/metrics/v3/stats.proto

import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';

/**
 * Specifies a matcher for stats and the buckets that matching stats should use.
 */
export interface HistogramBucketSettings {
  /**
   * The stats that this rule applies to. The match is applied to the original stat name
   * before tag-extraction, for example `cluster.exampleclustername.upstream_cx_length_ms`.
   */
  'match'?: (_envoy_type_matcher_v3_StringMatcher | null);
  /**
   * Each value is the upper bound of a bucket. Each bucket must be greater than 0 and unique.
   * The order of the buckets does not matter.
   */
  'buckets'?: (number | string)[];
}

/**
 * Specifies a matcher for stats and the buckets that matching stats should use.
 */
export interface HistogramBucketSettings__Output {
  /**
   * The stats that this rule applies to. The match is applied to the original stat name
   * before tag-extraction, for example `cluster.exampleclustername.upstream_cx_length_ms`.
   */
  'match': (_envoy_type_matcher_v3_StringMatcher__Output | null);
  /**
   * Each value is the upper bound of a bucket. Each bucket must be greater than 0 and unique.
   * The order of the buckets does not matter.
   */
  'buckets': (number)[];
}
