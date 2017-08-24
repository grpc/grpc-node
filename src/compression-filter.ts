import {Filter, BaseFilter} from './filter'
import {Metadata} from './metadata'

export class CompressionFilter extends BaseFilter implements Filter {
  constructor() {}

  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    let headers: Metadata = await metadata;
    headers.set('grpc-encoding', 'identity');
    headers.set('grpc-accept-encoding', 'identity');
    return headers;
  }

  async receiveMetadata(metadata: Promise<Metadata>): Promise<Metadata {
    let headers: Metadata = await metadata;
    headers.remove('grpc-encoding');
    headers.remove('grpc-accept-encoding');
    return headers;
  }
}

export class CompressionFilterFactory<CompressionFilter> {
  constructor(channel) {}
  createFilter(callStream: CallStream): CompressionFilter {
    return new CompressionFilter();
  }
}
