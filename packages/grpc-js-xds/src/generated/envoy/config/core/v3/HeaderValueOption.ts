// Original file: deps/envoy-api/envoy/config/core/v3/base.proto

import type { HeaderValue as _envoy_config_core_v3_HeaderValue, HeaderValue__Output as _envoy_config_core_v3_HeaderValue__Output } from '../../../../envoy/config/core/v3/HeaderValue';
import type { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

/**
 * Header name/value pair plus option to control append behavior.
 */
export interface HeaderValueOption {
  /**
   * Header name/value pair that this option applies to.
   */
  'header'?: (_envoy_config_core_v3_HeaderValue);
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values. Otherwise it replaces any existing values.
   */
  'append'?: (_google_protobuf_BoolValue);
}

/**
 * Header name/value pair plus option to control append behavior.
 */
export interface HeaderValueOption__Output {
  /**
   * Header name/value pair that this option applies to.
   */
  'header'?: (_envoy_config_core_v3_HeaderValue__Output);
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values. Otherwise it replaces any existing values.
   */
  'append'?: (_google_protobuf_BoolValue__Output);
}
