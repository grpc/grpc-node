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

import { StatusObject, MessageContext } from './call-interface';
import { Status } from './constants';
import { EmitterAugmentation1 } from './events';
import { Metadata } from './metadata';
import { ObjectReadable, ObjectWritable, WriteCallback } from './object-stream';

/**
 * Node invokes `_write` with `state.onwrite`, then calls the user's write
 * callback from there. Passing an error through `onwrite` destroys a duplex
 * and drops responses that have not been read. The user's callback is queued
 * here and completed on its own; `onwrite` is always completed without an
 * error so the readable side stays intact.
 */
function queueUserWriteCallback(
  callbacks: Array<WriteCallback | undefined>,
  encodingOrCallback?: unknown,
  cb?: unknown
): string | number | undefined {
  if (typeof encodingOrCallback === 'function') {
    callbacks.push(encodingOrCallback as WriteCallback);
    return undefined;
  }
  callbacks.push(typeof cb === 'function' ? (cb as WriteCallback) : undefined);
  return encodingOrCallback as string | number | undefined;
}

/**
 * Completes the caller's write callback and Node's `_write` callback.
 * `nodeCallback` is always invoked without an error so a duplex is not
 * destroyed. `finish` and `end(cb)` can run after the user write callback
 * has already received an error, because `nodeCallback(undefined)` keeps the
 * readable side alive so buffered bidi responses and `end` are not destroyed.
 *
 * The caller must store `failure` on the stream before calling this. Node
 * flushes the next buffered `_write` synchronously from `nodeCallback`.
 */
function settleSurfaceWrite(
  failure: Error | null,
  userCallback: WriteCallback | undefined,
  nodeCallback: WriteCallback
): void {
  if (failure) {
    userCallback?.(failure);
  } else {
    userCallback?.(undefined);
  }
  nodeCallback(undefined);
}
import { InterceptingCallInterface } from './client-interceptors';
import { AuthContext } from './auth-context';

/**
 * A type extending the built-in Error object with additional fields.
 */
export type ServiceError = StatusObject & Error;

/**
 * A base type for all user-facing values returned by client-side method calls.
 */
export type SurfaceCall = {
  call?: InterceptingCallInterface;
  cancel(): void;
  getPeer(): string;
  getAuthContext(): AuthContext | null;
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
export type ClientDuplexStream<RequestType, ResponseType> =
  ClientWritableStream<RequestType> & ClientReadableStream<ResponseType>;

/**
 * Construct a ServiceError from a StatusObject. This function exists primarily
 * as an attempt to make the error stack trace clearly communicate that the
 * error is not necessarily a problem in gRPC itself.
 * @param status
 */
export function callErrorFromStatus(
  status: StatusObject,
  callerStack: string
): ServiceError {
  const message = `${status.code} ${Status[status.code]}: ${status.details}`;
  const error = new Error(message);
  const stack = `${error.stack}\nfor call at\n${callerStack}`;
  return Object.assign(new Error(message), status, { stack });
}

export class ClientUnaryCallImpl
  extends EventEmitter
  implements ClientUnaryCall
{
  public call?: InterceptingCallInterface;
  constructor() {
    super();
  }

  cancel(): void {
    this.call?.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call?.getPeer() ?? 'unknown';
  }

  getAuthContext(): AuthContext | null {
    return this.call?.getAuthContext() ?? null;
  }
}

export class ClientReadableStreamImpl<ResponseType>
  extends Readable
  implements ClientReadableStream<ResponseType>
{
  public call?: InterceptingCallInterface;
  constructor(readonly deserialize: (chunk: Buffer) => ResponseType) {
    super({ objectMode: true });
  }

  cancel(): void {
    this.call?.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call?.getPeer() ?? 'unknown';
  }

  getAuthContext(): AuthContext | null {
    return this.call?.getAuthContext() ?? null;
  }

  _read(_size: number): void {
    this.call?.startRead();
  }
}

export class ClientWritableStreamImpl<RequestType>
  extends Writable
  implements ClientWritableStream<RequestType>
{
  public call?: InterceptingCallInterface;
  private userWriteCallbacks: Array<WriteCallback | undefined> = [];
  private terminalWriteError: Error | null = null;
  constructor(readonly serialize: (value: RequestType) => Buffer) {
    super({ objectMode: true });
  }

  write(chunk: RequestType, encoding?: unknown, cb?: unknown): boolean {
    // After end() or destroy(), Node emits the error and never calls _write.
    // Queueing the callback here would leave it pending forever.
    if (this.writableEnded || this.destroyed) {
      return super.write(chunk as never, encoding as never, cb as never);
    }
    const queued = this.userWriteCallbacks.length;
    const encodingArg = queueUserWriteCallback(
      this.userWriteCallbacks,
      encoding,
      cb
    );
    try {
      if (encodingArg === undefined) {
        return super.write(chunk);
      }
      return super.write(chunk, encodingArg as BufferEncoding);
    } catch (err) {
      this.userWriteCallbacks.length = queued;
      throw err;
    }
  }

  cancel(): void {
    this.call?.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call?.getPeer() ?? 'unknown';
  }

  getAuthContext(): AuthContext | null {
    return this.call?.getAuthContext() ?? null;
  }

  _write(chunk: RequestType, encoding: string, cb: WriteCallback) {
    const userCallback = this.userWriteCallbacks.shift();
    if (this.terminalWriteError) {
      userCallback?.(this.terminalWriteError);
      cb(undefined);
      return;
    }
    let invoked = false;
    const context: MessageContext = {
      callback: (error?: Error | null) => {
        if (invoked) {
          return;
        }
        invoked = true;
        const failure = error ?? this.terminalWriteError;
        if (failure) {
          this.terminalWriteError = failure;
        }
        settleSurfaceWrite(failure, userCallback, cb);
      },
    };
    const flags = Number(encoding);
    if (!Number.isNaN(flags)) {
      context.flags = flags;
    }
    this.call?.sendMessageWithContext(context, chunk);
  }

  _final(cb: Function) {
    this.call?.halfClose();
    cb();
  }
}

export class ClientDuplexStreamImpl<RequestType, ResponseType>
  extends Duplex
  implements ClientDuplexStream<RequestType, ResponseType>
{
  public call?: InterceptingCallInterface;
  private userWriteCallbacks: Array<WriteCallback | undefined> = [];
  private terminalWriteError: Error | null = null;
  constructor(
    readonly serialize: (value: RequestType) => Buffer,
    readonly deserialize: (chunk: Buffer) => ResponseType
  ) {
    super({ objectMode: true });
  }

  write(chunk: RequestType, encoding?: unknown, cb?: unknown): boolean {
    // After end() or destroy(), Node emits the error and never calls _write.
    // Queueing the callback here would leave it pending forever.
    if (this.writableEnded || this.destroyed) {
      return super.write(chunk as never, encoding as never, cb as never);
    }
    const queued = this.userWriteCallbacks.length;
    const encodingArg = queueUserWriteCallback(
      this.userWriteCallbacks,
      encoding,
      cb
    );
    try {
      if (encodingArg === undefined) {
        return super.write(chunk);
      }
      return super.write(chunk, encodingArg as BufferEncoding);
    } catch (err) {
      this.userWriteCallbacks.length = queued;
      throw err;
    }
  }

  cancel(): void {
    this.call?.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call?.getPeer() ?? 'unknown';
  }

  getAuthContext(): AuthContext | null {
    return this.call?.getAuthContext() ?? null;
  }

  _read(_size: number): void {
    this.call?.startRead();
  }

  _write(chunk: RequestType, encoding: string, cb: WriteCallback) {
    const userCallback = this.userWriteCallbacks.shift();
    if (this.terminalWriteError) {
      userCallback?.(this.terminalWriteError);
      cb(undefined);
      return;
    }
    let invoked = false;
    const context: MessageContext = {
      callback: (error?: Error | null) => {
        if (invoked) {
          return;
        }
        invoked = true;
        const failure = error ?? this.terminalWriteError;
        if (failure) {
          this.terminalWriteError = failure;
        }
        settleSurfaceWrite(failure, userCallback, cb);
      },
    };
    const flags = Number(encoding);
    if (!Number.isNaN(flags)) {
      context.flags = flags;
    }
    this.call?.sendMessageWithContext(context, chunk);
  }

  _final(cb: Function) {
    this.call?.halfClose();
    cb();
  }
}
