// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { HeaderValue as _envoy_config_core_v3_HeaderValue, HeaderValue__Output as _envoy_config_core_v3_HeaderValue__Output } from '../../../../envoy/config/core/v3/HeaderValue';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

/**
 * Describes the supported actions types for header append action.
 */
export enum _envoy_config_core_v3_HeaderValueOption_HeaderAppendAction {
  /**
   * This action will append the specified value to the existing values if the header
   * already exists. If the header doesn't exist then this will add the header with
   * specified key and value.
   */
  APPEND_IF_EXISTS_OR_ADD = 0,
  /**
   * This action will add the header if it doesn't already exist. If the header
   * already exists then this will be a no-op.
   */
  ADD_IF_ABSENT = 1,
  /**
   * This action will overwrite the specified value by discarding any existing values if
   * the header already exists. If the header doesn't exist then this will add the header
   * with specified key and value.
   */
  OVERWRITE_IF_EXISTS_OR_ADD = 2,
}

/**
 * Header name/value pair plus option to control append behavior.
 */
export interface HeaderValueOption {
  /**
   * Header name/value pair that this option applies to.
   */
  'header'?: (_envoy_config_core_v3_HeaderValue | null);
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values. Otherwise it replaces any existing values.
   * This field is deprecated and please use
   * :ref:`append_action <envoy_v3_api_field_config.core.v3.HeaderValueOption.append_action>` as replacement.
   * 
   * .. note::
   * The :ref:`external authorization service <envoy_v3_api_msg_service.auth.v3.CheckResponse>` and
   * :ref:`external processor service <envoy_v3_api_msg_service.ext_proc.v3.ProcessingResponse>` have
   * default value (``false``) for this field.
   */
  'append'?: (_google_protobuf_BoolValue | null);
  /**
   * Describes the action taken to append/overwrite the given value for an existing header
   * or to only add this header if it's absent.
   * Value defaults to :ref:`APPEND_IF_EXISTS_OR_ADD
   * <envoy_v3_api_enum_value_config.core.v3.HeaderValueOption.HeaderAppendAction.APPEND_IF_EXISTS_OR_ADD>`.
   */
  'append_action'?: (_envoy_config_core_v3_HeaderValueOption_HeaderAppendAction | keyof typeof _envoy_config_core_v3_HeaderValueOption_HeaderAppendAction);
  /**
   * Is the header value allowed to be empty? If false (default), custom headers with empty values are dropped,
   * otherwise they are added.
   */
  'keep_empty_value'?: (boolean);
}

/**
 * Header name/value pair plus option to control append behavior.
 */
export interface HeaderValueOption__Output {
  /**
   * Header name/value pair that this option applies to.
   */
  'header': (_envoy_config_core_v3_HeaderValue__Output | null);
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values. Otherwise it replaces any existing values.
   * This field is deprecated and please use
   * :ref:`append_action <envoy_v3_api_field_config.core.v3.HeaderValueOption.append_action>` as replacement.
   * 
   * .. note::
   * The :ref:`external authorization service <envoy_v3_api_msg_service.auth.v3.CheckResponse>` and
   * :ref:`external processor service <envoy_v3_api_msg_service.ext_proc.v3.ProcessingResponse>` have
   * default value (``false``) for this field.
   */
  'append': (_google_protobuf_BoolValue__Output | null);
  /**
   * Describes the action taken to append/overwrite the given value for an existing header
   * or to only add this header if it's absent.
   * Value defaults to :ref:`APPEND_IF_EXISTS_OR_ADD
   * <envoy_v3_api_enum_value_config.core.v3.HeaderValueOption.HeaderAppendAction.APPEND_IF_EXISTS_OR_ADD>`.
   */
  'append_action': (keyof typeof _envoy_config_core_v3_HeaderValueOption_HeaderAppendAction);
  /**
   * Is the header value allowed to be empty? If false (default), custom headers with empty values are dropped,
   * otherwise they are added.
   */
  'keep_empty_value': (boolean);
}
