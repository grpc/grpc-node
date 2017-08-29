import {CallStream, StatusObject} from './call-stream';
import {Metadata} from './metadata';

/**
 * Filter classes represent related per-call logic and state that is primarily
 * used to modify incoming and outgoing data
 */
export interface Filter {
  sendMetadata(metadata: Promise<Metadata>): Promise<Metadata>;

  receiveMetadata(metadata: Promise<Metadata>): Promise<Metadata>;

  receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject>;
}

export abstract class BaseFilter {
  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    return await metadata;
  }

  async receiveMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    return await metadata;
  }

  async receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    return await status;
  }
}

export interface FilterFactory<T extends Filter> {
  createFilter(callStream: CallStream): T;
}
