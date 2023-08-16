// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * [#next-free-field: 7]
 */
export interface _envoy_admin_v3_ScopedRoutesConfigDump_DynamicScopedRouteConfigs {
  /**
   * The name assigned to the scoped route configurations.
   */
  'name'?: (string);
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time that
   * the scoped routes configuration was loaded.
   */
  'version_info'?: (string);
  /**
   * The scoped route configurations.
   */
  'scoped_route_configs'?: (_google_protobuf_Any)[];
  /**
   * The timestamp when the scoped route config set was last updated.
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
 * [#next-free-field: 7]
 */
export interface _envoy_admin_v3_ScopedRoutesConfigDump_DynamicScopedRouteConfigs__Output {
  /**
   * The name assigned to the scoped route configurations.
   */
  'name': (string);
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time that
   * the scoped routes configuration was loaded.
   */
  'version_info': (string);
  /**
   * The scoped route configurations.
   */
  'scoped_route_configs': (_google_protobuf_Any__Output)[];
  /**
   * The timestamp when the scoped route config set was last updated.
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

export interface _envoy_admin_v3_ScopedRoutesConfigDump_InlineScopedRouteConfigs {
  /**
   * The name assigned to the scoped route configurations.
   */
  'name'?: (string);
  /**
   * The scoped route configurations.
   */
  'scoped_route_configs'?: (_google_protobuf_Any)[];
  /**
   * The timestamp when the scoped route config set was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

export interface _envoy_admin_v3_ScopedRoutesConfigDump_InlineScopedRouteConfigs__Output {
  /**
   * The name assigned to the scoped route configurations.
   */
  'name': (string);
  /**
   * The scoped route configurations.
   */
  'scoped_route_configs': (_google_protobuf_Any__Output)[];
  /**
   * The timestamp when the scoped route config set was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}

/**
 * Envoy's scoped RDS implementation fills this message with all currently loaded route
 * configuration scopes (defined via ScopedRouteConfigurationsSet protos). This message lists both
 * the scopes defined inline with the higher order object (i.e., the HttpConnectionManager) and the
 * dynamically obtained scopes via the SRDS API.
 */
export interface ScopedRoutesConfigDump {
  /**
   * The statically loaded scoped route configs.
   */
  'inline_scoped_route_configs'?: (_envoy_admin_v3_ScopedRoutesConfigDump_InlineScopedRouteConfigs)[];
  /**
   * The dynamically loaded scoped route configs.
   */
  'dynamic_scoped_route_configs'?: (_envoy_admin_v3_ScopedRoutesConfigDump_DynamicScopedRouteConfigs)[];
}

/**
 * Envoy's scoped RDS implementation fills this message with all currently loaded route
 * configuration scopes (defined via ScopedRouteConfigurationsSet protos). This message lists both
 * the scopes defined inline with the higher order object (i.e., the HttpConnectionManager) and the
 * dynamically obtained scopes via the SRDS API.
 */
export interface ScopedRoutesConfigDump__Output {
  /**
   * The statically loaded scoped route configs.
   */
  'inline_scoped_route_configs': (_envoy_admin_v3_ScopedRoutesConfigDump_InlineScopedRouteConfigs__Output)[];
  /**
   * The dynamically loaded scoped route configs.
   */
  'dynamic_scoped_route_configs': (_envoy_admin_v3_ScopedRoutesConfigDump_DynamicScopedRouteConfigs__Output)[];
}
