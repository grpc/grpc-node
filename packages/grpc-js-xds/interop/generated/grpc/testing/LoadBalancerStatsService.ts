// Original file: proto/grpc/testing/test.proto

import * as grpc from '@grpc/grpc-js'
import { LoadBalancerAccumulatedStatsRequest as _grpc_testing_LoadBalancerAccumulatedStatsRequest, LoadBalancerAccumulatedStatsRequest__Output as _grpc_testing_LoadBalancerAccumulatedStatsRequest__Output } from '../../grpc/testing/LoadBalancerAccumulatedStatsRequest';
import { LoadBalancerAccumulatedStatsResponse as _grpc_testing_LoadBalancerAccumulatedStatsResponse, LoadBalancerAccumulatedStatsResponse__Output as _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output } from '../../grpc/testing/LoadBalancerAccumulatedStatsResponse';
import { LoadBalancerStatsRequest as _grpc_testing_LoadBalancerStatsRequest, LoadBalancerStatsRequest__Output as _grpc_testing_LoadBalancerStatsRequest__Output } from '../../grpc/testing/LoadBalancerStatsRequest';
import { LoadBalancerStatsResponse as _grpc_testing_LoadBalancerStatsResponse, LoadBalancerStatsResponse__Output as _grpc_testing_LoadBalancerStatsResponse__Output } from '../../grpc/testing/LoadBalancerStatsResponse';

/**
 * A service used to obtain stats for verifying LB behavior.
 */
export interface LoadBalancerStatsServiceClient extends grpc.Client {
  /**
   * Gets the accumulated stats for RPCs sent by a test client.
   */
  GetClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  GetClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  GetClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  GetClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  /**
   * Gets the accumulated stats for RPCs sent by a test client.
   */
  getClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  getClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  getClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  getClientAccumulatedStats(argument: _grpc_testing_LoadBalancerAccumulatedStatsRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerAccumulatedStatsResponse__Output) => void): grpc.ClientUnaryCall;
  
  /**
   * Gets the backend distribution for RPCs sent by a test client.
   */
  GetClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  GetClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  GetClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  GetClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  /**
   * Gets the backend distribution for RPCs sent by a test client.
   */
  getClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  getClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  getClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  getClientStats(argument: _grpc_testing_LoadBalancerStatsRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_LoadBalancerStatsResponse__Output) => void): grpc.ClientUnaryCall;
  
}

/**
 * A service used to obtain stats for verifying LB behavior.
 */
export interface LoadBalancerStatsServiceHandlers extends grpc.UntypedServiceImplementation {
  /**
   * Gets the accumulated stats for RPCs sent by a test client.
   */
  GetClientAccumulatedStats(call: grpc.ServerUnaryCall<_grpc_testing_LoadBalancerAccumulatedStatsRequest__Output, _grpc_testing_LoadBalancerAccumulatedStatsResponse>, callback: grpc.sendUnaryData<_grpc_testing_LoadBalancerAccumulatedStatsResponse>): void;
  
  /**
   * Gets the backend distribution for RPCs sent by a test client.
   */
  GetClientStats(call: grpc.ServerUnaryCall<_grpc_testing_LoadBalancerStatsRequest__Output, _grpc_testing_LoadBalancerStatsResponse>, callback: grpc.sendUnaryData<_grpc_testing_LoadBalancerStatsResponse>): void;
  
}
