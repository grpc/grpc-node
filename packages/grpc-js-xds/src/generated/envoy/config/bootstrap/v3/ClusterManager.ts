// Original file: deps/envoy-api/envoy/config/bootstrap/v3/bootstrap.proto

import type { BindConfig as _envoy_config_core_v3_BindConfig, BindConfig__Output as _envoy_config_core_v3_BindConfig__Output } from '../../../../envoy/config/core/v3/BindConfig';
import type { ApiConfigSource as _envoy_config_core_v3_ApiConfigSource, ApiConfigSource__Output as _envoy_config_core_v3_ApiConfigSource__Output } from '../../../../envoy/config/core/v3/ApiConfigSource';
import type { EventServiceConfig as _envoy_config_core_v3_EventServiceConfig, EventServiceConfig__Output as _envoy_config_core_v3_EventServiceConfig__Output } from '../../../../envoy/config/core/v3/EventServiceConfig';

export interface _envoy_config_bootstrap_v3_ClusterManager_OutlierDetection {
  /**
   * Specifies the path to the outlier event log.
   */
  'event_log_path'?: (string);
  /**
   * [#not-implemented-hide:]
   * The gRPC service for the outlier detection event service.
   * If empty, outlier detection events won't be sent to a remote endpoint.
   */
  'event_service'?: (_envoy_config_core_v3_EventServiceConfig | null);
}

export interface _envoy_config_bootstrap_v3_ClusterManager_OutlierDetection__Output {
  /**
   * Specifies the path to the outlier event log.
   */
  'event_log_path': (string);
  /**
   * [#not-implemented-hide:]
   * The gRPC service for the outlier detection event service.
   * If empty, outlier detection events won't be sent to a remote endpoint.
   */
  'event_service': (_envoy_config_core_v3_EventServiceConfig__Output | null);
}

/**
 * Cluster manager :ref:`architecture overview <arch_overview_cluster_manager>`.
 */
export interface ClusterManager {
  /**
   * Name of the local cluster (i.e., the cluster that owns the Envoy running
   * this configuration). In order to enable :ref:`zone aware routing
   * <arch_overview_load_balancing_zone_aware_routing>` this option must be set.
   * If *local_cluster_name* is defined then :ref:`clusters
   * <envoy_v3_api_msg_config.cluster.v3.Cluster>` must be defined in the :ref:`Bootstrap
   * static cluster resources
   * <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.StaticResources.clusters>`. This is unrelated to
   * the :option:`--service-cluster` option which does not `affect zone aware
   * routing <https://github.com/envoyproxy/envoy/issues/774>`_.
   */
  'local_cluster_name'?: (string);
  /**
   * Optional global configuration for outlier detection.
   */
  'outlier_detection'?: (_envoy_config_bootstrap_v3_ClusterManager_OutlierDetection | null);
  /**
   * Optional configuration used to bind newly established upstream connections.
   * This may be overridden on a per-cluster basis by upstream_bind_config in the cds_config.
   */
  'upstream_bind_config'?: (_envoy_config_core_v3_BindConfig | null);
  /**
   * A management server endpoint to stream load stats to via
   * *StreamLoadStats*. This must have :ref:`api_type
   * <envoy_v3_api_field_config.core.v3.ApiConfigSource.api_type>` :ref:`GRPC
   * <envoy_v3_api_enum_value_config.core.v3.ApiConfigSource.ApiType.GRPC>`.
   */
  'load_stats_config'?: (_envoy_config_core_v3_ApiConfigSource | null);
}

/**
 * Cluster manager :ref:`architecture overview <arch_overview_cluster_manager>`.
 */
export interface ClusterManager__Output {
  /**
   * Name of the local cluster (i.e., the cluster that owns the Envoy running
   * this configuration). In order to enable :ref:`zone aware routing
   * <arch_overview_load_balancing_zone_aware_routing>` this option must be set.
   * If *local_cluster_name* is defined then :ref:`clusters
   * <envoy_v3_api_msg_config.cluster.v3.Cluster>` must be defined in the :ref:`Bootstrap
   * static cluster resources
   * <envoy_v3_api_field_config.bootstrap.v3.Bootstrap.StaticResources.clusters>`. This is unrelated to
   * the :option:`--service-cluster` option which does not `affect zone aware
   * routing <https://github.com/envoyproxy/envoy/issues/774>`_.
   */
  'local_cluster_name': (string);
  /**
   * Optional global configuration for outlier detection.
   */
  'outlier_detection': (_envoy_config_bootstrap_v3_ClusterManager_OutlierDetection__Output | null);
  /**
   * Optional configuration used to bind newly established upstream connections.
   * This may be overridden on a per-cluster basis by upstream_bind_config in the cds_config.
   */
  'upstream_bind_config': (_envoy_config_core_v3_BindConfig__Output | null);
  /**
   * A management server endpoint to stream load stats to via
   * *StreamLoadStats*. This must have :ref:`api_type
   * <envoy_v3_api_field_config.core.v3.ApiConfigSource.api_type>` :ref:`GRPC
   * <envoy_v3_api_enum_value_config.core.v3.ApiConfigSource.ApiType.GRPC>`.
   */
  'load_stats_config': (_envoy_config_core_v3_ApiConfigSource__Output | null);
}
