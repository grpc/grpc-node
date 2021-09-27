// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { Percent as _envoy_type_v3_Percent, Percent__Output as _envoy_type_v3_Percent__Output } from '../../../../envoy/type/v3/Percent';

/**
 * Runtime derived percentage with a default when not specified.
 */
export interface RuntimePercent {
  /**
   * Default value if runtime value is not available.
   */
  'default_value'?: (_envoy_type_v3_Percent | null);
  /**
   * Runtime key to get value for comparison. This value is used if defined.
   */
  'runtime_key'?: (string);
}

/**
 * Runtime derived percentage with a default when not specified.
 */
export interface RuntimePercent__Output {
  /**
   * Default value if runtime value is not available.
   */
  'default_value': (_envoy_type_v3_Percent__Output | null);
  /**
   * Runtime key to get value for comparison. This value is used if defined.
   */
  'runtime_key': (string);
}
