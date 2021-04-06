// Original file: proto/grpc/testing/test.proto

import type * as grpc from '@grpc/grpc-js'
import type { Empty as _grpc_testing_Empty, Empty__Output as _grpc_testing_Empty__Output } from '../../grpc/testing/Empty';

/**
 * A simple service NOT implemented at servers so clients can test for
 * that case.
 */
export interface UnimplementedServiceClient extends grpc.Client {
  /**
   * A call that no server should implement
   */
  UnimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  UnimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  UnimplementedCall(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  UnimplementedCall(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  /**
   * A call that no server should implement
   */
  unimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  unimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  unimplementedCall(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  unimplementedCall(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  
}

/**
 * A simple service NOT implemented at servers so clients can test for
 * that case.
 */
export interface UnimplementedServiceHandlers extends grpc.UntypedServiceImplementation {
  /**
   * A call that no server should implement
   */
  UnimplementedCall: grpc.handleUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_Empty>;
  
}
