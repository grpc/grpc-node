import {EventEmitter} from 'events';
import {Duplex, Readable, Writable} from 'stream';

import {CallStream, StatusObject, WriteObject} from './call-stream';
import {Status} from './constants';
import {Metadata} from './metadata';
import {ObjectReadable, ObjectWritable} from './object-stream';

export interface ServiceError extends Error {
  code?: number;
  metadata?: Metadata;
}

export class ServiceErrorImpl extends Error implements ServiceError {
  code?: number;
  metadata?: Metadata;
}

export interface Call extends EventEmitter {
  cancel(): void;
  getPeer(): string;

  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;

  addListener(event: 'metadata', listener: (metadata: Metadata) => void): this;
  emit(event: 'metadata', metadata: Metadata): boolean;
  on(event: 'metadata', listener: (metadata: Metadata) => void): this;
  once(event: 'metadata', listener: (metadata: Metadata) => void): this;
  prependListener(event: 'metadata', listener: (metadata: Metadata) => void):
      this;
  prependOnceListener(
      event: 'metadata', listener: (metadata: Metadata) => void): this;
  removeListener(event: 'metadata', listener: (metadata: Metadata) => void):
      this;
}

export interface ClientUnaryCall extends Call {}

export class ClientUnaryCallImpl extends EventEmitter implements Call {
  constructor(private readonly call: CallStream) {
    super();
    call.on('metadata', (metadata: Metadata) => {
      this.emit('metadata', metadata);
    });
  }

  cancel(): void {
    this.call.cancelWithStatus(Status.CANCELLED, 'Cancelled on client');
  }

  getPeer(): string {
    return this.call.getPeer();
  }
}

export interface ClientReadableStream<ResponseType> extends
    Call, ObjectReadable<ResponseType> {
  deserialize: (chunk: Buffer) => ResponseType;

  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;

  addListener(event: 'status', listener: (status: StatusObject) => void): this;
  emit(event: 'status', status: StatusObject): boolean;
  on(event: 'status', listener: (status: StatusObject) => void): this;
  once(event: 'status', listener: (status: StatusObject) => void): this;
  prependListener(event: 'status', listener: (status: StatusObject) => void):
      this;
  prependOnceListener(
      event: 'status', listener: (status: StatusObject) => void): this;
  removeListener(event: 'status', listener: (status: StatusObject) => void):
      this;
}

export interface ClientWritableStream<RequestType> extends
    Call, ObjectWritable<RequestType> {
  serialize: (value: RequestType) => Buffer;

  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;
}

export interface ClientDuplexStream<RequestType, ResponseType> extends
    ClientWritableStream<RequestType>, ClientReadableStream<ResponseType> {
  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;
}

function setUpReadableStream<ResponseType>(
    stream: ClientReadableStream<ResponseType>, call: CallStream,
    deserialize: (chunk: Buffer) => ResponseType): void {
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
    stream.push(null);
  });
  call.on('status', (status: StatusObject) => {
    stream.emit('status', status);
    if (status.code !== Status.OK) {
      const error = new ServiceErrorImpl(status.details);
      error.code = status.code;
      error.metadata = status.metadata;
      stream.emit('error', error);
    }
  });
  call.pause();
}

export class ClientReadableStreamImpl<ResponseType> extends Readable implements
    ClientReadableStream<ResponseType> {
  constructor(
      private readonly call: CallStream,
      public readonly deserialize: (chunk: Buffer) => ResponseType) {
    super({objectMode: true});
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
    call: CallStream, serialize: (value: RequestType) => Buffer,
    chunk: RequestType, encoding: string, cb: Function) {
  let message: Buffer;
  const flags: number = Number(encoding);
  try {
    message = serialize(chunk);
  } catch (e) {
    call.cancelWithStatus(Status.INTERNAL, 'Serialization failure');
    cb(e);
    return;
  }
  const writeObj: WriteObject = {message: message};
  if (!Number.isNaN(flags)) {
    writeObj.flags = flags;
  }
  call.write(writeObj, cb);
}

export class ClientWritableStreamImpl<RequestType> extends Writable implements
    ClientWritableStream<RequestType> {
  constructor(
      private readonly call: CallStream,
      public readonly serialize: (value: RequestType) => Buffer) {
    super({objectMode: true});
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
      private readonly call: CallStream,
      public readonly serialize: (value: RequestType) => Buffer,
      public readonly deserialize: (chunk: Buffer) => ResponseType) {
    super({objectMode: true});
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
