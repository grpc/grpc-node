
import { CallCredentials } from './call-credentials';
import { ChannelCredentials } from './channel-credentials';
import { Client } from './client';
import { Status} from './constants';
import { makeClientConstructor, loadPackageDefinition } from './make-client';
import { Metadata } from './metadata';
import { IncomingHttpHeaders } from 'http';

export interface OAuth2Client {
  getRequestMetadata: (url: string, callback: (err: Error|null, headers?: { Authorization: string }) => void) => void;
}

/**** Client Credentials ****/

// Using assign only copies enumerable properties, which is what we want
export const credentials = Object.assign({
  /**
   * Create a gRPC credential from a Google credential object.
   * @param googleCredentials The authentication client to use.
   * @return The resulting CallCredentials object.
   */
  createFromGoogleCredential: (googleCredentials: OAuth2Client): CallCredentials => {
    return CallCredentials.createFromMetadataGenerator((options, callback) => {
      googleCredentials.getRequestMetadata(options.service_url, (err, headers) => {
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
  combineChannelCredentials: (
      channelCredentials: ChannelCredentials,
      ...callCredentials: CallCredentials[]): ChannelCredentials => {
    return callCredentials.reduce((acc, other) => acc.compose(other), channelCredentials);
  },

  /**
   * Combine any number of CallCredentials into a single CallCredentials object.
   * @param first The first CallCredentials object.
   * @param additional Any number of additional CallCredentials objects.
   * @return The resulting CallCredentials object.
   */
  combineCallCredentials: (
      first: CallCredentials,
      ...additional: CallCredentials[]): CallCredentials => {
    return additional.reduce((acc, other) => acc.compose(other), first);
  }
}, ChannelCredentials, CallCredentials);

/**** Metadata ****/

export { Metadata };

/**** Constants ****/

export {
  Status as status
  // TODO: Other constants as well
};

/**** Client ****/

export {
  Client,
  loadPackageDefinition,
  makeClientConstructor,
  makeClientConstructor as makeGenericClientConstructor
};

/**
 * Close a Client object.
 * @param client The client to close.
 */
export const closeClient = (client: Client) => client.close();

export const waitForClientReady = (client: Client, deadline: Date|number, callback: (error: Error | null) => void) => client.waitForReady(deadline, callback);

/**** Unimplemented function stubs ****/

export const loadObject = (value: any, options: any) => {
  throw new Error('Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead');
}

export const load = (filename: any, format: any, options: any) => {
  throw new Error('Not available in this library. Use @grpc/proto-loader and loadPackageDefinition instead');
}

export const setLogger = (logger: any) => {
  throw new Error('Not yet implemented');
}

export const setLogVerbosity = (verbosity: any) => {
  throw new Error('Not yet implemented');
}

export const Server = (options: any) => {
  throw new Error('Not yet implemented');
}

export const ServerCredentials = {
  createSsl: (rootCerts: any, keyCertPairs: any, checkClientCertificate: any) => {
    throw new Error('Not yet implemented');
  },
  createInsecure: () => {
    throw new Error('Not yet implemented');
  }
}

export const getClientChannel = (client: any) => {
  throw new Error('Not available in this library');
}

export const StatusBuilder = () => { throw new Error('Not yet implemented'); }

export const ListenerBuilder = () => { throw new Error('Not yet implemented'); }

export const InterceptorBuilder = () => { throw new Error('Not yet implemented'); }

export const InterceptingCall = () => { throw new Error('Not yet implemented'); }
