import * as http2 from 'http2';
import {Duplex} from 'stream';

import {CallCredentials} from './call-credentials';
import {Status} from './constants';
import {Filter} from './filter';
import {FilterStackFactory} from './filter-stack';
import {Metadata} from './metadata';
import {ObjectDuplex} from './object-stream';

const {HTTP2_HEADER_STATUS, HTTP2_HEADER_CONTENT_TYPE} = http2.constants;

export type Deadline = Date | number;

export interface CallStreamOptions {
  deadline: Deadline;
  credentials: CallCredentials;
  flags: number;
}

export type CallOptions = Partial<CallStreamOptions>;

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

  getDeadline(): Deadline;
  getCredentials(): CallCredentials;
  /* If the return value is null, the call has not ended yet. Otherwise, it has
   * ended with the specified status */
  getStatus(): StatusObject|null;

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

const emptyBuffer = Buffer.alloc(0);

export class Http2CallStream extends Duplex implements CallStream {
  public filterStack: Filter;
  private statusEmitted = false;
  private http2Stream: http2.ClientHttp2Stream|null = null;
  private pendingRead = false;
  private pendingWrite: Buffer|null = null;
  private pendingWriteCallback: Function|null = null;
  private pendingFinalCallback: Function|null = null;

  private readState: ReadState = ReadState.NO_DATA;
  private readCompressFlag = false;
  private readPartialSize: Buffer = Buffer.alloc(4);
  private readSizeRemaining = 4;
  private readMessageSize = 0;
  private readPartialMessage: Buffer[] = [];
  private readMessageRemaining = 0;

  private unpushedReadMessages: (Buffer|null)[] = [];

  // Status code mapped from :status. To be used if grpc-status is not received
  private mappedStatusCode: Status = Status.UNKNOWN;

  // This is populated (non-null) if and only if the call has ended
  private finalStatus: StatusObject|null = null;

  constructor(
      private readonly methodName: string,
      private readonly options: CallStreamOptions,
      filterStackFactory: FilterStackFactory) {
    super({objectMode: true});
    this.filterStack = filterStackFactory.createFilter(this);
  }

  private endCall(status: StatusObject): void {
    if (this.finalStatus === null) {
      this.finalStatus = status;
      this.emit('status', status);
    }
  }

  private tryPush(messageBytes: Buffer, canPush: boolean): boolean {
    if (canPush) {
      if (!this.push(messageBytes)) {
        canPush = false;
        (this.http2Stream as http2.ClientHttp2Stream).pause();
      }
    } else {
      this.unpushedReadMessages.push(messageBytes);
    }
    return canPush;
  }

  attachHttp2Stream(stream: http2.ClientHttp2Stream): void {
    if (this.finalStatus !== null) {
      stream.rstWithCancel();
    } else {
      this.http2Stream = stream;
      stream.on('response', (headers) => {
        switch (headers[HTTP2_HEADER_STATUS]) {
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
        delete headers[HTTP2_HEADER_STATUS];
        delete headers[HTTP2_HEADER_CONTENT_TYPE];
        let metadata: Metadata;
        try {
          metadata = Metadata.fromHttp2Headers(headers);
        } catch (e) {
          this.cancelWithStatus(Status.UNKNOWN, e.message);
          return;
        }
        this.filterStack.receiveMetadata(Promise.resolve(metadata))
            .then(
                (finalMetadata) => {
                  this.emit('metadata', finalMetadata);
                },
                (error) => {
                  this.cancelWithStatus(Status.UNKNOWN, error.message);
                });
      });
      stream.on('trailers', (headers) => {
        let code: Status = this.mappedStatusCode;
        if (headers.hasOwnProperty('grpc-status')) {
          let receivedCode = Number(headers['grpc-status']);
          if (receivedCode in Status) {
            code = receivedCode;
          } else {
            code = Status.UNKNOWN;
          }
          delete headers['grpc-status'];
        }
        let details = '';
        if (headers.hasOwnProperty('grpc-message')) {
          details = decodeURI(headers['grpc-message']);
        }
        let metadata: Metadata;
        try {
          metadata = Metadata.fromHttp2Headers(headers);
        } catch (e) {
          metadata = new Metadata();
        }
        let status: StatusObject = {code, details, metadata};
        this.filterStack.receiveTrailers(Promise.resolve(status))
            .then(
                (finalStatus) => {
                  this.endCall(finalStatus);
                },
                (error) => {
                  this.endCall({
                    code: Status.INTERNAL,
                    details: 'Failed to process received status',
                    metadata: new Metadata()
                  });
                });
      });
      stream.on('data', (data) => {
        let readHead = 0;
        let canPush = true;
        let toRead: number;
        while (readHead < data.length) {
          switch (this.readState) {
            case ReadState.NO_DATA:
              this.readCompressFlag = (data.readUInt8(readHead) !== 0);
              readHead += 1;
              this.readState = ReadState.READING_SIZE;
              this.readPartialSize.fill(0);
              this.readSizeRemaining = 4;
              this.readMessageSize = 0;
              this.readMessageRemaining = 0;
              this.readPartialMessage = [];
              break;
            case ReadState.READING_SIZE:
              toRead = Math.min(data.length - readHead, this.readSizeRemaining);
              data.copy(
                  this.readPartialSize, 4 - this.readSizeRemaining, readHead,
                  readHead + toRead);
              this.readSizeRemaining -= toRead;
              readHead += toRead;
              // readSizeRemaining >=0 here
              if (this.readSizeRemaining === 0) {
                this.readMessageSize = this.readPartialSize.readUInt32BE(0);
                this.readMessageRemaining = this.readMessageSize;
                if (this.readMessageRemaining > 0) {
                  this.readState = ReadState.READING_MESSAGE;
                } else {
                  canPush = this.tryPush(emptyBuffer, canPush);
                  this.readState = ReadState.NO_DATA;
                }
              }
              break;
            case ReadState.READING_MESSAGE:
              toRead =
                  Math.min(data.length - readHead, this.readMessageRemaining);
              this.readPartialMessage.push(
                  data.slice(readHead, readHead + toRead));
              this.readMessageRemaining -= toRead;
              readHead += toRead;
              // readMessageRemaining >=0 here
              if (this.readMessageRemaining === 0) {
                // At this point, we have read a full message
                const messageBytes = Buffer.concat(
                    this.readPartialMessage, this.readMessageSize);
                // TODO(murgatroid99): Add receive message filters
                canPush = this.tryPush(messageBytes, canPush);
                this.readState = ReadState.NO_DATA;
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
      stream.on('streamClosed', (errorCode) => {
        let code: Status;
        let details = '';
        switch (errorCode) {
          case http2.constants.NGHTTP2_REFUSED_STREAM:
            code = Status.UNAVAILABLE;
            break;
          case http2.constants.NGHTTP2_CANCEL:
            code = Status.CANCELLED;
            break;
          case http2.constants.NGHTTP2_ENHANCE_YOUR_CALM:
            code = Status.RESOURCE_EXHAUSTED;
            details = 'Bandwidth exhausted';
            break;
          case http2.constants.NGHTTP2_INADEQUATE_SECURITY:
            code = Status.PERMISSION_DENIED;
            details = 'Protocol not secure enough';
            break;
          default:
            code = Status.INTERNAL;
        }
        this.endCall({code: code, details: details, metadata: new Metadata()});
      });
      stream.on('error', () => {
        this.endCall({
          code: Status.INTERNAL,
          details: 'Internal HTTP2 error',
          metadata: new Metadata()
        });
      });
      if (!this.pendingRead) {
        stream.pause();
      }
      if (this.pendingWrite) {
        if (!this.pendingWriteCallback) {
          throw new Error('Invalid state in write handling code');
        }
        stream.write(this.pendingWrite, this.pendingWriteCallback);
      }
      if (this.pendingFinalCallback) {
        stream.end(this.pendingFinalCallback);
      }
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

  getDeadline(): Deadline {
    return this.options.deadline;
  }

  getCredentials(): CallCredentials {
    return this.options.credentials;
  }

  getStatus(): StatusObject|null {
    return this.finalStatus;
  }

  getPeer(): string {
    throw new Error('Not yet implemented');
  }

  _read(size: number) {
    if (this.http2Stream === null) {
      this.pendingRead = true;
    } else {
      while (this.unpushedReadMessages.length > 0) {
        const nextMessage = this.unpushedReadMessages.shift();
        const keepPushing = this.push(nextMessage);
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
    /* allocUnsafe doesn't initiate the bytes in the buffer. We are explicitly
     * overwriting every single byte, so that should be fine */
    const output: Buffer = Buffer.allocUnsafe(message.message.length + 5);
    // TODO(murgatroid99): handle compressed flag appropriately
    output.writeUInt8(0, 0);
    output.writeUInt32BE(message.message.length, 1);
    message.message.copy(output, 5);
    return output;
  }

  _write(chunk: WriteObject, encoding: string, cb: Function) {
    // TODO(murgatroid99): Add send message filters
    const encodedMessage = this.encodeMessage(chunk);
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
