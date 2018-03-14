import {map, reduce} from 'lodash';

import {Metadata} from './metadata';

export type CallMetadataGenerator<T extends {} = {}> =
    (options: T, cb: (err: Error|null, metadata?: Metadata) => void) =>
        void;

/**
 * A class that represents a generic method of adding authentication-related
 * metadata on a per-request basis.
 */
export interface CallCredentials<T extends {} = {}> {
  /**
   * Asynchronously generates a new Metadata object.
   * @param options Options used in generating the Metadata object.
   */
  generateMetadata(options: T): Promise<Metadata>;
  /**
   * Creates a new CallCredentials object from properties of both this and
   * another CallCredentials object. This object's metadata generator will be
   * called first.
   * @param callCredentials The other CallCredentials object.
   */
  compose<S>(callCredentials: CallCredentials<S>): CallCredentials<S&T>;
}

class ComposedCallCredentials<T> implements CallCredentials<T> {
  constructor(private creds: CallCredentials<T>[]) {}

  async generateMetadata(options: T): Promise<Metadata> {
    let base: Metadata = new Metadata();
    let generated: Metadata[] = await Promise.all(
        map(this.creds, (cred) => cred.generateMetadata(options)));
    for (let gen of generated) {
      base.merge(gen);
    }
    return base;
  }

  compose<S>(other: CallCredentials<S>): CallCredentials<S&T> {
    return new ComposedCallCredentials<S&T>([...this.creds, other]);
  }
}

class SingleCallCredentials<T> implements CallCredentials<T> {
  constructor(private metadataGenerator: CallMetadataGenerator<T>) {}

  generateMetadata(options: T): Promise<Metadata> {
    return new Promise<Metadata>((resolve, reject) => {
      this.metadataGenerator(options, (err, metadata) => {
        if (metadata !== undefined) {
          resolve(metadata);
        } else {
          reject(err);
        }
      });
    });
  }

  compose<S>(other: CallCredentials<S>): CallCredentials<S&T> {
    return new ComposedCallCredentials<S&T>([this, other]);
  }
}

class EmptyCallCredentials implements CallCredentials<{}> {
  generateMetadata(options: {}): Promise<Metadata> {
    return Promise.resolve(new Metadata());
  }

  compose<S>(other: CallCredentials<S>): CallCredentials<S> {
    return other;
  }
}

export namespace CallCredentials {
  /**
   * Creates a new CallCredentials object from a given function that generates
   * Metadata objects.
   * @param metadataGenerator A function that accepts a set of options, and
   * generates a Metadata object based on these options, which is passed back
   * to the caller via a supplied (err, metadata) callback.
   */
  export function createFromMetadataGenerator<T>(
      metadataGenerator: CallMetadataGenerator<T>): CallCredentials<T> {
    return new SingleCallCredentials(metadataGenerator);
  }

  export function createEmpty(): CallCredentials<{}> {
    return new EmptyCallCredentials();
  }
}
