// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { MetadataMatcher as _envoy_type_matcher_v3_MetadataMatcher, MetadataMatcher__Output as _envoy_type_matcher_v3_MetadataMatcher__Output } from '../../../../envoy/type/matcher/v3/MetadataMatcher';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

/**
 * Filters based on matching dynamic metadata.
 * If the matcher path and key correspond to an existing key in dynamic
 * metadata, the request is logged only if the matcher value is equal to the
 * metadata value. If the matcher path and key *do not* correspond to an
 * existing key in dynamic metadata, the request is logged only if
 * match_if_key_not_found is "true" or unset.
 */
export interface MetadataFilter {
  /**
   * Matcher to check metadata for specified value. For example, to match on the
   * access_log_hint metadata, set the filter to "envoy.common" and the path to
   * "access_log_hint", and the value to "true".
   */
  'matcher'?: (_envoy_type_matcher_v3_MetadataMatcher | null);
  /**
   * Default result if the key does not exist in dynamic metadata: if unset or
   * true, then log; if false, then don't log.
   */
  'match_if_key_not_found'?: (_google_protobuf_BoolValue | null);
}

/**
 * Filters based on matching dynamic metadata.
 * If the matcher path and key correspond to an existing key in dynamic
 * metadata, the request is logged only if the matcher value is equal to the
 * metadata value. If the matcher path and key *do not* correspond to an
 * existing key in dynamic metadata, the request is logged only if
 * match_if_key_not_found is "true" or unset.
 */
export interface MetadataFilter__Output {
  /**
   * Matcher to check metadata for specified value. For example, to match on the
   * access_log_hint metadata, set the filter to "envoy.common" and the path to
   * "access_log_hint", and the value to "true".
   */
  'matcher': (_envoy_type_matcher_v3_MetadataMatcher__Output | null);
  /**
   * Default result if the key does not exist in dynamic metadata: if unset or
   * true, then log; if false, then don't log.
   */
  'match_if_key_not_found': (_google_protobuf_BoolValue__Output | null);
}
