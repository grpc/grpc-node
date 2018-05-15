import {EventEmitter} from 'events';
import * as http2 from 'http2';
import {checkServerIdentity, PeerCertificate, SecureContext} from 'tls';
import * as url from 'url';

import {CallCredentials} from './call-credentials';
import {CallCredentialsFilterFactory} from './call-credentials-filter';
import {CallOptions, CallStream, CallStreamOptions, Http2CallStream} from './call-stream';
import {ChannelCredentials} from './channel-credentials';
import {CompressionFilterFactory} from './compression-filter';
import {Status} from './constants';
import {DeadlineFilterFactory} from './deadline-filter';
import {FilterStackFactory} from './filter-stack';
import {Metadata, MetadataObject} from './metadata';
import {MetadataStatusFilterFactory} from './metadata-status-filter';

const {version: clientVersion} = require('../../package');

const IDLE_TIMEOUT_MS = 300000;

const MIN_CONNECT_TIMEOUT_MS = 20000;
const INITIAL_BACKOFF_MS = 1000;
const BACKOFF_MULTIPLIER = 1.6;
const MAX_BACKOFF_MS = 120000;
const BACKOFF_JITTER = 0.2;

const {
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_SCHEME,
  HTTP2_HEADER_TE,
  HTTP2_HEADER_USER_AGENT
} = http2.constants;

/**
 * An interface that contains options used when initializing a Channel instance.
 */
export interface ChannelOptions {
  'grpc.ssl_target_name_override': string;
  'grpc.primary_user_agent': string;
  'grpc.secondary_user_agent': string;
  'grpc.default_authority': string;
  [key: string]: string|number;
}

export enum ConnectivityState {
  CONNECTING,
  READY,
  TRANSIENT_FAILURE,
  IDLE,
  SHUTDOWN
}

function uniformRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// todo: maybe we want an interface for load balancing, but no implementation
// for anything complicated

/**
 * An interface that represents a communication channel to a server specified
 * by a given address.
 */
export interface Channel extends EventEmitter {
  createStream(methodName: string, metadata: Metadata, options: CallOptions):
      CallStream;
  connect(): Promise<void>;
  getConnectivityState(): ConnectivityState;
  close(): void;

  /* tslint:disable:no-any */
  addListener(event: string, listener: Function): this;
  emit(event: string|symbol, ...args: any[]): boolean;
  on(event: string, listener: Function): this;
  once(event: string, listener: Function): this;
  prependListener(event: string, listener: Function): this;
  prependOnceListener(event: string, listener: Function): this;
  removeListener(event: string, listener: Function): this;
  /* tslint:enable:no-any */
}

/* This should be a real subchannel class that contains a ClientHttp2Session,
 * but for now this serves its purpose */
type Http2SubChannel = http2.ClientHttp2Session & {
  /* Count the number of currently active streams associated with the session.
   * The purpose of this is to keep the session reffed if and only if there
   * is at least one active stream */
  streamCount?: number;
};

export class Http2Channel extends EventEmitter implements Channel {
  private readonly userAgent: string;
  private readonly target: url.URL;
  private readonly defaultAuthority: string;
  private connectivityState: ConnectivityState = ConnectivityState.IDLE;
  // Helper Promise object only used in the implementation of connect().
  private connecting: Promise<void>|null = null;
  /* For now, we have up to one subchannel, which will exist as long as we are
   * connecting or trying to connect */
  private subChannel: Http2SubChannel|null = null;
  private filterStackFactory: FilterStackFactory;

  private subChannelConnectCallback: () => void = () => {};
  private subChannelCloseCallback: () => void = () => {};

  private backoffTimerId: NodeJS.Timer;
  private currentBackoff: number = INITIAL_BACKOFF_MS;
  private currentBackoffDeadline: Date;

  private handleStateChange(
      oldState: ConnectivityState, newState: ConnectivityState): void {
    const now: Date = new Date();
    switch (newState) {
      case ConnectivityState.CONNECTING:
        if (oldState === ConnectivityState.IDLE) {
          this.currentBackoff = INITIAL_BACKOFF_MS;
          this.currentBackoffDeadline =
              new Date(now.getTime() + INITIAL_BACKOFF_MS);
        } else if (oldState === ConnectivityState.TRANSIENT_FAILURE) {
          this.currentBackoff = Math.min(
              this.currentBackoff * BACKOFF_MULTIPLIER, MAX_BACKOFF_MS);
          const jitterMagnitude: number = BACKOFF_JITTER * this.currentBackoff;
          this.currentBackoffDeadline = new Date(
              now.getTime() + this.currentBackoff +
              uniformRandom(-jitterMagnitude, jitterMagnitude));
        }
        this.startConnecting();
        break;
      case ConnectivityState.READY:
        this.emit('connect');
        break;
      case ConnectivityState.TRANSIENT_FAILURE:
        this.subChannel = null;
        this.backoffTimerId = setTimeout(() => {
          this.transitionToState(
              [ConnectivityState.TRANSIENT_FAILURE],
              ConnectivityState.CONNECTING);
        }, this.currentBackoffDeadline.getTime() - now.getTime());
        break;
      case ConnectivityState.IDLE:
      case ConnectivityState.SHUTDOWN:
        if (this.subChannel) {
          this.subChannel.close();
          this.subChannel.removeListener(
              'connect', this.subChannelConnectCallback);
          this.subChannel.removeListener('close', this.subChannelCloseCallback);
          this.subChannel = null;
          this.emit('shutdown');
          clearTimeout(this.backoffTimerId);
        }
        break;
      default:
        throw new Error('This should never happen');
    }
  }

  // Transition from any of a set of oldStates to a specific newState
  private transitionToState(
      oldStates: ConnectivityState[], newState: ConnectivityState): void {
    if (oldStates.indexOf(this.connectivityState) > -1) {
      const oldState: ConnectivityState = this.connectivityState;
      this.connectivityState = newState;
      this.handleStateChange(oldState, newState);
      this.emit('connectivityStateChanged', newState);
    }
  }

  private startConnecting(): void {
    let subChannel: Http2SubChannel;
    const secureContext = this.credentials.getSecureContext();
    if (secureContext === null) {
      subChannel = http2.connect(this.target);
    } else {
      const connectionOptions: http2.SecureClientSessionOptions = {
        secureContext,
      };
      // If provided, the value of grpc.ssl_target_name_override should be used
      // to override the target hostname when checking server identity.
      // This option is used for testing only.
      if (this.options['grpc.ssl_target_name_override']) {
        const sslTargetNameOverride =
            this.options['grpc.ssl_target_name_override']!;
        connectionOptions.checkServerIdentity =
            (host: string, cert: PeerCertificate): Error|undefined => {
              return checkServerIdentity(sslTargetNameOverride, cert);
            };
        connectionOptions.servername = sslTargetNameOverride;
      }
      subChannel = http2.connect(this.target, connectionOptions);
    }
    this.subChannel = subChannel;
    const now = new Date();
    const connectionTimeout: number = Math.max(
        this.currentBackoffDeadline.getTime() - now.getTime(),
        MIN_CONNECT_TIMEOUT_MS);
    const connectionTimerId: NodeJS.Timer = setTimeout(() => {
      // This should trigger the 'close' event, which will send us back to
      // TRANSIENT_FAILURE
      subChannel.close();
    }, connectionTimeout);
    this.subChannelConnectCallback = () => {
      // Connection succeeded
      clearTimeout(connectionTimerId);
      this.transitionToState(
          [ConnectivityState.CONNECTING], ConnectivityState.READY);
    };
    subChannel.once('connect', this.subChannelConnectCallback);
    this.subChannelCloseCallback = () => {
      // Connection failed
      clearTimeout(connectionTimerId);
      /* TODO(murgatroid99): verify that this works for
       * CONNECTING->TRANSITIVE_FAILURE see nodejs/node#16645 */
      this.transitionToState(
          [ConnectivityState.CONNECTING, ConnectivityState.READY],
          ConnectivityState.TRANSIENT_FAILURE);
    };
    subChannel.once('close', this.subChannelCloseCallback);
    subChannel.once('error', this.subChannelCloseCallback);
  }

  constructor(
      address: string, readonly credentials: ChannelCredentials,
      private readonly options: Partial<ChannelOptions>) {
    super();
    if (credentials.getSecureContext() === null) {
      this.target = new url.URL(`http://${address}`);
    } else {
      this.target = new url.URL(`https://${address}`);
    }
    // TODO(murgatroid99): Add more centralized handling of channel options
    if (this.options['grpc.default_authority']) {
      this.defaultAuthority = this.options['grpc.default_authority'] as string;
    } else {
      this.defaultAuthority = this.target.host;
    }
    this.filterStackFactory = new FilterStackFactory([
      new CompressionFilterFactory(this),
      new CallCredentialsFilterFactory(this), new DeadlineFilterFactory(this),
      new MetadataStatusFilterFactory(this)
    ]);
    this.currentBackoffDeadline = new Date();
    /* The only purpose of these lines is to ensure that this.backoffTimerId has
     * a value of type NodeJS.Timer. */
    this.backoffTimerId = setTimeout(() => {}, 0);
    clearTimeout(this.backoffTimerId);

    // Build user-agent string.
    this.userAgent = [
      options['grpc.primary_user_agent'], `grpc-node-js/${clientVersion}`,
      options['grpc.secondary_user_agent']
    ].filter(e => e).join(' ');  // remove falsey values first
  }

  private startHttp2Stream(
      authority: string, methodName: string, stream: Http2CallStream,
      metadata: Metadata) {
    const finalMetadata: Promise<Metadata> =
        stream.filterStack.sendMetadata(Promise.resolve(metadata.clone()));
    Promise.all([finalMetadata, this.connect()])
        .then(([metadataValue]) => {
          const headers = metadataValue.toHttp2Headers();
          headers[HTTP2_HEADER_AUTHORITY] = authority;
          headers[HTTP2_HEADER_USER_AGENT] = this.userAgent;
          headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
          headers[HTTP2_HEADER_METHOD] = 'POST';
          headers[HTTP2_HEADER_PATH] = methodName;
          headers[HTTP2_HEADER_TE] = 'trailers';
          if (this.connectivityState === ConnectivityState.READY) {
            const session: Http2SubChannel = this.subChannel!;
            let http2Stream = session.request(headers);
            /* This is a very ad-hoc reference counting scheme. This should be
             * handled by a subchannel class */
            session.ref();
            if (!session.streamCount) {
              session.streamCount = 0;
            }
            session.streamCount += 1;
            http2Stream.on('close', () => {
              if (!session.streamCount) {
                session.streamCount = 0;
              }
              session.streamCount -= 1;
              if (session.streamCount <= 0) {
                session.unref();
              }
            });
            stream.attachHttp2Stream(http2Stream);
          } else {
            /* In this case, we lost the connection while finalizing
             * metadata. That should be very unusual */
            setImmediate(() => {
              this.startHttp2Stream(authority, methodName, stream, metadata);
            });
          }
        })
        .catch((error: Error&{code: number}) => {
          // We assume the error code isn't 0 (Status.OK)
          stream.cancelWithStatus(
              error.code || Status.UNKNOWN,
              `Getting metadata from plugin failed with error: ${
                  error.message}`);
        });
  }

  createStream(methodName: string, metadata: Metadata, options: CallOptions):
      CallStream {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    const finalOptions: CallStreamOptions = {
      deadline: options.deadline === undefined ? Infinity : options.deadline,
      credentials: options.credentials || CallCredentials.createEmpty(),
      flags: options.flags || 0,
      host: options.host || this.defaultAuthority
    };
    const stream: Http2CallStream =
        new Http2CallStream(methodName, finalOptions, this.filterStackFactory);
    this.startHttp2Stream(finalOptions.host, methodName, stream, metadata);
    return stream;
  }

  /**
   * Attempts to connect, returning a Promise that resolves when the connection
   * is successful, or rejects if the channel is shut down.
   */
  connect(): Promise<void> {
    if (this.connectivityState === ConnectivityState.READY) {
      return Promise.resolve();
    } else if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      return Promise.reject(new Error('Channel has been shut down'));
    } else {
      // In effect, this.connecting is only assigned upon the first attempt to
      // transition from IDLE to CONNECTING, so this condition could have also
      // been (connectivityState === IDLE).
      if (!this.connecting) {
        this.connecting = new Promise((resolve, reject) => {
          this.transitionToState(
              [ConnectivityState.IDLE], ConnectivityState.CONNECTING);
          const onConnect = () => {
            this.connecting = null;
            this.removeListener('shutdown', onShutdown);
            resolve();
          };
          const onShutdown = () => {
            this.connecting = null;
            this.removeListener('connect', onConnect);
            reject(new Error('Channel has been shut down'));
          };
          this.once('connect', onConnect);
          this.once('shutdown', onShutdown);
        });
      }
      return this.connecting;
    }
  }

  getConnectivityState(): ConnectivityState {
    return this.connectivityState;
  }

  close() {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    this.transitionToState(
        [
          ConnectivityState.CONNECTING, ConnectivityState.READY,
          ConnectivityState.TRANSIENT_FAILURE, ConnectivityState.IDLE
        ],
        ConnectivityState.SHUTDOWN);
  }
}
