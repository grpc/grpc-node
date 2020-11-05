// Original file: proto/grpc/testing/test.proto

import * as grpc from '@grpc/grpc-js'
import { Empty as _grpc_testing_Empty, Empty__Output as _grpc_testing_Empty__Output } from '../../grpc/testing/Empty';
import { ReconnectInfo as _grpc_testing_ReconnectInfo, ReconnectInfo__Output as _grpc_testing_ReconnectInfo__Output } from '../../grpc/testing/ReconnectInfo';
import { ReconnectParams as _grpc_testing_ReconnectParams, ReconnectParams__Output as _grpc_testing_ReconnectParams__Output } from '../../grpc/testing/ReconnectParams';

/**
 * A service used to control reconnect server.
 */
export interface ReconnectServiceClient extends grpc.Client {
  Start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  Start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  Start(argument: _grpc_testing_ReconnectParams, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  Start(argument: _grpc_testing_ReconnectParams, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  
  Stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  Stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  Stop(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  Stop(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_ReconnectInfo__Output) => void): grpc.ClientUnaryCall;
  
}

/**
 * A service used to control reconnect server.
 */
export interface ReconnectServiceHandlers extends grpc.UntypedServiceImplementation {
  Start(call: grpc.ServerUnaryCall<_grpc_testing_ReconnectParams__Output, _grpc_testing_Empty>, callback: grpc.sendUnaryData<_grpc_testing_Empty>): void;
  
  Stop(call: grpc.ServerUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_ReconnectInfo>, callback: grpc.sendUnaryData<_grpc_testing_ReconnectInfo>): void;
  
}
