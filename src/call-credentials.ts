import { Metadata } from './metadata'

export class CallCredentials {
  static createFromMetadataGenerator(metadataGenerator: (options: Object, cb: (err: Error, metadata: Metadata) => void) => void): CallCredentials {
    throw new Error();
  }

  call(options: Object, cb: (err: Error, metadata: Metadata) => void): void {
    throw new Error();
  }

  compose(callCredentials: CallCredentials): CallCredentials {
    throw new Error();
  }
}
