// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../../google/protobuf/Any';

export interface ResourceMonitor {
  /**
   * The name of the resource monitor to instantiate. Must match a registered
   * resource monitor type.
   * See the :ref:`extensions listed in typed_config below <extension_category_envoy.resource_monitors>` for the default list of available resource monitor.
   */
  'name'?: (string);
  'typed_config'?: (_google_protobuf_Any | null);
  /**
   * Configuration for the resource monitor being instantiated.
   * [#extension-category: envoy.resource_monitors]
   */
  'config_type'?: "typed_config";
}

export interface ResourceMonitor__Output {
  /**
   * The name of the resource monitor to instantiate. Must match a registered
   * resource monitor type.
   * See the :ref:`extensions listed in typed_config below <extension_category_envoy.resource_monitors>` for the default list of available resource monitor.
   */
  'name': (string);
  'typed_config'?: (_google_protobuf_Any__Output | null);
  /**
   * Configuration for the resource monitor being instantiated.
   * [#extension-category: envoy.resource_monitors]
   */
  'config_type': "typed_config";
}
