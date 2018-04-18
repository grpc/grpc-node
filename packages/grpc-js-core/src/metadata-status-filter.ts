import {CallStream} from './call-stream';
import {StatusObject} from './call-stream';
import {Channel} from './channel';
import {Status} from './constants';
import {BaseFilter, Filter, FilterFactory} from './filter';

export class MetadataStatusFilter extends BaseFilter implements Filter {
  async receiveTrailers(status: Promise<StatusObject>): Promise<StatusObject> {
    // tslint:disable-next-line:prefer-const
    let {code, details, metadata} = await status;
    if (code !== Status.UNKNOWN) {
      // we already have a known status, so don't assign a new one.
      return {code, details, metadata};
    }
    const metadataMap = metadata.getMap();
    if (typeof metadataMap['grpc-status'] === 'string') {
      const receivedCode = Number(metadataMap['grpc-status']);
      if (receivedCode in Status) {
        code = receivedCode;
      }
      metadata.remove('grpc-status');
    }
    if (typeof metadataMap['grpc-message'] === 'string') {
      details = decodeURI(metadataMap['grpc-message'] as string);
      metadata.remove('grpc-message');
    }
    return {code, details, metadata};
  }
}

export class MetadataStatusFilterFactory implements
    FilterFactory<MetadataStatusFilter> {
  constructor(private readonly channel: Channel) {}
  createFilter(callStream: CallStream): MetadataStatusFilter {
    return new MetadataStatusFilter();
  }
}
