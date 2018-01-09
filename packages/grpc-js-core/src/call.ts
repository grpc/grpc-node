import {EventEmitter} from 'events';
import {EmitterAugmentation1} from './events';
import {Duplex, Readable, Writable} from 'stream';

import {CallStream, StatusObject, WriteObject} from './call-stream';
import {Status} from './constants';
import {Metadata} from './metadata';
import {ObjectReadable, ObjectWritable} from './object-stream';
import { Channel } from './channel';

export interface ServiceError extends Error {
  code?: number;
  metadata?: Metadata;
}

export class ServiceErrorImpl extends Error implements ServiceError {
  code?: number;
  metadata?: Metadata;
}

export type Call = {
  cancel(): void;
  getPeer(): string;
} & EmitterAugmentation1<'metadata', Metadata>
  & EmitterAugmentation1<'status', StatusObject>
  & EventEmitter;

export type ClientUnaryCall = Call;

export type ClientReadableStream<ResponseType> = {
  deserialize: (chunk: Buffer) => ResponseType;
} & Call & ObjectReadable<ResponseType>;

export type ClientWritableStream<RequestType> = {
  serialize: (value: RequestType) => Buffer;
} & Call & ObjectWritable<RequestType>;

export type ClientDuplexStream<RequestType, ResponseType> =
  ClientWritableStream<RequestType> & ClientReadableStream<ResponseType>;

export class ClientUnaryCallImpl extends EventEmitter implements ClientUnaryCall {
  constructor(
      private readonly channel: Channel,
      private readonly call: CallStream) {
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
    return this.channel.getTarget();
  }
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
      private readonly channel: Channel,
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
    return this.channel.getTarget();
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
      private readonly channel: Channel,
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
    return this.channel.getTarget();
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
      private readonly channel: Channel,
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
    return this.channel.getTarget();
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
