import { Metadata } from './metadata';

export type CallMetadataGenerator = (
  options: Object,
  cb: (err: Error | null, metadata?: Metadata) => void
) => void

/**
 * A class that represents a generic method of adding authentication-related
 * metadata on a per-request basis.
 */
export interface CallCredentials {
  /**
   * Asynchronously generates a new Metadata object.
   * @param options Options used in generating the Metadata object.
   * @param cb A callback of the form (err, metadata) which will be called with
   * either the generated metadata, or an error if one occurred.
   */
  generateMetadata: CallMetadataGenerator;
  /**
   * Creates a new CallCredentials object from properties of both this and
   * another CallCredentials object. This object's metadata generator will be
   * called first.
   * @param callCredentials The other CallCredentials object.
   */
  compose: (callCredentials: CallCredentials) => CallCredentials;
}

export namespace CallCredentials {
  /**
   * Creates a new CallCredentials object from a given function that generates
   * Metadata objects.
   * @param metadataGenerator A function that accepts a set of options, and
   * generates a Metadata object based on these options, which is passed back
   * to the caller via a supplied (err, metadata) callback.
   */
  export function createFromMetadataGenerator(
    metadataGenerator: CallMetadataGenerator
  ): CallCredentials {
    return new CallCredentialsImpl([metadataGenerator]);
  }
}


class CallCredentialsImpl {
  constructor(private metadataGenerators: Array<CallMetadataGenerator>) {}

  generateMetadata(
    options: Object,
    cb: (err: Error | null, metadata?: Metadata) => void
  ): void {
    if (this.metadataGenerators.length === 1) {
      this.metadataGenerators[0](options, cb);
      return;
    }

    // getMetadata accepts a new Metadata object, runs each metadata generator
    // in metadataGenerators in reverse order, eventually either calling cb
    // with the first occurring error or the resulting merged Metadata object
    const getMetadata = this.metadataGenerators.reduce(
      (next: (metadata: Metadata) => void, generator) => {
        return (accMetadata: Metadata) => {
          // Run the metadata generator function
          generator(options, (err, metadata?) => {
            // Immediately bail and call cb(err) if there is an error
            if (err || !metadata) {
              cb(err);
              return;
            }
            // Merge metadata with current accumulator value
            const metadataObj = metadata.getMap();
            Object.keys(metadataObj).forEach((key) => {
              metadata.get(key).forEach((value) => {
                accMetadata.add(key, value);
              });
            });
            // Run the next 
            next(accMetadata);
          });
        };
      },
      (accMetadata: Metadata) => cb(null, accMetadata)
    );
    getMetadata(Metadata.createMetadata());
  }

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
