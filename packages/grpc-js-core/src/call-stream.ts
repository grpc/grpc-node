import * as http2 from 'http2';
import {Duplex} from 'stream';

import {CallCredentials} from './call-credentials';
import {Status} from './constants';
import {EmitterAugmentation1} from './events';
import {Filter} from './filter';
import {FilterStackFactory} from './filter-stack';
import {Metadata} from './metadata';
import {ObjectDuplex} from './object-stream';

const {HTTP2_HEADER_STATUS, HTTP2_HEADER_CONTENT_TYPE, NGHTTP2_CANCEL} = http2.constants;

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
export type CallStream =  {
  cancelWithStatus(status: Status, details: string): void;
  getPeer(): string;

  getDeadline(): Deadline;
  getCredentials(): CallCredentials;
  /* If the return value is null, the call has not ended yet. Otherwise, it has
   * ended with the specified status */
  getStatus(): StatusObject|null;
} & EmitterAugmentation1<'metadata', Metadata>
  & EmitterAugmentation1<'status', StatusObject>
  & ObjectDuplex<WriteObject, Buffer>;

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

  // Promise objects that are re-assigned to resolving promises when headers
  // or trailers received. Processing headers/trailers is asynchronous, so we
  // can use these objects to await their completion. This helps us establish
  // order of precedence when obtaining the status of the call.
  private handlingHeaders = Promise.resolve();
  private handlingTrailers = Promise.resolve();

  // This is populated (non-null) if and only if the call has ended
  private finalStatus: StatusObject|null = null;

  constructor(
      private readonly methodName: string,
      private readonly options: CallStreamOptions,
      filterStackFactory: FilterStackFactory) {
    super({objectMode: true});
    this.filterStack = filterStackFactory.createFilter(this);
  }

  /**
   * On first call, emits a 'status' event with the given StatusObject.
   * Subsequent calls are no-ops.
   * @param status The status of the call.
   */
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

  private handleTrailers(headers: http2.IncomingHttpHeaders) {
    let code: Status = this.mappedStatusCode;
    let details = '';
    let metadata: Metadata;
    try {
      metadata = Metadata.fromHttp2Headers(headers);
    } catch (e) {
      metadata = new Metadata();
    }
    let status: StatusObject = {code, details, metadata};
    this.handlingTrailers = (async () => {
      let finalStatus;
      try {
        // Attempt to assign final status.
        finalStatus = await this.filterStack.receiveTrailers(Promise.resolve(status));
      } catch (error) {
        await this.handlingHeaders;
        // This is a no-op if the call was already ended when handling headers.
        this.endCall({
          code: Status.INTERNAL,
          details: 'Failed to process received status',
          metadata: new Metadata()
        });
        return;
      }
      // It's possible that headers were received but not fully handled yet.
      // Give the headers handler an opportunity to end the call first,
      // if an error occurred.
      await this.handlingHeaders;
      // This is a no-op if the call was already ended when handling headers.
      this.endCall(finalStatus);
    })();
  }

  attachHttp2Stream(stream: http2.ClientHttp2Stream): void {
    if (this.finalStatus !== null) {
      stream.close(NGHTTP2_CANCEL);
    } else {
      this.http2Stream = stream;
      stream.on('response', (headers, flags) => {
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
        if (flags & http2.constants.NGHTTP2_FLAG_END_STREAM) {
          this.handleTrailers(headers);
        } else {
          let metadata: Metadata;
          try {
            metadata = Metadata.fromHttp2Headers(headers);
          } catch (error) {
            this.endCall({code: Status.UNKNOWN, details: error.message, metadata: new Metadata()});
            return;
          }
          this.handlingHeaders =
            this.filterStack.receiveMetadata(Promise.resolve(metadata))
              .then((finalMetadata) => {
                this.emit('metadata', finalMetadata);
              }).catch((error) => {
                this.destroyHttp2Stream();
                this.endCall({code: Status.UNKNOWN, details: error.message, metadata: new Metadata()});
              });
        }
      });
      stream.on('trailers', this.handleTrailers.bind(this));
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
      stream.on('close', async (errorCode) => {
        let code: Status;
        let details = '';
        switch (errorCode) {
          case http2.constants.NGHTTP2_NO_ERROR:
            code = Status.OK;
            break;
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
        // This guarantees that if trailers were received, the value of the
        // 'grpc-status' header takes precedence for emitted status data.
        await this.handlingTrailers;
        // This is a no-op if trailers were received at all.
        // This is OK, because status codes emitted here correspond to more
        // catastrophic issues that prevent us from receiving trailers in the
        // first place.
        this.endCall({code: code, details: details, metadata: new Metadata()});
      });
      stream.on('error', (err: Error) => {
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

  private destroyHttp2Stream() {
    // The http2 stream could already have been destroyed if cancelWithStatus
    // is called in response to an internal http2 error.
    if (this.http2Stream !== null && !this.http2Stream.destroyed) {
      /* TODO(murgatroid99): Determine if we want to send different RST_STREAM
       * codes based on the status code */
      this.http2Stream.close(NGHTTP2_CANCEL);
    }
  }

  cancelWithStatus(status: Status, details: string): void {
    this.destroyHttp2Stream();
    (async () => {
      // If trailers are currently being processed, the call should be ended
      // by handleTrailers instead.
      await this.handlingTrailers;
      this.endCall({code: status, details: details, metadata: new Metadata()});
    })();
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
