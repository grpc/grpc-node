// Original file: proto/grpc/testing/test.proto

import * as grpc from '@grpc/grpc-js'
import { Empty as _grpc_testing_Empty, Empty__Output as _grpc_testing_Empty__Output } from '../../grpc/testing/Empty';
import { SimpleRequest as _grpc_testing_SimpleRequest, SimpleRequest__Output as _grpc_testing_SimpleRequest__Output } from '../../grpc/testing/SimpleRequest';
import { SimpleResponse as _grpc_testing_SimpleResponse, SimpleResponse__Output as _grpc_testing_SimpleResponse__Output } from '../../grpc/testing/SimpleResponse';
import { StreamingInputCallRequest as _grpc_testing_StreamingInputCallRequest, StreamingInputCallRequest__Output as _grpc_testing_StreamingInputCallRequest__Output } from '../../grpc/testing/StreamingInputCallRequest';
import { StreamingInputCallResponse as _grpc_testing_StreamingInputCallResponse, StreamingInputCallResponse__Output as _grpc_testing_StreamingInputCallResponse__Output } from '../../grpc/testing/StreamingInputCallResponse';
import { StreamingOutputCallRequest as _grpc_testing_StreamingOutputCallRequest, StreamingOutputCallRequest__Output as _grpc_testing_StreamingOutputCallRequest__Output } from '../../grpc/testing/StreamingOutputCallRequest';
import { StreamingOutputCallResponse as _grpc_testing_StreamingOutputCallResponse, StreamingOutputCallResponse__Output as _grpc_testing_StreamingOutputCallResponse__Output } from '../../grpc/testing/StreamingOutputCallResponse';

/**
 * A simple service to test the various types of RPCs and experiment with
 * performance with various types of payload.
 */
export interface TestServiceClient extends grpc.Client {
  /**
   * One request followed by one response. Response has cache control
   * headers set such that a caching HTTP proxy (such as GFE) can
   * satisfy subsequent requests.
   */
  CacheableUnaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  CacheableUnaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  CacheableUnaryCall(argument: _grpc_testing_SimpleRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  CacheableUnaryCall(argument: _grpc_testing_SimpleRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  /**
   * One request followed by one response. Response has cache control
   * headers set such that a caching HTTP proxy (such as GFE) can
   * satisfy subsequent requests.
   */
  cacheableUnaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  cacheableUnaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  cacheableUnaryCall(argument: _grpc_testing_SimpleRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  cacheableUnaryCall(argument: _grpc_testing_SimpleRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  
  /**
   * One empty request followed by one empty response.
   */
  EmptyCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  EmptyCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  EmptyCall(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  EmptyCall(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  /**
   * One empty request followed by one empty response.
   */
  emptyCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  emptyCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  emptyCall(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  emptyCall(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  
  /**
   * A sequence of requests with each request served by the server immediately.
   * As one request could lead to multiple responses, this interface
   * demonstrates the idea of full duplexing.
   */
  FullDuplexCall(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  FullDuplexCall(options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  /**
   * A sequence of requests with each request served by the server immediately.
   * As one request could lead to multiple responses, this interface
   * demonstrates the idea of full duplexing.
   */
  fullDuplexCall(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  fullDuplexCall(options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  
  /**
   * A sequence of requests followed by a sequence of responses.
   * The server buffers all the client requests and then serves them in order. A
   * stream of responses are returned to the client when the server starts with
   * first request.
   */
  HalfDuplexCall(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  HalfDuplexCall(options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  /**
   * A sequence of requests followed by a sequence of responses.
   * The server buffers all the client requests and then serves them in order. A
   * stream of responses are returned to the client when the server starts with
   * first request.
   */
  halfDuplexCall(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  halfDuplexCall(options?: grpc.CallOptions): grpc.ClientDuplexStream<_grpc_testing_StreamingOutputCallRequest, _grpc_testing_StreamingOutputCallResponse__Output>;
  
  /**
   * A sequence of requests followed by one response (streamed upload).
   * The server returns the aggregated size of client payload as the result.
   */
  StreamingInputCall(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  StreamingInputCall(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  StreamingInputCall(options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  StreamingInputCall(callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  /**
   * A sequence of requests followed by one response (streamed upload).
   * The server returns the aggregated size of client payload as the result.
   */
  streamingInputCall(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  streamingInputCall(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  streamingInputCall(options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  streamingInputCall(callback: (error?: grpc.ServiceError, result?: _grpc_testing_StreamingInputCallResponse__Output) => void): grpc.ClientWritableStream<_grpc_testing_StreamingInputCallResponse__Output>;
  
  /**
   * One request followed by a sequence of responses (streamed download).
   * The server returns the payload with client desired type and sizes.
   */
  StreamingOutputCall(argument: _grpc_testing_StreamingOutputCallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_StreamingOutputCallResponse__Output>;
  StreamingOutputCall(argument: _grpc_testing_StreamingOutputCallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_StreamingOutputCallResponse__Output>;
  /**
   * One request followed by a sequence of responses (streamed download).
   * The server returns the payload with client desired type and sizes.
   */
  streamingOutputCall(argument: _grpc_testing_StreamingOutputCallRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_StreamingOutputCallResponse__Output>;
  streamingOutputCall(argument: _grpc_testing_StreamingOutputCallRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_grpc_testing_StreamingOutputCallResponse__Output>;
  
  /**
   * One request followed by one response.
   */
  UnaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  UnaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  UnaryCall(argument: _grpc_testing_SimpleRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  UnaryCall(argument: _grpc_testing_SimpleRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  /**
   * One request followed by one response.
   */
  unaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  unaryCall(argument: _grpc_testing_SimpleRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  unaryCall(argument: _grpc_testing_SimpleRequest, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  unaryCall(argument: _grpc_testing_SimpleRequest, callback: (error?: grpc.ServiceError, result?: _grpc_testing_SimpleResponse__Output) => void): grpc.ClientUnaryCall;
  
  /**
   * The test server will not implement this method. It will be used
   * to test the behavior when clients call unimplemented methods.
   */
  UnimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  UnimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  UnimplementedCall(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  UnimplementedCall(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  /**
   * The test server will not implement this method. It will be used
   * to test the behavior when clients call unimplemented methods.
   */
  unimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  unimplementedCall(argument: _grpc_testing_Empty, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  unimplementedCall(argument: _grpc_testing_Empty, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  unimplementedCall(argument: _grpc_testing_Empty, callback: (error?: grpc.ServiceError, result?: _grpc_testing_Empty__Output) => void): grpc.ClientUnaryCall;
  
}

/**
 * A simple service to test the various types of RPCs and experiment with
 * performance with various types of payload.
 */
export interface TestServiceHandlers extends grpc.UntypedServiceImplementation {
  /**
   * One request followed by one response. Response has cache control
   * headers set such that a caching HTTP proxy (such as GFE) can
   * satisfy subsequent requests.
   */
  CacheableUnaryCall(call: grpc.ServerUnaryCall<_grpc_testing_SimpleRequest__Output, _grpc_testing_SimpleResponse>, callback: grpc.sendUnaryData<_grpc_testing_SimpleResponse>): void;
  
  /**
   * One empty request followed by one empty response.
   */
  EmptyCall(call: grpc.ServerUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_Empty>, callback: grpc.sendUnaryData<_grpc_testing_Empty>): void;
  
  /**
   * A sequence of requests with each request served by the server immediately.
   * As one request could lead to multiple responses, this interface
   * demonstrates the idea of full duplexing.
   */
  FullDuplexCall(call: grpc.ServerDuplexStream<_grpc_testing_StreamingOutputCallRequest__Output, _grpc_testing_StreamingOutputCallResponse>): void;
  
  /**
   * A sequence of requests followed by a sequence of responses.
   * The server buffers all the client requests and then serves them in order. A
   * stream of responses are returned to the client when the server starts with
   * first request.
   */
  HalfDuplexCall(call: grpc.ServerDuplexStream<_grpc_testing_StreamingOutputCallRequest__Output, _grpc_testing_StreamingOutputCallResponse>): void;
  
  /**
   * A sequence of requests followed by one response (streamed upload).
   * The server returns the aggregated size of client payload as the result.
   */
  StreamingInputCall(call: grpc.ServerReadableStream<_grpc_testing_StreamingInputCallRequest__Output, _grpc_testing_StreamingInputCallResponse>, callback: grpc.sendUnaryData<_grpc_testing_StreamingInputCallResponse>): void;
  
  /**
   * One request followed by a sequence of responses (streamed download).
   * The server returns the payload with client desired type and sizes.
   */
  StreamingOutputCall(call: grpc.ServerWritableStream<_grpc_testing_StreamingOutputCallRequest__Output, _grpc_testing_StreamingOutputCallResponse>): void;
  
  /**
   * One request followed by one response.
   */
  UnaryCall(call: grpc.ServerUnaryCall<_grpc_testing_SimpleRequest__Output, _grpc_testing_SimpleResponse>, callback: grpc.sendUnaryData<_grpc_testing_SimpleResponse>): void;
  
  /**
   * The test server will not implement this method. It will be used
   * to test the behavior when clients call unimplemented methods.
   */
  UnimplementedCall(call: grpc.ServerUnaryCall<_grpc_testing_Empty__Output, _grpc_testing_Empty>, callback: grpc.sendUnaryData<_grpc_testing_Empty>): void;
  
}
