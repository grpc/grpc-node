import * as http2 from 'http2';
import {Duplex} from 'stream';

import {CallCredentials} from './call-credentials';
import {Http2Channel} from './channel';
import {Status} from './constants';
import {EmitterAugmentation1} from './events';
import {Filter} from './filter';
import {FilterStackFactory} from './filter-stack';
import {Metadata} from './metadata';
import {ObjectDuplex, WriteCallback} from './object-stream';

const {HTTP2_HEADER_STATUS, HTTP2_HEADER_CONTENT_TYPE, NGHTTP2_CANCEL} =
    http2.constants;

export type Deadline = Date|number;

export interface CallStreamOptions {
  deadline: Deadline;
  flags: number;
  host: string;
  parentCall: Call|null;
}

export type PartialCallStreamOptions = Partial<CallStreamOptions>;

export interface StatusObject {
  code: Status;
  details: string;
  metadata: Metadata;
}

export const enum WriteFlags {
  BufferHint = 1,
  NoCompress = 2,
  WriteThrough = 4
}

export interface WriteObject {
  message: Buffer;
  flags?: number;
}

/**
 * This interface represents a duplex stream associated with a single gRPC call.
 */
export type Call = {
  cancelWithStatus(status: Status, details: string): void; getPeer(): string;
  sendMetadata(metadata: Metadata): void;

  getDeadline(): Deadline;
  getCredentials(): CallCredentials;
  setCredentials(credentials: CallCredentials): void;
  /* If the return value is null, the call has not ended yet. Otherwise, it has
   * ended with the specified status */
  getStatus(): StatusObject | null;
  getMethod(): string;
  getHost(): string;
}&EmitterAugmentation1<'metadata', Metadata>&
    EmitterAugmentation1<'status', StatusObject>&
    ObjectDuplex<WriteObject, Buffer>;

enum ReadState {
  NO_DATA,
  READING_SIZE,
  READING_MESSAGE
}

export class Http2CallStream extends Duplex implements Call {
  credentials: CallCredentials = CallCredentials.createEmpty();
  filterStack: Filter;
  private http2Stream: http2.ClientHttp2Stream|null = null;
  private pendingRead = false;
  private pendingWrite: Buffer|null = null;
  private pendingWriteCallback: WriteCallback|null = null;
  private pendingFinalCallback: Function|null = null;

  private readState: ReadState = ReadState.NO_DATA;
  private readCompressFlag: Buffer = Buffer.alloc(1);
  private readPartialSize: Buffer = Buffer.alloc(4);
  private readSizeRemaining = 4;
  private readMessageSize = 0;
  private readPartialMessage: Buffer[] = [];
  private readMessageRemaining = 0;

  private isReadFilterPending = false;
  private canPush = false;

  private unpushedReadMessages: Array<Buffer|null> = [];
  private unfilteredReadMessages: Array<Buffer|null> = [];

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
      private readonly channel: Http2Channel,
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

  private handleFilterError(error: Error) {
    this.cancelWithStatus(Status.INTERNAL, error.message);
  }

  private handleFilteredRead(message: Buffer) {
    /* If we the call has already ended, we don't want to do anything with
     * this message. Dropping it on the floor is correct behavior */
    if (this.finalStatus !== null) {
      return;
    }
    this.isReadFilterPending = false;
    if (this.canPush) {
      if (!this.push(message)) {
        this.canPush = false;
        (this.http2Stream as http2.ClientHttp2Stream).pause();
      }
    } else {
      this.unpushedReadMessages.push(message);
    }
    if (this.unfilteredReadMessages.length > 0) {
      /* nextMessage is guaranteed not to be undefined because
         unfilteredReadMessages is non-empty */
      const nextMessage = this.unfilteredReadMessages.shift() as Buffer | null;
      this.filterReceivedMessage(nextMessage);
    }
  }

  private filterReceivedMessage(framedMessage: Buffer|null) {
    /* If we the call has already ended, we don't want to do anything with
     * this message. Dropping it on the floor is correct behavior */
    if (this.finalStatus !== null) {
      return;
    }
    if (framedMessage === null) {
      if (this.canPush) {
        this.push(null);
      } else {
        this.unpushedReadMessages.push(null);
      }
      return;
    }
    this.isReadFilterPending = true;
    this.filterStack.receiveMessage(Promise.resolve(framedMessage))
        .then(
            this.handleFilteredRead.bind(this),
            this.handleFilterError.bind(this));
  }

  private tryPush(messageBytes: Buffer|null): void {
    if (this.isReadFilterPending) {
      this.unfilteredReadMessages.push(messageBytes);
    } else {
      this.filterReceivedMessage(messageBytes);
    }
  }

  private handleTrailers(headers: http2.IncomingHttpHeaders) {
    const code: Status = this.mappedStatusCode;
    const details = '';
    let metadata: Metadata;
    try {
      metadata = Metadata.fromHttp2Headers(headers);
    } catch (e) {
      metadata = new Metadata();
    }
    const status: StatusObject = {code, details, metadata};
    this.handlingTrailers = (async () => {
      let finalStatus;
      try {
        // Attempt to assign final status.
        finalStatus =
            await this.filterStack.receiveTrailers(Promise.resolve(status));
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

        if (flags & http2.constants.NGHTTP2_FLAG_END_STREAM) {
          this.handleTrailers(headers);
        } else {
          let metadata: Metadata;
          try {
            metadata = Metadata.fromHttp2Headers(headers);
          } catch (error) {
            this.endCall({
              code: Status.UNKNOWN,
              details: error.message,
              metadata: new Metadata()
            });
            return;
          }
          this.handlingHeaders =
              this.filterStack.receiveMetadata(Promise.resolve(metadata))
                  .then((finalMetadata) => {
                    this.emit('metadata', finalMetadata);
                  })
                  .catch((error) => {
                    this.destroyHttp2Stream();
                    this.endCall({
                      code: Status.UNKNOWN,
                      details: error.message,
                      metadata: new Metadata()
                    });
                  });
        }
      });
      stream.on('trailers', this.handleTrailers.bind(this));
      stream.on('data', (data: Buffer) => {
        let readHead = 0;
        let toRead: number;
        while (readHead < data.length) {
          switch (this.readState) {
            case ReadState.NO_DATA:
              this.readCompressFlag = data.slice(readHead, readHead + 1);
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
                  this.tryPush(Buffer.concat(
                      [this.readCompressFlag, this.readPartialSize]));
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
                const framedMessageBuffers = [
                  this.readCompressFlag, this.readPartialSize
                ].concat(this.readPartialMessage);
                const framedMessage = Buffer.concat(
                    framedMessageBuffers, this.readMessageSize + 5);
                this.tryPush(framedMessage);
                this.readState = ReadState.NO_DATA;
              }
              break;
            default:
              throw new Error('This should never happen');
          }
        }
      });
      stream.on('end', () => {
        this.tryPush(null);
      });
      stream.on('close', async (errorCode) => {
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
        // This guarantees that if trailers were received, the value of the
        // 'grpc-status' header takes precedence for emitted status data.
        await this.handlingTrailers;
        // This is a no-op if trailers were received at all.
        // This is OK, because status codes emitted here correspond to more
        // catastrophic issues that prevent us from receiving trailers in the
        // first place.
        this.endCall({code, details, metadata: new Metadata()});
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

  sendMetadata(metadata: Metadata): void {
    this.channel._startHttp2Stream(
        this.options.host, this.methodName, this, metadata);
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
      this.endCall({code: status, details, metadata: new Metadata()});
    })();
  }

  getDeadline(): Deadline {
    return this.options.deadline;
  }

  getCredentials(): CallCredentials {
    return this.credentials;
  }

  setCredentials(credentials: CallCredentials): void {
    this.credentials = credentials;
  }

  getStatus(): StatusObject|null {
    return this.finalStatus;
  }

  getPeer(): string {
    throw new Error('Not yet implemented');
  }

  getMethod(): string {
    return this.methodName;
  }

  getHost(): string {
    return this.options.host;
  }

  _read(size: number) {
    /* If we have already emitted a status, we should not emit any more
     * messages and we should communicate that the stream has ended */
    if (this.finalStatus !== null) {
      this.push(null);
      return;
    }
    this.canPush = true;
    if (this.http2Stream === null) {
      this.pendingRead = true;
    } else {
      while (this.unpushedReadMessages.length > 0) {
        const nextMessage = this.unpushedReadMessages.shift();
        this.canPush = this.push(nextMessage);
        if (nextMessage === null || (!this.canPush)) {
          this.canPush = false;
          return;
        }
      }
      /* Only resume reading from the http2Stream if we don't have any pending
       * messages to emit, and we haven't gotten the signal to stop pushing
       * messages */
      this.http2Stream.resume();
    }
  }

  _write(chunk: WriteObject, encoding: string, cb: WriteCallback) {
    this.filterStack.sendMessage(Promise.resolve(chunk)).then((message) => {
      if (this.http2Stream === null) {
        this.pendingWrite = message.message;
        this.pendingWriteCallback = cb;
      } else {
        this.http2Stream.write(message.message, cb);
      }
    }, this.handleFilterError.bind(this));
  }

  _final(cb: Function) {
    if (this.http2Stream === null) {
      this.pendingFinalCallback = cb;
    } else {
      this.http2Stream.end(cb);
    }
  }
}
