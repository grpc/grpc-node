// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * Describes a dynamically loaded listener via the LDS API.
 * [#next-free-field: 7]
 */
export interface _envoy_admin_v3_ListenersConfigDump_DynamicListener {
  /**
   * The name or unique id of this listener, pulled from the DynamicListenerState config.
   */
  'name'?: (string);
  /**
   * The listener state for any active listener by this name.
   * These are listeners that are available to service data plane traffic.
   */
  'active_state'?: (_envoy_admin_v3_ListenersConfigDump_DynamicListenerState | null);
  /**
   * The listener state for any warming listener by this name.
   * These are listeners that are currently undergoing warming in preparation to service data
   * plane traffic. Note that if attempting to recreate an Envoy configuration from a
   * configuration dump, the warming listeners should generally be discarded.
   */
  'warming_state'?: (_envoy_admin_v3_ListenersConfigDump_DynamicListenerState | null);
  /**
   * The listener state for any draining listener by this name.
   * These are listeners that are currently undergoing draining in preparation to stop servicing
   * data plane traffic. Note that if attempting to recreate an Envoy configuration from a
   * configuration dump, the draining listeners should generally be discarded.
   */
  'draining_state'?: (_envoy_admin_v3_ListenersConfigDump_DynamicListenerState | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The ``error_state`` field contains the rejected version of this particular
   * resource along with the reason and timestamp. For successfully updated or
   * acknowledged resource, this field should be empty.
   */
  'error_state'?: (_envoy_admin_v3_UpdateFailureState | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status'?: (_envoy_admin_v3_ClientResourceStatus | keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

/**
 * Describes a dynamically loaded listener via the LDS API.
 * [#next-free-field: 7]
 */
export interface _envoy_admin_v3_ListenersConfigDump_DynamicListener__Output {
  /**
   * The name or unique id of this listener, pulled from the DynamicListenerState config.
   */
  'name': (string);
  /**
   * The listener state for any active listener by this name.
   * These are listeners that are available to service data plane traffic.
   */
  'active_state': (_envoy_admin_v3_ListenersConfigDump_DynamicListenerState__Output | null);
  /**
   * The listener state for any warming listener by this name.
   * These are listeners that are currently undergoing warming in preparation to service data
   * plane traffic. Note that if attempting to recreate an Envoy configuration from a
   * configuration dump, the warming listeners should generally be discarded.
   */
  'warming_state': (_envoy_admin_v3_ListenersConfigDump_DynamicListenerState__Output | null);
  /**
   * The listener state for any draining listener by this name.
   * These are listeners that are currently undergoing draining in preparation to stop servicing
   * data plane traffic. Note that if attempting to recreate an Envoy configuration from a
   * configuration dump, the draining listeners should generally be discarded.
   */
  'draining_state': (_envoy_admin_v3_ListenersConfigDump_DynamicListenerState__Output | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The ``error_state`` field contains the rejected version of this particular
   * resource along with the reason and timestamp. For successfully updated or
   * acknowledged resource, this field should be empty.
   */
  'error_state': (_envoy_admin_v3_UpdateFailureState__Output | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status': (keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

export interface _envoy_admin_v3_ListenersConfigDump_DynamicListenerState {
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time
   * that the listener was loaded. In the future, discrete per-listener versions may be supported
   * by the API.
   */
  'version_info'?: (string);
  /**
   * The listener config.
   */
  'listener'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the Listener was last successfully updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

export interface _envoy_admin_v3_ListenersConfigDump_DynamicListenerState__Output {
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time
   * that the listener was loaded. In the future, discrete per-listener versions may be supported
   * by the API.
   */
  'version_info': (string);
  /**
   * The listener config.
   */
  'listener': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the Listener was last successfully updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}

/**
 * Describes a statically loaded listener.
 */
export interface _envoy_admin_v3_ListenersConfigDump_StaticListener {
  /**
   * The listener config.
   */
  'listener'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the Listener was last successfully updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

/**
 * Describes a statically loaded listener.
 */
export interface _envoy_admin_v3_ListenersConfigDump_StaticListener__Output {
  /**
   * The listener config.
   */
  'listener': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the Listener was last successfully updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}

/**
 * Envoy's listener manager fills this message with all currently known listeners. Listener
 * configuration information can be used to recreate an Envoy configuration by populating all
 * listeners as static listeners or by returning them in a LDS response.
 */
export interface ListenersConfigDump {
  /**
   * This is the :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` in the
   * last processed LDS discovery response. If there are only static bootstrap listeners, this field
   * will be "".
   */
  'version_info'?: (string);
  /**
   * The statically loaded listener configs.
   */
  'static_listeners'?: (_envoy_admin_v3_ListenersConfigDump_StaticListener)[];
  /**
   * State for any warming, active, or draining listeners.
   */
  'dynamic_listeners'?: (_envoy_admin_v3_ListenersConfigDump_DynamicListener)[];
}

/**
 * Envoy's listener manager fills this message with all currently known listeners. Listener
 * configuration information can be used to recreate an Envoy configuration by populating all
 * listeners as static listeners or by returning them in a LDS response.
 */
export interface ListenersConfigDump__Output {
  /**
   * This is the :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` in the
   * last processed LDS discovery response. If there are only static bootstrap listeners, this field
   * will be "".
   */
  'version_info': (string);
  /**
   * The statically loaded listener configs.
   */
  'static_listeners': (_envoy_admin_v3_ListenersConfigDump_StaticListener__Output)[];
  /**
   * State for any warming, active, or draining listeners.
   */
  'dynamic_listeners': (_envoy_admin_v3_ListenersConfigDump_DynamicListener__Output)[];
}
