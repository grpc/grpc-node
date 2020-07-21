// Original file: deps/gapic-showcase/schema/google/showcase/v1beta1/echo.proto

import * as grpc from '@grpc/grpc-js'
import { BlockRequest as _google_showcase_v1beta1_BlockRequest, BlockRequest__Output as _google_showcase_v1beta1_BlockRequest__Output } from '../../../google/showcase/v1beta1/BlockRequest';
import { BlockResponse as _google_showcase_v1beta1_BlockResponse, BlockResponse__Output as _google_showcase_v1beta1_BlockResponse__Output } from '../../../google/showcase/v1beta1/BlockResponse';
import { EchoRequest as _google_showcase_v1beta1_EchoRequest, EchoRequest__Output as _google_showcase_v1beta1_EchoRequest__Output } from '../../../google/showcase/v1beta1/EchoRequest';
import { EchoResponse as _google_showcase_v1beta1_EchoResponse, EchoResponse__Output as _google_showcase_v1beta1_EchoResponse__Output } from '../../../google/showcase/v1beta1/EchoResponse';
import { ExpandRequest as _google_showcase_v1beta1_ExpandRequest, ExpandRequest__Output as _google_showcase_v1beta1_ExpandRequest__Output } from '../../../google/showcase/v1beta1/ExpandRequest';
import { Operation as _google_longrunning_Operation, Operation__Output as _google_longrunning_Operation__Output } from '../../../google/longrunning/Operation';
import { PagedExpandRequest as _google_showcase_v1beta1_PagedExpandRequest, PagedExpandRequest__Output as _google_showcase_v1beta1_PagedExpandRequest__Output } from '../../../google/showcase/v1beta1/PagedExpandRequest';
import { PagedExpandResponse as _google_showcase_v1beta1_PagedExpandResponse, PagedExpandResponse__Output as _google_showcase_v1beta1_PagedExpandResponse__Output } from '../../../google/showcase/v1beta1/PagedExpandResponse';
import { WaitRequest as _google_showcase_v1beta1_WaitRequest, WaitRequest__Output as _google_showcase_v1beta1_WaitRequest__Output } from '../../../google/showcase/v1beta1/WaitRequest';

export interface EchoClient extends grpc.Client {
  Block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  Block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  Block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  Block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  block(argument: _google_showcase_v1beta1_BlockRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_BlockResponse__Output) => void): grpc.ClientUnaryCall;
  
  Chat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  Chat(options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  chat(metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  chat(options?: grpc.CallOptions): grpc.ClientDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>;
  
  Collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  Collect(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  Collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  Collect(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  collect(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  collect(metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  collect(metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientWritableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  
  Echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  Echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  Echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  Echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  echo(argument: _google_showcase_v1beta1_EchoRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_EchoResponse__Output) => void): grpc.ClientUnaryCall;
  
  Expand(argument: _google_showcase_v1beta1_ExpandRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  Expand(argument: _google_showcase_v1beta1_ExpandRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  expand(argument: _google_showcase_v1beta1_ExpandRequest, metadata: grpc.Metadata, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  expand(argument: _google_showcase_v1beta1_ExpandRequest, options?: grpc.CallOptions): grpc.ClientReadableStream<_google_showcase_v1beta1_EchoResponse__Output>;
  
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  PagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  pagedExpand(argument: _google_showcase_v1beta1_PagedExpandRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_showcase_v1beta1_PagedExpandResponse__Output) => void): grpc.ClientUnaryCall;
  
  Wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  Wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  Wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  Wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, options: grpc.CallOptions, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  wait(argument: _google_showcase_v1beta1_WaitRequest, metadata: grpc.Metadata, callback: (error?: grpc.ServiceError, result?: _google_longrunning_Operation__Output) => void): grpc.ClientUnaryCall;
  
}

export interface EchoHandlers {
  Block(call: grpc.ServerUnaryCall<_google_showcase_v1beta1_BlockRequest, _google_showcase_v1beta1_BlockResponse__Output>, callback: grpc.sendUnaryData<_google_showcase_v1beta1_BlockResponse__Output>): void;
  
  Chat(call: grpc.ServerDuplexStream<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>): void;
  
  Collect(call: grpc.ServerReadableStream<_google_showcase_v1beta1_EchoRequest>, callback: grpc.sendUnaryData<_google_showcase_v1beta1_EchoResponse__Output>): void;
  
  Echo(call: grpc.ServerUnaryCall<_google_showcase_v1beta1_EchoRequest, _google_showcase_v1beta1_EchoResponse__Output>, callback: grpc.sendUnaryData<_google_showcase_v1beta1_EchoResponse__Output>): void;
  
  Expand(call: grpc.ServerWritableStream<_google_showcase_v1beta1_ExpandRequest, _google_showcase_v1beta1_EchoResponse__Output>): void;
  
  PagedExpand(call: grpc.ServerUnaryCall<_google_showcase_v1beta1_PagedExpandRequest, _google_showcase_v1beta1_PagedExpandResponse__Output>, callback: grpc.sendUnaryData<_google_showcase_v1beta1_PagedExpandResponse__Output>): void;
  
  Wait(call: grpc.ServerUnaryCall<_google_showcase_v1beta1_WaitRequest, _google_longrunning_Operation__Output>, callback: grpc.sendUnaryData<_google_longrunning_Operation__Output>): void;
  
}
