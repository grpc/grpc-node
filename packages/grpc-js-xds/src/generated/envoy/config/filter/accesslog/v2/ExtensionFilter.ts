// Original file: deps/envoy-api/envoy/config/filter/accesslog/v2/accesslog.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../google/protobuf/Any';

/**
 * Extension filter is statically registered at runtime.
 */
export interface ExtensionFilter {
  /**
   * The name of the filter implementation to instantiate. The name must
   * match a statically registered filter.
   */
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Custom configuration that depends on the filter being instantiated.
   */
  'config_type'?: "config"|"typed_config";
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
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Custom configuration that depends on the filter being instantiated.
   */
  'config_type': "config"|"typed_config";
}
