import { Metadata } from './metadata'

export interface ICallCredentials {
  call: (options: Object, cb: (err: Error, metadata: Metadata) => void) => void;
  compose: (callCredentials: CallCredentials) => CallCredentials;
}

export abstract class CallCredentials {
  static createFromMetadataGenerator(metadataGenerator: (options: Object, cb: (err: Error, metadata: Metadata) => void) => void): CallCredentials {
    throw new Error();
  }

  abstract call(options: Object, cb: (err: Error, metadata: Metadata) => void): void;

  abstract compose(callCredentials: CallCredentials): CallCredentials;
}
