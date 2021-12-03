// Original file: deps/envoy-api/envoy/config/cluster/v3/filter.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface Filter {
  /**
   * The name of the filter to instantiate. The name must match a
   * supported upstream filter. Note that Envoy's :ref:`downstream network
   * filters <config_network_filters>` are not valid upstream filters.
   */
  'name'?: (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   */
  'typed_config'?: (_google_protobuf_Any | null);
}

export interface Filter__Output {
  /**
   * The name of the filter to instantiate. The name must match a
   * supported upstream filter. Note that Envoy's :ref:`downstream network
   * filters <config_network_filters>` are not valid upstream filters.
   */
  'name': (string);
  /**
   * Filter specific configuration which depends on the filter being
   * instantiated. See the supported filters for further documentation.
   */
  'typed_config': (_google_protobuf_Any__Output | null);
}
