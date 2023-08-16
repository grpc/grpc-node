// Original file: deps/envoy-api/envoy/admin/v3/config_dump_shared.proto

import type { Any as _google_protobuf_Any, Any__Output as _google_protobuf_Any__Output } from '../../../google/protobuf/Any';
import type { Timestamp as _google_protobuf_Timestamp, Timestamp__Output as _google_protobuf_Timestamp__Output } from '../../../google/protobuf/Timestamp';
import type { UpdateFailureState as _envoy_admin_v3_UpdateFailureState, UpdateFailureState__Output as _envoy_admin_v3_UpdateFailureState__Output } from '../../../envoy/admin/v3/UpdateFailureState';
import type { ClientResourceStatus as _envoy_admin_v3_ClientResourceStatus } from '../../../envoy/admin/v3/ClientResourceStatus';

/**
 * Describes a dynamically loaded cluster via the CDS API.
 * [#next-free-field: 6]
 */
export interface _envoy_admin_v3_ClustersConfigDump_DynamicCluster {
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time
   * that the cluster was loaded. In the future, discrete per-cluster versions may be supported by
   * the API.
   */
  'version_info'?: (string);
  /**
   * The cluster config.
   */
  'cluster'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the Cluster was last updated.
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
 * Describes a dynamically loaded cluster via the CDS API.
 * [#next-free-field: 6]
 */
export interface _envoy_admin_v3_ClustersConfigDump_DynamicCluster__Output {
  /**
   * This is the per-resource version information. This version is currently taken from the
   * :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` field at the time
   * that the cluster was loaded. In the future, discrete per-cluster versions may be supported by
   * the API.
   */
  'version_info': (string);
  /**
   * The cluster config.
   */
  'cluster': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the Cluster was last updated.
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

/**
 * Describes a statically loaded cluster.
 */
export interface _envoy_admin_v3_ClustersConfigDump_StaticCluster {
  /**
   * The cluster config.
   */
  'cluster'?: (_google_protobuf_Any | null);
  /**
   * The timestamp when the Cluster was last updated.
   */
  'last_updated'?: (_google_protobuf_Timestamp | null);
}

/**
 * Describes a statically loaded cluster.
 */
export interface _envoy_admin_v3_ClustersConfigDump_StaticCluster__Output {
  /**
   * The cluster config.
   */
  'cluster': (_google_protobuf_Any__Output | null);
  /**
   * The timestamp when the Cluster was last updated.
   */
  'last_updated': (_google_protobuf_Timestamp__Output | null);
}

/**
 * Envoy's cluster manager fills this message with all currently known clusters. Cluster
 * configuration information can be used to recreate an Envoy configuration by populating all
 * clusters as static clusters or by returning them in a CDS response.
 */
export interface ClustersConfigDump {
  /**
   * This is the :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` in the
   * last processed CDS discovery response. If there are only static bootstrap clusters, this field
   * will be "".
   */
  'version_info'?: (string);
  /**
   * The statically loaded cluster configs.
   */
  'static_clusters'?: (_envoy_admin_v3_ClustersConfigDump_StaticCluster)[];
  /**
   * The dynamically loaded active clusters. These are clusters that are available to service
   * data plane traffic.
   */
  'dynamic_active_clusters'?: (_envoy_admin_v3_ClustersConfigDump_DynamicCluster)[];
  /**
   * The dynamically loaded warming clusters. These are clusters that are currently undergoing
   * warming in preparation to service data plane traffic. Note that if attempting to recreate an
   * Envoy configuration from a configuration dump, the warming clusters should generally be
   * discarded.
   */
  'dynamic_warming_clusters'?: (_envoy_admin_v3_ClustersConfigDump_DynamicCluster)[];
}

/**
 * Envoy's cluster manager fills this message with all currently known clusters. Cluster
 * configuration information can be used to recreate an Envoy configuration by populating all
 * clusters as static clusters or by returning them in a CDS response.
 */
export interface ClustersConfigDump__Output {
  /**
   * This is the :ref:`version_info <envoy_v3_api_field_service.discovery.v3.DiscoveryResponse.version_info>` in the
   * last processed CDS discovery response. If there are only static bootstrap clusters, this field
   * will be "".
   */
  'version_info': (string);
  /**
   * The statically loaded cluster configs.
   */
  'static_clusters': (_envoy_admin_v3_ClustersConfigDump_StaticCluster__Output)[];
  /**
   * The dynamically loaded active clusters. These are clusters that are available to service
   * data plane traffic.
   */
  'dynamic_active_clusters': (_envoy_admin_v3_ClustersConfigDump_DynamicCluster__Output)[];
  /**
   * The dynamically loaded warming clusters. These are clusters that are currently undergoing
   * warming in preparation to service data plane traffic. Note that if attempting to recreate an
   * Envoy configuration from a configuration dump, the warming clusters should generally be
   * discarded.
   */
  'dynamic_warming_clusters': (_envoy_admin_v3_ClustersConfigDump_DynamicCluster__Output)[];
}
