import {flow, flowRight, map} from 'lodash';
import {Metadata} from './metadata';
import {CallStream, StatusObject} from './call-stream'
import {Filter, FilterFactory} from './filter';

export class FilterStack implements Filter {
  constructor(private readonly filters: Filter[]) {}

  async sendMetadata(metadata: Promise<Metadata>) {
    return await flow(map(this.filters, (filter) => filter.sendMetadata.bind(filter)))(metadata);
  }

  async receiveMetadata(metadata: Promise<Metadata>) {
    return await flowRight(map(this.filters, (filter) => filter.receiveMetadata.bind(filter)))(metadata);
  }

  async receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    return await flowRight(map(this.filters, (filter) => filter.receiveTrailers.bind(filter)))(status);
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: FilterFactory<any>[]) {}

  createFilter(callStream: CallStream): FilterStack {
    return new FilterStack(map(this.factories, (factory) => factory.createFilter(callStream)));
  }
}
