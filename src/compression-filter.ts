import {CallStream} from './call-stream'
import {Channel} from './channel'
import {Filter, BaseFilter, FilterFactory} from './filter'
import {Metadata} from './metadata'

export class CompressionFilter extends BaseFilter implements Filter {
  constructor() {
    super();
  }

  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    let headers: Metadata = await metadata;
    headers.set('grpc-encoding', 'identity');
    headers.set('grpc-accept-encoding', 'identity');
    return headers;
  }

  async receiveMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    let headers: Metadata = await metadata;
    headers.remove('grpc-encoding');
    headers.remove('grpc-accept-encoding');
    return headers;
  }
}

export class CompressionFilterFactory implements FilterFactory<CompressionFilter> {
  constructor(channel: Channel) {}
  createFilter(callStream: CallStream): CompressionFilter {
    return new CompressionFilter();
  }
}
