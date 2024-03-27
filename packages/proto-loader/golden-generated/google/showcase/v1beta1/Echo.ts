// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import type * as grpc from '@grpc/grpc-js'
import type { MethodDefinition } from '@grpc/proto-loader'
import type { IBlockRequest as I_google_showcase_v1beta1_BlockRequest, OBlockRequest as O_google_showcase_v1beta1_BlockRequest } from '../../../google/showcase/v1beta1/BlockRequest';
import type { IBlockResponse as I_google_showcase_v1beta1_BlockResponse, OBlockResponse as O_google_showcase_v1beta1_BlockResponse } from '../../../google/showcase/v1beta1/BlockResponse';
import type { IEchoRequest as I_google_showcase_v1beta1_EchoRequest, OEchoRequest as O_google_showcase_v1beta1_EchoRequest } from '../../../google/showcase/v1beta1/EchoRequest';
import type { IEchoResponse as I_google_showcase_v1beta1_EchoResponse, OEchoResponse as O_google_showcase_v1beta1_EchoResponse } from '../../../google/showcase/v1beta1/EchoResponse';
import type { IExpandRequest as I_google_showcase_v1beta1_ExpandRequest, OExpandRequest as O_google_showcase_v1beta1_ExpandRequest } from '../../../google/showcase/v1beta1/ExpandRequest';
import type { IOperation as I_google_longrunning_Operation, OOperation as O_google_longrunning_Operation } from '../../../google/longrunning/Operation';
import type { IPagedExpandRequest as I_google_showcase_v1beta1_PagedExpandRequest, OPagedExpandRequest as O_google_showcase_v1beta1_PagedExpandRequest } from '../../../google/showcase/v1beta1/PagedExpandRequest';
import type { IPagedExpandResponse as I_google_showcase_v1beta1_PagedExpandResponse, OPagedExpandResponse as O_google_showcase_v1beta1_PagedExpandResponse } from '../../../google/showcase/v1beta1/PagedExpandResponse';
import type { IWaitRequest as I_google_showcase_v1beta1_WaitRequest, OWaitRequest as O_google_showcase_v1beta1_WaitRequest } from '../../../google/showcase/v1beta1/WaitRequest';

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
  Block(argument: I_google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  Block(argument: I_google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  Block(argument: I_google_showcase_v1beta1_BlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  Block(argument: I_google_showcase_v1beta1_BlockRequest, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  /**
   * This method will block (wait) for the requested amount of time
   * and then return the response or error.
   * This method showcases how a client handles delays or retries.
   */
  block(argument: I_google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  block(argument: I_google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  block(argument: I_google_showcase_v1beta1_BlockRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  block(argument: I_google_showcase_v1beta1_BlockRequest, callback: grpc.requestCallback<O_google_showcase_v1beta1_BlockResponse>): grpc.ClientUnaryCall;
  
  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   */
  Chat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<I_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>;
  Chat(options?: grpc.CallOptions): grpc.ClientDuplexStream<I_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>;
  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   */
  chat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<I_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>;
  chat(options?: grpc.CallOptions): grpc.ClientDuplexStream<I_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   */
  Collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  Collect(metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  Collect(options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  Collect(callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   */
  collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  collect(metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  collect(options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  collect(callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientWritableStream<I_google_showcase_v1beta1_EchoRequest>;
  
  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   */
  Echo(argument: I_google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  Echo(argument: I_google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  Echo(argument: I_google_showcase_v1beta1_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  Echo(argument: I_google_showcase_v1beta1_EchoRequest, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   */
  echo(argument: I_google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  echo(argument: I_google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  echo(argument: I_google_showcase_v1beta1_EchoRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  echo(argument: I_google_showcase_v1beta1_EchoRequest, callback: grpc.requestCallback<O_google_showcase_v1beta1_EchoResponse>): grpc.ClientUnaryCall;
  
  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   */
  Expand(argument: I_google_showcase_v1beta1_ExpandRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<O_google_showcase_v1beta1_EchoResponse>;
  Expand(argument: I_google_showcase_v1beta1_ExpandRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<O_google_showcase_v1beta1_EchoResponse>;
  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   */
  expand(argument: I_google_showcase_v1beta1_ExpandRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<O_google_showcase_v1beta1_EchoResponse>;
  expand(argument: I_google_showcase_v1beta1_ExpandRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<O_google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   */
  PagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  PagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  PagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  PagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   */
  pagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  pagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  pagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  pagedExpand(argument: I_google_showcase_v1beta1_PagedExpandRequest, callback: grpc.requestCallback<O_google_showcase_v1beta1_PagedExpandResponse>): grpc.ClientUnaryCall;
  
  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   */
  Wait(argument: I_google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  Wait(argument: I_google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  Wait(argument: I_google_showcase_v1beta1_WaitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  Wait(argument: I_google_showcase_v1beta1_WaitRequest, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   */
  wait(argument: I_google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  wait(argument: I_google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  wait(argument: I_google_showcase_v1beta1_WaitRequest, options: grpc.CallOptions, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  wait(argument: I_google_showcase_v1beta1_WaitRequest, callback: grpc.requestCallback<O_google_longrunning_Operation>): grpc.ClientUnaryCall;
  
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
  Block: grpc.handleUnaryCall<O_google_showcase_v1beta1_BlockRequest, I_google_showcase_v1beta1_BlockResponse>;
  
  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   */
  Chat: grpc.handleBidiStreamingCall<O_google_showcase_v1beta1_EchoRequest, I_google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   */
  Collect: grpc.handleClientStreamingCall<O_google_showcase_v1beta1_EchoRequest, I_google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   */
  Echo: grpc.handleUnaryCall<O_google_showcase_v1beta1_EchoRequest, I_google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   */
  Expand: grpc.handleServerStreamingCall<O_google_showcase_v1beta1_ExpandRequest, I_google_showcase_v1beta1_EchoResponse>;
  
  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   */
  PagedExpand: grpc.handleUnaryCall<O_google_showcase_v1beta1_PagedExpandRequest, I_google_showcase_v1beta1_PagedExpandResponse>;
  
  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   */
  Wait: grpc.handleUnaryCall<O_google_showcase_v1beta1_WaitRequest, I_google_longrunning_Operation>;
  
}

export interface EchoDefinition extends grpc.ServiceDefinition {
  Block: MethodDefinition<I_google_showcase_v1beta1_BlockRequest, I_google_showcase_v1beta1_BlockResponse, O_google_showcase_v1beta1_BlockRequest, O_google_showcase_v1beta1_BlockResponse>
  Chat: MethodDefinition<I_google_showcase_v1beta1_EchoRequest, I_google_showcase_v1beta1_EchoResponse, O_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>
  Collect: MethodDefinition<I_google_showcase_v1beta1_EchoRequest, I_google_showcase_v1beta1_EchoResponse, O_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>
  Echo: MethodDefinition<I_google_showcase_v1beta1_EchoRequest, I_google_showcase_v1beta1_EchoResponse, O_google_showcase_v1beta1_EchoRequest, O_google_showcase_v1beta1_EchoResponse>
  Expand: MethodDefinition<I_google_showcase_v1beta1_ExpandRequest, I_google_showcase_v1beta1_EchoResponse, O_google_showcase_v1beta1_ExpandRequest, O_google_showcase_v1beta1_EchoResponse>
  PagedExpand: MethodDefinition<I_google_showcase_v1beta1_PagedExpandRequest, I_google_showcase_v1beta1_PagedExpandResponse, O_google_showcase_v1beta1_PagedExpandRequest, O_google_showcase_v1beta1_PagedExpandResponse>
  Wait: MethodDefinition<I_google_showcase_v1beta1_WaitRequest, I_google_longrunning_Operation, O_google_showcase_v1beta1_WaitRequest, O_google_longrunning_Operation>
}
