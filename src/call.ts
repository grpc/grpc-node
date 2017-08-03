import * as events from 'events';
import * as stream from 'stream';
const { EventEmitter } = events;
const { Readable, Writable, Duplex } = stream;

export interface Call {
  // cancel();
  // getPeer();
}

export class ClientUnaryCall extends EventEmitter implements Call {}

export class ClientReadableStream extends Readable implements Call {}

export class ClientWritableStream extends Writable implements Call {}

export class ClientDuplexStream extends Duplex implements Call {}
