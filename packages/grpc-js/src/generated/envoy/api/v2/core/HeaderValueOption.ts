// Original file: deps/envoy-api/envoy/api/v2/core/base.proto

import { HeaderValue as _envoy_api_v2_core_HeaderValue, HeaderValue__Output as _envoy_api_v2_core_HeaderValue__Output } from '../../../../envoy/api/v2/core/HeaderValue';
import { BoolValue as _google_protobuf_BoolValue, BoolValue__Output as _google_protobuf_BoolValue__Output } from '../../../../google/protobuf/BoolValue';

/**
 * Header name/value pair plus option to control append behavior.
 */
export interface HeaderValueOption {
  /**
   * Header name/value pair that this option applies to.
   */
  'header'?: (_envoy_api_v2_core_HeaderValue);
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values.
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
  'header'?: (_envoy_api_v2_core_HeaderValue__Output);
  /**
   * Should the value be appended? If true (default), the value is appended to
   * existing values.
   */
  'append'?: (_google_protobuf_BoolValue__Output);
}
