// Original file: proto/grpc/testing/test.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _grpc_testing_Empty, Empty__Output as _grpc_testing_Empty__Output } from '../../grpc/testing/Empty';
import type { ReconnectInfo as _grpc_testing_ReconnectInfo, ReconnectInfo__Output as _grpc_testing_ReconnectInfo__Output } from '../../grpc/testing/ReconnectInfo';
import type { ReconnectParams as _grpc_testing_ReconnectParams, ReconnectParams__Output as _grpc_testing_ReconnectParams__Output } from '../../grpc/testing/ReconnectParams';

/**
 * A service used to control reconnect server.
 */
export interface ReconnectServiceClient extends grpc.Client {
  Start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  Start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  Start(argument: _grpc_testing_ReconnectParams, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  Start(argument: _grpc_testing_ReconnectParams, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  start(argument: _grpc_testing_ReconnectParams, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  
  Stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  Stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  Stop(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  Stop(argument: _grpc_testing_Empty, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  stop(argument: _grpc_testing_Empty, callback: grpc.requestCallback<_grpc_testing_ReconnectInfo__Output>): grpc.ClientUnaryCall;
  
}

/**
 * A service used to control reconnect server.
 */
export interface ReconnectServiceHandlers extends grpc.UntypedServiceImplementation {
  Start: grpc.handleUnaryCall<_grpc_testing_ReconnectParams__Output, _grpc_testing_Empty>;
  
  Stop: grpc.handleUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_ReconnectInfo>;
  
}

export interface ReconnectServiceDefinition extends grpc.ServiceDefinition {
  Start: MethodDefinition<_grpc_testing_ReconnectParams, _grpc_testing_Empty, _grpc_testing_ReconnectParams__Output, _grpc_testing_Empty__Output>
  Stop: MethodDefinition<_grpc_testing_Empty, _grpc_testing_ReconnectInfo, _grpc_testing_Empty__Output, _grpc_testing_ReconnectInfo__Output>
}
