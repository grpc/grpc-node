import {flow, map} from 'lodash';
import {Filter} from './filter'

export class FilterStack implements Filter {
  constructor(private readonly filters: Filter[]) {}

  async sendMetadata(metadata: Promise<Metadata>) {
    return await flow(map(filters, (filter) => filter.sendMetadata.bind(filter)))(metadata);
  }

  async receiveMetadata(metadata: Promise<Metadata>) {
    return await flowRight(map(filters, (filter) => filter.receiveMetadata.bind(filter)))(metadata);
  }

  async receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    return await flowRight(map(filters, (filter) => filter.receiveTrailers.bind(filter)))(status);
  }
}

export class FilterStackFactory implements FilterFactory<FilterStack> {
  constructor(private readonly factories: FilterFactory[]) {}

  createFilter(callStream: CallStream): FilterStack {
    return new FilterStack(map(factories, (factory) => factory.createFilter(callStream)));
  }
}
