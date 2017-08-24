import { Metadata } from './metadata';
import * as async from 'async';

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

    const tasks: Array<AsyncFunction<Metadata, Error>> =
      this.metadataGenerators.map(fn => fn.bind(null, options));
    const callback: AsyncResultArrayCallback<Metadata, Error> =
      (err, metadataArray) => {
        if (err || !metadataArray) {
          cb(err || new Error('Unknown error'));
          return;
        } else {
          const result: Metadata = new Metadata();
          metadataArray.forEach((metadata) => {
            if (metadata) {
              result.merge(metadata);
            }
          });
          cb(null, result);
        }
      };
    async.parallel(tasks, callback);
  }

  compose(callCredentials: CallCredentials): CallCredentials {
    if (!(callCredentials instanceof CallCredentialsImpl)) {
      throw new Error('Unknown CallCredentials implementation provided');
    }
    return new CallCredentialsImpl(this.metadataGenerators.concat(
      (callCredentials as CallCredentialsImpl).metadataGenerators));
  }
}
