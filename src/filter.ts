import {Metadata} from './metadata'
import {StatusObject, CallStream} from './call-stream'

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
