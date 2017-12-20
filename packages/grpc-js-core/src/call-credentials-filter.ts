import {promisify} from 'util';

import {CallCredentials} from './call-credentials';
import {CallStream} from './call-stream';
import {Http2Channel} from './channel';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class CallCredentialsFilter extends BaseFilter implements Filter {
  constructor(private readonly credentials: CallCredentials) {
    super();
  }

  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    // TODO(murgatroid99): pass real options to generateMetadata
    let credsMetadata = this.credentials.generateMetadata({});
    let resultMetadata = await metadata;
    resultMetadata.merge(await credsMetadata);
    return resultMetadata;
  }
}

export class CallCredentialsFilterFactory implements
    FilterFactory<CallCredentialsFilter> {
  private readonly credentials: CallCredentials;
  constructor(channel: Http2Channel) {
    this.credentials = channel.credentials.getCallCredentials();
  }

  createFilter(callStream: CallStream): CallCredentialsFilter {
    return new CallCredentialsFilter(
        this.credentials.compose(callStream.getCredentials()));
  }
}
