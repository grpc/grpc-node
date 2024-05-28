// Original file: proto/grpc/testing/test.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { Empty as _grpc_testing_Empty, Empty__Output as _grpc_testing_Empty__Output } from '../../grpc/testing/Empty';

/**
 * A service to remotely control health status of an xDS test server.
 */
export interface XdsUpdateHealthServiceClient extends grpc.Client {
  SetNotServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  SetNotServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  SetNotServing(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  SetNotServing(argument: _grpc_testing_Empty, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setNotServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setNotServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setNotServing(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setNotServing(argument: _grpc_testing_Empty, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  
  SetServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  SetServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  SetServing(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  SetServing(argument: _grpc_testing_Empty, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setServing(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setServing(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  setServing(argument: _grpc_testing_Empty, callback: grpc.requestCallback<_grpc_testing_Empty__Output>): grpc.ClientUnaryCall;
  
}

/**
 * A service to remotely control health status of an xDS test server.
 */
export interface XdsUpdateHealthServiceHandlers extends grpc.UntypedServiceImplementation {
  SetNotServing: grpc.handleUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_Empty>;
  
  SetServing: grpc.handleUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_Empty>;
  
}

export interface XdsUpdateHealthServiceDefinition extends grpc.ServiceDefinition {
  SetNotServing: MethodDefinition<_grpc_testing_Empty, _grpc_testing_Empty, _grpc_testing_Empty__Output, _grpc_testing_Empty__Output>
  SetServing: MethodDefinition<_grpc_testing_Empty, _grpc_testing_Empty, _grpc_testing_Empty__Output, _grpc_testing_Empty__Output>
}
