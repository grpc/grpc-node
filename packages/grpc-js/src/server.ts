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

import * as http2 from 'http2';
import { AddressInfo, ListenOptions } from 'net';
import { URL } from 'url';

import { ServiceError } from './call';
import { Status } from './constants';
import { Deserialize, Serialize, ServiceDefinition } from './make-client';
import { Metadata } from './metadata';
import {
  BidiStreamingHandler,
  ClientStreamingHandler,
  HandleCall,
  Handler,
  HandlerType,
  Http2ServerCallStream,
  sendUnaryData,
  ServerDuplexStream,
  ServerDuplexStreamImpl,
  ServerReadableStream,
  ServerReadableStreamImpl,
  ServerStreamingHandler,
  ServerUnaryCall,
  ServerUnaryCallImpl,
  ServerWritableStream,
  ServerWritableStreamImpl,
  UnaryHandler,
  ServerErrorResponse,
  ServerStatusResponse,
} from './server-call';
import { ServerCredentials } from './server-credentials';
import { ChannelOptions } from './channel-options';

function noop(): void {}

const unimplementedStatusResponse: Partial<ServiceError> = {
  code: Status.UNIMPLEMENTED,
  details: 'The server does not implement this method',
  metadata: new Metadata(),
};

// tslint:disable:no-any
type UntypedUnaryHandler = UnaryHandler<any, any>;
type UntypedClientStreamingHandler = ClientStreamingHandler<any, any>;
type UntypedServerStreamingHandler = ServerStreamingHandler<any, any>;
type UntypedBidiStreamingHandler = BidiStreamingHandler<any, any>;
export type UntypedHandleCall = HandleCall<any, any>;
type UntypedHandler = Handler<any, any>;
export interface UntypedServiceImplementation {
  [name: string]: UntypedHandleCall;
}

const defaultHandler = {
  unary(call: ServerUnaryCall<any, any>, callback: sendUnaryData<any>): void {
    callback(unimplementedStatusResponse as ServiceError, null);
  },
  clientStream(
    call: ServerReadableStream<any, any>,
    callback: sendUnaryData<any>
  ): void {
    callback(unimplementedStatusResponse as ServiceError, null);
  },
  serverStream(call: ServerWritableStream<any, any>): void {
    call.emit('error', unimplementedStatusResponse);
  },
  bidi(call: ServerDuplexStream<any, any>): void {
    call.emit('error', unimplementedStatusResponse);
  },
};
// tslint:enable:no-any

export class Server {
  private http2Server:
    | http2.Http2Server
    | http2.Http2SecureServer
    | null = null;
  private handlers: Map<string, UntypedHandler> = new Map<
    string,
    UntypedHandler
  >();
  private sessions = new Set<http2.ServerHttp2Session>();
  private started = false;
  private options: ChannelOptions;

  constructor(options?: ChannelOptions) {
    this.options = options ?? {};
  }

  addProtoService(): void {
    throw new Error('Not implemented. Use addService() instead');
  }

  addService(
    service: ServiceDefinition,
    implementation: UntypedServiceImplementation
  ): void {
    if (this.started === true) {
      throw new Error("Can't add a service to a started server.");
    }

    if (
      service === null ||
      typeof service !== 'object' ||
      implementation === null ||
      typeof implementation !== 'object'
    ) {
      throw new Error('addService() requires two objects as arguments');
    }

    const serviceKeys = Object.keys(service);

    if (serviceKeys.length === 0) {
      throw new Error('Cannot add an empty service to a server');
    }

    serviceKeys.forEach(name => {
      const attrs = service[name];
      let methodType: HandlerType;

      if (attrs.requestStream) {
        if (attrs.responseStream) {
          methodType = 'bidi';
        } else {
          methodType = 'clientStream';
        }
      } else {
        if (attrs.responseStream) {
          methodType = 'serverStream';
        } else {
          methodType = 'unary';
        }
      }

      let implFn = implementation[name];
      let impl;

      if (implFn === undefined && typeof attrs.originalName === 'string') {
        implFn = implementation[attrs.originalName];
      }

      if (implFn !== undefined) {
        impl = implFn.bind(implementation);
      } else {
        impl = defaultHandler[methodType];
      }

      const success = this.register(
        attrs.path,
        impl as UntypedHandleCall,
        attrs.responseSerialize,
        attrs.requestDeserialize,
        methodType
      );

      if (success === false) {
        throw new Error(`Method handler for ${attrs.path} already provided.`);
      }
    });
  }

  bind(port: string, creds: ServerCredentials): void {
    throw new Error('Not implemented. Use bindAsync() instead');
  }

  bindAsync(
    port: string,
    creds: ServerCredentials,
    callback: (error: Error | null, port: number) => void
  ): void {
    if (this.started === true) {
      throw new Error('server is already started');
    }

    if (typeof port !== 'string') {
      throw new TypeError('port must be a string');
    }

    if (creds === null || typeof creds !== 'object') {
      throw new TypeError('creds must be an object');
    }

    if (typeof callback !== 'function') {
      throw new TypeError('callback must be a function');
    }

    const url = new URL(`http://${port}`);
    const options: ListenOptions = { host: url.hostname, port: +url.port };
    const serverOptions: http2.ServerOptions = {};
    if ('grpc.max_concurrent_streams' in this.options) {
      serverOptions.settings = {maxConcurrentStreams: this.options['grpc.max_concurrent_streams']};
    }

    if (creds._isSecure()) {
      const secureServerOptions = Object.assign(serverOptions, creds._getSettings()!);
      this.http2Server = http2.createSecureServer(secureServerOptions);
    } else {
      this.http2Server = http2.createServer(serverOptions);
    }

    this.http2Server.setTimeout(0, noop);
    this._setupHandlers();

    function onError(err: Error): void {
      callback(err, -1);
    }

    this.http2Server.once('error', onError);

    this.http2Server.listen(options, () => {
      const server = this.http2Server as
        | http2.Http2Server
        | http2.Http2SecureServer;
      const port = (server.address() as AddressInfo).port;

      server.removeListener('error', onError);
      callback(null, port);
    });
  }

  forceShutdown(): void {
    // Close the server if it is still running.
    if (this.http2Server && this.http2Server.listening) {
      this.http2Server.close();
    }

    this.started = false;

    // Always destroy any available sessions. It's possible that one or more
    // tryShutdown() calls are in progress. Don't wait on them to finish.
    this.sessions.forEach(session => {
      // Cast NGHTTP2_CANCEL to any because TypeScript doesn't seem to
      // recognize destroy(code) as a valid signature.
      // tslint:disable-next-line:no-any
      session.destroy(http2.constants.NGHTTP2_CANCEL as any);
    });
    this.sessions.clear();
  }

  register<RequestType, ResponseType>(
    name: string,
    handler: HandleCall<RequestType, ResponseType>,
    serialize: Serialize<ResponseType>,
    deserialize: Deserialize<RequestType>,
    type: string
  ): boolean {
    if (this.handlers.has(name)) {
      return false;
    }

    this.handlers.set(name, {
      func: handler,
      serialize,
      deserialize,
      type,
    } as UntypedHandler);
    return true;
  }

  start(): void {
    if (this.http2Server === null || this.http2Server.listening !== true) {
      throw new Error('server must be bound in order to start');
    }

    if (this.started === true) {
      throw new Error('server is already started');
    }

    this.started = true;
  }

  tryShutdown(callback: (error?: Error) => void): void {
    let pendingChecks = 0;

    function maybeCallback(): void {
      pendingChecks--;

      if (pendingChecks === 0) {
        callback();
      }
    }

    // Close the server if necessary.
    this.started = false;

    if (this.http2Server && this.http2Server.listening) {
      pendingChecks++;
      this.http2Server.close(maybeCallback);
    }

    // If any sessions are active, close them gracefully.
    pendingChecks += this.sessions.size;
    this.sessions.forEach(session => {
      session.close(maybeCallback);
    });

    // If the server is closed and there are no active sessions, just call back.
    if (pendingChecks === 0) {
      callback();
    }
  }

  addHttp2Port(): void {
    throw new Error('Not yet implemented');
  }

  private _setupHandlers(): void {
    if (this.http2Server === null) {
      return;
    }

    this.http2Server.on(
      'stream',
      (stream: http2.ServerHttp2Stream, headers: http2.IncomingHttpHeaders) => {
        const contentType = headers[http2.constants.HTTP2_HEADER_CONTENT_TYPE];

        if (
          typeof contentType !== 'string' ||
          !contentType.startsWith('application/grpc')
        ) {
          stream.respond(
            {
              [http2.constants.HTTP2_HEADER_STATUS]:
                http2.constants.HTTP_STATUS_UNSUPPORTED_MEDIA_TYPE,
            },
            { endStream: true }
          );
          return;
        }

        try {
          const path = headers[http2.constants.HTTP2_HEADER_PATH] as string;
          const handler = this.handlers.get(path);

          if (handler === undefined) {
            throw unimplementedStatusResponse;
          }

          const call = new Http2ServerCallStream(stream, handler);
          const metadata: Metadata = call.receiveMetadata(headers) as Metadata;

          switch (handler.type) {
            case 'unary':
              handleUnary(call, handler as UntypedUnaryHandler, metadata);
              break;
            case 'clientStream':
              handleClientStreaming(
                call,
                handler as UntypedClientStreamingHandler,
                metadata
              );
              break;
            case 'serverStream':
              handleServerStreaming(
                call,
                handler as UntypedServerStreamingHandler,
                metadata
              );
              break;
            case 'bidi':
              handleBidiStreaming(
                call,
                handler as UntypedBidiStreamingHandler,
                metadata
              );
              break;
            default:
              throw new Error(`Unknown handler type: ${handler.type}`);
          }
        } catch (err) {
          const call = new Http2ServerCallStream(stream, null!);

          if (err.code === undefined) {
            err.code = Status.INTERNAL;
          }

          call.sendError(err);
        }
      }
    );

    this.http2Server.on('session', session => {
      if (!this.started) {
        session.destroy();
        return;
      }

      this.sessions.add(session);
    });
  }
}

async function handleUnary<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: UnaryHandler<RequestType, ResponseType>,
  metadata: Metadata
): Promise<void> {
  const emitter = new ServerUnaryCallImpl<RequestType, ResponseType>(
    call,
    metadata
  );
  const request = await call.receiveUnaryMessage();

  if (request === undefined || call.cancelled) {
    return;
  }

  emitter.request = request;
  handler.func(
    emitter,
    (
      err: ServerErrorResponse | ServerStatusResponse | null,
      value: ResponseType | null,
      trailer?: Metadata,
      flags?: number
    ) => {
      call.sendUnaryMessage(err, value, trailer, flags);
    }
  );
}

function handleClientStreaming<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: ClientStreamingHandler<RequestType, ResponseType>,
  metadata: Metadata
): void {
  const stream = new ServerReadableStreamImpl<RequestType, ResponseType>(
    call,
    metadata,
    handler.deserialize
  );

  function respond(
    err: ServerErrorResponse | ServerStatusResponse | null,
    value: ResponseType | null,
    trailer?: Metadata,
    flags?: number
  ) {
    stream.destroy();
    call.sendUnaryMessage(err, value, trailer, flags);
  }

  if (call.cancelled) {
    return;
  }

  stream.on('error', respond);
  handler.func(stream, respond);
}

async function handleServerStreaming<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: ServerStreamingHandler<RequestType, ResponseType>,
  metadata: Metadata
): Promise<void> {
  const request = await call.receiveUnaryMessage();

  if (request === undefined || call.cancelled) {
    return;
  }

  const stream = new ServerWritableStreamImpl<RequestType, ResponseType>(
    call,
    metadata,
    handler.serialize
  );

  stream.request = request;
  handler.func(stream);
}

function handleBidiStreaming<RequestType, ResponseType>(
  call: Http2ServerCallStream<RequestType, ResponseType>,
  handler: BidiStreamingHandler<RequestType, ResponseType>,
  metadata: Metadata
): void {
  const stream = new ServerDuplexStreamImpl<RequestType, ResponseType>(
    call,
    metadata,
    handler.serialize,
    handler.deserialize
  );

  if (call.cancelled) {
    return;
  }

  handler.func(stream);
}
