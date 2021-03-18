// Original file: proto/grpc/testing/messages.proto


export interface _grpc_testing_LoadBalancerAccumulatedStatsResponse_MethodStats {
  /**
   * The number of RPCs that were started for this method.
   */
  'rpcs_started'?: (number);
  /**
   * The number of RPCs that completed with each status for this method.  The
   * key is the integral value of a google.rpc.Code; the value is the count.
   */
  'result'?: ({[key: number]: number});
}

export interface _grpc_testing_LoadBalancerAccumulatedStatsResponse_MethodStats__Output {
  /**
   * The number of RPCs that were started for this method.
   */
  'rpcs_started': (number);
  /**
   * The number of RPCs that completed with each status for this method.  The
   * key is the integral value of a google.rpc.Code; the value is the count.
   */
  'result': ({[key: number]: number});
}

/**
 * Accumulated stats for RPCs sent by a test client.
 */
export interface LoadBalancerAccumulatedStatsResponse {
  /**
   * The total number of RPCs have ever issued for each type.
   * Deprecated: use stats_per_method.rpcs_started instead.
   */
  'num_rpcs_started_by_method'?: ({[key: string]: number});
  /**
   * The total number of RPCs have ever completed successfully for each type.
   * Deprecated: use stats_per_method.result instead.
   */
  'num_rpcs_succeeded_by_method'?: ({[key: string]: number});
  /**
   * The total number of RPCs have ever failed for each type.
   * Deprecated: use stats_per_method.result instead.
   */
  'num_rpcs_failed_by_method'?: ({[key: string]: number});
  /**
   * Per-method RPC statistics.  The key is the RpcType in string form; e.g.
   * 'EMPTY_CALL' or 'UNARY_CALL'
   */
  'stats_per_method'?: ({[key: string]: _grpc_testing_LoadBalancerAccumulatedStatsResponse_MethodStats});
}

/**
 * Accumulated stats for RPCs sent by a test client.
 */
export interface LoadBalancerAccumulatedStatsResponse__Output {
  /**
   * The total number of RPCs have ever issued for each type.
   * Deprecated: use stats_per_method.rpcs_started instead.
   */
  'num_rpcs_started_by_method': ({[key: string]: number});
  /**
   * The total number of RPCs have ever completed successfully for each type.
   * Deprecated: use stats_per_method.result instead.
   */
  'num_rpcs_succeeded_by_method': ({[key: string]: number});
  /**
   * The total number of RPCs have ever failed for each type.
   * Deprecated: use stats_per_method.result instead.
   */
  'num_rpcs_failed_by_method': ({[key: string]: number});
  /**
   * Per-method RPC statistics.  The key is the RpcType in string form; e.g.
   * 'EMPTY_CALL' or 'UNARY_CALL'
   */
  'stats_per_method'?: ({[key: string]: _grpc_testing_LoadBalancerAccumulatedStatsResponse_MethodStats__Output});
}
