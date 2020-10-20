// Original file: proto/grpc/testing/messages.proto


export interface LoadBalancerStatsRequest {
  /**
   * Request stats for the next num_rpcs sent by client.
   */
  'num_rpcs'?: (number);
  /**
   * If num_rpcs have not completed within timeout_sec, return partial results.
   */
  'timeout_sec'?: (number);
}

export interface LoadBalancerStatsRequest__Output {
  /**
   * Request stats for the next num_rpcs sent by client.
   */
  'num_rpcs': (number);
  /**
   * If num_rpcs have not completed within timeout_sec, return partial results.
   */
  'timeout_sec': (number);
}
