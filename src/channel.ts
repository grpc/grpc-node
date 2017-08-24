import {EventEmitter} from 'events';
import {SecureContext} from 'tls';
import * as http2 from 'http2';
import {IncomingHttpHeaders, OutgoingHttpHeaders} from 'http';
import * as url from 'url';
import {CallOptions, CallStream} from './call-stream';
import {ChannelCredentials} from './channel-credentials';
import {Metadata, MetadataObject} from './metadata';
import {Status} from './constants'

import {FilterStackFactory} from './filter-stack'
import {DeadlineFilterFactory} from './deadline-filter'
import {CallCredentialsFilterFactory} from './call-credentials-filter'
import {Http2FilterFactory} from './http2-filter'

const IDLE_TIMEOUT_MS = 300000;

const {
  HTTP2_HEADER_AUTHORITY,
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
  createStream(methodName: string, metadata: OutgoingHttp2Headers, options: CallOptions): CallStream;
  connect(() => void): void;
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
  private subChannel : Http2Session | null;
  private address : url.Url;
  private filterStackFactory : FilterStackFactory;

  private transitionToState(newState: ConnectivityState): void {
    if (newState !== this.connectivityState) {
      this.connectivityState = newState;
      this.emit('connectivityStateChanged', newState);
    }
  }

  private startConnecting(): void {
    this.transitionToState(ConnectivityState.CONNECTING);
    this.subChannel = http2.connect(address, { secureContext: this.secureContext });
    this.subChannel.on('connect', () => {
      this.transitionToState(ConnectivityState.READY);
    });
    this.subChannel.setTimeout(IDLE_TIMEOUT_MS, () => {
      this.goIdle();
    });
  }

  private goIdle(): void {
    this.subChannel.shutdown({graceful: true});
    this.transitionToState(ConnectivityState.IDLE);
  }

  private kickConnectivityState(): void {
    if (this.connectivityState === ConnectivityState.IDLE) {
      this.startConnecting();
    }
  }

  constructor(private readonly address: url.Url,
              public readonly credentials: ChannelCredentials,
              private readonly options: ChannelOptions) {
    if (channelCredentials.getSecureContext() === null) {
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

  createStream(methodName: string, metadata: Metadata, options: CallOptions): CallStream {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    let stream: Http2CallStream = new Http2CallStream(methodName, options, this.filterStackFactory);
    let finalMetadata: Promise<Metadata> = stream.filterStack.sendMetadata(Promise.resolve(metadata));
    this.connect(() => {
      finalMetadata.then((metadataValue) => {
        let headers = metadataValue.toHttp2Headers();
        headers[HTTP2_HEADER_AUTHORITY] = this.address.hostname;
        headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
        headers[HTTP2_HEADER_METHOD] = 'POST';
        headers[HTTP2_HEADER_PATH] = methodName;
        headers[HTTP2_HEADER_TE] = 'trailers';
        if (stream.isOpen()) {
          stream.attachHttp2Stream(this.subchannel.request(headers));
        }
      }, (error) => {
        stream.cancelWithStatus(Status.UNKNOWN, "Failed to generate metadata");
      });
    });
    return stream;
  }

  connect(callback: () => void): void {
    this.kickConnectivityState();
    if (this.connectivityState === ConnectivityState.READY) {
      setImmediate(callback);
    } else {
      this.on('connectivityStateChanged', (newState) => {
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
    this.subChannel.shutdown({graceful: true});
  }
}
