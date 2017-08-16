import * as stream from 'stream';

import {CallCredentials} from './call-credentials';
import {Status} from './constants';
import {Metadata} from './metadata';
import {ObjectDuplex} from './object-stream';

export interface CallOptions {
  deadline?: Date|number;
  host?: string;
  credentials?: CallCredentials;
  flags?: number;
}

export interface StatusObject {
  code: Status;
  details: string;
  metadata: Metadata;
}

export interface WriteObject {
  message: Buffer;
  flags?: number;
}

/**
 * This interface represents a duplex stream associated with a single gRPC call.
 */
export interface CallStream extends ObjectDuplex<WriteObject, Buffer> {
  cancelWithStatus(status: Status, details: string): void;
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

export class Http2CallStream extends stream.Duplex implements CallStream {

  attachHttp2Stream(stream: ClientHttp2Stream): void {
    throw new Error('Not yet implemented');
  }

  cancelWithStatus(status: Status, details: string): void {
    throw new Error('Not yet implemented');
  }

  getPeer(): string {
    throw new Error('Not yet implemented');
  }
}
