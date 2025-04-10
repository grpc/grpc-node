// Original file: deps/envoy-api/envoy/type/matcher/v3/path.proto

import type { StringMatcher as _envoy_type_matcher_v3_StringMatcher, StringMatcher__Output as _envoy_type_matcher_v3_StringMatcher__Output } from '../../../../envoy/type/matcher/v3/StringMatcher';

/**
 * Specifies the way to match a path on HTTP request.
 */
export interface PathMatcher {
  /**
   * The ``path`` must match the URL path portion of the :path header. The query and fragment
   * string (if present) are removed in the URL path portion.
   * For example, the path ``/data`` will match the ``:path`` header ``/data#fragment?param=value``.
   */
  'path'?: (_envoy_type_matcher_v3_StringMatcher | null);
  'rule'?: "path";
}

/**
 * Specifies the way to match a path on HTTP request.
 */
export interface PathMatcher__Output {
  /**
   * The ``path`` must match the URL path portion of the :path header. The query and fragment
   * string (if present) are removed in the URL path portion.
   * For example, the path ``/data`` will match the ``:path`` header ``/data#fragment?param=value``.
   */
  'path'?: (_envoy_type_matcher_v3_StringMatcher__Output | null);
  'rule'?: "path";
}
