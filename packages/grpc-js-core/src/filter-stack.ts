import {Call, StatusObject, WriteObject} from './call-stream';
import {Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class FilterStack implements Filter {
  constructor(private readonly filters: Filter[]) {}

  sendMetadata(metadata: Promise<Metadata>) {
    let result: Promise<Metadata> = metadata;

    for (let i = 0; i < this.filters.length; i++) {
      result = this.filters[i].sendMetadata(result);
    }

    return result;
  }

  receiveMetadata(metadata: Promise<Metadata>) {
    let result: Promise<Metadata> = metadata;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      result = this.filters[i].receiveMetadata(result);
    }

    return result;
  }

  sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    let result: Promise<WriteObject> = message;

    for (let i = 0; i < this.filters.length; i++) {
      result = this.filters[i].sendMessage(result);
    }

    return result;
  }

  receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    let result: Promise<Buffer> = message;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      result = this.filters[i].receiveMessage(result);
    }

    return result;
  }

  receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    let result: Promise<StatusObject> = status;

    for (let i = this.filters.length - 1; i >= 0; i--) {
      result = this.filters[i].receiveTrailers(result);
    }

    return result;
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: Array<FilterFactory<Filter>>) {}

  createFilter(callStream: Call): FilterStack {
    return new FilterStack(
        this.factories.map((factory) => factory.createFilter(callStream)));
  }
}
