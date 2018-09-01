import {StatusObject} from './call-stream';
import {Status} from './constants';
import {Metadata} from './metadata';

/**
 * A builder for gRPC status objects.
 */
export class StatusBuilder {
  private code: Status|null;
  private details: string|null;
  private metadata: Metadata|null;

  constructor() {
    this.code = null;
    this.details = null;
    this.metadata = null;
  }

  /**
   * Adds a status code to the builder.
   */
  withCode(code: Status): this {
    this.code = code;
    return this;
  }

  /**
   * Adds details to the builder.
   */
  withDetails(details: string): this {
    this.details = details;
    return this;
  }

  /**
   * Adds metadata to the builder.
   */
  withMetadata(metadata: Metadata): this {
    this.metadata = metadata;
    return this;
  }

  /**
   * Builds the status object.
   */
  build(): Partial<StatusObject> {
    const status: Partial<StatusObject> = {};

    if (this.code !== null) {
      status.code = this.code;
    }

    if (this.details !== null) {
      status.details = this.details;
    }

    if (this.metadata !== null) {
      status.metadata = this.metadata;
    }

    return status;
  }
}
