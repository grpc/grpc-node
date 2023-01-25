// Original file: proto/grpc/testing/echo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EchoRequest as _grpc_testing_EchoRequest, EchoRequest__Output as _grpc_testing_EchoRequest__Output } from '../../grpc/testing/EchoRequest';
import type { EchoResponse as _grpc_testing_EchoResponse, EchoResponse__Output as _grpc_testing_EchoResponse__Output } from '../../grpc/testing/EchoResponse';
import type { SimpleRequest as _grpc_testing_SimpleRequest, SimpleRequest__Output as _grpc_testing_SimpleRequest__Output } from '../../grpc/testing/SimpleRequest';
import type { SimpleResponse as _grpc_testing_SimpleResponse, SimpleResponse__Output as _grpc_testing_SimpleResponse__Output } from '../../grpc/testing/SimpleResponse';

export interface EchoTest2ServiceClient extends grpc.Client {
  BidiStream(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse__Output>;
  BidiStream(options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse__Output>;
  bidiStream(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse__Output>;
  bidiStream(options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse__Output>;
  
  /**
   * A service which checks that the initial metadata sent over contains some
   * expected key value pair
   */
  CheckClientInitialMetadata(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  CheckClientInitialMetadata(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  CheckClientInitialMetadata(argument: _grpc_testing_SimpleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  CheckClientInitialMetadata(argument: _grpc_testing_SimpleRequest, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  /**
   * A service which checks that the initial metadata sent over contains some
   * expected key value pair
   */
  checkClientInitialMetadata(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  checkClientInitialMetadata(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  checkClientInitialMetadata(argument: _grpc_testing_SimpleRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  checkClientInitialMetadata(argument: _grpc_testing_SimpleRequest, callback: grpc.requestCallback<_grpc_testing_SimpleResponse__Output>): grpc.ClientUnaryCall;
  
  Echo(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  
  Echo1(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo1(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo1(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo1(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo1(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo1(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo1(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo1(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  
  Echo2(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo2(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo2(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo2(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo2(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo2(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo2(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo2(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  
  RequestStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  RequestStream(metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  RequestStream(options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  RequestStream(callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  requestStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  requestStream(metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  requestStream(options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  requestStream(callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientWritableStream<_grpc_testing_EchoRequest>;
  
  ResponseStream(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_EchoResponse__Output>;
  ResponseStream(argument: _grpc_testing_EchoRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_EchoResponse__Output>;
  responseStream(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_EchoResponse__Output>;
  responseStream(argument: _grpc_testing_EchoRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_EchoResponse__Output>;
  
  Unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Unimplemented(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  Unimplemented(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  unimplemented(argument: _grpc_testing_EchoRequest, callback: grpc.requestCallback<_grpc_testing_EchoResponse__Output>): grpc.ClientUnaryCall;
  
}

export interface EchoTest2ServiceHandlers extends grpc.UntypedServiceImplementation {
  BidiStream: grpc.handleBidiStreamingCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
  /**
   * A service which checks that the initial metadata sent over contains some
   * expected key value pair
   */
  CheckClientInitialMetadata: grpc.handleUnaryCall<_grpc_testing_SimpleRequest__Output, _grpc_testing_SimpleResponse>;
  
  Echo: grpc.handleUnaryCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
  Echo1: grpc.handleUnaryCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
  Echo2: grpc.handleUnaryCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
  RequestStream: grpc.handleClientStreamingCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
  ResponseStream: grpc.handleServerStreamingCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
  Unimplemented: grpc.handleUnaryCall<_grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse>;
  
}

export interface EchoTest2ServiceDefinition extends grpc.ServiceDefinition {
  BidiStream: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
  CheckClientInitialMetadata: MethodDefinition<_grpc_testing_SimpleRequest, _grpc_testing_SimpleResponse, _grpc_testing_SimpleRequest__Output, _grpc_testing_SimpleResponse__Output>
  Echo: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
  Echo1: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
  Echo2: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
  RequestStream: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
  ResponseStream: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
  Unimplemented: MethodDefinition<_grpc_testing_EchoRequest, _grpc_testing_EchoResponse, _grpc_testing_EchoRequest__Output, _grpc_testing_EchoResponse__Output>
}
