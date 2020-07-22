// Original file: deps/envoy-api/envoy/api/v2/cluster/filter.proto

import { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface Filter {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_network_filters>`.
   */
  'name'?: (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   */
  'typed_config'?: (_google_protobuf_Any);
}

export interface Filter__Output {
  /**
   * The name of the filter to instantiate. The name must match a
   * :ref:`supported filter <config_network_filters>`.
   */
  'name': (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   */
  'typed_config'?: (_google_protobuf_Any__Output);
}
