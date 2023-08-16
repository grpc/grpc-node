// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * [#next-free-field: 6]
 */
export interface _envoy_admin_v3_EcdsConfigDump_EcdsFilterConfig {
  /**
   * This is the per-resource version information. This version is currently
   * taken from the :ref:`version_info
   * <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>`
   * field at the time that the ECDS filter was loaded.
   */
  'version_info'?: (string);
  /**
   * The ECDS filter config.
   */
  'ecds_filter'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the ECDS filter was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The ``error_state`` field contains the rejected version of this
   * particular resource along with the reason and timestamp. For successfully
   * updated or acknowledged resource, this field should be empty.
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
export interface _envoy_admin_v3_EcdsConfigDump_EcdsFilterConfig__Output {
  /**
   * This is the per-resource version information. This version is currently
   * taken from the :ref:`version_info
   * <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>`
   * field at the time that the ECDS filter was loaded.
   */
  'version_info': (string);
  /**
   * The ECDS filter config.
   */
  'ecds_filter': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the ECDS filter was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
  /**
   * Set if the last update failed, cleared after the next successful update.
   * The ``error_state`` field contains the rejected version of this
   * particular resource along with the reason and timestamp. For successfully
   * updated or acknowledged resource, this field should be empty.
   * [#not-implemented-hide:]
   */
  'error_state': (_envoy_admin_v3_UpdateFailureState__Output | null);
  /**
   * The client status of this resource.
   * [#not-implemented-hide:]
   */
  'client_status': (keyof typeof _envoy_admin_v3_ClientResourceStatus);
}

/**
 * Envoy's ECDS service fills this message with all currently extension
 * configuration. Extension configuration information can be used to recreate
 * an Envoy ECDS listener and HTTP filters as static filters or by returning
 * them in ECDS response.
 */
export interface EcdsConfigDump {
  /**
   * The ECDS filter configs.
   */
  'ecds_filters'?: (_envoy_admin_v3_EcdsConfigDump_EcdsFilterConfig)[];
}

/**
 * Envoy's ECDS service fills this message with all currently extension
 * configuration. Extension configuration information can be used to recreate
 * an Envoy ECDS listener and HTTP filters as static filters or by returning
 * them in ECDS response.
 */
export interface EcdsConfigDump__Output {
  /**
   * The ECDS filter configs.
   */
  'ecds_filters': (_envoy_admin_v3_EcdsConfigDump_EcdsFilterConfig__Output)[];
}
