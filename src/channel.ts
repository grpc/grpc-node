import {CallOptions, CallStream} from './call-stream';
import {ChannelCredentials} from './channel-credentials';
import {Metadata} from './metadata';

/**
 * An interface that contains options used when initializing a Channel instance.
 */
export interface ChannelOptions { [index: string]: string|number; }

export class SubChannel {}

// todo: maybe we want an interface for load balancing, but no implementation
// for anything complicated

/**
 * A class that represents a communication channel to a server specified by a
 * given address.
 */
export class Channel {
  constructor(
      address: string, credentials?: ChannelCredentials,
      options?: ChannelOptions) {
    throw new Error();
  }

  createStream(methodName: string, metadata: Metadata, options: CallOptions):
      CallStream {
    throw new Error();
  }

  close() {
    throw new Error();
  }
}
