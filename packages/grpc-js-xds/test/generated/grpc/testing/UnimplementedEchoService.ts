// Original file: proto/grpc/testing/echo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EchoRequest as _grpc_testing_EchoRequest, EchoRequest__Output as _grpc_testing_EchoRequest__Output } from '../../grpc/testing/EchoRequest';
import type { EchoResponse as _grpc_testing_EchoResponse, EchoResponse__Output as _grpc_testing_EchoResponse__Output } from '../../grpc/testing/EchoResponse';

export interface UnimplementedEchoServiceClient extends grpc.Client {
  Unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Unimplemented(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Unimplemented(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface UnimplementedEchoServiceHandlers extends grpc.UntypedServiceImplementation {
  Unimplemented: grpc.handleUnaryCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
}

export interface UnimplementedEchoServiceDefinition extends grpc.ServiceDefinition {
  Unimplemented: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
}
