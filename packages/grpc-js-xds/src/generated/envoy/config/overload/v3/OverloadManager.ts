// Original file: deps/envoy-api/envoy/config/overload/v3/overload.proto

import type { Duration as _google_protobuf_Duration, Duration__Output as _google_protobuf_Duration__Output } from '../../../../google/protobuf/Duration';
import type { ResourceMonitor as _envoy_config_overload_v3_ResourceMonitor, ResourceMonitor__Output as _envoy_config_overload_v3_ResourceMonitor__Output } from '../../../../envoy/config/overload/v3/ResourceMonitor';
import type { OverloadAction as _envoy_config_overload_v3_OverloadAction, OverloadAction__Output as _envoy_config_overload_v3_OverloadAction__Output } from '../../../../envoy/config/overload/v3/OverloadAction';
import type { BufferFactoryConfig as _envoy_config_overload_v3_BufferFactoryConfig, BufferFactoryConfig__Output as _envoy_config_overload_v3_BufferFactoryConfig__Output } from '../../../../envoy/config/overload/v3/BufferFactoryConfig';

export interface OverloadManager {
  /**
   * The interval for refreshing resource usage.
   */
  'refresh_interval'?: (_google_protobuf_Duration | null);
  /**
   * The set of resources to monitor.
   */
  'resource_monitors'?: (_envoy_config_overload_v3_ResourceMonitor)[];
  /**
   * The set of overload actions.
   */
  'actions'?: (_envoy_config_overload_v3_OverloadAction)[];
  /**
   * Configuration for buffer factory.
   */
  'buffer_factory_config'?: (_envoy_config_overload_v3_BufferFactoryConfig | null);
}

export interface OverloadManager__Output {
  /**
   * The interval for refreshing resource usage.
   */
  'refresh_interval': (_google_protobuf_Duration__Output | null);
  /**
   * The set of resources to monitor.
   */
  'resource_monitors': (_envoy_config_overload_v3_ResourceMonitor__Output)[];
  /**
   * The set of overload actions.
   */
  'actions': (_envoy_config_overload_v3_OverloadAction__Output)[];
  /**
   * Configuration for buffer factory.
   */
  'buffer_factory_config': (_envoy_config_overload_v3_BufferFactoryConfig__Output | null);
}
