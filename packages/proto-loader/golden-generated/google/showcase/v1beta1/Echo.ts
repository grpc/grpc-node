// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { BlockRequest as _google_showcase_v1beta1_BlockRequest, BlockRequest__Output as _google_showcase_v1beta1_BlockRequest__Output } from '../../../google/showcase/v1beta1/BlockRequest';
import type { BlockResponse as _google_showcase_v1beta1_BlockResponse, BlockResponse__Output as _google_showcase_v1beta1_BlockResponse__Output } from '../../../google/showcase/v1beta1/BlockResponse';
import type { EchoRequest as _google_showcase_v1beta1_EchoRequest, EchoRequest__Output as _google_showcase_v1beta1_EchoRequest__Output } from '../../../google/showcase/v1beta1/EchoRequest';
import type { EchoResponse as _google_showcase_v1beta1_EchoResponse, EchoResponse__Output as _google_showcase_v1beta1_EchoResponse__Output } from '../../../google/showcase/v1beta1/EchoResponse';
import type { ExpandRequest as _google_showcase_v1beta1_ExpandRequest, ExpandRequest__Output as _google_showcase_v1beta1_ExpandRequest__Output } from '../../../google/showcase/v1beta1/ExpandRequest';
import type { Operation as _google_longrunning_Operation, Operation__Output as _google_longrunning_Operation__Output } from '../../../google/longrunning/Operation';
import type { PagedExpandRequest as _google_showcase_v1beta1_PagedExpandRequest, PagedExpandRequest__Output as _google_showcase_v1beta1_PagedExpandRequest__Output } from '../../../google/showcase/v1beta1/PagedExpandRequest';
import type { PagedExpandResponse as _google_showcase_v1beta1_PagedExpandResponse, PagedExpandResponse__Output as _google_showcase_v1beta1_PagedExpandResponse__Output } from '../../../google/showcase/v1beta1/PagedExpandResponse';
import type { WaitRequest as _google_showcase_v1beta1_WaitRequest, WaitRequest__Output as _google_showcase_v1beta1_WaitRequest__Output } from '../../../google/showcase/v1beta1/WaitRequest';

/**
 * This service is used showcase the four main types of rpcs - unary, server
 * side streaming, client side streaming, and bidirectional streaming. This
 * service also exposes methods that explicitly implement server delay, and
 * paginated calls. Set the 'showcase-trailer' metadata key on any method
 * to have the values echoed in the response trailers.
 */
export interface EchoClient extends grpc.Client {
  /**
   * This method will block (wait) for the requested amount of time
   * and then return the response or error.
   * This method showcases how a client handles delays or retries.
   */
  Block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  Block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  Block(argument: _google_showcase_v1beta1_BlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  Block(argument: _google_showcase_v1beta1_BlockRequest, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  /**
   * This method will block (wait) for the requested amount of time
   * and then return the response or error.
   * This method showcases how a client handles delays or retries.
   */
  block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, callback: grpc.requestCallback<_google_showcase_v1beta1_BlockResponse__Output>): grpc.ClientUnaryCall;
  
  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   */
  Chat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  Chat(options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   */
  chat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  chat(options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  
  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   */
  Collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  Collect(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  Collect(options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  Collect(callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   */
  collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  collect(metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  collect(options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  collect(callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoRequest>;
  
  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   */
  Echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo(argument: _google_showcase_v1beta1_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  Echo(argument: _google_showcase_v1beta1_EchoRequest, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   */
  echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, callback: grpc.requestCallback<_google_showcase_v1beta1_EchoResponse__Output>): grpc.ClientUnaryCall;
  
  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   */
  Expand(argument: _google_showcase_v1beta1_ExpandRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  Expand(argument: _google_showcase_v1beta1_ExpandRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   */
  expand(argument: _google_showcase_v1beta1_ExpandRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  expand(argument: _google_showcase_v1beta1_ExpandRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  
  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   */
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   */
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, callback: grpc.requestCallback<_google_showcase_v1beta1_PagedExpandResponse__Output>): grpc.ClientUnaryCall;
  
  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   */
  Wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  Wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  Wait(argument: _google_showcase_v1beta1_WaitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  Wait(argument: _google_showcase_v1beta1_WaitRequest, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   */
  wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, callback: grpc.requestCallback<_google_longrunning_Operation__Output>): grpc.ClientUnaryCall;
  
}

/**
 * This service is used showcase the four main types of rpcs - unary, server
 * side streaming, client side streaming, and bidirectional streaming. This
 * service also exposes methods that explicitly implement server delay, and
 * paginated calls. Set the 'showcase-trailer' metadata key on any method
 * to have the values echoed in the response trailers.
 */
export interface EchoHandlers extends grpc.UntypedServiceImplementation {
  /**
   * This method will block (wait) for the requested amount of time
   * and then return the response or error.
   * This method showcases how a client handles delays or retries.
   */
  Block: grpc.handleUnaryCall<_google_showcase_v1beta1_BlockRequest__Output, _google_showcase_v1beta1_BlockResponse>;
  
  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   */
  Chat: grpc.handleBidiStreamingCall<_google_showcase_v1beta1_EchoRequest__Output, _google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   */
  Collect: grpc.handleClientStreamingCall<_google_showcase_v1beta1_EchoRequest__Output, _google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   */
  Echo: grpc.handleUnaryCall<_google_showcase_v1beta1_EchoRequest__Output, _google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   */
  Expand: grpc.handleServerStreamingCall<_google_showcase_v1beta1_ExpandRequest__Output, _google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   */
  PagedExpand: grpc.handleUnaryCall<_google_showcase_v1beta1_PagedExpandRequest__Output, _google_showcase_v1beta1_PagedExpandResponse>;
  
  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   */
  Wait: grpc.handleUnaryCall<_google_showcase_v1beta1_WaitRequest__Output, _google_longrunning_Operation>;
  
}

export interface EchoDefinition extends grpc.ServiceDefinition {
  Block: MethodDefinition<_google_showcase_v1beta1_BlockRequest, _google_showcase_v1beta1_BlockResponse, _google_showcase_v1beta1_BlockRequest__Output, _google_showcase_v1beta1_BlockResponse__Output>
  Chat: MethodDefinition<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse, _google_showcase_v1beta1_EchoRequest__Output, _google_showcase_v1beta1_EchoResponse__Output>
  Collect: MethodDefinition<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse, _google_showcase_v1beta1_EchoRequest__Output, _google_showcase_v1beta1_EchoResponse__Output>
  Echo: MethodDefinition<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse, _google_showcase_v1beta1_EchoRequest__Output, _google_showcase_v1beta1_EchoResponse__Output>
  Expand: MethodDefinition<_google_showcase_v1beta1_ExpandRequest, _google_showcase_v1beta1_EchoResponse, _google_showcase_v1beta1_ExpandRequest__Output, _google_showcase_v1beta1_EchoResponse__Output>
  PagedExpand: MethodDefinition<_google_showcase_v1beta1_PagedExpandRequest, _google_showcase_v1beta1_PagedExpandResponse, _google_showcase_v1beta1_PagedExpandRequest__Output, _google_showcase_v1beta1_PagedExpandResponse__Output>
  Wait: MethodDefinition<_google_showcase_v1beta1_WaitRequest, _google_longrunning_Operation, _google_showcase_v1beta1_WaitRequest__Output, _google_longrunning_Operation__Output>
}
