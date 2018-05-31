import {flow, flowRight, map} from 'lodash';

import {CallStream, StatusObject, WriteObject} from './call-stream';
import {Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class FilterStack implements Filter {
  constructor(private readonly filters: Filter[]) {}

  sendMetadata(metadata: Promise<Metadata>) {
    return flow(map(
        this.filters, (filter) => filter.sendMetadata.bind(filter)))(metadata);
  }

  receiveMetadata(metadata: Promise<Metadata>) {
    return flowRight(
        map(this.filters, (filter) => filter.receiveMetadata.bind(filter)))(
        metadata);
  }

  sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    return flow(map(this.filters, (filter) => filter.sendMessage.bind(filter)))(
        message);
  }

  receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    return flowRight(map(
        this.filters, (filter) => filter.receiveMessage.bind(filter)))(message);
  }

  receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    return flowRight(map(
        this.filters, (filter) => filter.receiveTrailers.bind(filter)))(status);
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: Array<FilterFactory<Filter>>) {}

  createFilter(callStream: CallStream): FilterStack {
    return new FilterStack(
        map(this.factories, (factory) => factory.createFilter(callStream)));
  }
}
