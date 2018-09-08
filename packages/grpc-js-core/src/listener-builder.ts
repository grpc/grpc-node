import {Listener, MessageListener, MetadataListener, StatusListener} from './listener';

/**
 * A builder for listener interceptors.
 */
export class ListenerBuilder {
  private metadata: MetadataListener|null;
  private message: MessageListener|null;
  private status: StatusListener|null;

  constructor() {
    this.metadata = null;
    this.message = null;
    this.status = null;
  }

  /**
   * Adds an onReceiveMetadata method to the builder.
   */
  withOnReceiveMetadata(onReceiveMetadata: MetadataListener): this {
    this.metadata = onReceiveMetadata;
    return this;
  }

  /**
   * Adds an onReceiveMessage method to the builder.
   */
  withOnReceiveMessage(onReceiveMessage: MessageListener): this {
    this.message = onReceiveMessage;
    return this;
  }

  /**
   * Adds an onReceiveStatus method to the builder.
   */
  withOnReceiveStatus(onReceiveStatus: StatusListener): this {
    this.status = onReceiveStatus;
    return this;
  }

  /**
   * Builds the call listener.
   */
  build(): Listener {
    const listener: Listener = {};

    if (this.metadata !== null) {
      listener.onReceiveMetadata = this.metadata;
    }

    if (this.message !== null) {
      listener.onReceiveMessage = this.message;
    }

    if (this.status !== null) {
      listener.onReceiveStatus = this.status;
    }

    return listener;
  }
}
