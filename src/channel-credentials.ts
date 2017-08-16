import { CallCredentials } from './call-credentials';
import { createSecureContext, SecureContext } from 'tls';

/**
 * A class that contains credentials for communicating over a channel, as well
 * as a set of per-call credentials, which are applied to every method call made
 * over a channel initialized with an instance of this class.
 */
export interface ChannelCredentials {
  /**
   * Returns a copy of this object with the included set of per-call credentials
   * expanded to include callCredentials.
   * @param callCredentials A CallCredentials object to associate with this
   * instance.
   */
  compose(callCredentials: CallCredentials) : ChannelCredentials;

  /**
   * Gets the set of per-call credentials associated with this instance.
   */
  getCallCredentials() : CallCredentials | null;
  
  /**
   * Gets a SecureContext object generated from input parameters if this
   * instance was created with createSsl, or null if this instance was created
   * with createInsecure.
   */
  getSecureContext() : SecureContext | null;
}

export namespace ChannelCredentials {
  /**
   * Return a new ChannelCredentials instance with a given set of credentials.
   * The resulting instance can be used to construct a Channel that communicates
   * over TLS.
   * @param rootCerts The root certificate data.
   * @param privateKey The client certificate private key, if available.
   * @param certChain The client certificate key chain, if available.
   */
  export function createSsl(rootCerts?: Buffer | null, privateKey?: Buffer | null, certChain?: Buffer | null) : ChannelCredentials {
    if (privateKey && !certChain) {
      throw new Error('Private key must be given with accompanying certificate chain');
    }
    if (!privateKey && certChain) {
      throw new Error('Certificate chain must be given with accompanying private key');
    }
    const secureContext = createSecureContext({
      ca: rootCerts || undefined,
      key: privateKey || undefined,
      cert: certChain || undefined
    });
    return new SecureChannelCredentialsImpl(secureContext);
  }

  /**
   * Return a new ChannelCredentials instance with no credentials.
   */
  export function createInsecure() : ChannelCredentials {
    return new InsecureChannelCredentialsImpl();
  }
}


abstract class ChannelCredentialsImpl implements ChannelCredentials {
  protected callCredentials: CallCredentials | null;

  protected constructor(callCredentials?: CallCredentials) {
    this.callCredentials = callCredentials || null;
  }

  abstract compose(callCredentials: CallCredentials) : ChannelCredentialsImpl;

  getCallCredentials() : CallCredentials | null {
    return this.callCredentials;
  }

  abstract getSecureContext() : SecureContext | null;
}

class InsecureChannelCredentialsImpl extends ChannelCredentialsImpl {
  constructor(callCredentials?: CallCredentials) {
    super(callCredentials);
  }

  compose(callCredentials: CallCredentials) : ChannelCredentialsImpl {
    const combinedCallCredentials = this.callCredentials ?
      this.callCredentials.compose(callCredentials) :
      callCredentials;
    return new InsecureChannelCredentialsImpl(combinedCallCredentials);
  }

  getSecureContext() : SecureContext | null {
    return null;
  }
}

class SecureChannelCredentialsImpl extends ChannelCredentialsImpl {
  secureContext: SecureContext;

  constructor(
    secureContext: SecureContext,
    callCredentials?: CallCredentials
  ) {
    super(callCredentials);
    this.secureContext = secureContext;
  }

  compose(callCredentials: CallCredentials) : ChannelCredentialsImpl {
    const combinedCallCredentials = this.callCredentials ?
      this.callCredentials.compose(callCredentials) :
      callCredentials;
    return new SecureChannelCredentialsImpl(this.secureContext,
      combinedCallCredentials);
  }

  getSecureContext() : SecureContext | null {
    return this.secureContext;
  }
}
