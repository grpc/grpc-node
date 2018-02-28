
import { CallCredentials } from './call-credentials';
import { ChannelCredentials } from './channel-credentials';
import { Client } from './client';
import { Status} from './constants';
import { makeClientConstructor, loadPackageDefinition } from './make-client';
import { Metadata } from './metadata';

const notImplementedFn = () => { throw new Error('Not implemented'); };

// Metadata
export { Metadata };

// Client credentials

export const credentials = {
  createSsl: ChannelCredentials.createSsl,
  createFromMetadataGenerator: CallCredentials.createFromMetadataGenerator,
  createFromGoogleCredential: notImplementedFn /*TODO*/,
  combineChannelCredentials: (first: ChannelCredentials, ...additional: CallCredentials[]) => additional.reduce((acc, other) => acc.compose(other), first),
  combineCallCredentials: (first: CallCredentials, ...additional: CallCredentials[]) => additional.reduce((acc, other) => acc.compose(other), first),
  createInsecure: ChannelCredentials.createInsecure
};

// Constants

export {
  Status as status
  // TODO: Other constants as well
};

// Client

export {
  Client,
  loadPackageDefinition,
  makeClientConstructor,
  makeClientConstructor as makeGenericClientConstructor
};
export const closeClient = (client: Client) => client.close();
