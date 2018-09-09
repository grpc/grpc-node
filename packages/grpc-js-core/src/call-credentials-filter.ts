import {CallCredentials} from './call-credentials';
import {Call} from './call-stream';
import {Http2Channel} from './channel';
import {BaseFilter, Filter, FilterFactory} from './filter';
import {Metadata} from './metadata';

export class CallCredentialsFilter extends BaseFilter implements Filter {
  private serviceUrl: string;
  constructor(
      private readonly credentials: CallCredentials,
      private readonly host: string, private readonly path: string) {
    super();
    const splitPath: string[] = path.split('/');
    let serviceName = '';
    /* The standard path format is "/{serviceName}/{methodName}", so if we split
     * by '/', the first item should be empty and the second should be the
     * service name */
    if (splitPath.length >= 2) {
      serviceName = splitPath[1];
    }
    /* Currently, call credentials are only allowed on HTTPS connections, so we
     * can assume that the scheme is "https" */
    this.serviceUrl = `https://${host}/${serviceName}`;
  }

  async sendMetadata(metadata: Metadata): Promise<Metadata> {
    const credsMetadata =
        this.credentials.generateMetadata({service_url: this.serviceUrl});
    metadata.merge(await credsMetadata);
    return metadata;
  }
}

export class CallCredentialsFilterFactory implements
    FilterFactory<CallCredentialsFilter> {
  private readonly credentials: CallCredentials;
  constructor(channel: Http2Channel) {
    this.credentials = channel.credentials._getCallCredentials();
  }

  createFilter(callStream: Call): CallCredentialsFilter {
    return new CallCredentialsFilter(
        this.credentials.compose(callStream.getCredentials()),
        callStream.getHost(), callStream.getMethod());
  }
}
