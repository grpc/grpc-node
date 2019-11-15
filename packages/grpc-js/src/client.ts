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

import {
  ClientDuplexStream,
  ClientDuplexStreamImpl,
  ClientReadableStream,
  ClientReadableStreamImpl,
  ClientUnaryCall,
  ClientUnaryCallImpl,
  ClientWritableStream,
  ClientWritableStreamImpl,
  ServiceError,
  callErrorFromStatus,
  SurfaceCall,
} from './call';
import { CallCredentials } from './call-credentials';
import {
  Deadline,
  StatusObject,
  WriteObject,
  InterceptingListener,
} from './call-stream';
import { Channel, ConnectivityState, ChannelImplementation } from './channel';
import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions } from './channel-options';
import { Status } from './constants';
import { Metadata } from './metadata';
import { ClientMethodDefinition } from './make-client';
import {
  getInterceptingCall,
  Interceptor,
  InterceptorProvider,
  InterceptorArguments,
  InterceptingCallInterface,
} from './client-interceptors';

const CHANNEL_SYMBOL = Symbol();
const INTERCEPTOR_SYMBOL = Symbol();
const INTERCEPTOR_PROVIDER_SYMBOL = Symbol();

export interface UnaryCallback<ResponseType> {
  (err: ServiceError | null, value?: ResponseType): void;
}

export interface CallOptions {
  deadline?: Deadline;
  host?: string;
  /* There should be a parent option here that will accept a server call,
   * but the server is not yet implemented so it makes no sense to have it */
  propagate_flags?: number;
  credentials?: CallCredentials;
  interceptors?: Interceptor[];
  interceptor_providers?: InterceptorProvider[];
}

export type ClientOptions = Partial<ChannelOptions> & {
  channelOverride?: Channel;
  channelFactoryOverride?: (
    address: string,
    credentials: ChannelCredentials,
    options: ClientOptions
  ) => Channel;
  interceptors?: Interceptor[];
  interceptor_providers?: InterceptorProvider[];
};

/**
 * A generic gRPC client. Primarily useful as a base class for all generated
 * clients.
 */
export class Client {
  private readonly [CHANNEL_SYMBOL]: Channel;
  private readonly [INTERCEPTOR_SYMBOL]: Interceptor[];
  private readonly [INTERCEPTOR_PROVIDER_SYMBOL]: InterceptorProvider[];
  constructor(
    address: string,
    credentials: ChannelCredentials,
    options: ClientOptions = {}
  ) {
    if (options.channelOverride) {
      this[CHANNEL_SYMBOL] = options.channelOverride;
    } else if (options.channelFactoryOverride) {
      this[CHANNEL_SYMBOL] = options.channelFactoryOverride(
        address,
        credentials,
        options
      );
    } else {
      this[CHANNEL_SYMBOL] = new ChannelImplementation(
        address,
        credentials,
        options
      );
    }
    this[INTERCEPTOR_SYMBOL] = options.interceptors ?? [];
    this[INTERCEPTOR_PROVIDER_SYMBOL] = options.interceptor_providers ?? [];
    if (
      this[INTERCEPTOR_SYMBOL].length > 0 &&
      this[INTERCEPTOR_PROVIDER_SYMBOL].length > 0
    ) {
      throw new Error(
        'Both interceptors and interceptor_providers were passed as options ' +
          'to the client constructor. Only one of these is allowed.'
      );
    }
  }

  close(): void {
    this[CHANNEL_SYMBOL].close();
  }

  getChannel(): Channel {
    return this[CHANNEL_SYMBOL];
  }

  waitForReady(deadline: Deadline, callback: (error?: Error) => void): void {
    const checkState = (err?: Error) => {
      if (err) {
        callback(new Error('Failed to connect before the deadline'));
        return;
      }
      let newState;
      try {
        newState = this[CHANNEL_SYMBOL].getConnectivityState(true);
      } catch (e) {
        callback(new Error('The channel has been closed'));
        return;
      }
      if (newState === ConnectivityState.READY) {
        callback();
      } else {
        try {
          this[CHANNEL_SYMBOL].watchConnectivityState(
            newState,
            deadline,
            checkState
          );
        } catch (e) {
          callback(new Error('The channel has been closed'));
        }
      }
    };
    setImmediate(checkState);
  }

  private checkOptionalUnaryResponseArguments<ResponseType>(
    arg1: Metadata | CallOptions | UnaryCallback<ResponseType>,
    arg2?: CallOptions | UnaryCallback<ResponseType>,
    arg3?: UnaryCallback<ResponseType>
  ): {
    metadata: Metadata;
    options: CallOptions;
    callback: UnaryCallback<ResponseType>;
  } {
    if (arg1 instanceof Function) {
      return { metadata: new Metadata(), options: {}, callback: arg1 };
    } else if (arg2 instanceof Function) {
      if (arg1 instanceof Metadata) {
        return { metadata: arg1, options: {}, callback: arg2 };
      } else {
        return { metadata: new Metadata(), options: arg1, callback: arg2 };
      }
    } else {
      if (
        !(
          arg1 instanceof Metadata &&
          arg2 instanceof Object &&
          arg3 instanceof Function
        )
      ) {
        throw new Error('Incorrect arguments passed');
      }
      return { metadata: arg1, options: arg2, callback: arg3 };
    }
  }

  makeUnaryRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    metadata: Metadata,
    options: CallOptions,
    callback: UnaryCallback<ResponseType>
  ): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    metadata: Metadata,
    callback: UnaryCallback<ResponseType>
  ): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    options: CallOptions,
    callback: UnaryCallback<ResponseType>
  ): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    callback: UnaryCallback<ResponseType>
  ): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    metadata: Metadata | CallOptions | UnaryCallback<ResponseType>,
    options?: CallOptions | UnaryCallback<ResponseType>,
    callback?: UnaryCallback<ResponseType>
  ): ClientUnaryCall {
    ({ metadata, options, callback } = this.checkOptionalUnaryResponseArguments<
      ResponseType
    >(metadata, options, callback));
    const methodDefinition: ClientMethodDefinition<
      RequestType,
      ResponseType
    > = {
      path: method,
      requestStream: false,
      responseStream: false,
      requestSerialize: serialize,
      responseDeserialize: deserialize,
    };
    const interceptorArgs: InterceptorArguments = {
      clientInterceptors: this[INTERCEPTOR_SYMBOL],
      clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
      callInterceptors: options.interceptors ?? [],
      callInterceptorProviders: options.interceptor_providers ?? [],
    };
    const call: InterceptingCallInterface = getInterceptingCall(
      interceptorArgs,
      methodDefinition,
      options,
      this[CHANNEL_SYMBOL]
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    const emitter = new ClientUnaryCallImpl(call);
    let responseMessage: ResponseType | null = null;
    let receivedStatus = false;
    call.start(metadata, {
      onReceiveMetadata: metadata => {
        emitter.emit('metadata', metadata);
      },
      // tslint:disable-next-line no-any
      onReceiveMessage(message: any) {
        if (responseMessage != null) {
          call.cancelWithStatus(Status.INTERNAL, 'Too many responses received');
        }
        responseMessage = message;
      },
      onReceiveStatus(status: StatusObject) {
        if (receivedStatus) {
          return;
        }
        receivedStatus = true;
        if (status.code === Status.OK) {
          callback!(null, responseMessage!);
        } else {
          callback!(callErrorFromStatus(status));
        }
        emitter.emit('status', status);
      },
    });
    call.sendMessage(argument);
    call.halfClose();
    return emitter;
  }

  makeClientStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    metadata: Metadata,
    options: CallOptions,
    callback: UnaryCallback<ResponseType>
  ): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    metadata: Metadata,
    callback: UnaryCallback<ResponseType>
  ): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    options: CallOptions,
    callback: UnaryCallback<ResponseType>
  ): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    callback: UnaryCallback<ResponseType>
  ): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    metadata: Metadata | CallOptions | UnaryCallback<ResponseType>,
    options?: CallOptions | UnaryCallback<ResponseType>,
    callback?: UnaryCallback<ResponseType>
  ): ClientWritableStream<RequestType> {
    ({ metadata, options, callback } = this.checkOptionalUnaryResponseArguments<
      ResponseType
    >(metadata, options, callback));
    const methodDefinition: ClientMethodDefinition<
      RequestType,
      ResponseType
    > = {
      path: method,
      requestStream: true,
      responseStream: false,
      requestSerialize: serialize,
      responseDeserialize: deserialize,
    };
    const interceptorArgs: InterceptorArguments = {
      clientInterceptors: this[INTERCEPTOR_SYMBOL],
      clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
      callInterceptors: options.interceptors ?? [],
      callInterceptorProviders: options.interceptor_providers ?? [],
    };
    const call: InterceptingCallInterface = getInterceptingCall(
      interceptorArgs,
      methodDefinition,
      options,
      this[CHANNEL_SYMBOL]
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    const emitter = new ClientWritableStreamImpl<RequestType>(call, serialize);
    let responseMessage: ResponseType | null = null;
    let receivedStatus = false;
    call.start(metadata, {
      onReceiveMetadata: metadata => {
        emitter.emit('metadata', metadata);
      },
      // tslint:disable-next-line no-any
      onReceiveMessage(message: any) {
        if (responseMessage != null) {
          call.cancelWithStatus(Status.INTERNAL, 'Too many responses received');
        }
        responseMessage = message;
      },
      onReceiveStatus(status: StatusObject) {
        if (receivedStatus) {
          return;
        }
        receivedStatus = true;
        if (status.code === Status.OK) {
          callback!(null, responseMessage!);
        } else {
          callback!(callErrorFromStatus(status));
        }
        emitter.emit('status', status);
      },
    });
    return emitter;
  }

  private checkMetadataAndOptions(
    arg1?: Metadata | CallOptions,
    arg2?: CallOptions
  ): { metadata: Metadata; options: CallOptions } {
    let metadata: Metadata;
    let options: CallOptions;
    if (arg1 instanceof Metadata) {
      metadata = arg1;
      if (arg2) {
        options = arg2;
      } else {
        options = {};
      }
    } else {
      if (arg1) {
        options = arg1;
      } else {
        options = {};
      }
      metadata = new Metadata();
    }
    return { metadata, options };
  }

  makeServerStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    metadata: Metadata,
    options?: CallOptions
  ): ClientReadableStream<ResponseType>;
  makeServerStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    options?: CallOptions
  ): ClientReadableStream<ResponseType>;
  makeServerStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    argument: RequestType,
    metadata?: Metadata | CallOptions,
    options?: CallOptions
  ): ClientReadableStream<ResponseType> {
    ({ metadata, options } = this.checkMetadataAndOptions(metadata, options));
    const methodDefinition: ClientMethodDefinition<
      RequestType,
      ResponseType
    > = {
      path: method,
      requestStream: false,
      responseStream: true,
      requestSerialize: serialize,
      responseDeserialize: deserialize,
    };
    const interceptorArgs: InterceptorArguments = {
      clientInterceptors: this[INTERCEPTOR_SYMBOL],
      clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
      callInterceptors: options.interceptors ?? [],
      callInterceptorProviders: options.interceptor_providers ?? [],
    };
    const call: InterceptingCallInterface = getInterceptingCall(
      interceptorArgs,
      methodDefinition,
      options,
      this[CHANNEL_SYMBOL]
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    const stream = new ClientReadableStreamImpl<ResponseType>(
      call,
      deserialize
    );
    let receivedStatus = false;
    call.start(metadata, {
      onReceiveMetadata(metadata: Metadata) {
        stream.emit('metadata', metadata);
      },
      // tslint:disable-next-line no-any
      onReceiveMessage(message: any) {
        if (stream.push(message)) {
          call.startRead();
        }
      },
      onReceiveStatus(status: StatusObject) {
        if (receivedStatus) {
          return;
        }
        receivedStatus = true;
        stream.push(null);
        if (status.code !== Status.OK) {
          stream.emit('error', callErrorFromStatus(status));
        }
        stream.emit('status', status);
      },
    });
    call.sendMessage(argument);
    call.halfClose();
    return stream;
  }

  makeBidiStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    metadata: Metadata,
    options?: CallOptions
  ): ClientDuplexStream<RequestType, ResponseType>;
  makeBidiStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    options?: CallOptions
  ): ClientDuplexStream<RequestType, ResponseType>;
  makeBidiStreamRequest<RequestType, ResponseType>(
    method: string,
    serialize: (value: RequestType) => Buffer,
    deserialize: (value: Buffer) => ResponseType,
    metadata?: Metadata | CallOptions,
    options?: CallOptions
  ): ClientDuplexStream<RequestType, ResponseType> {
    ({ metadata, options } = this.checkMetadataAndOptions(metadata, options));
    const methodDefinition: ClientMethodDefinition<
      RequestType,
      ResponseType
    > = {
      path: method,
      requestStream: true,
      responseStream: true,
      requestSerialize: serialize,
      responseDeserialize: deserialize,
    };
    const interceptorArgs: InterceptorArguments = {
      clientInterceptors: this[INTERCEPTOR_SYMBOL],
      clientInterceptorProviders: this[INTERCEPTOR_PROVIDER_SYMBOL],
      callInterceptors: options.interceptors ?? [],
      callInterceptorProviders: options.interceptor_providers ?? [],
    };
    const call: InterceptingCallInterface = getInterceptingCall(
      interceptorArgs,
      methodDefinition,
      options,
      this[CHANNEL_SYMBOL]
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    const stream = new ClientDuplexStreamImpl<RequestType, ResponseType>(
      call,
      serialize,
      deserialize
    );
    let receivedStatus = false;
    call.start(metadata, {
      onReceiveMetadata(metadata: Metadata) {
        stream.emit('metadata', metadata);
      },
      onReceiveMessage(message: Buffer) {
        if (stream.push(message)) {
          call.startRead();
        }
      },
      onReceiveStatus(status: StatusObject) {
        if (receivedStatus) {
          return;
        }
        receivedStatus = true;
        stream.push(null);
        if (status.code !== Status.OK) {
          stream.emit('error', callErrorFromStatus(status));
        }
        stream.emit('status', status);
      },
    });
    return stream;
  }
}
