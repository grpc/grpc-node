import {EventEmitter} from 'events';
import {SecureContext} from 'tls';
import * as http2 from 'http2';
import * as url from 'url';
import {CallOptions, CallStreamOptions, CallStream, Http2CallStream} from './call-stream';
import {CallCredentials} from './call-credentials';
import {ChannelCredentials} from './channel-credentials';
import {Metadata, MetadataObject} from './metadata';
import {Status} from './constants'

import {FilterStackFactory} from './filter-stack'
import {DeadlineFilterFactory} from './deadline-filter'
import {CallCredentialsFilterFactory} from './call-credentials-filter'
import {CompressionFilterFactory} from './compression-filter'

const IDLE_TIMEOUT_MS = 300000;

const {
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_SCHEME,
  HTTP2_HEADER_TE
} = http2.constants;

/**
 * An interface that contains options used when initializing a Channel instance.
 */
export interface ChannelOptions { [index: string]: string|number; }

export enum ConnectivityState {
  CONNECTING,
  READY,
  TRANSIENT_FAILURE,
  IDLE,
  SHUTDOWN
}

// todo: maybe we want an interface for load balancing, but no implementation
// for anything complicated

/**
 * An interface that represents a communication channel to a server specified
 * by a given address.
 */
export interface Channel extends EventEmitter {
  createStream(methodName: string, metadata: Metadata, options: CallOptions): CallStream;
  connect(callback: () => void): void;
  getConnectivityState(): ConnectivityState;
  close(): void;

  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;
}

export class Http2Channel extends EventEmitter implements Channel {
  private connectivityState: ConnectivityState = ConnectivityState.IDLE;
  private idleTimerId: NodeJS.Timer | null = null;
  /* For now, we have up to one subchannel, which will exist as long as we are
   * connecting or trying to connect */
  private subChannel : http2.ClientHttp2Session | null;
  private filterStackFactory : FilterStackFactory;

  private transitionToState(newState: ConnectivityState): void {
    if (newState !== this.connectivityState) {
      this.connectivityState = newState;
      this.emit('connectivityStateChanged', newState);
    }
  }

  private startConnecting(): void {
    this.transitionToState(ConnectivityState.CONNECTING);
    let secureContext = this.credentials.getSecureContext();
    if (secureContext === null) {
      this.subChannel = http2.connect(this.address);
    } else {
      this.subChannel = http2.connect(this.address, {secureContext});
    }
    this.subChannel.once('connect', () => {
      this.transitionToState(ConnectivityState.READY);
    });
    this.subChannel.setTimeout(IDLE_TIMEOUT_MS, () => {
      this.goIdle();
    });
    /* TODO(murgatroid99): add connection-level error handling with exponential
     * reconnection backoff */
  }

  private goIdle(): void {
    if (this.subChannel !== null) {
      this.subChannel.shutdown({graceful: true}, () => {});
      this.subChannel = null;
    }
    this.transitionToState(ConnectivityState.IDLE);
  }

  private kickConnectivityState(): void {
    if (this.connectivityState === ConnectivityState.IDLE) {
      this.startConnecting();
    }
  }

  constructor(private readonly address: url.URL,
              public readonly credentials: ChannelCredentials,
              private readonly options: ChannelOptions) {
    super();
    if (credentials.getSecureContext() === null) {
      address.protocol = 'http';
    } else {
      address.protocol = 'https';
    }
    this.filterStackFactory = new FilterStackFactory([
      new CompressionFilterFactory(this),
      new CallCredentialsFilterFactory(this),
      new DeadlineFilterFactory(this)
    ]);
  }

  private startHttp2Stream(methodName: string, stream: Http2CallStream, metadata: Metadata) {
    let finalMetadata: Promise<Metadata> = stream.filterStack.sendMetadata(Promise.resolve(metadata));
    this.connect(() => {
      finalMetadata.then((metadataValue) => {
        let headers = metadataValue.toHttp2Headers();
        headers[HTTP2_HEADER_AUTHORITY] = this.address.hostname;
        headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
        headers[HTTP2_HEADER_METHOD] = 'POST';
        headers[HTTP2_HEADER_PATH] = methodName;
        headers[HTTP2_HEADER_TE] = 'trailers';
        if (stream.getStatus() === null) {
          if (this.connectivityState === ConnectivityState.READY) {
            let session: http2.ClientHttp2Session =
              (this.subChannel as http2.ClientHttp2Session);
            stream.attachHttp2Stream(session.request(headers));
          } else {
            /* In this case, we lost the connection while finalizing metadata.
             * That should be very unusual */
            setImmediate(() => {
              this.startHttp2Stream(methodName, stream, metadata);
            });
          }
        }
      }, (error) => {
        stream.cancelWithStatus(Status.UNKNOWN, "Failed to generate metadata");
      });
    });
  }

  createStream(methodName: string, metadata: Metadata, options: CallOptions): CallStream {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    let finalOptions: CallStreamOptions = {
      deadline: options.deadline === undefined ? Infinity : options.deadline,
      credentials: options.credentials || CallCredentials.createEmpty(),
      flags: options.flags || 0
    }
    let stream: Http2CallStream = new Http2CallStream(methodName, finalOptions, this.filterStackFactory);
    this.startHttp2Stream(methodName, stream, metadata);
    return stream;
  }

  connect(callback: () => void): void {
    this.kickConnectivityState();
    if (this.connectivityState === ConnectivityState.READY) {
      setImmediate(callback);
    } else {
      this.once('connectivityStateChanged', (newState) => {
        if (newState === ConnectivityState.READY) {
          callback();
        }
      });
    }
  }

  getConnectivityState(): ConnectivityState{
    return this.connectivityState;
  }

  close() {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    this.transitionToState(ConnectivityState.SHUTDOWN);
    if (this.subChannel !== null) {
      this.subChannel.shutdown({graceful: true});
    }
  }
}
