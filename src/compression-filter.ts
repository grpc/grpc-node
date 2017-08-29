import {CallStream} from './call-stream';
import {Channel} from './channel';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class CompressionFilter extends BaseFilter implements Filter {
  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    const headers: Metadata = await metadata;
    headers.set('grpc-encoding', 'identity');
    headers.set('grpc-accept-encoding', 'identity');
    return headers;
  }

  async receiveMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    const headers: Metadata = await metadata;
    headers.remove('grpc-encoding');
    headers.remove('grpc-accept-encoding');
    return headers;
  }
}

export class CompressionFilterFactory implements
    FilterFactory<CompressionFilter> {
  constructor(private readonly channel: Channel) {}
  createFilter(callStream: CallStream): CompressionFilter {
    return new CompressionFilter();
  }
}
