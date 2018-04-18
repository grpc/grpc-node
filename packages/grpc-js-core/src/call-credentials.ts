import {map, reduce} from 'lodash';

import {Metadata} from './metadata';

export type CallMetadataOptions = {
  service_url: string;
};

export type CallMetadataGenerator =
    (options: CallMetadataOptions,
     cb: (err: Error|null, metadata?: Metadata) => void) => void;

/**
 * A class that represents a generic method of adding authentication-related
 * metadata on a per-request basis.
 */
export abstract class CallCredentials {
  /**
   * Asynchronously generates a new Metadata object.
   * @param options Options used in generating the Metadata object.
   */
  abstract generateMetadata(options: CallMetadataOptions): Promise<Metadata>;
  /**
   * Creates a new CallCredentials object from properties of both this and
   * another CallCredentials object. This object's metadata generator will be
   * called first.
   * @param callCredentials The other CallCredentials object.
   */
  abstract compose(callCredentials: CallCredentials): CallCredentials;

  /**
   * Creates a new CallCredentials object from a given function that generates
   * Metadata objects.
   * @param metadataGenerator A function that accepts a set of options, and
   * generates a Metadata object based on these options, which is passed back
   * to the caller via a supplied (err, metadata) callback.
   */
  static createFromMetadataGenerator(metadataGenerator: CallMetadataGenerator):
      CallCredentials {
    return new SingleCallCredentials(metadataGenerator);
  }

  static createEmpty(): CallCredentials {
    return new EmptyCallCredentials();
  }
}

class ComposedCallCredentials extends CallCredentials {
  constructor(private creds: CallCredentials[]) {
    super();
  }

  async generateMetadata(options: CallMetadataOptions): Promise<Metadata> {
    const base: Metadata = new Metadata();
    const generated: Metadata[] = await Promise.all(
        map(this.creds, (cred) => cred.generateMetadata(options)));
    for (const gen of generated) {
      base.merge(gen);
    }
    return base;
  }

  compose(other: CallCredentials): CallCredentials {
    return new ComposedCallCredentials(this.creds.concat([other]));
  }
}

class SingleCallCredentials extends CallCredentials {
  constructor(private metadataGenerator: CallMetadataGenerator) {
    super();
  }

  generateMetadata(options: CallMetadataOptions): Promise<Metadata> {
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

  compose(other: CallCredentials): CallCredentials {
    return new ComposedCallCredentials([this, other]);
  }
}

class EmptyCallCredentials extends CallCredentials {
  generateMetadata(options: CallMetadataOptions): Promise<Metadata> {
    return Promise.resolve(new Metadata());
  }

  compose(other: CallCredentials): CallCredentials {
    return other;
  }
}
