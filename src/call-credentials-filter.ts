import {promisify} from 'util'
import {Filter} from './filter'
import {CallCredentials} from './call-credentials'

export class CallCredentialsFilter extends BaseFilter implements Filter {

  private credsMetadata: Promise<Metadata>;

  constructor(credentials: CallCredentials) {
    // TODO(murgatroid99): pass real options to generateMetadata
    credsMetadata = util.promisify(credentials.generateMetadata.bind(credentials))({});
  }

  async sendMetadata(metadata: Promise<Metadata>) {
    return (await metadata).merge(await this.credsMetadata);
  }
}

export class CallCredentialsFilterFactory implements FilterFactory<CallCredentialsFilter> {
  private credentials: CallCredentials | null;
  constructor(channel: Http2Channel) {
    this.credentials = channel.credentials.getCallCredentials();
  }

  createFilter(callStream: CallStream): CallCredentialsFilter {
    return new CallCredentialsFilter(this.credentials.compose(callStream.credentials));
  }
}
