// Original file: deps/envoy-api/envoy/extensions/clusters/aggregate/v3/cluster.proto


/**
 * Configuration for the aggregate cluster. See the :ref:`architecture overview
 * <arch_overview_aggregate_cluster>` for more information.
 * [#extension: envoy.clusters.aggregate]
 */
export interface ClusterConfig {
  /**
   * Load balancing clusters in aggregate cluster. Clusters are prioritized based on the order they
   * appear in this list.
   */
  'clusters'?: (string)[];
}

/**
 * Configuration for the aggregate cluster. See the :ref:`architecture overview
 * <arch_overview_aggregate_cluster>` for more information.
 * [#extension: envoy.clusters.aggregate]
 */
export interface ClusterConfig__Output {
  /**
   * Load balancing clusters in aggregate cluster. Clusters are prioritized based on the order they
   * appear in this list.
   */
  'clusters': (string)[];
}
