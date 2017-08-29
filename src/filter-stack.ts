import {flow, flowRight, map} from 'lodash';

import {CallStream, StatusObject} from './call-stream';
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

  receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    return flowRight(map(
        this.filters, (filter) => filter.receiveTrailers.bind(filter)))(status);
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: FilterFactory<any>[]) {}

  createFilter(callStream: CallStream): FilterStack {
    return new FilterStack(
        map(this.factories, (factory) => factory.createFilter(callStream)));
  }
}
