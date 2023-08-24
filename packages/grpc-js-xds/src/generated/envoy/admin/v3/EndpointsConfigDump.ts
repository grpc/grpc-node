// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * [#next-free-field: 6]
 */
export interface _envoy_admin_v3_EndpointsConfigDump_DynamicEndpointConfig {
  /**
   * [#not-implemented-hide:] This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time that
   * the endpoint configuration was loaded.
   */
  'version_info'?: (string);
  /**
   * The endpoint config.
   */
  'endpoint_config'?: (_google_protobuf_Any | null);
  /**
   * [#not-implemented-hide:] The timestamp when the Endpoint was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The ``error_state`` field contains the rejected version of this particular
   * resource along with the reason and timestamp. For successfully updated or
   * acknowledged resource, this field should be empty.
   * [#not-implemented-hide:]
   */
  'error_state'?: (_envoy_admin_v3_UpdateFailureState | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status'?: (_envoy_admin_v3_ClientResourceStatus | keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

/**
 * [#next-free-field: 6]
 */
export interface _envoy_admin_v3_EndpointsConfigDump_DynamicEndpointConfig__Output {
  /**
   * [#not-implemented-hide:] This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time that
   * the endpoint configuration was loaded.
   */
  'version_info': (string);
  /**
   * The endpoint config.
   */
  'endpoint_config': (_google_protobuf_Any__Output | null);
  /**
   * [#not-implemented-hide:] The timestamp when the Endpoint was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The ``error_state`` field contains the rejected version of this particular
   * resource along with the reason and timestamp. For successfully updated or
   * acknowledged resource, this field should be empty.
   * [#not-implemented-hide:]
   */
  'error_state': (_envoy_admin_v3_UpdateFailureState__Output | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status': (keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

export interface _envoy_admin_v3_EndpointsConfigDump_StaticEndpointConfig {
  /**
   * The endpoint config.
   */
  'endpoint_config'?: (_google_protobuf_Any | null);
  /**
   * [#not-implemented-hide:] The timestamp when the Endpoint was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

export interface _envoy_admin_v3_EndpointsConfigDump_StaticEndpointConfig__Output {
  /**
   * The endpoint config.
   */
  'endpoint_config': (_google_protobuf_Any__Output | null);
  /**
   * [#not-implemented-hide:] The timestamp when the Endpoint was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}

/**
 * Envoy's admin fill this message with all currently known endpoints. Endpoint
 * configuration information can be used to recreate an Envoy configuration by populating all
 * endpoints as static endpoints or by returning them in an EDS response.
 */
export interface EndpointsConfigDump {
  /**
   * The statically loaded endpoint configs.
   */
  'static_endpoint_configs'?: (_envoy_admin_v3_EndpointsConfigDump_StaticEndpointConfig)[];
  /**
   * The dynamically loaded endpoint configs.
   */
  'dynamic_endpoint_configs'?: (_envoy_admin_v3_EndpointsConfigDump_DynamicEndpointConfig)[];
}

/**
 * Envoy's admin fill this message with all currently known endpoints. Endpoint
 * configuration information can be used to recreate an Envoy configuration by populating all
 * endpoints as static endpoints or by returning them in an EDS response.
 */
export interface EndpointsConfigDump__Output {
  /**
   * The statically loaded endpoint configs.
   */
  'static_endpoint_configs': (_envoy_admin_v3_EndpointsConfigDump_StaticEndpointConfig__Output)[];
  /**
   * The dynamically loaded endpoint configs.
   */
  'dynamic_endpoint_configs': (_envoy_admin_v3_EndpointsConfigDump_DynamicEndpointConfig__Output)[];
}
