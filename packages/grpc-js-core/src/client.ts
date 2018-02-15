import {once} from 'lodash';
import {URL} from 'url';

import {ClientDuplexStream, ClientDuplexStreamImpl, ClientReadableStream, ClientReadableStreamImpl, ClientUnaryCall, ClientUnaryCallImpl, ClientWritableStream, ClientWritableStreamImpl, ServiceError} from './call';
import {CallOptions, CallStream, StatusObject, WriteObject} from './call-stream';
import {Channel, ChannelOptions, Http2Channel} from './channel';
import {ChannelCredentials} from './channel-credentials';
import {Status} from './constants';
import {Metadata} from './metadata';

export interface UnaryCallback<ResponseType> {
  (err: ServiceError|null, value?: ResponseType): void;
}

export class Client {
  private readonly channel: Channel;
  constructor(
      address: string, credentials: ChannelCredentials,
      options: Partial<ChannelOptions> = {}) {
    this.channel = new Http2Channel(address, credentials, options);
  }

  close(): void {
    this.channel.close();
  }

  waitForReady(deadline: Date|number, callback: (error: Error|null) => void):
      void {
    let cb: (error: Error|null) => void = once(callback);
    let callbackCalled = false;
    let timer: NodeJS.Timer | null = null;
    this.channel.connect().then(() => {
      if (timer) {
        clearTimeout(timer);
      }
      cb(null);
    });
    if (deadline !== Infinity) {
      let timeout: number;
      let now: number = (new Date).getTime();
      if (deadline instanceof Date) {
        timeout = deadline.getTime() - now;
      } else {
        timeout = deadline - now;
      }
      if (timeout < 0) {
        timeout = 0;
      }
      timer = setTimeout(() => {
        cb(new Error('Failed to connect before the deadline'));
      }, timeout);
    }
  }

  private handleUnaryResponse<ResponseType>(
      call: CallStream, deserialize: (value: Buffer) => ResponseType,
      callback: UnaryCallback<ResponseType>): void {
    let responseMessage: ResponseType|null = null;
    call.on('data', (data: Buffer) => {
      if (responseMessage != null) {
        call.cancelWithStatus(Status.INTERNAL, 'Too many responses received');
      }
      try {
        responseMessage = deserialize(data);
      } catch (e) {
        call.cancelWithStatus(
            Status.INTERNAL, 'Failed to parse server response');
      }
    });
    call.on('end', () => {
      if (responseMessage == null) {
        call.cancelWithStatus(Status.INTERNAL, 'Not enough responses received');
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
        const error: ServiceError = Object.assign(new Error(status.details), status);
        callback(error);
      }
    });
  }

  private checkOptionalUnaryResponseArguments<ResponseType>(
      arg1: Metadata|CallOptions|UnaryCallback<ResponseType>,
      arg2?: CallOptions|UnaryCallback<ResponseType>,
      arg3?: UnaryCallback<ResponseType>): {
    metadata: Metadata,
    options: CallOptions,
    callback: UnaryCallback<ResponseType>
  } {
    if (arg1 instanceof Function) {
      return {metadata: new Metadata(), options: {}, callback: arg1};
    } else if (arg2 instanceof Function) {
      if (arg1 instanceof Metadata) {
        return {metadata: arg1, options: {}, callback: arg2};
      } else {
        return {metadata: new Metadata(), options: arg1, callback: arg2};
      }
    } else {
      if (!((arg1 instanceof Metadata) && (arg2 instanceof Object) &&
            (arg3 instanceof Function))) {
        throw new Error('Incorrect arguments passed');
      }
      return {metadata: arg1, options: arg2, callback: arg3};
    }
  }

  makeUnaryRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      metadata: Metadata, options: CallOptions,
      callback: UnaryCallback<ResponseType>): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      metadata: Metadata,
      callback: UnaryCallback<ResponseType>): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      options: CallOptions,
      callback: UnaryCallback<ResponseType>): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      callback: UnaryCallback<ResponseType>): ClientUnaryCall;
  makeUnaryRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      metadata: Metadata|CallOptions|UnaryCallback<ResponseType>,
      options?: CallOptions|UnaryCallback<ResponseType>,
      callback?: UnaryCallback<ResponseType>): ClientUnaryCall {
    ({metadata, options, callback} =
         this.checkOptionalUnaryResponseArguments<ResponseType>(
             metadata, options, callback));
    const call: CallStream =
        this.channel.createStream(method, metadata, options);
    const message: Buffer = serialize(argument);
    const writeObj: WriteObject = {message: message};
    writeObj.flags = options.flags;
    call.write(writeObj);
    call.end();
    this.handleUnaryResponse<ResponseType>(call, deserialize, callback);
    return new ClientUnaryCallImpl(call);
  }

  makeClientStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, metadata: Metadata,
      options: CallOptions,
      callback: UnaryCallback<ResponseType>): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, metadata: Metadata,
      callback: UnaryCallback<ResponseType>): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, options: CallOptions,
      callback: UnaryCallback<ResponseType>): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType,
      callback: UnaryCallback<ResponseType>): ClientWritableStream<RequestType>;
  makeClientStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType,
      metadata: Metadata|CallOptions|UnaryCallback<ResponseType>,
      options?: CallOptions|UnaryCallback<ResponseType>,
      callback?: UnaryCallback<ResponseType>):
      ClientWritableStream<RequestType> {
    ({metadata, options, callback} =
         this.checkOptionalUnaryResponseArguments<ResponseType>(
             metadata, options, callback));
    const call: CallStream =
        this.channel.createStream(method, metadata, options);
    this.handleUnaryResponse<ResponseType>(call, deserialize, callback);
    return new ClientWritableStreamImpl<RequestType>(call, serialize);
  }

  private checkMetadataAndOptions(
      arg1?: Metadata|CallOptions,
      arg2?: CallOptions): {metadata: Metadata, options: CallOptions} {
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
    return {metadata, options};
  }

  makeServerStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      metadata: Metadata,
      options?: CallOptions): ClientReadableStream<ResponseType>;
  makeServerStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      options?: CallOptions): ClientReadableStream<ResponseType>;
  makeServerStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, argument: RequestType,
      metadata?: Metadata|CallOptions,
      options?: CallOptions): ClientReadableStream<ResponseType> {
    ({metadata, options} = this.checkMetadataAndOptions(metadata, options));
    const call: CallStream =
        this.channel.createStream(method, metadata, options);
    const message: Buffer = serialize(argument);
    const writeObj: WriteObject = {message: message};
    writeObj.flags = options.flags;
    call.write(writeObj);
    call.end();
    return new ClientReadableStreamImpl<ResponseType>(call, deserialize);
  }

  makeBidiStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType, metadata: Metadata,
      options?: CallOptions): ClientDuplexStream<RequestType, ResponseType>;
  makeBidiStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType,
      options?: CallOptions): ClientDuplexStream<RequestType, ResponseType>;
  makeBidiStreamRequest<RequestType, ResponseType>(
      method: string, serialize: (value: RequestType) => Buffer,
      deserialize: (value: Buffer) => ResponseType,
      metadata?: Metadata|CallOptions,
      options?: CallOptions): ClientDuplexStream<RequestType, ResponseType> {
    ({metadata, options} = this.checkMetadataAndOptions(metadata, options));
    const call: CallStream =
        this.channel.createStream(method, metadata, options);
    return new ClientDuplexStreamImpl<RequestType, ResponseType>(
        call, serialize, deserialize);
  }
}
