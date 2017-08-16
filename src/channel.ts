import {EventEmitter} from 'events';
import {SecureContext} from 'tls';
import * as http2 from 'http2';
import {IncomingHttpHeaders, OutgoingHttpHeaders} from 'http';
import * as url from 'url';
import {CallOptions, CallStream} from './call-stream';
import {ChannelCredentials} from './channel-credentials';
import {Metadata} from './metadata';

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
  connect(): void;
  getConnectivityState(): ConnectivityState;
  close(): void;

  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;

  addListener(event: 'connectivity_state_changed', listener: (state: ConnectivityState) => void): this;
  emit(event: 'connectivity_state_changed', state: ConnectivityState): boolean;
  on(event: 'connectivity_state_changed', listener: (state: ConnectivityState) => void): this;
  once(event: 'connectivity_state_changed', listener: (state: ConnectivityState) => void): this;
  prependListener(event: 'connectivity_state_changed', listener: (state: ConnectivityState) => void):
      this;
  prependOnceListener(
      event: 'connectivity_state_changed', listener: (state: ConnectivityState) => void): this;
  removeListener(event: 'connectivity_state_changed', listener: (state: ConnectivityState) => void):
      this;
}

export class Http2Channel extends EventEmitter implements Channel {
  private connectivityState: ConnectivityState = ConnectivityState.IDLE;
  private idleTimerId: NodeJS.Timer | null = null;
  /* For now, we have up to one subchannel, which will exist as long as we are
   * connecting or trying to connect */
  private subChannel : Http2Session | null;
  private secureContext : SecureContext | null;
  private address : url.Url;

  private transitionToState(newState: ConnectivityState): void {
    if (newState !== this.connectivityState) {
      this.connectivityState = newState;
      this.emit('connectivity_state_changed', newState);
    }
  }

  private startConnecting(): void {
    this.transitionToState(ConnectivityState.CONNECTING);
    this.subChannel = http2.connect(address, { secureContext: this.secureContext });
    this.subChannel.on('connect', () => {
      this.transitionToState(ConnectivityState.READY);
    });
  }

  private goIdle(): void {
    this.subChannel.shutdown({graceful: true});
    this.transitionToState(ConnectivityState.IDLE);
  }

  /* Reset the lastRpcActivity date to now, and kick the connectivity state
   * machine out of idle */
  private kickConnectivityState(): void {
    if (this.connectivityState === ConnectivityState.IDLE) {
      this.startConnecting();
    } else {
      clearTimeout(this.idleTimeoutId);
    }
    this.idleTimeoutId = setTimeout(() => {
      this.goIdle();
    }, IDLE_TIMEOUT_MS);
  }

  constructor(address: url.Url,
              credentials: ChannelCredentials,
              private readonly options: ChannelOptions) {
    this.secureContext = credentials.getSecureContext();
    if (this.secureContext === null) {
      address.protocol = 'http';
    } else {
      address.protocol = 'https';
    }
    this.address = address;
  }

  createStream(methodName: string, metadata: OutgoingHttpHeaders, options: CallOptions): CallStream {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    this.kickConnectivityState();
    let stream: Http2CallStream = new Http2CallStream();
    metadata[HTTP2_HEADER_AUTHORITY] = this.address.hostname;
    metadata[HTTP2_HEADER_METHOD] = 'POST';
    metadata[HTTP2_HEADER_PATH] = methodName;
    metadata[HTTP2_HEADER_TE] = 'trailers';
    if (this.connectivityState === ConnectivityState.READY) {
      stream.attachHttp2Stream(this.subchannel.request(metadata));
    } else {
      let connectCb = (state) => {
        if (state === ConnectivityState.READY) {
          stream.attachHttp2Stream(this.subchannel.request(metadata));
          this.removeListener('connectivity_state_changed', connectCb);
        }
      };
      this.on('connectivity_state_changed', connectCb);
    }
  }

  connect(): void {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    this.kickConnectivityState();
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
