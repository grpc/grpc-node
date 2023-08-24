// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * [#next-free-field: 6]
 */
export interface _envoy_admin_v3_RoutesConfigDump_DynamicRouteConfig {
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time that
   * the route configuration was loaded.
   */
  'version_info'?: (string);
  /**
   * The route config.
   */
  'route_config'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the Route was last updated.
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
export interface _envoy_admin_v3_RoutesConfigDump_DynamicRouteConfig__Output {
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time that
   * the route configuration was loaded.
   */
  'version_info': (string);
  /**
   * The route config.
   */
  'route_config': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the Route was last updated.
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

export interface _envoy_admin_v3_RoutesConfigDump_StaticRouteConfig {
  /**
   * The route config.
   */
  'route_config'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the Route was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

export interface _envoy_admin_v3_RoutesConfigDump_StaticRouteConfig__Output {
  /**
   * The route config.
   */
  'route_config': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the Route was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}

/**
 * Envoy's RDS implementation fills this message with all currently loaded routes, as described by
 * their RouteConfiguration objects. Static routes that are either defined in the bootstrap configuration
 * or defined inline while configuring listeners are separated from those configured dynamically via RDS.
 * Route configuration information can be used to recreate an Envoy configuration by populating all routes
 * as static routes or by returning them in RDS responses.
 */
export interface RoutesConfigDump {
  /**
   * The statically loaded route configs.
   */
  'static_route_configs'?: (_envoy_admin_v3_RoutesConfigDump_StaticRouteConfig)[];
  /**
   * The dynamically loaded route configs.
   */
  'dynamic_route_configs'?: (_envoy_admin_v3_RoutesConfigDump_DynamicRouteConfig)[];
}

/**
 * Envoy's RDS implementation fills this message with all currently loaded routes, as described by
 * their RouteConfiguration objects. Static routes that are either defined in the bootstrap configuration
 * or defined inline while configuring listeners are separated from those configured dynamically via RDS.
 * Route configuration information can be used to recreate an Envoy configuration by populating all routes
 * as static routes or by returning them in RDS responses.
 */
export interface RoutesConfigDump__Output {
  /**
   * The statically loaded route configs.
   */
  'static_route_configs': (_envoy_admin_v3_RoutesConfigDump_StaticRouteConfig__Output)[];
  /**
   * The dynamically loaded route configs.
   */
  'dynamic_route_configs': (_envoy_admin_v3_RoutesConfigDump_DynamicRouteConfig__Output)[];
}
