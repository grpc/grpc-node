/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import {EventEmitter} from 'events';
import {Duplex, Readable, Writable} from 'stream';
import {ServiceError} from './call';
import {Deserialize, Serialize} from './make-client';
import {Metadata} from './metadata';


export class ServerUnaryCall<RequestType> extends EventEmitter {
  cancelled: boolean;
  request: RequestType|null;

  constructor(private call: ServerCall, public metadata: Metadata) {
    super();
    this.cancelled = false;
    this.request = null;  // TODO(cjihrig): Read the unary request here.
  }

  getPeer(): string {
    throw new Error('not implemented yet');
  }

  sendMetadata(responseMetadata: Metadata): void {
    throw new Error('not implemented yet');
  }
}


export class ServerReadableStream<RequestType> extends Readable {
  cancelled: boolean;

  constructor(
      private call: ServerCall, public metadata: Metadata,
      private deserialize: Deserialize<RequestType>) {
    super();
    this.cancelled = false;
  }

  getPeer(): string {
    throw new Error('not implemented yet');
  }

  sendMetadata(responseMetadata: Metadata): void {
    throw new Error('not implemented yet');
  }
}


export class ServerWritableStream<RequestType, ResponseType> extends Writable {
  cancelled: boolean;
  request: RequestType|null;

  constructor(
      private call: ServerCall, public metadata: Metadata,
      private serialize: Serialize<ResponseType>) {
    super();
    this.cancelled = false;
    this.request = null;  // TODO(cjihrig): Read the unary request here.
  }

  getPeer(): string {
    throw new Error('not implemented yet');
  }

  sendMetadata(responseMetadata: Metadata): void {
    throw new Error('not implemented yet');
  }
}


export class ServerDuplexStream<RequestType, ResponseType> extends Duplex {
  cancelled: boolean;

  constructor(
      private call: ServerCall, public metadata: Metadata,
      private serialize: Serialize<ResponseType>,
      private deserialize: Deserialize<RequestType>) {
    super();
    this.cancelled = false;
  }

  getPeer(): string {
    throw new Error('not implemented yet');
  }

  sendMetadata(responseMetadata: Metadata): void {
    throw new Error('not implemented yet');
  }
}


// Internal class that wraps the HTTP2 request.
export class ServerCall {}


// Unary response callback signature.
export type sendUnaryData<ResponseType> =
    (error: ServiceError|null, value: ResponseType|null, trailer?: Metadata,
     flags?: number) => void;

// User provided handler for unary calls.
export type handleUnaryCall<RequestType, ResponseType> =
    (call: ServerUnaryCall<RequestType>,
     callback: sendUnaryData<ResponseType>) => void;

// User provided handler for client streaming calls.
export type handleClientStreamingCall<RequestType, ResponseType> =
    (call: ServerReadableStream<RequestType>,
     callback: sendUnaryData<ResponseType>) => void;

// User provided handler for server streaming calls.
export type handleServerStreamingCall<RequestType, ResponseType> =
    (call: ServerWritableStream<RequestType, ResponseType>) => void;

// User provided handler for bidirectional streaming calls.
export type handleBidiStreamingCall<RequestType, ResponseType> =
    (call: ServerDuplexStream<RequestType, ResponseType>) => void;

export type HandleCall<RequestType, ResponseType> =
    handleUnaryCall<RequestType, ResponseType>|
    handleClientStreamingCall<RequestType, ResponseType>|
    handleServerStreamingCall<RequestType, ResponseType>|
    handleBidiStreamingCall<RequestType, ResponseType>;

export type Handler<RequestType, ResponseType> = {
  func: HandleCall<RequestType, ResponseType>;
  serialize: Serialize<ResponseType>;
  deserialize: Deserialize<RequestType>;
  type: HandlerType;
};

export type HandlerType = 'bidi'|'clientStream'|'serverStream'|'unary';
