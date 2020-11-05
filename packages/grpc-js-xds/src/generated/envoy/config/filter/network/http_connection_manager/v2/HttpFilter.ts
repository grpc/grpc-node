// Original file: deps/envoy-api/envoy/config/filter/network/http_connection_manager/v2/http_connection_manager.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../../../google/protobuf/Any';

export interface HttpFilter {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_http_filters>`.
   */
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Filter specific configuration which depends on the filter being instantiated. See the supported
   * filters for further documentation.
   */
  'config_type'?: "config"|"typed_config";
}

export interface HttpFilter__Output {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_http_filters>`.
   */
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Filter specific configuration which depends on the filter being instantiated. See the supported
   * filters for further documentation.
   */
  'config_type': "config"|"typed_config";
}
