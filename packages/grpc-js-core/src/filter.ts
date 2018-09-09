import {Call, StatusObject, WriteObject} from './call-stream';
import {Metadata} from './metadata';

/**
 * Filter classes represent related per-call logic and state that is primarily
 * used to modify incoming and outgoing data
 */
export interface Filter {
  sendMetadata(metadata: Metadata): Promise<Metadata>;

  receiveMetadata(metadata: Metadata): Promise<Metadata>;

  sendMessage(message: WriteObject): Promise<WriteObject>;

  receiveMessage(message: Buffer): Promise<Buffer>;

  receiveTrailers(status: StatusObject): Promise<StatusObject>;
}

export abstract class BaseFilter {
  async sendMetadata(metadata: Metadata): Promise<Metadata> {
    return metadata;
  }

  async receiveMetadata(metadata: Metadata): Promise<Metadata> {
    return metadata;
  }

  async sendMessage(message: WriteObject): Promise<WriteObject> {
    return message;
  }

  async receiveMessage(message: Buffer): Promise<Buffer> {
    return message;
  }

  async receiveTrailers(status: StatusObject): Promise<StatusObject> {
    return status;
  }
}

export interface FilterFactory<T extends Filter> {
  createFilter(callStream: Call): T;
}
