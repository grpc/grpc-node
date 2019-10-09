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
} from './call';
import { CallCredentials } from './call-credentials';
import { Call, Deadline, StatusObject, WriteObject } from './call-stream';
import { Channel, ConnectivityState, ChannelImplementation } from './channel';
import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions } from './channel-options';
import { Status } from './constants';
import { Metadata } from './metadata';

const CHANNEL_SYMBOL = Symbol();

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
}

export type ClientOptions = Partial<ChannelOptions> & {
  channelOverride?: Channel;
  channelFactoryOverride?: (
    address: string,
    credentials: ChannelCredentials,
    options: ClientOptions
  ) => Channel;
};

/**
 * A generic gRPC client. Primarily useful as a base class for all generated
 * clients.
 */
export class Client {
  private readonly [CHANNEL_SYMBOL]: Channel;
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

  private handleUnaryResponse<ResponseType>(
    call: Call,
    deserialize: (value: Buffer) => ResponseType,
    callback: UnaryCallback<ResponseType>
  ): void {
    let responseMessage: ResponseType | null = null;
    call.on('data', (data: Buffer) => {
      if (responseMessage != null) {
        call.cancelWithStatus(Status.INTERNAL, 'Too many responses received');
      }
      try {
        responseMessage = deserialize(data);
      } catch (e) {
        call.cancelWithStatus(
          Status.INTERNAL,
          'Failed to parse server response'
        );
      }
    });
    call.on('status', (status: StatusObject) => {
      /* We assume that call emits status after it emits end, and that it
       * accounts for any cancelWithStatus calls up until it emits status.
       * Therefore, considering the above event handlers, status.code should be
       * OK if and only if we have a non-null responseMessage */
      if (status.code === Status.OK) {
        callback(null, responseMessage as ResponseType);
      } else {
        callback(callErrorFromStatus(status));
      }
    });
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
    const call: Call = this[CHANNEL_SYMBOL].createCall(
      method,
      options.deadline,
      options.host,
      null,
      options.propagate_flags
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    const message: Buffer = serialize(argument);
    const writeObj: WriteObject = { message };
    call.sendMetadata(metadata);
    call.write(writeObj);
    call.end();
    this.handleUnaryResponse<ResponseType>(call, deserialize, callback);
    return new ClientUnaryCallImpl(call);
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
    const call: Call = this[CHANNEL_SYMBOL].createCall(
      method,
      options.deadline,
      options.host,
      null,
      options.propagate_flags
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    call.sendMetadata(metadata);
    this.handleUnaryResponse<ResponseType>(call, deserialize, callback);
    return new ClientWritableStreamImpl<RequestType>(call, serialize);
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
    const call: Call = this[CHANNEL_SYMBOL].createCall(
      method,
      options.deadline,
      options.host,
      null,
      options.propagate_flags
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    const message: Buffer = serialize(argument);
    const writeObj: WriteObject = { message };
    call.sendMetadata(metadata);
    call.write(writeObj);
    call.end();
    return new ClientReadableStreamImpl<ResponseType>(call, deserialize);
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
    const call: Call = this[CHANNEL_SYMBOL].createCall(
      method,
      options.deadline,
      options.host,
      null,
      options.propagate_flags
    );
    if (options.credentials) {
      call.setCredentials(options.credentials);
    }
    call.sendMetadata(metadata);
    return new ClientDuplexStreamImpl<RequestType, ResponseType>(
      call,
      serialize,
      deserialize
    );
  }
}
