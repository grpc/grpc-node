import {Metadata} from './metadata'
import {WriteObject, CallStream} from './call-stream'

export interface Filter {
  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata>;

  async receiveMetadata(metadata: Promise<Metadata>): Promise<Metadata>;

  async receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject>;
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
