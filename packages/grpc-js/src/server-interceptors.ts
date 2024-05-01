/*
 * Copyright 2024 gRPC authors.
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

import { PartialStatusObject } from './call-interface';
import { ServerMethodDefinition } from './make-client';
import { Metadata } from './metadata';
import { ChannelOptions } from './channel-options';
import { Handler, ServerErrorResponse } from './server-call';
import { Deadline } from './deadline';
import {
  DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH,
  DEFAULT_MAX_SEND_MESSAGE_LENGTH,
  LogVerbosity,
  Status,
} from './constants';
import * as http2 from 'http2';
import { getErrorMessage } from './error';
import * as zlib from 'zlib';
import { promisify } from 'util';
import { GrpcFrame, decoder } from './stream-decoder';
import { CallEventTracker } from './transport';
import * as logging from './logging';

const unzip = promisify(zlib.unzip);
const inflate = promisify(zlib.inflate);

const TRACER_NAME = 'server_call';

function trace(text: string) {
  logging.trace(LogVerbosity.DEBUG, TRACER_NAME, text);
}

type GrpcWriteFrame = [header: Buffer, message: Buffer];

export interface ServerMetadataListener {
  (metadata: Metadata, next: (metadata: Metadata) => void): void;
}

export interface ServerMessageListener {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (message: any, next: (message: any) => void): void;
}

export interface ServerHalfCloseListener {
  (next: () => void): void;
}

export interface ServerCancelListener {
  (): void;
}

export interface FullServerListener {
  onReceiveMetadata: ServerMetadataListener;
  onReceiveMessage: ServerMessageListener;
  onReceiveHalfClose: ServerHalfCloseListener;
  onCancel: ServerCancelListener;
}

export type ServerListener = Partial<FullServerListener>;

export class ServerListenerBuilder {
  private metadata: ServerMetadataListener | undefined = undefined;
  private message: ServerMessageListener | undefined = undefined;
  private halfClose: ServerHalfCloseListener | undefined = undefined;
  private cancel: ServerCancelListener | undefined = undefined;

  withOnReceiveMetadata(onReceiveMetadata: ServerMetadataListener): this {
    this.metadata = onReceiveMetadata;
    return this;
  }

  withOnReceiveMessage(onReceiveMessage: ServerMessageListener): this {
    this.message = onReceiveMessage;
    return this;
  }

  withOnReceiveHalfClose(onReceiveHalfClose: ServerHalfCloseListener): this {
    this.halfClose = onReceiveHalfClose;
    return this;
  }

  withOnCancel(onCancel: ServerCancelListener): this {
    this.cancel = onCancel;
    return this;
  }

  build(): ServerListener {
    return {
      onReceiveMetadata: this.metadata,
      onReceiveMessage: this.message,
      onReceiveHalfClose: this.halfClose,
      onCancel: this.cancel,
    };
  }
}

export interface InterceptingServerListener {
  onReceiveMetadata(metadata: Metadata): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onReceiveMessage(message: any): void;
  onReceiveHalfClose(): void;
  onCancel(): void;
}

export function isInterceptingServerListener(
  listener: ServerListener | InterceptingServerListener
): listener is InterceptingServerListener {
  return (
    listener.onReceiveMetadata !== undefined &&
    listener.onReceiveMetadata.length === 1
  );
}

class InterceptingServerListenerImpl implements InterceptingServerListener {
  /**
   * Once the call is cancelled, ignore all other events.
   */
  private cancelled = false;
  private processingMetadata = false;
  private hasPendingMessage = false;
  private pendingMessage: any = null;
  private processingMessage = false;
  private hasPendingHalfClose = false;

  constructor(
    private listener: FullServerListener,
    private nextListener: InterceptingServerListener
  ) {}

  private processPendingMessage() {
    if (this.hasPendingMessage) {
      this.nextListener.onReceiveMessage(this.pendingMessage);
      this.pendingMessage = null;
      this.hasPendingMessage = false;
    }
  }

  private processPendingHalfClose() {
    if (this.hasPendingHalfClose) {
      this.nextListener.onReceiveHalfClose();
      this.hasPendingHalfClose = false;
    }
  }

  onReceiveMetadata(metadata: Metadata): void {
    if (this.cancelled) {
      return;
    }
    this.processingMetadata = true;
    this.listener.onReceiveMetadata(metadata, interceptedMetadata => {
      this.processingMetadata = false;
      if (this.cancelled) {
        return;
      }
      this.nextListener.onReceiveMetadata(interceptedMetadata);
      this.processPendingMessage();
      this.processPendingHalfClose();
    });
  }
  onReceiveMessage(message: any): void {
    if (this.cancelled) {
      return;
    }
    this.processingMessage = true;
    this.listener.onReceiveMessage(message, msg => {
      this.processingMessage = false;
      if (this.cancelled) {
        return;
      }
      if (this.processingMetadata) {
        this.pendingMessage = msg;
        this.hasPendingMessage = true;
      } else {
        this.nextListener.onReceiveMessage(msg);
        this.processPendingHalfClose();
      }
    });
  }
  onReceiveHalfClose(): void {
    if (this.cancelled) {
      return;
    }
    this.listener.onReceiveHalfClose(() => {
      if (this.cancelled) {
        return;
      }
      if (this.processingMetadata || this.processingMessage) {
        this.hasPendingHalfClose = true;
      } else {
        this.nextListener.onReceiveHalfClose();
      }
    });
  }
  onCancel(): void {
    this.cancelled = true;
    this.listener.onCancel();
    this.nextListener.onCancel();
  }
}

export interface StartResponder {
  (next: (listener?: ServerListener) => void): void;
}

export interface MetadataResponder {
  (metadata: Metadata, next: (metadata: Metadata) => void): void;
}

export interface MessageResponder {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (message: any, next: (message: any) => void): void;
}

export interface StatusResponder {
  (
    status: PartialStatusObject,
    next: (status: PartialStatusObject) => void
  ): void;
}

export interface FullResponder {
  start: StartResponder;
  sendMetadata: MetadataResponder;
  sendMessage: MessageResponder;
  sendStatus: StatusResponder;
}

export type Responder = Partial<FullResponder>;

export class ResponderBuilder {
  private start: StartResponder | undefined = undefined;
  private metadata: MetadataResponder | undefined = undefined;
  private message: MessageResponder | undefined = undefined;
  private status: StatusResponder | undefined = undefined;

  withStart(start: StartResponder): this {
    this.start = start;
    return this;
  }

  withSendMetadata(sendMetadata: MetadataResponder): this {
    this.metadata = sendMetadata;
    return this;
  }

  withSendMessage(sendMessage: MessageResponder): this {
    this.message = sendMessage;
    return this;
  }

  withSendStatus(sendStatus: StatusResponder): this {
    this.status = sendStatus;
    return this;
  }

  build(): Responder {
    return {
      start: this.start,
      sendMetadata: this.metadata,
      sendMessage: this.message,
      sendStatus: this.status,
    };
  }
}

const defaultServerListener: FullServerListener = {
  onReceiveMetadata: (metadata, next) => {
    next(metadata);
  },
  onReceiveMessage: (message, next) => {
    next(message);
  },
  onReceiveHalfClose: next => {
    next();
  },
  onCancel: () => {},
};

const defaultResponder: FullResponder = {
  start: next => {
    next();
  },
  sendMetadata: (metadata, next) => {
    next(metadata);
  },
  sendMessage: (message, next) => {
    next(message);
  },
  sendStatus: (status, next) => {
    next(status);
  },
};

export interface ServerInterceptingCallInterface {
  /**
   * Register the listener to handle inbound events.
   */
  start(listener: InterceptingServerListener): void;
  /**
   * Send response metadata.
   */
  sendMetadata(metadata: Metadata): void;
  /**
   * Send a response message.
   */
  sendMessage(message: any, callback: () => void): void;
  /**
   * End the call by sending this status.
   */
  sendStatus(status: PartialStatusObject): void;
  /**
   * Start a single read, eventually triggering either listener.onReceiveMessage or listener.onReceiveHalfClose.
   */
  startRead(): void;
  /**
   * Return the peer address of the client making the request, if known, or "unknown" otherwise
   */
  getPeer(): string;
  /**
   * Return the call deadline set by the client. The value is Infinity if there is no deadline.
   */
  getDeadline(): Deadline;
}

export class ServerInterceptingCall implements ServerInterceptingCallInterface {
  private responder: FullResponder;
  private processingMetadata = false;
  private processingMessage = false;
  private pendingMessage: any = null;
  private pendingMessageCallback: (() => void) | null = null;
  private pendingStatus: PartialStatusObject | null = null;
  constructor(
    private nextCall: ServerInterceptingCallInterface,
    responder?: Responder
  ) {
    this.responder = {
      start: responder?.start ?? defaultResponder.start,
      sendMetadata: responder?.sendMetadata ?? defaultResponder.sendMetadata,
      sendMessage: responder?.sendMessage ?? defaultResponder.sendMessage,
      sendStatus: responder?.sendStatus ?? defaultResponder.sendStatus,
    };
  }

  private processPendingMessage() {
    if (this.pendingMessageCallback) {
      this.nextCall.sendMessage(
        this.pendingMessage,
        this.pendingMessageCallback
      );
      this.pendingMessage = null;
      this.pendingMessageCallback = null;
    }
  }

  private processPendingStatus() {
    if (this.pendingStatus) {
      this.nextCall.sendStatus(this.pendingStatus);
      this.pendingStatus = null;
    }
  }

  start(listener: InterceptingServerListener): void {
    this.responder.start(interceptedListener => {
      const fullInterceptedListener: FullServerListener = {
        onReceiveMetadata:
          interceptedListener?.onReceiveMetadata ??
          defaultServerListener.onReceiveMetadata,
        onReceiveMessage:
          interceptedListener?.onReceiveMessage ??
          defaultServerListener.onReceiveMessage,
        onReceiveHalfClose:
          interceptedListener?.onReceiveHalfClose ??
          defaultServerListener.onReceiveHalfClose,
        onCancel:
          interceptedListener?.onCancel ?? defaultServerListener.onCancel,
      };
      const finalInterceptingListener = new InterceptingServerListenerImpl(
        fullInterceptedListener,
        listener
      );
      this.nextCall.start(finalInterceptingListener);
    });
  }
  sendMetadata(metadata: Metadata): void {
    this.processingMetadata = true;
    this.responder.sendMetadata(metadata, interceptedMetadata => {
      this.processingMetadata = false;
      this.nextCall.sendMetadata(interceptedMetadata);
      this.processPendingMessage();
      this.processPendingStatus();
    });
  }
  sendMessage(message: any, callback: () => void): void {
    this.processingMessage = true;
    this.responder.sendMessage(message, interceptedMessage => {
      this.processingMessage = false;
      if (this.processingMetadata) {
        this.pendingMessage = interceptedMessage;
        this.pendingMessageCallback = callback;
      } else {
        this.nextCall.sendMessage(interceptedMessage, callback);
      }
    });
  }
  sendStatus(status: PartialStatusObject): void {
    this.responder.sendStatus(status, interceptedStatus => {
      if (this.processingMetadata || this.processingMessage) {
        this.pendingStatus = interceptedStatus;
      } else {
        this.nextCall.sendStatus(interceptedStatus);
      }
    });
  }
  startRead(): void {
    this.nextCall.startRead();
  }
  getPeer(): string {
    return this.nextCall.getPeer();
  }
  getDeadline(): Deadline {
    return this.nextCall.getDeadline();
  }
}

export interface ServerInterceptor {
  (
    methodDescriptor: ServerMethodDefinition<any, any>,
    call: ServerInterceptingCallInterface
  ): ServerInterceptingCall;
}

interface DeadlineUnitIndexSignature {
  [name: string]: number;
}

const GRPC_ACCEPT_ENCODING_HEADER = 'grpc-accept-encoding';
const GRPC_ENCODING_HEADER = 'grpc-encoding';
const GRPC_MESSAGE_HEADER = 'grpc-message';
const GRPC_STATUS_HEADER = 'grpc-status';
const GRPC_TIMEOUT_HEADER = 'grpc-timeout';
const DEADLINE_REGEX = /(\d{1,8})\s*([HMSmun])/;
const deadlineUnitsToMs: DeadlineUnitIndexSignature = {
  H: 3600000,
  M: 60000,
  S: 1000,
  m: 1,
  u: 0.001,
  n: 0.000001,
};

const defaultCompressionHeaders = {
  // TODO(cjihrig): Remove these encoding headers from the default response
  // once compression is integrated.
  [GRPC_ACCEPT_ENCODING_HEADER]: 'identity,deflate,gzip',
  [GRPC_ENCODING_HEADER]: 'identity',
};
const defaultResponseHeaders = {
  [http2.constants.HTTP2_HEADER_STATUS]: http2.constants.HTTP_STATUS_OK,
  [http2.constants.HTTP2_HEADER_CONTENT_TYPE]: 'application/grpc+proto',
};
const defaultResponseOptions = {
  waitForTrailers: true,
} as http2.ServerStreamResponseOptions;

type ReadQueueEntryType = 'COMPRESSED' | 'READABLE' | 'HALF_CLOSE';

interface ReadQueueEntry {
  type: ReadQueueEntryType;
  compressedMessage: GrpcFrame | null;
  parsedMessage: any;
}

export class BaseServerInterceptingCall
  implements ServerInterceptingCallInterface
{
  private listener: InterceptingServerListener | null = null;
  private metadata: Metadata;
  private deadlineTimer: NodeJS.Timeout | null = null;
  private deadline: Deadline = Infinity;
  private maxSendMessageSize: number = DEFAULT_MAX_SEND_MESSAGE_LENGTH;
  private maxReceiveMessageSize: number = DEFAULT_MAX_RECEIVE_MESSAGE_LENGTH;
  private cancelled = false;
  private metadataSent = false;
  private wantTrailers = false;
  private cancelNotified = false;
  private incomingEncoding = 'identity';
  private decoder = decoder.get();
  private readQueue: ReadQueueEntry[] = [];
  private isReadPending = false;
  private receivedHalfClose = false;
  private streamEnded = false;

  constructor(
    private readonly stream: http2.ServerHttp2Stream,
    headers: http2.IncomingHttpHeaders,
    private readonly callEventTracker: CallEventTracker | null,
    private readonly handler: Handler<any, any>,
    options: ChannelOptions
  ) {
    this.stream.once('error', (err: ServerErrorResponse) => {
      /* We need an error handler to avoid uncaught error event exceptions, but
       * there is nothing we can reasonably do here. Any error event should
       * have a corresponding close event, which handles emitting the cancelled
       * event. And the stream is now in a bad state, so we can't reasonably
       * expect to be able to send an error over it. */
    });

    this.stream.once('close', () => {
      trace(
        'Request to method ' +
          this.handler?.path +
          ' stream closed with rstCode ' +
          this.stream.rstCode
      );

      if (this.callEventTracker && !this.streamEnded) {
        this.streamEnded = true;
        this.callEventTracker.onStreamEnd(false);
        this.callEventTracker.onCallEnd({
          code: Status.CANCELLED,
          details: 'Stream closed before sending status',
          metadata: null,
        });
      }

      this.notifyOnCancel();

      // release current decoder
      decoder.release(this.decoder);
    });

    this.stream.on('data', (data: Buffer) => {
      this.handleDataFrame(data);
    });
    this.stream.pause();

    this.stream.on('end', () => {
      this.handleEndEvent();
    });

    if ('grpc.max_send_message_length' in options) {
      this.maxSendMessageSize = options['grpc.max_send_message_length']!;
    }
    if ('grpc.max_receive_message_length' in options) {
      this.maxReceiveMessageSize = options['grpc.max_receive_message_length']!;
    }

    const metadata = Metadata.fromHttp2Headers(headers);

    if (logging.isTracerEnabled(TRACER_NAME)) {
      trace(
        'Request to ' +
          this.handler.path +
          ' received headers ' +
          JSON.stringify(metadata.toJSON())
      );
    }

    const timeoutHeader = metadata.get(GRPC_TIMEOUT_HEADER);

    if (timeoutHeader.length > 0) {
      this.handleTimeoutHeader(timeoutHeader[0] as string);
    }

    const encodingHeader = metadata.get(GRPC_ENCODING_HEADER);

    if (encodingHeader.length > 0) {
      this.incomingEncoding = encodingHeader[0] as string;
    }

    // Remove several headers that should not be propagated to the application
    metadata.remove(GRPC_TIMEOUT_HEADER);
    metadata.remove(GRPC_ENCODING_HEADER);
    metadata.remove(GRPC_ACCEPT_ENCODING_HEADER);
    metadata.remove(http2.constants.HTTP2_HEADER_ACCEPT_ENCODING);
    metadata.remove(http2.constants.HTTP2_HEADER_TE);
    metadata.remove(http2.constants.HTTP2_HEADER_CONTENT_TYPE);
    this.metadata = metadata;
  }

  private handleTimeoutHeader(timeoutHeader: string) {
    const match = timeoutHeader.toString().match(DEADLINE_REGEX);

    if (match === null) {
      const status: PartialStatusObject = {
        code: Status.INTERNAL,
        details: `Invalid ${GRPC_TIMEOUT_HEADER} value "${timeoutHeader}"`,
        metadata: null,
      };
      // Wait for the constructor to complete before sending the error.
      process.nextTick(() => {
        this.sendStatus(status);
      });
      return;
    }

    const timeout = (+match[1] * deadlineUnitsToMs[match[2]]) | 0;

    const now = new Date();
    this.deadline = now.setMilliseconds(now.getMilliseconds() + timeout);
    this.deadlineTimer = setTimeout(() => {
      const status: PartialStatusObject = {
        code: Status.DEADLINE_EXCEEDED,
        details: 'Deadline exceeded',
        metadata: null,
      };
      this.sendStatus(status);
    }, timeout);
  }

  private checkCancelled(): boolean {
    /* In some cases the stream can become destroyed before the close event
     * fires. That creates a race condition that this check works around */
    if (!this.cancelled && (this.stream.destroyed || this.stream.closed)) {
      this.notifyOnCancel();
      this.cancelled = true;
    }
    return this.cancelled;
  }
  private notifyOnCancel() {
    if (this.cancelNotified) {
      return;
    }
    this.cancelNotified = true;
    this.cancelled = true;
    queueMicrotask(() => {
      this.listener?.onCancel();
    });
    if (this.deadlineTimer) {
      clearTimeout(this.deadlineTimer);
    }
    // Flush incoming data frames
    this.stream.resume();
  }

  /**
   * A server handler can start sending messages without explicitly sending
   * metadata. In that case, we need to send headers before sending any
   * messages. This function does that if necessary.
   */
  private maybeSendMetadata() {
    if (!this.metadataSent) {
      this.sendMetadata(new Metadata());
    }
  }

  /**
   * Serialize a message to a length-delimited byte string.
   * @param value
   * @returns
   */
  private serializeMessage(value: any): GrpcWriteFrame {
    const messageBuffer = this.handler.serialize(value);
    const { byteLength } = messageBuffer;

    const header = Buffer.allocUnsafe(5);
    header.writeUint8(0, 0);
    header.writeUint32BE(byteLength, 1);

    return [header, messageBuffer];
  }

  private decompressMessage(
    message: Buffer,
    encoding: string
  ): Promise<Buffer> {
    if (encoding === 'deflate') {
      return inflate(message);
    }

    if (encoding === 'gzip') {
      return unzip(message);
    }

    throw {
      code: Status.UNIMPLEMENTED,
      details: `Received message compressed with unsupported encoding "${encoding}"`,
    };
  }

  private async decompressAndMaybePush(queueEntry: ReadQueueEntry) {
    if (queueEntry.type !== 'COMPRESSED') {
      throw new Error(`Invalid queue entry type: ${queueEntry.type}`);
    }

    const msg = queueEntry.compressedMessage!;
    const compressed = msg!.compressed === 1;

    try {
      const decompressedMessage = compressed
        ? await this.decompressMessage(msg.message, this.incomingEncoding)
        : msg.message;

      queueEntry.parsedMessage = this.handler.deserialize(decompressedMessage);
    } catch (err: any) {
      this.sendStatus({
        code: err.code || Status.INTERNAL,
        details: err.details || `Error deserializing request: ${err.message}`,
      });
      return;
    }

    queueEntry.type = 'READABLE';
    this.maybePushNextMessage();
  }

  private maybePushNextMessage() {
    if (
      this.listener &&
      this.isReadPending &&
      this.readQueue.length > 0 &&
      this.readQueue[0].type !== 'COMPRESSED'
    ) {
      this.isReadPending = false;
      const nextQueueEntry = this.readQueue.shift()!;
      if (nextQueueEntry.type === 'READABLE') {
        this.listener.onReceiveMessage(nextQueueEntry.parsedMessage);
      } else {
        // nextQueueEntry.type === 'HALF_CLOSE'
        this.listener.onReceiveHalfClose();
      }
    }
  }

  private handleDataFrame(data: Buffer) {
    if (this.checkCancelled()) {
      return;
    }
    trace(
      'Request to ' +
        this.handler.path +
        ' received data frame of size ' +
        data.length
    );
    const rawMessages: GrpcFrame[] = this.decoder.write(data);

    if (rawMessages.length > 0) {
      this.stream.pause();
    }

    for (const message of rawMessages) {
      if (
        this.maxReceiveMessageSize !== -1 &&
        message.size > this.maxReceiveMessageSize
      ) {
        this.sendStatus({
          code: Status.RESOURCE_EXHAUSTED,
          details: `Received message larger than max (${message.size} vs. ${this.maxReceiveMessageSize})`,
          metadata: null,
        });
        return;
      }
      const queueEntry: ReadQueueEntry = {
        type: 'COMPRESSED',
        compressedMessage: message,
        parsedMessage: null,
      };
      this.readQueue.push(queueEntry);
      this.decompressAndMaybePush(queueEntry);
      this.callEventTracker?.addMessageReceived();
    }
  }
  private handleEndEvent() {
    this.readQueue.push({
      type: 'HALF_CLOSE',
      compressedMessage: null,
      parsedMessage: null,
    });
    this.receivedHalfClose = true;
    this.maybePushNextMessage();
  }
  start(listener: InterceptingServerListener): void {
    trace('Request to ' + this.handler.path + ' start called');
    if (this.checkCancelled()) {
      return;
    }
    this.listener = listener;
    listener.onReceiveMetadata(this.metadata);
  }
  sendMetadata(metadata: Metadata): void {
    if (this.checkCancelled()) {
      return;
    }

    if (this.metadataSent) {
      return;
    }

    this.metadataSent = true;
    const custom = metadata ? metadata.toHttp2Headers() : null;
    const headers = {
      ...defaultResponseHeaders,
      ...defaultCompressionHeaders,
      ...custom,
    };
    this.stream.respond(headers, defaultResponseOptions);
  }
  sendMessage(message: any, callback: () => void): void {
    if (this.checkCancelled()) {
      return;
    }
    let response: GrpcWriteFrame;
    try {
      response = this.serializeMessage(message);
    } catch (e) {
      this.sendStatus({
        code: Status.INTERNAL,
        details: `Error serializing response: ${getErrorMessage(e)}`,
        metadata: null,
      });
      return;
    }

    if (
      this.maxSendMessageSize !== -1 &&
      response[1].length > this.maxSendMessageSize
    ) {
      this.sendStatus({
        code: Status.RESOURCE_EXHAUSTED,
        details: `Sent message larger than max (${response[1].length} vs. ${this.maxSendMessageSize})`,
        metadata: null,
      });
      return;
    }
    this.maybeSendMetadata();
    trace(
      'Request to ' +
        this.handler.path +
        ' sent data frame of size ' +
        response[1].length
    );
    const { stream } = this;

    // TODO: measure cork() / uncork() ?
    stream.write(response[0]);
    stream.write(response[1], error => {
      if (error) {
        this.sendStatus({
          code: Status.INTERNAL,
          details: `Error writing message: ${getErrorMessage(error)}`,
          metadata: null,
        });
        return;
      }
      this.callEventTracker?.addMessageSent();
      callback();
    });
  }
  sendStatus(status: PartialStatusObject): void {
    if (this.checkCancelled()) {
      return;
    }

    trace(
      'Request to method ' +
        this.handler?.path +
        ' ended with status code: ' +
        Status[status.code] +
        ' details: ' +
        status.details
    );

    if (this.metadataSent) {
      if (!this.wantTrailers) {
        this.wantTrailers = true;
        this.stream.once('wantTrailers', () => {
          if (this.callEventTracker && !this.streamEnded) {
            this.streamEnded = true;
            this.callEventTracker.onStreamEnd(true);
            this.callEventTracker.onCallEnd(status);
          }
          const trailersToSend = {
            [GRPC_STATUS_HEADER]: status.code,
            [GRPC_MESSAGE_HEADER]: encodeURI(status.details),
            ...status.metadata?.toHttp2Headers(),
          };

          this.stream.sendTrailers(trailersToSend);
          this.notifyOnCancel();
        });
        this.stream.end();
      } else {
        this.notifyOnCancel();
      }
    } else {
      if (this.callEventTracker && !this.streamEnded) {
        this.streamEnded = true;
        this.callEventTracker.onStreamEnd(true);
        this.callEventTracker.onCallEnd(status);
      }
      // Trailers-only response
      const trailersToSend = {
        [GRPC_STATUS_HEADER]: status.code,
        [GRPC_MESSAGE_HEADER]: encodeURI(status.details),
        ...defaultResponseHeaders,
        ...status.metadata?.toHttp2Headers(),
      };
      this.stream.respond(trailersToSend, { endStream: true });
      this.notifyOnCancel();
    }
  }
  startRead(): void {
    trace('Request to ' + this.handler.path + ' startRead called');
    if (this.checkCancelled()) {
      return;
    }
    this.isReadPending = true;
    if (this.readQueue.length === 0) {
      if (!this.receivedHalfClose) {
        this.stream.resume();
      }
    } else {
      this.maybePushNextMessage();
    }
  }
  getPeer(): string {
    const socket = this.stream.session?.socket;
    if (socket?.remoteAddress) {
      if (socket.remotePort) {
        return `${socket.remoteAddress}:${socket.remotePort}`;
      } else {
        return socket.remoteAddress;
      }
    } else {
      return 'unknown';
    }
  }
  getDeadline(): Deadline {
    return this.deadline;
  }
}

export function getServerInterceptingCall(
  interceptors: ServerInterceptor[],
  stream: http2.ServerHttp2Stream,
  headers: http2.IncomingHttpHeaders,
  callEventTracker: CallEventTracker | null,
  handler: Handler<any, any>,
  options: ChannelOptions
) {
  const methodDefinition: ServerMethodDefinition<any, any> = {
    path: handler.path,
    requestStream: handler.type === 'clientStream' || handler.type === 'bidi',
    responseStream: handler.type === 'serverStream' || handler.type === 'bidi',
    requestDeserialize: handler.deserialize,
    responseSerialize: handler.serialize,
  };
  const baseCall = new BaseServerInterceptingCall(
    stream,
    headers,
    callEventTracker,
    handler,
    options
  );
  return interceptors.reduce(
    (call: ServerInterceptingCallInterface, interceptor: ServerInterceptor) => {
      return interceptor(methodDefinition, call);
    },
    baseCall
  );
}
