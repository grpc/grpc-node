// Original file: deps/envoy-api/envoy/config/core/v3/config_source.proto

import type { UInt32Value as _google_protobuf_UInt32Value, UInt32Value__Output as _google_protobuf_UInt32Value__Output } from '../../../../google/protobuf/UInt32Value';
import type { DoubleValue as _google_protobuf_DoubleValue, DoubleValue__Output as _google_protobuf_DoubleValue__Output } from '../../../../google/protobuf/DoubleValue';

/**
 * Rate Limit settings to be applied for discovery requests made by Envoy.
 */
export interface RateLimitSettings {
  /**
   * Maximum number of tokens to be used for rate limiting discovery request calls. If not set, a
   * default value of 100 will be used.
   */
  'max_tokens'?: (_google_protobuf_UInt32Value | null);
  /**
   * Rate at which tokens will be filled per second. If not set, a default fill rate of 10 tokens
   * per second will be used.
   */
  'fill_rate'?: (_google_protobuf_DoubleValue | null);
}

/**
 * Rate Limit settings to be applied for discovery requests made by Envoy.
 */
export interface RateLimitSettings__Output {
  /**
   * Maximum number of tokens to be used for rate limiting discovery request calls. If not set, a
   * default value of 100 will be used.
   */
  'max_tokens': (_google_protobuf_UInt32Value__Output | null);
  /**
   * Rate at which tokens will be filled per second. If not set, a default fill rate of 10 tokens
   * per second will be used.
   */
  'fill_rate': (_google_protobuf_DoubleValue__Output | null);
}
