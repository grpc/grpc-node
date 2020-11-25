// Original file: proto/grpc/testing/messages.proto


export interface _grpc_testing_LoadBalancerStatsResponse_RpcsByPeer {
  /**
   * The number of completed RPCs for each peer.
   */
  'rpcs_by_peer'?: ({[key: string]: number});
}

export interface _grpc_testing_LoadBalancerStatsResponse_RpcsByPeer__Output {
  /**
   * The number of completed RPCs for each peer.
   */
  'rpcs_by_peer': ({[key: string]: number});
}

export interface LoadBalancerStatsResponse {
  /**
   * The number of completed RPCs for each peer.
   */
  'rpcs_by_peer'?: ({[key: string]: number});
  /**
   * The number of RPCs that failed to record a remote peer.
   */
  'num_failures'?: (number);
  'rpcs_by_method'?: ({[key: string]: _grpc_testing_LoadBalancerStatsResponse_RpcsByPeer});
}

export interface LoadBalancerStatsResponse__Output {
  /**
   * The number of completed RPCs for each peer.
   */
  'rpcs_by_peer': ({[key: string]: number});
  /**
   * The number of RPCs that failed to record a remote peer.
   */
  'num_failures': (number);
  'rpcs_by_method'?: ({[key: string]: _grpc_testing_LoadBalancerStatsResponse_RpcsByPeer__Output});
}
