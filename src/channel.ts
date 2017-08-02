import { CallStream } from './call-stream';
import { ChannelCredentials } from './channel-credentials';
import { Metadata } from './metadata';

/**
 * An interface that contains options used when initializing a Channel instance.
 */
export interface ChannelOptions {}

/**
 * A class that represents a communication channel to a server specified by a given address.
 */
export class Channel {
  constructor(address: string, credentials?: ChannelCredentials, options?: ChannelOptions) {
    throw new Error();
  }

  createStream(methodName: string, metadata: Metadata) : CallStream {
    throw new Error();
  }

  close() {
    throw new Error();
  }
}
