import * as stream from 'stream';

import {CallCredentials} from './call-credentials';
import {Status} from './constants';
import {Metadata} from './metadata';
import {ObjectDuplex} from './object-stream';
import {Filter} from './filter'
import {FilterStackFactory} from './filter-stack'

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

enum ReadState {
  NO_DATA,
  READING_SIZE,
  READING_MESSAGE
}

export class Http2CallStream extends stream.Duplex implements CallStream {

  private filterStack: Filter;
  private statusEmitted: bool = false;
  private http2Stream: ClientHttp2Stream | null = null;
  private pendingRead: bool = false;
  private pendingWrite: Buffer | null = null;
  private pendingWriteCallback: Function | null = null;
  private pendingFinalCallback: Function | null = null;

  private readState: ReadState = ReadState.NO_DATA;
  private readCompressFlag: bool = false;
  private readPartialSize: Buffer = Buffer.alloc(4);
  private readSizeRemaining: number = 4;
  private readMessageSize: number = 0;
  private readPartialMessage: Buffer[] = [];
  private readMessageRemaining = 0;

  private unpushedReadMessages: (Buffer | null)[] = [];

  // Status code mapped from :status. To be used if grpc-status is not received
  private mappedStatusCode: Status = Status.UNKNOWN;

  constructor(public readonly methodName: string, public readonly options: CallOptions,
              filterStackFactory: FilterStackFactory) {
    this.filterStack = FilterStackFactory.createFilter(this);
  }

  private endCall(status: StatusObject): void {
    if (!this.statusEmitted) {
      this.emit('status', {code: status, details: details, metadata: new Metadata()});
      this.statusEmitted = true;
    }
  }

  attachHttp2Stream(stream: ClientHttp2Stream): void {
    if (this.statusEmitted) {
      // TODO(murgatroid99): Handle call end before http2 stream start
    } else {
      this.http2Stream = stream;
      stream.on('response', (headers) => {
        switch(headers[HTTP2_HEADER_STATUS]) {
          // TODO(murgatroid99): handle 100 and 101
        case '400':
          this.mappedStatusCode = Status.INTERNAL;
          break;
        case '401':
          this.mappedStatusCode = Status.UNAUTHENTICATED;
          break;
        case '403':
          this.mappedStatusCode = Status.PERMISSION_DENIED;
          break;
        case '404':
          this.mappedStatusCode = Status.UNIMPLEMENTED;
          break;
        case '429':
        case '502':
        case '503':
        case '504':
          this.mappedStatusCode = Status.UNAVAILABLE;
          break;
        default:
          this.mappedStatusCode = Status.UNKNOWN;
        }
        delete headers[HTTP2_HEADERS_STATUS];
        delete headers[HTTP2_HEADERS_CONTENT_TYPE];
        let metadata: Metadata;
        try {
          metadata = Metadata.fromHttp2Headers(headers);
        } catch (e) {
          this.cancelWithStatus(Status.UNKNOWN, e.message);
          return;
        }
        this.filterStack.receiveMetadata(Promise.resolve(metadata)).then((finalMetadata) => {
          this.emit('metadata', finalMetadata);
        }, (error) => {
          this.cancelWithStatus(Status.UNKNOWN, error.message);
        });
      });
      stream.on('trailers', (headers) => {
        let code: Status = this.mappedStatusCode;
        if (headers.hasOwnProperty('grpc-status')) {
          let receivedCode = Number(headers['grpc-status']);
          if (possibleCode in Status) {
            code = receivedCode;
          } else {
            code = Status.UNKNOWN;
          }
          delete headers['grpc-status'];
        }
        let details: string = '';
        if (headers.hasOwnProperty('grpc-message')) {
          details = decodeURI(headers['grpc-message']);
        }
        let metadata: Metadata;
        try {
          metadata = Metadata.fromHttp2Headers(headers);
        } catch (e) {
          metadata = new Metadata();
        }
        this.filterStack.receiveTrailers(Promise.resolve(status)).then((finalStatus) => {
          this.endCall(finalStatus);
        }, (error) => {
          this.endCall({
            code: Status.INTERNAL,
            details: 'Failed to process received status',
            metadata: new Metadata();
          });
        });
      });
      stream.on('read', (data) => {
        let readHead = 0;
        let canPush = true;
        while (readHead < data.length) {
          switch(this.readState) {
          case ReadState.NO_DATA:
            readCompressFlag = (data.readUInt8(readHead) !== 0);
            this.readState = ReadState.READING_SIZE;
            this.readPartialSize.fill(0);
            this.readSizeRemaining = 4;
            this.readMessageSize = 0;
            this.readMessageRemaining = 0;
            this.readPartialMessage = [];
            break;
          case ReadState.READING_SIZE:
            let toRead: number = Math.min(data.length - readHead, this.readSizeRemaining);
            data.copy(readPartialSize, 4 - this.readSizeRemaining, readHead, readHead + toRead);
            this.readSizeRemaining -= toRead;
            readHead += toRead;
            // readSizeRemaining >=0 here
            if (this.readSizeRemaining === 0) {
              this.readMessageSize = readPartialSize.readUInt32BE(0);
              this.readMessageRemaining = this.readMessageSize;
              this.readState = ReadState.READING_MESSAGE;
            }
            break;
          case ReadSize.READING_MESSAGE:
            let toRead: number = math.min(data.length - readHead, this.readMessageRemaining);
            readPartialMessage.push(data.slice(readHead, readHead + toRead));
            this.readMessageRemaining -= toRead;
            this.readHead += toRead;
            // readMessageRemaining >=0 here
            if (this.readMessageRemaining === 0) {
              // At this point, we have read a full message
              let messageBytes = Buffer.concat(readPartialMessage, readMessageSize);
              // TODO(murgatroid99): Add receive message filters
              if (canPush) {
                if (!this.push(messageBytes)) {
                  canPush = false;
                  this.http2Stream.pause();
                }
              } else {
                this.unpushedReadMessages.push(messageBytes);
              }
            }
          }
        }
      });
      stream.on('end', () => {
        if (this.unpushedReadMessages.length === 0) {
          this.push(null);
        } else {
          this.unpushedReadMessages.push(null);
        }
      });
    }
  }

  cancelWithStatus(status: Status, details: string): void {
    this.endCall({code: status, details: details, metadata: new Metadata()});
    if (this.http2Stream !== null) {
      /* TODO(murgatroid99): Determine if we want to send different RST_STREAM
       * codes based on the status code */
      this.http2Stream.rstWithCancel();
    }
  }

  getPeer(): string {
    throw new Error('Not yet implemented');
  }

  _read(size: number) {
    if (this.http2Stream === null) {
      this.pendingRead = true;
    } else {
      while (unpushedReadMessages.length > 0) {
        let nextMessage = unpushedReadMessages.shift();
        let keepPushing = this.push(nextMessage);
        if (nextMessage === null || (!keepPushing)) {
          return;
        }
      }
      /* Only resume reading from the http2Stream if we don't have any pending
       * messages to emit, and we haven't gotten the signal to stop pushing
       * messages */
      this.http2Stream.resume();
    }
  }

  // Encode a message to the wire format
  private encodeMessage(message: WriteObject): Buffer {
    /* unsafeAlloc doesn't initiate the bytes in the buffer. We are explicitly
     * overwriting every single byte, so that should be fine */
    let output: Buffer = Buffer.unsafeAlloc(message.length + 5);
    // TODO(murgatroid99): handle compressed flag appropriately
    output.writeUInt8(0, 0);
    output.writeUint32BE(message.message.length, 1);
    message.message.copy(output, 5);
    return output;
  }

  _write(chunk: WriteObject, encoding: string, cb: Function) {
    // TODO(murgatroid99): Add send message filters
    let encodedMessage = encodeMessage(chunk);
    if (this.http2Stream === null) {
      this.pendingWrite = encodedMessage;
      this.pendingWriteCallback = cb;
    } else {
      this.http2Stream.write(encodedMessage, cb);
    }
  }

  _final(cb: Function) {
    if (this.http2Stream === null) {
      this.pendingFinalCallback = cb;
    } else {
      this.http2Stream.end(cb);
    }
  }
}
