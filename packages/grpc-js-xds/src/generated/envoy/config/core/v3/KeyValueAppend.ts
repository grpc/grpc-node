// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { KeyValue as _envoy_config_core_v3_KeyValue, KeyValue__Output as _envoy_config_core_v3_KeyValue__Output } from '../../../../envoy/config/core/v3/KeyValue';

// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

/**
 * Describes the supported actions types for key/value pair append action.
 */
export const _envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction = {
  /**
   * If the key already exists, this action will result in the following behavior:
   * 
   * - Comma-concatenated value if multiple values are not allowed.
   * - New value added to the list of values if multiple values are allowed.
   * 
   * If the key doesn't exist then this will add pair with specified key and value.
   */
  APPEND_IF_EXISTS_OR_ADD: 'APPEND_IF_EXISTS_OR_ADD',
  /**
   * This action will add the key/value pair if it doesn't already exist. If the
   * key already exists then this will be a no-op.
   */
  ADD_IF_ABSENT: 'ADD_IF_ABSENT',
  /**
   * This action will overwrite the specified value by discarding any existing
   * values if the key already exists. If the key doesn't exist then this will add
   * the pair with specified key and value.
   */
  OVERWRITE_IF_EXISTS_OR_ADD: 'OVERWRITE_IF_EXISTS_OR_ADD',
  /**
   * This action will overwrite the specified value by discarding any existing
   * values if the key already exists. If the key doesn't exist then this will
   * be no-op.
   */
  OVERWRITE_IF_EXISTS: 'OVERWRITE_IF_EXISTS',
} as const;

/**
 * Describes the supported actions types for key/value pair append action.
 */
export type _envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction =
  /**
   * If the key already exists, this action will result in the following behavior:
   * 
   * - Comma-concatenated value if multiple values are not allowed.
   * - New value added to the list of values if multiple values are allowed.
   * 
   * If the key doesn't exist then this will add pair with specified key and value.
   */
  | 'APPEND_IF_EXISTS_OR_ADD'
  | 0
  /**
   * This action will add the key/value pair if it doesn't already exist. If the
   * key already exists then this will be a no-op.
   */
  | 'ADD_IF_ABSENT'
  | 1
  /**
   * This action will overwrite the specified value by discarding any existing
   * values if the key already exists. If the key doesn't exist then this will add
   * the pair with specified key and value.
   */
  | 'OVERWRITE_IF_EXISTS_OR_ADD'
  | 2
  /**
   * This action will overwrite the specified value by discarding any existing
   * values if the key already exists. If the key doesn't exist then this will
   * be no-op.
   */
  | 'OVERWRITE_IF_EXISTS'
  | 3

/**
 * Describes the supported actions types for key/value pair append action.
 */
export type _envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction__Output = typeof _envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction[keyof typeof _envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction]

/**
 * Key/value pair plus option to control append behavior. This is used to specify
 * key/value pairs that should be appended to a set of existing key/value pairs.
 */
export interface KeyValueAppend {
  /**
   * Key/value pair entry that this option to append or overwrite.
   */
  'entry'?: (_envoy_config_core_v3_KeyValue | null);
  /**
   * Describes the action taken to append/overwrite the given value for an existing
   * key or to only add this key if it's absent.
   */
  'action'?: (_envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction);
}

/**
 * Key/value pair plus option to control append behavior. This is used to specify
 * key/value pairs that should be appended to a set of existing key/value pairs.
 */
export interface KeyValueAppend__Output {
  /**
   * Key/value pair entry that this option to append or overwrite.
   */
  'entry': (_envoy_config_core_v3_KeyValue__Output | null);
  /**
   * Describes the action taken to append/overwrite the given value for an existing
   * key or to only add this key if it's absent.
   */
  'action': (_envoy_config_core_v3_KeyValueAppend_KeyValueAppendAction__Output);
}
