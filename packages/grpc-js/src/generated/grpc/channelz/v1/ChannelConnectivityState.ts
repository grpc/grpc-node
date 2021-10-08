// Original file: proto/channelz.proto


// Original file: proto/channelz.proto

export enum _grpc_channelz_v1_ChannelConnectivityState_State {
  UNKNOWN = 0,
  IDLE = 1,
  CONNECTING = 2,
  READY = 3,
  TRANSIENT_FAILURE = 4,
  SHUTDOWN = 5,
}

/**
 * These come from the specified states in this document:
 * https://github.com/grpc/grpc/blob/master/doc/connectivity-semantics-and-api.md
 */
export interface ChannelConnectivityState {
  'state'?: (_grpc_channelz_v1_ChannelConnectivityState_State | keyof typeof _grpc_channelz_v1_ChannelConnectivityState_State);
}

/**
 * These come from the specified states in this document:
 * https://github.com/grpc/grpc/blob/master/doc/connectivity-semantics-and-api.md
 */
export interface ChannelConnectivityState__Output {
  'state': (keyof typeof _grpc_channelz_v1_ChannelConnectivityState_State);
}
