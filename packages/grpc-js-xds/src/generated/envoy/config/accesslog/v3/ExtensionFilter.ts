// Original file: deps/envoy-api/envoy/config/accesslog/v3/accesslog.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

/**
 * Extension filter is statically registered at runtime.
 */
export interface ExtensionFilter {
  /**
   * The name of the filter implementation to instantiate. The name must
   * match a statically registered filter.
   */
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Custom configuration that depends on the filter being instantiated.
   */
  'config_type'?: "typed_config";
}

/**
 * Extension filter is statically registered at runtime.
 */
export interface ExtensionFilter__Output {
  /**
   * The name of the filter implementation to instantiate. The name must
   * match a statically registered filter.
   */
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Custom configuration that depends on the filter being instantiated.
   */
  'config_type': "typed_config";
}
