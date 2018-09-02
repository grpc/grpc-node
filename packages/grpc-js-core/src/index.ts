
import {IncomingHttpHeaders} from 'http';

import {CallCredentials} from './call-credentials';
import {ChannelCredentials} from './channel-credentials';
import {Client} from './client';
import {LogVerbosity, Status} from './constants';
import {loadPackageDefinition, makeClientConstructor} from './make-client';
import {Metadata} from './metadata';
import { Channel } from './channel';
import {StatusBuilder} from './status-builder';
import * as logging from './logging';

interface IndexedObject {
  [key: string]: any;
  [key: number]: any;
}

function mixin(...sources: IndexedObject[]) {
  const result: {[key: string]: Function} = {};
  for (const source of sources) {
    for (const propName of Object.getOwnPropertyNames(source)) {
      const property: any = source[propName];
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
      createFromGoogleCredential: (googleCredentials: OAuth2Client):
          CallCredentials => {
            return CallCredentials.createFromMetadataGenerator(
                (options, callback) => {
                  googleCredentials.getRequestMetadata(
                      options.service_url, (err, headers) => {
                        if (err) {
                          callback(err);
                          return;
                        }
                        const metadata = new Metadata();
                        metadata.add('authorization', headers!.Authorization);
                        callback(null, metadata);
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
  Status as status
  // TODO: Other constants as well
};

/**** Client ****/

export {
  Client,
  loadPackageDefinition,
  makeClientConstructor,
  makeClientConstructor as makeGenericClientConstructor,
  Channel
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

export const ServerCredentials = {
  createSsl:
      (rootCerts: any, keyCertPairs: any, checkClientCertificate: any) => {
        throw new Error('Not yet implemented');
      },
  createInsecure: () => {
    throw new Error('Not yet implemented');
  }
};

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
