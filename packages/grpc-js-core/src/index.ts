
import { CallCredentials } from './call-credentials';
import { ChannelCredentials } from './channel-credentials';
import { Client } from './client';
import { Status} from './constants';
import { makeClientConstructor, loadPackageDefinition } from './make-client';
import { Metadata } from './metadata';
import { IncomingHttpHeaders } from 'http';

export interface OAuth2Client {
  getRequestMetadata: (url: string) => Promise<{ Authorization: string }>;
}

export type GoogleCallCredentials = CallCredentials<{ service_url: string }>;

/**** Client Credentials ****/

// Using assign only copies enumerable properties, which is what we want
export const credentials = Object.assign({
  /**
   * Create a gRPC credential from a Google credential object.
   * @param googleCredentials The authentication client to use.
   * @return The resulting CallCredentials object.
   */
  createFromGoogleCredential: (googleCredentials: OAuth2Client): GoogleCallCredentials => {
    return CallCredentials.createFromMetadataGenerator(async (options, callback) => {
      let header;
      try {
        header = await googleCredentials.getRequestMetadata(options.service_url);
      } catch (err) {
        callback(err);
        return;
      }
      const metadata = new Metadata();
      metadata.add('authorization', header.Authorization);
      callback(null, metadata);
    });
  },

  /**
   * Combine a ChannelCredentials with any number of CallCredentials into a
   * single ChannelCredentials object.
   * @param channelCredentials The ChannelCredentials object.
   * @param callCredentials Any number of CallCredentials objects.
   * @return The resulting ChannelCredentials object.
   */
  combineChannelCredentials: <S, T>(
      channelCredentials: ChannelCredentials<S>,
      ...callCredentials: CallCredentials<T>[]): ChannelCredentials<S&T> => {
    return callCredentials.reduce((acc, other) => acc.compose(other), channelCredentials);
  },

  /**
   * Combine any number of CallCredentials into a single CallCredentials object.
   * @param first The first CallCredentials object.
   * @param additional Any number of additional CallCredentials objects.
   * @return The resulting CallCredentials object.
   */
  combineCallCredentials: <S, T>(
      first: CallCredentials<S>,
      ...additional: CallCredentials<T>[]): CallCredentials<S&T> => {
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
