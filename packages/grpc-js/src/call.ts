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

import { EventEmitter } from 'events';
import { Duplex, Readable, Writable } from 'stream';

import { Call, StatusObject, WriteObject } from './call-stream';
import { Status } from './constants';
import { EmitterAugmentation1 } from './events';
import { Metadata } from './metadata';
import { ObjectReadable, ObjectWritable } from './object-stream';

/**
 * A type extending the built-in Error object with additional fields.
 */
export type ServiceError = StatusObject & Error;

/**
 * A base type for all user-facing values returned by client-side method calls.
 */
export type SurfaceCall = {
  cancel(): void;
  getPeer(): string;
} & EmitterAugmentation1<'metadata', Metadata> &
  EmitterAugmentation1<'status', StatusObject> &
  EventEmitter;

/**
 * A type representing the return value of a unary method call.
 */
export type ClientUnaryCall = SurfaceCall;

/**
 * A type representing the return value of a server stream method call.
 */
export type ClientReadableStream<ResponseType> = {
  deserialize: (chunk: Buffer) => ResponseType;
} & SurfaceCall &
  ObjectReadable<ResponseType>;

/**
 * A type representing the return value of a client stream method call.
 */
export type ClientWritableStream<RequestType> = {
  serialize: (value: RequestType) => Buffer;
} & SurfaceCall &
  ObjectWritable<RequestType>;

/**
 * A type representing the return value of a bidirectional stream method call.
 */
export type ClientDuplexStream<
  RequestType,
  ResponseType
> = ClientWritableStream<RequestType> & ClientReadableStream<ResponseType>;

/**
 * Construct a ServiceError from a StatusObject. This function exists primarily
 * as an attempt to make the error stack trace clearly communicate that the
 * error is not necessarily a problem in gRPC itself.
 * @param status
 */
export function callErrorFromStatus(status: StatusObject): ServiceError {
  const message = `${status.code} ${Status[status.code]}: ${status.details}`;
  return Object.assign(new Error(message), status);
}

export class ClientUnaryCallImpl extends EventEmitter
  implements ClientUnaryCall {
  constructor(private readonly call: Call) {
    super();
    call.on('metadata', (metadata: Metadata) => {
      this.emit('metadata', metadata);
    });
    call.on('status', (status: StatusObject) => {
      this.emit('status', status);
    });
  }

  cancel(): void {
    this.call.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call.getPeer();
  }
}

function setUpReadableStream<ResponseType>(
  stream: ClientReadableStream<ResponseType>,
  call: Call,
  deserialize: (chunk: Buffer) => ResponseType
): void {
  let statusEmitted = false;
  call.on('data', (data: Buffer) => {
    let deserialized: ResponseType;
    try {
      deserialized = deserialize(data);
    } catch (e) {
      call.cancelWithStatus(Status.INTERNAL, 'Failed to parse server response');
      return;
    }
    if (!stream.push(deserialized)) {
      call.pause();
    }
  });
  call.on('end', () => {
    if (statusEmitted) {
      stream.push(null);
    } else {
      call.once('status', () => {
        stream.push(null);
      });
    }
  });
  call.on('status', (status: StatusObject) => {
    if (status.code !== Status.OK) {
      stream.emit('error', callErrorFromStatus(status));
    }
    stream.emit('status', status);
    statusEmitted = true;
  });
  call.pause();
}

export class ClientReadableStreamImpl<ResponseType> extends Readable
  implements ClientReadableStream<ResponseType> {
  constructor(
    private readonly call: Call,
    readonly deserialize: (chunk: Buffer) => ResponseType
  ) {
    super({ objectMode: true });
    call.on('metadata', (metadata: Metadata) => {
      this.emit('metadata', metadata);
    });
    setUpReadableStream<ResponseType>(this, call, deserialize);
  }

  cancel(): void {
    this.call.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  _read(_size: number): void {
    this.call.resume();
  }
}

function tryWrite<RequestType>(
  call: Call,
  serialize: (value: RequestType) => Buffer,
  chunk: RequestType,
  encoding: string,
  cb: Function
) {
  let message: Buffer;
  const flags: number = Number(encoding);
  try {
    message = serialize(chunk);
  } catch (e) {
    call.cancelWithStatus(Status.INTERNAL, 'Serialization failure');
    cb(e);
    return;
  }
  const writeObj: WriteObject = { message };
  if (!Number.isNaN(flags)) {
    writeObj.flags = flags;
  }
  call.write(writeObj, cb);
}

export class ClientWritableStreamImpl<RequestType> extends Writable
  implements ClientWritableStream<RequestType> {
  constructor(
    private readonly call: Call,
    readonly serialize: (value: RequestType) => Buffer
  ) {
    super({ objectMode: true });
    call.on('metadata', (metadata: Metadata) => {
      this.emit('metadata', metadata);
    });
    call.on('status', (status: StatusObject) => {
      this.emit('status', status);
    });
  }

  cancel(): void {
    this.call.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  _write(chunk: RequestType, encoding: string, cb: Function) {
    tryWrite<RequestType>(this.call, this.serialize, chunk, encoding, cb);
  }

  _final(cb: Function) {
    this.call.end();
    cb();
  }
}

export class ClientDuplexStreamImpl<RequestType, ResponseType> extends Duplex
  implements ClientDuplexStream<RequestType, ResponseType> {
  constructor(
    private readonly call: Call,
    readonly serialize: (value: RequestType) => Buffer,
    readonly deserialize: (chunk: Buffer) => ResponseType
  ) {
    super({ objectMode: true });
    call.on('metadata', (metadata: Metadata) => {
      this.emit('metadata', metadata);
    });
    setUpReadableStream<ResponseType>(this, call, deserialize);
  }

  cancel(): void {
    this.call.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call.getPeer();
  }

  _read(_size: number): void {
    this.call.resume();
  }

  _write(chunk: RequestType, encoding: string, cb: Function) {
    tryWrite<RequestType>(this.call, this.serialize, chunk, encoding, cb);
  }

  _final(cb: Function) {
    this.call.end();
    cb();
  }
}
