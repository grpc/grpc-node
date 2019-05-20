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

import * as semver from 'semver';

import {ClientDuplexStream, ClientReadableStream, ClientUnaryCall, ClientWritableStream, ServiceError} from './call';
import {CallCredentials} from './call-credentials';
import {Deadline, StatusObject} from './call-stream';
import {Channel, ConnectivityState, Http2Channel} from './channel';
import {ChannelCredentials} from './channel-credentials';
import {CallOptions, Client} from './client';
import {LogVerbosity, Status} from './constants';
import * as logging from './logging';
import {Deserialize, loadPackageDefinition, makeClientConstructor, Serialize} from './make-client';
import {Metadata} from './metadata';
import {KeyCertPair, ServerCredentials} from './server-credentials';
import {StatusBuilder} from './status-builder';

const supportedNodeVersions = '^8.13.0 || >=10.10.0';
if (!semver.satisfies(process.version, supportedNodeVersions)) {
  throw new Error(`@grpc/grpc-js only works on Node ${supportedNodeVersions}`);
}

interface IndexedObject {
  [key: string]: any;  // tslint:disable-line no-any
  [key: number]: any;  // tslint:disable-line no-any
}

function mixin(...sources: IndexedObject[]) {
  const result: {[key: string]: Function} = {};
  for (const source of sources) {
    for (const propName of Object.getOwnPropertyNames(source)) {
      const property: any = source[propName];  // tslint:disable-line no-any
      if (typeof property === 'function') {
        result[propName] = property;
      }
    }
  }
  return result;
}

export interface OAuth2Client {
  getRequestMetadata: (url: string, callback: (err: Error|null, headers?: {
                                      Authorization: string
                                    }) => void) => void;
  getRequestHeaders: (url?: string) => Promise<{Authorization: string}>;
}

/**** Client Credentials ****/

// Using assign only copies enumerable properties, which is what we want
export const credentials = mixin(
    {
      /**
       * Create a gRPC credential from a Google credential object.
       * @param googleCredentials The authentication client to use.
       * @return The resulting CallCredentials object.
       */
      createFromGoogleCredential: (
          googleCredentials: OAuth2Client): CallCredentials => {
        return CallCredentials.createFromMetadataGenerator(
            (options, callback) => {
              // google-auth-library pre-v2.0.0 does not have getRequestHeaders
              // but has getRequestMetadata, which is deprecated in v2.0.0
              let getHeaders: Promise<{Authorization: string}>;
              if (typeof googleCredentials.getRequestHeaders === 'function') {
                getHeaders =
                    googleCredentials.getRequestHeaders(options.service_url);
              } else {
                getHeaders = new Promise((resolve, reject) => {
                  googleCredentials.getRequestMetadata(
                      options.service_url, (err, headers) => {
                        if (err) {
                          reject(err);
                          return;
                        }
                        resolve(headers);
                      });
                });
              }
              getHeaders.then(
                  headers => {
                    const metadata = new Metadata();
                    metadata.add('authorization', headers.Authorization);
                    callback(null, metadata);
                  },
                  err => {
                    callback(err);
                  });
            });
      },

      /**
       * Combine a ChannelCredentials with any number of CallCredentials into a
       * single ChannelCredentials object.
       * @param channelCredentials The ChannelCredentials object.
       * @param callCredentials Any number of CallCredentials objects.
       * @return The resulting ChannelCredentials object.
       */
      combineChannelCredentials:
          (channelCredentials: ChannelCredentials,
           ...callCredentials: CallCredentials[]): ChannelCredentials => {
            return callCredentials.reduce(
                (acc, other) => acc.compose(other), channelCredentials);
          },

      /**
       * Combine any number of CallCredentials into a single CallCredentials
       * object.
       * @param first The first CallCredentials object.
       * @param additional Any number of additional CallCredentials objects.
       * @return The resulting CallCredentials object.
       */
      combineCallCredentials: (
          first: CallCredentials, ...additional: CallCredentials[]):
          CallCredentials => {
            return additional.reduce((acc, other) => acc.compose(other), first);
          }
    },
    ChannelCredentials, CallCredentials);

/**** Metadata ****/

export {Metadata};

/**** Constants ****/

export {
  LogVerbosity as logVerbosity,
  Status as status,
  ConnectivityState as connectivityState
  // TODO: Other constants as well
};

/**** Client ****/

export {
  Client,
  loadPackageDefinition,
  makeClientConstructor,
  makeClientConstructor as makeGenericClientConstructor,
  Http2Channel as Channel
};

/**
 * Close a Client object.
 * @param client The client to close.
 */
export const closeClient = (client: Client) => client.close();

export const waitForClientReady =
    (client: Client, deadline: Date|number,
     callback: (error?: Error) => void) =>
        client.waitForReady(deadline, callback);

/* Interfaces */

export {
  ChannelCredentials,
  CallCredentials,
  Deadline,
  Serialize as serialize,
  Deserialize as deserialize,
  ClientUnaryCall,
  ClientReadableStream,
  ClientWritableStream,
  ClientDuplexStream,
  CallOptions,
  StatusObject,
  ServiceError
};

/* tslint:disable:no-any */
export type Call = ClientUnaryCall|ClientReadableStream<any>|
    ClientWritableStream<any>|ClientDuplexStream<any, any>;
/* tslint:enable:no-any */

export type MetadataListener = (metadata: Metadata, next: Function) => void;

// tslint:disable-next-line:no-any
export type MessageListener = (message: any, next: Function) => void;

export type StatusListener = (status: StatusObject, next: Function) => void;

export interface Listener {
  onReceiveMetadata?: MetadataListener;
  onReceiveMessage?: MessageListener;
  onReceiveStatus?: StatusListener;
}

/**** Unimplemented function stubs ****/

/* tslint:disable:no-any variable-name */

export const loadObject = (value: any, options: any) => {
  throw new Error(
      'Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead');
};

export const load = (filename: any, format: any, options: any) => {
  throw new Error(
      'Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead');
};

export const setLogger = (logger: Partial<Console>): void => {
  logging.setLogger(logger);
};

export const setLogVerbosity = (verbosity: LogVerbosity): void => {
  logging.setLoggerVerbosity(verbosity);
};

export const Server = (options: any) => {
  throw new Error('Not yet implemented');
};

export {ServerCredentials};
export {KeyCertPair};


export const getClientChannel = (client: Client) => {
  return Client.prototype.getChannel.call(client);
};

export {StatusBuilder};

export const ListenerBuilder = () => {
  throw new Error('Not yet implemented');
};

export const InterceptorBuilder = () => {
  throw new Error('Not yet implemented');
};

export const InterceptingCall = () => {
  throw new Error('Not yet implemented');
};

export {GrpcObject} from './make-client';

const packageJson = require('../../package.json');
export const version =
    `${packageJson.name.replace(/.*\//, '')}/${packageJson.version}`;
