import {CallCredentials} from './call-credentials';
import {Call} from './call-stream';
import {Http2Channel} from './channel';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class CallCredentialsFilter extends BaseFilter implements Filter {
  private serviceUrl: string;
  constructor(
      private readonly channel: Http2Channel, private readonly stream: Call) {
    super();
    this.channel = channel;
    this.stream = stream;
    const splitPath: string[] = stream.getMethod().split('/');
    let serviceName = '';
    /* The standard path format is "/{serviceName}/{methodName}", so if we split
     * by '/', the first item should be empty and the second should be the
     * service name */
    if (splitPath.length >= 2) {
      serviceName = splitPath[1];
    }
    /* Currently, call credentials are only allowed on HTTPS connections, so we
     * can assume that the scheme is "https" */
    this.serviceUrl = `https://${stream.getHost()}/${serviceName}`;
  }

  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    const channelCredentials = this.channel.credentials._getCallCredentials();
    const streamCredentials = this.stream.getCredentials();
    const credentials = channelCredentials.compose(streamCredentials);
    const credsMetadata =
        credentials.generateMetadata({service_url: this.serviceUrl});
    const resultMetadata = await metadata;
    resultMetadata.merge(await credsMetadata);
    return resultMetadata;
  }
}

export class CallCredentialsFilterFactory implements
    FilterFactory<CallCredentialsFilter> {
  private readonly channel: Http2Channel;
  constructor(channel: Http2Channel) {
    this.channel = channel;
  }

  createFilter(callStream: Call): CallCredentialsFilter {
    return new CallCredentialsFilter(this.channel, callStream);
  }
}
