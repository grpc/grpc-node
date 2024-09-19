// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { KeyValueAppend as _envoy_config_core_v3_KeyValueAppend, KeyValueAppend__Output as _envoy_config_core_v3_KeyValueAppend__Output } from '../../../../envoy/config/core/v3/KeyValueAppend';

/**
 * Key/value pair to append or remove.
 */
export interface KeyValueMutation {
  /**
   * Key/value pair to append or overwrite. Only one of ``append`` or ``remove`` can be set.
   */
  'append'?: (_envoy_config_core_v3_KeyValueAppend | null);
  /**
   * Key to remove. Only one of ``append`` or ``remove`` can be set.
   */
  'remove'?: (string);
}

/**
 * Key/value pair to append or remove.
 */
export interface KeyValueMutation__Output {
  /**
   * Key/value pair to append or overwrite. Only one of ``append`` or ``remove`` can be set.
   */
  'append': (_envoy_config_core_v3_KeyValueAppend__Output | null);
  /**
   * Key to remove. Only one of ``append`` or ``remove`` can be set.
   */
  'remove': (string);
}
