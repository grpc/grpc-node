import { CallCredentials } from './call-credentials';

/**
 * A class that contains credentials for communicating over a channel.
 */
export class ChannelCredentials {
  private constructor() {}

  static createSsl(rootCerts: Buffer, privateKey?: Buffer, certChain?: Buffer) : ChannelCredentials {
    throw new Error();
  }

  static createInsecure() : ChannelCredentials {
    throw new Error();
  }

  compose(callCredentials: CallCredentials) : ChannelCredentials {
    throw new Error();
  }
}
