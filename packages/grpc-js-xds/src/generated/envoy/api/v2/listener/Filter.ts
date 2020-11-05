// Original file: deps/envoy-api/envoy/api/v2/listener/listener_components.proto

import { Struct as _google_protobuf_Struct, Struct__Output as _google_protobuf_Struct__Output } from '../../../../google/protobuf/Struct';
import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface Filter {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_network_filters>`.
   */
  'name'?: (string);
  'config'?: (_google_protobuf_Struct);
  'typed_config'?: (_google_protobuf_Any);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   */
  'config_type'?: "config"|"typed_config";
}

export interface Filter__Output {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_network_filters>`.
   */
  'name': (string);
  'config'?: (_google_protobuf_Struct__Output);
  'typed_config'?: (_google_protobuf_Any__Output);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   */
  'config_type': "config"|"typed_config";
}
