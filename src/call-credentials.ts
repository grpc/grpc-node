import { Metadata } from './metadata';

export type CallMetadataGenerator = (
  options: Object,
  cb: (err: Error | null, metadata?: Metadata) => void
) => void

export interface CallCredentials {
  generateMetadata: CallMetadataGenerator;
  compose: (callCredentials: CallCredentials) => CallCredentials;
}

/**
 * A class that represents a generic method of adding authentication-related
 * metadata on a per-request basis.
 */
export class CallCredentialsImpl {
  metadataGenerators: Array<CallMetadataGenerator>;

  constructor(metadataGenerators: Array<CallMetadataGenerator>) {
    this.metadataGenerators = metadataGenerators;
  }

  /**
   * Creates a new CallCredentials object from a given function that generates
   * Metadata objects.
   * @param metadataGenerator A function that accepts a set of options, and
   * generates a Metadata object based on these options, which is passed back
   * to the caller via a supplied (err, metadata) callback.
   */
  static createFromMetadataGenerator(
    metadataGenerator: CallMetadataGenerator
  ): CallCredentials {
    return new CallCredentialsImpl([metadataGenerator]);
  }

  /**
   * Asynchronously generates a new Metadata object.
   * @param options Options used in generating the Metadata object.
   * @param cb A callback of the form (err, metadata) which will be called with
   * either the generated metadata, or an error if one occurred.
   */
  generateMetadata(
    options: Object,
    cb: (err: Error | null, metadata?: Metadata) => void
  ): void {
    this.metadataGenerators.reduce((prevCb, generator) => {
      return (_err: Error, _metadata?: Metadata) => {
        // TODO(kjin): Unsure whether we should fail fast or ignore errors
        // TODO(kjin): Metadata interface isn't defined yet
        generator(options, prevCb);
      };
    }, cb)(null);
  }

  /**
   * Creates a new CallCredentials object from properties of both this and
   * another CallCredentials object. This object's metadata generator will be
   * called first.
   * @param callCredentials The other CallCredentials object.
   */
  compose(callCredentials: CallCredentials): CallCredentials {
    if (!(callCredentials instanceof CallCredentialsImpl)) {
      throw new Error('Unknown CallCredentials implementation provided');
    }
    // Other object goes first, because generateMetadata iterates through
    // generators in reverse order
    return new CallCredentialsImpl((callCredentials as CallCredentialsImpl)
      .metadataGenerators.concat(this.metadataGenerators));
  }
}
