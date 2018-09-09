import {flow, flowRight, map} from 'lodash';

import {Call, StatusObject, WriteObject} from './call-stream';
import {Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class FilterStack implements Filter {
  constructor(private readonly filters: Filter[]) {}

  sendMetadata(metadata: Metadata) {
    return flow(map(
        this.filters, (filter) => filter.sendMetadata.bind(filter)))(metadata);
  }

  receiveMetadata(metadata: Metadata) {
    return flowRight(
        map(this.filters, (filter) => filter.receiveMetadata.bind(filter)))(
        metadata);
  }

  sendMessage(message: WriteObject): Promise<WriteObject> {
    return flow(map(this.filters, (filter) => filter.sendMessage.bind(filter)))(
        message);
  }

  receiveMessage(message: Buffer): Promise<Buffer> {
    return flowRight(map(
        this.filters, (filter) => filter.receiveMessage.bind(filter)))(message);
  }

  receiveTrailers(status: StatusObject): Promise<StatusObject> {
    return flowRight(map(
        this.filters, (filter) => filter.receiveTrailers.bind(filter)))(status);
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: Array<FilterFactory<Filter>>) {}

  createFilter(callStream: Call): FilterStack {
    return new FilterStack(
        map(this.factories, (factory) => factory.createFilter(callStream)));
  }
}
