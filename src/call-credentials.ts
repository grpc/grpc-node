import { Metadata } from './metadata';

export type CallMetadataGenerator = (
  options: Object,
  cb: (err: Error | null, metadata?: Metadata) => void
) => void

export interface ICallCredentials {
  generateMetadata: CallMetadataGenerator;
  compose: (callCredentials: ICallCredentials) => ICallCredentials;
}

/**
 * A class that represents a generic method of adding authentication-related
 * metadata on a per-request basis.
 */
export abstract class CallCredentials {
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
    throw new Error();
  }

  /**
   * Asynchronously generates a new Metadata object.
   * @param options Options used in generating the Metadata object.
   * @param cb A callback of the form (err, metadata) which will be called with
   * either the generated metadata, or an error if one occurred.
   */
  abstract generateMetadata(
    options: Object,
    cb: (err: Error | null, metadata?: Metadata) => void
  ): void;

  /**
   * Creates a new CallCredentials object from properties of both this and
   * another CallCredentials object.
   * @param callCredentials The other CallCredentials object.
   */
  abstract compose(callCredentials: CallCredentials): CallCredentials;
}
