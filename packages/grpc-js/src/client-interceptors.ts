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

import { Metadata } from './metadata';
import { StatusObject, CallStreamOptions, Listener, MetadataListener, MessageListener, StatusListener, FullListener, InterceptingListener, WriteObject, WriteCallback, InterceptingListenerImpl, isInterceptingListener, MessageContext, Http2CallStream, Deadline, Call } from './call-stream';
import { Status } from './constants';
import { Channel } from './channel';
import { CallOptions } from './client';
import { CallCredentials } from './call-credentials';
import { ClientMethodDefinition, Serialize } from './make-client';

export class InterceptorConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InterceptorConfigurationError';
    Error.captureStackTrace(this, InterceptorConfigurationError);
  }
}

export interface MetadataRequester {
  (metadata: Metadata, listener: InterceptingListener, next: (metadata: Metadata, listener: InterceptingListener | Listener) => void): void;
}

export interface MessageRequester {
  (message: any, next: (message: any) => void): void;
}

export interface CloseRequester {
  (next: () => void): void;
}

export interface CancelRequester {
  (next: () => void): void;
}

export interface FullRequester {
  start: MetadataRequester;
  sendMessage: MessageRequester;
  halfClose: CloseRequester;
  cancel: CancelRequester;
}

export type Requester = Partial<FullRequester>;

export class ListenerBuilder {
  private metadata: MetadataListener | undefined = undefined;
  private message: MessageListener | undefined = undefined;
  private status: StatusListener | undefined = undefined;

  withOnReceiveMetadata(onReceiveMetadata: MetadataListener): this {
    this.metadata = onReceiveMetadata;
    return this;
  }

  withOnReceiveMessage(onReceiveMessage: MessageListener): this {
    this.message = onReceiveMessage;
    return this;
  }

  withOnReceiveStatus(onReceiveStatus: StatusListener): this {
    this.status = onReceiveStatus;
    return this;
  }

  build(): Listener {
    return {
      onReceiveMetadata: this.metadata,
      onReceiveMessage: this.message,
      onReceiveStatus: this.status
    }
  }
}

export class RequesterBuilder {
  private start: MetadataRequester | undefined = undefined;
  private message: MessageRequester | undefined = undefined;
  private halfClose: CloseRequester | undefined = undefined;
  private cancel: CancelRequester | undefined = undefined;

  withStart(start: MetadataRequester): this {
    this.start = start;
    return this;
  }

  withSendMessage(sendMessage: MessageRequester): this {
    this.message = sendMessage;
    return this;
  }

  withHalfClose(halfClose: CloseRequester): this {
    this.halfClose = halfClose;
    return this;
  }

  withCancel(cancel: CancelRequester): this {
    this.cancel = cancel;
    return this;
  }

  build(): Requester {
    return {
      start: this.start,
      sendMessage: this.message,
      halfClose: this.halfClose,
      cancel: this.cancel
    };
  }
}

const defaultListener: FullListener = {
  onReceiveMetadata: (metadata, next) => {
    next(metadata);
  },
  onReceiveMessage: (message, next) => {
    next(message);
  },
  onReceiveStatus: (status, next) => {
    next(status);
  }
};

const defaultRequester: FullRequester = {
  start: (metadata, listener, next) => {
    next(metadata, listener);
  },
  sendMessage: (message, next) => {
    next(message);
  },
  halfClose: (next) => {
    next();
  },
  cancel: (next) => {
    next();
  }
}

export interface InterceptorOptions extends CallOptions {
  method_definition: ClientMethodDefinition<any, any>;
}

export interface InterceptingCallInterface {
  cancelWithStatus(status: Status, details: string): void;
  getPeer(): string;
  start(metadata: Metadata, listener: InterceptingListener): void;
  sendMessageWithContext(context: MessageContext, message: any): void;
  startRead(): void;
  halfClose(): void;

  getDeadline(): Deadline;
  getCredentials(): CallCredentials;
  setCredentials(credentials: CallCredentials): void;
  getMethod(): string;
  getHost(): string;
}

export class InterceptingCall implements InterceptingCallInterface {
  private requester: FullRequester;
  private processingMessage = false;
  private pendingHalfClose = false;
  constructor(private nextCall: InterceptingCallInterface, requester?: Requester) {
    if (requester) {
      // Undefined elements overwrite, unset ones do not
      this.requester = {
        start: requester.start || defaultRequester.start,
        sendMessage: requester.sendMessage || defaultRequester.sendMessage,
        halfClose: requester.halfClose || defaultRequester.halfClose,
        cancel: requester.cancel || defaultRequester.cancel
      }
    } else {
      this.requester = defaultRequester;
    }
  }

  cancelWithStatus(status: Status, details: string) {
    this.requester.cancel(() => {
      this.nextCall.cancelWithStatus(status, details);
    });
  }

  getPeer() {
    return this.nextCall.getPeer();
  }
  start(metadata: Metadata, interceptingListener: InterceptingListener): void {
    this.requester.start(metadata, interceptingListener, (md, listener) => {
      let finalInterceptingListener: InterceptingListener;
      if (isInterceptingListener(listener)) {
        finalInterceptingListener = listener;
      } else {
        const fullListener: FullListener = {
          onReceiveMetadata: listener.onReceiveMetadata || defaultListener.onReceiveMetadata,
          onReceiveMessage: listener.onReceiveMessage || defaultListener.onReceiveMessage,
          onReceiveStatus: listener.onReceiveStatus || defaultListener.onReceiveStatus
        };
        finalInterceptingListener = new InterceptingListenerImpl(fullListener, interceptingListener);
      }
      this.nextCall.start(md, finalInterceptingListener);
    });
  }
  sendMessageWithContext(context: MessageContext, message: any): void {
    this.processingMessage = true;
    this.requester.sendMessage(message, (finalMessage) => {
      this.processingMessage = false;
      this.nextCall.sendMessageWithContext(context, finalMessage);
      if (this.pendingHalfClose) {
        this.nextCall.halfClose();
      }
    })
  }
  sendMessage(message: any): void {
    this.sendMessageWithContext({}, message);
  }
  startRead(): void {
    this.nextCall.startRead();
  }
  halfClose(): void {
    this.requester.halfClose(() => {
      if (this.processingMessage) {
        this.pendingHalfClose = true;
      } else {
        this.nextCall.halfClose();
      }
    });
  }
  getDeadline(): number | Date {
    return this.nextCall.getDeadline();
  }
  getCredentials(): CallCredentials {
    return this.nextCall.getCredentials();
  }
  setCredentials(credentials: CallCredentials): void {
    this.nextCall.setCredentials(credentials);
  }
  getMethod(): string {
    return this.nextCall.getHost();
  }
  getHost(): string {
    return this.nextCall.getHost();
  }
}

function getCall(channel: Channel, path: string, options: CallOptions): Call {
  var deadline;
  var host;
  var parent;
  var propagate_flags;
  var credentials;
  if (options) {
    deadline = options.deadline;
    host = options.host;

    propagate_flags = options.propagate_flags;
    credentials = options.credentials;
  }
  if (deadline === undefined) {
    deadline = Infinity;
  }
  var call = channel.createCall(path, deadline, host,
                                parent, propagate_flags);
  if (credentials) {
    call.setCredentials(credentials);
  }
  return call;
}

class BaseInterceptingCall implements InterceptingCallInterface {
  constructor(protected call: Call, protected methodDefinition: ClientMethodDefinition<any, any>) {}
  cancelWithStatus(status: Status, details: string): void {
    this.call.cancelWithStatus(status, details);
  }
  getPeer(): string {
    return this.call.getPeer();
  }
  getDeadline(): number | Date {
    return this.call.getDeadline();
  }
  getCredentials(): CallCredentials {
    return this.call.getCredentials();
  }
  setCredentials(credentials: CallCredentials): void {
    this.call.setCredentials(credentials);
  }
  getMethod(): string {
    return this.call.getMethod();
  }
  getHost(): string {
    return this.call.getHost();
  }
  sendMessageWithContext(context: MessageContext, message: any): void {
    let serialized: Buffer;
    try {
      serialized = this.methodDefinition.requestSerialize(message);
      this.call.sendMessageWithContext(context, serialized);
    } catch (e) {
      this.call.cancelWithStatus(Status.INTERNAL, 'Serialization failure');
    }
  }
  start(metadata: Metadata, listener: InterceptingListener): void {
    let readError: StatusObject | null = null;
    this.call.start(metadata, {
      onReceiveMetadata: (metadata) => {
        listener.onReceiveMetadata(metadata);
      },
      onReceiveMessage: (message) => {
        let deserialized: any;
        try {
          deserialized = this.methodDefinition.responseDeserialize(message);
          listener.onReceiveMessage(deserialized);
        } catch (e) {
          readError = {code: Status.INTERNAL, details: 'Failed to parse server response', metadata: new Metadata()};
          this.call.cancelWithStatus(readError.code, readError.details);
        }
      },
      onReceiveStatus: (status) => {
        if (readError) {
          listener.onReceiveStatus(readError);
        } else {
          listener.onReceiveStatus(status);
        }
      }
    });
  }
  startRead() {
    this.call.startRead();
  }
  halfClose(): void {
    this.call.halfClose();
  }
}

class BaseUnaryInterceptingCall extends BaseInterceptingCall implements InterceptingCallInterface {
  constructor(call: Call, methodDefinition: ClientMethodDefinition<any, any>) {
    super(call, methodDefinition);
  }
  start(metadata: Metadata, listener: InterceptingListener): void {
    super.start(metadata, listener);
    this.call.startRead();
  }
}

class BaseStreamingInterceptingCall extends BaseInterceptingCall implements InterceptingCallInterface { }

function getBottomInterceptingCall(channel: Channel, path: string, options: InterceptorOptions, methodDefinition: ClientMethodDefinition<any, any>) {
  const call = getCall(channel, path, options);
  if (methodDefinition.responseStream) {
    return new BaseStreamingInterceptingCall(call, methodDefinition);
  } else {
    return new BaseUnaryInterceptingCall(call, methodDefinition);
  }
}

export interface NextCall {
  (options: InterceptorOptions): InterceptingCallInterface;
}

export interface Interceptor {
  (options: InterceptorOptions, nextCall: NextCall): InterceptingCall
}

export interface InterceptorProvider {
  (methodDefinition: ClientMethodDefinition<any, any>): Interceptor;
}

export interface InterceptorArguments {
  clientInterceptors: Interceptor[],
  clientInterceptorProviders: InterceptorProvider[],
  callInterceptors: Interceptor[],
  callInterceptorProviders: InterceptorProvider[]
}

export function getInterceptingCall(interceptorArgs: InterceptorArguments, methodDefinition: ClientMethodDefinition<any, any>, options: CallOptions, channel: Channel): InterceptingCallInterface {
  if (interceptorArgs.clientInterceptors.length > 0 && interceptorArgs.clientInterceptorProviders.length > 0) {
    throw new InterceptorConfigurationError(
      'Both interceptors and interceptor_providers were passed as options ' +
      'to the client constructor. Only one of these is allowed.'
    );
  }
  if (interceptorArgs.callInterceptors.length > 0 && interceptorArgs.callInterceptorProviders.length > 0) {
    throw new InterceptorConfigurationError(
      'Both interceptors and interceptor_providers were passed as call ' +
      'options. Only one of these is allowed.'
    );
  }
  let interceptors: Interceptor[] = [];
  // Interceptors passed to the call override interceptors passed to the client constructor
  if (interceptorArgs.callInterceptors.length > 0 || interceptorArgs.callInterceptorProviders.length > 0) {
    interceptors = ([] as Interceptor[]).concat(
      interceptorArgs.callInterceptors,
      interceptorArgs.callInterceptorProviders.map(provider => provider(methodDefinition))
    ).filter(interceptor => interceptor);
    // Filter out falsy values when providers return nothing
  } else {
    interceptors = ([] as Interceptor[]).concat(
      interceptorArgs.clientInterceptors,
      interceptorArgs.clientInterceptorProviders.map(provider => provider(methodDefinition))
    ).filter(interceptor => interceptor);
    // Filter out falsy values when providers return nothing
  }
  const interceptorOptions = Object.assign({}, options, {method_definition: methodDefinition});
  /* For each interceptor in the list, the nextCall function passed to it is
   * based on the next interceptor in the list, using a nextCall function
   * constructed with the following interceptor in the list, and so on. The
   * initialValue, which is effectively at the end of the list, is a nextCall
   * function that invokes getBottomInterceptingCall, which handles
   * (de)serialization and also gets the underlying call from the channel */
  const getCall: NextCall = interceptors.reduceRight<NextCall>((previousValue: NextCall, currentValue: Interceptor) => {
    return currentOptions => currentValue(currentOptions, previousValue);
  }, (finalOptions: InterceptorOptions) => getBottomInterceptingCall(channel, methodDefinition.path, finalOptions, methodDefinition));
  return getCall(interceptorOptions);
}