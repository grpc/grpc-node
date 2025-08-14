// Original file: test/fixtures/echo_service.proto

import type * as grpc from './../../src/index'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { EchoMessage as _EchoMessage, EchoMessage__Output as _EchoMessage__Output } from './EchoMessage';

export interface EchoServiceClient extends grpc.Client {
  Echo(argument: _EchoMessage, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  Echo(argument: _EchoMessage, metadata: grpc.Metadata, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  Echo(argument: _EchoMessage, options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  Echo(argument: _EchoMessage, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  echo(argument: _EchoMessage, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  echo(argument: _EchoMessage, metadata: grpc.Metadata, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  echo(argument: _EchoMessage, options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  echo(argument: _EchoMessage, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientUnaryCall;
  
  EchoBidiStream(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_EchoMessage, _EchoMessage__Output>;
  EchoBidiStream(options?: grpc.CallOptions): grpc.ClientDuplexStream<_EchoMessage, _EchoMessage__Output>;
  echoBidiStream(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_EchoMessage, _EchoMessage__Output>;
  echoBidiStream(options?: grpc.CallOptions): grpc.ClientDuplexStream<_EchoMessage, _EchoMessage__Output>;
  
  EchoClientStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  EchoClientStream(metadata: grpc.Metadata, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  EchoClientStream(options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  EchoClientStream(callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  echoClientStream(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  echoClientStream(metadata: grpc.Metadata, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  echoClientStream(options: grpc.CallOptions, callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  echoClientStream(callback: grpc.requestCallback<_EchoMessage__Output>): grpc.ClientWritableStream<_EchoMessage>;
  
  EchoServerStream(argument: _EchoMessage, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_EchoMessage__Output>;
  EchoServerStream(argument: _EchoMessage, options?: grpc.CallOptions): grpc.ClientReadableStream<_EchoMessage__Output>;
  echoServerStream(argument: _EchoMessage, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_EchoMessage__Output>;
  echoServerStream(argument: _EchoMessage, options?: grpc.CallOptions): grpc.ClientReadableStream<_EchoMessage__Output>;
  
}

export interface EchoServiceHandlers extends grpc.UntypedServiceImplementation {
  Echo: grpc.handleUnaryCall<_EchoMessage__Output, _EchoMessage>;
  
  EchoBidiStream: grpc.handleBidiStreamingCall<_EchoMessage__Output, _EchoMessage>;
  
  EchoClientStream: grpc.handleClientStreamingCall<_EchoMessage__Output, _EchoMessage>;
  
  EchoServerStream: grpc.handleServerStreamingCall<_EchoMessage__Output, _EchoMessage>;
  
}

export interface EchoServiceDefinition extends grpc.ServiceDefinition {
  Echo: MethodDefinition<_EchoMessage, _EchoMessage, _EchoMessage__Output, _EchoMessage__Output>
  EchoBidiStream: MethodDefinition<_EchoMessage, _EchoMessage, _EchoMessage__Output, _EchoMessage__Output>
  EchoClientStream: MethodDefinition<_EchoMessage, _EchoMessage, _EchoMessage__Output, _EchoMessage__Output>
  EchoServerStream: MethodDefinition<_EchoMessage, _EchoMessage, _EchoMessage__Output, _EchoMessage__Output>
}
