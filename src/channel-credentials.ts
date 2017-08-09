import { CallCredentials } from './call-credentials';
import { SecureContext } from 'tls';

export interface IChannelCredentials {
  compose(callCredentials: CallCredentials) : ChannelCredentials;
  getCallCredentials() : CallCredentials;
  getSecureContext() : SecureContext;
}

/**
 * A class that contains credentials for communicating over a channel, as well
 * as a set of per-call credentials, which are applied to every method call made
 * over a channel initialized with an instance of this class.
 */
export class ChannelCredentials implements IChannelCredentials {
  protected constructor() {}

  /**
   * Return a new ChannelCredentials instance with a given set of credentials.
   * The resulting instance can be used to construct a Channel that communicates
   * over TLS.
   * @param rootCerts The root certificate data.
   * @param privateKey The client certificate private key, if available.
   * @param certChain The client certificate key chain, if available.
   */
  static createSsl(rootCerts?: Buffer | null, privateKey?: Buffer | null, certChain?: Buffer | null) : ChannelCredentials {
    throw new Error();
  }

  /**
   * Return a new ChannelCredentials instance with no credentials.
   */
  static createInsecure() : ChannelCredentials {
    return new ChannelCredentials();
  }

  /**
   * Returns a copy of this object with the included set of per-call credentials
   * expanded to include callCredentials.
   * @param callCredentials A CallCredentials object to associate with this
   * instance.
   */
  compose(callCredentials: CallCredentials) : ChannelCredentials {
    throw new Error();
  }

  /**
   * Gets the set of per-call credentials associated with this instance.
   */
  getCallCredentials() : CallCredentials {
    throw new Error();
  }

  /**
   * Gets a SecureContext object generated from input parameters if this
   * instance was created with createSsl, or null if this instance was created
   * with createInsecure.
   */
  getSecureContext() : SecureContext {
    throw new Error();
  }
}
