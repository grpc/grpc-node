// Original file: deps/envoy-api/envoy/config/cluster/v3/cluster.proto


export interface TrackClusterStats {
  /**
   * If timeout_budgets is true, the :ref:`timeout budget histograms
   * <config_cluster_manager_cluster_stats_timeout_budgets>` will be published for each
   * request. These show what percentage of a request's per try and global timeout was used. A value
   * of 0 would indicate that none of the timeout was used or that the timeout was infinite. A value
   * of 100 would indicate that the request took the entirety of the timeout given to it.
   */
  'timeout_budgets'?: (boolean);
  /**
   * If request_response_sizes is true, then the :ref:`histograms
   * <config_cluster_manager_cluster_stats_request_response_sizes>`  tracking header and body sizes
   * of requests and responses will be published.
   */
  'request_response_sizes'?: (boolean);
}

export interface TrackClusterStats__Output {
  /**
   * If timeout_budgets is true, the :ref:`timeout budget histograms
   * <config_cluster_manager_cluster_stats_timeout_budgets>` will be published for each
   * request. These show what percentage of a request's per try and global timeout was used. A value
   * of 0 would indicate that none of the timeout was used or that the timeout was infinite. A value
   * of 100 would indicate that the request took the entirety of the timeout given to it.
   */
  'timeout_budgets': (boolean);
  /**
   * If request_response_sizes is true, then the :ref:`histograms
   * <config_cluster_manager_cluster_stats_request_response_sizes>`  tracking header and body sizes
   * of requests and responses will be published.
   */
  'request_response_sizes': (boolean);
}
