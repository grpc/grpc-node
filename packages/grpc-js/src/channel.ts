/*
 * Copyright 2019 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { EventEmitter } from 'events';
import * as http2 from 'http2';
import { checkServerIdentity, PeerCertificate } from 'tls';
import * as url from 'url';

import { CallCredentialsFilterFactory } from './call-credentials-filter';
import {
  Call,
  CallStreamOptions,
  Deadline,
  Http2CallStream,
} from './call-stream';
import { ChannelCredentials } from './channel-credentials';
import { ChannelOptions, recognizedOptions } from './channel-options';
import { CompressionFilterFactory } from './compression-filter';
import { Status } from './constants';
import { DeadlineFilterFactory } from './deadline-filter';
import { FilterStackFactory } from './filter-stack';
import { Metadata } from './metadata';
import { MetadataStatusFilterFactory } from './metadata-status-filter';
import { Http2SubChannel } from './subchannel';

const { version: clientVersion } = require('../../package.json');

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
  HTTP2_HEADER_TE,
  HTTP2_HEADER_USER_AGENT,
} = http2.constants;

export enum ConnectivityState {
  CONNECTING,
  READY,
  TRANSIENT_FAILURE,
  IDLE,
  SHUTDOWN,
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
export interface Channel {
  /**
   * Close the channel. This has the same functionality as the existing
   * grpc.Client.prototype.close
   */
  close(): void;
  /**
   * Return the target that this channel connects to
   */
  getTarget(): string;
  /**
   * Get the channel's current connectivity state. This method is here mainly
   * because it is in the existing internal Channel class, and there isn't
   * another good place to put it.
   * @param tryToConnect If true, the channel will start connecting if it is
   *     idle. Otherwise, idle channels will only start connecting when a
   *     call starts.
   */
  getConnectivityState(tryToConnect: boolean): ConnectivityState;
  /**
   * Watch for connectivity state changes. This is also here mainly because
   * it is in the existing external Channel class.
   * @param currentState The state to watch for transitions from. This should
   *     always be populated by calling getConnectivityState immediately
   *     before.
   * @param deadline A deadline for waiting for a state change
   * @param callback Called with no error when a state change, or with an
   *     error if the deadline passes without a state change.
   */
  watchConnectivityState(
    currentState: ConnectivityState,
    deadline: Date | number,
    callback: (error?: Error) => void
  ): void;
  /**
   * Create a call object. Call is an opaque type that is used by the Client
   * class. This function is called by the gRPC library when starting a
   * request. Implementers should return an instance of Call that is returned
   * from calling createCall on an instance of the provided Channel class.
   * @param method The full method string to request.
   * @param deadline The call deadline
   * @param host A host string override for making the request
   * @param parentCall A server call to propagate some information from
   * @param propagateFlags A bitwise combination of elements of grpc.propagate
   *     that indicates what information to propagate from parentCall.
   */
  createCall(
    method: string,
    deadline: Deadline | null | undefined,
    host: string | null | undefined,
    parentCall: Call | null | undefined,
    propagateFlags: number | null | undefined
  ): Call;
}

export class Http2Channel extends EventEmitter implements Channel {
  private readonly userAgent: string;
  private readonly target: url.URL;
  private readonly defaultAuthority: string;
  private connectivityState: ConnectivityState = ConnectivityState.IDLE;
  // Helper Promise object only used in the implementation of connect().
  private connecting: Promise<void> | null = null;
  /* For now, we have up to one subchannel, which will exist as long as we are
   * connecting or trying to connect */
  private subChannel: Http2SubChannel | null = null;
  private filterStackFactory: FilterStackFactory;

  private subChannelConnectCallback: () => void = () => {};
  private subChannelCloseCallback: () => void = () => {};

  private backoffTimerId: NodeJS.Timer;
  private currentBackoff: number = INITIAL_BACKOFF_MS;
  private currentBackoffDeadline: Date;

  private handleStateChange(
    oldState: ConnectivityState,
    newState: ConnectivityState
  ): void {
    const now: Date = new Date();
    switch (newState) {
      case ConnectivityState.CONNECTING:
        if (oldState === ConnectivityState.IDLE) {
          this.currentBackoff = INITIAL_BACKOFF_MS;
          this.currentBackoffDeadline = new Date(
            now.getTime() + INITIAL_BACKOFF_MS
          );
        } else if (oldState === ConnectivityState.TRANSIENT_FAILURE) {
          this.currentBackoff = Math.min(
            this.currentBackoff * BACKOFF_MULTIPLIER,
            MAX_BACKOFF_MS
          );
          const jitterMagnitude: number = BACKOFF_JITTER * this.currentBackoff;
          this.currentBackoffDeadline = new Date(
            now.getTime() +
              this.currentBackoff +
              uniformRandom(-jitterMagnitude, jitterMagnitude)
          );
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
            ConnectivityState.CONNECTING
          );
        }, this.currentBackoffDeadline.getTime() - now.getTime());
        break;
      case ConnectivityState.IDLE:
      case ConnectivityState.SHUTDOWN:
        if (this.subChannel) {
          this.subChannel.close();
          this.subChannel.removeListener(
            'connect',
            this.subChannelConnectCallback
          );
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
    oldStates: ConnectivityState[],
    newState: ConnectivityState
  ): void {
    if (oldStates.indexOf(this.connectivityState) > -1) {
      const oldState: ConnectivityState = this.connectivityState;
      this.connectivityState = newState;
      this.handleStateChange(oldState, newState);
      this.emit('connectivityStateChanged', newState);
    }
  }

  private startConnecting(): void {
    const connectionOptions: http2.SecureClientSessionOptions =
      this.credentials._getConnectionOptions() || {};
    if (connectionOptions.secureContext !== null) {
      // If provided, the value of grpc.ssl_target_name_override should be used
      // to override the target hostname when checking server identity.
      // This option is used for testing only.
      if (this.options['grpc.ssl_target_name_override']) {
        const sslTargetNameOverride = this.options[
          'grpc.ssl_target_name_override'
        ]!;
        connectionOptions.checkServerIdentity = (
          host: string,
          cert: PeerCertificate
        ): Error | undefined => {
          return checkServerIdentity(sslTargetNameOverride, cert);
        };
        connectionOptions.servername = sslTargetNameOverride;
      }
    }
    const subChannel: Http2SubChannel = new Http2SubChannel(
      this.target,
      connectionOptions,
      this.userAgent,
      this.options
    );
    this.subChannel = subChannel;
    const now = new Date();
    const connectionTimeout: number = Math.max(
      this.currentBackoffDeadline.getTime() - now.getTime(),
      MIN_CONNECT_TIMEOUT_MS
    );
    const connectionTimerId: NodeJS.Timer = setTimeout(() => {
      // This should trigger the 'close' event, which will send us back to
      // TRANSIENT_FAILURE
      subChannel.close();
    }, connectionTimeout);
    this.subChannelConnectCallback = () => {
      // Connection succeeded
      clearTimeout(connectionTimerId);
      this.transitionToState(
        [ConnectivityState.CONNECTING],
        ConnectivityState.READY
      );
    };
    subChannel.once('connect', this.subChannelConnectCallback);
    this.subChannelCloseCallback = () => {
      // Connection failed
      clearTimeout(connectionTimerId);
      /* TODO(murgatroid99): verify that this works for
       * CONNECTING->TRANSITIVE_FAILURE see nodejs/node#16645 */
      this.transitionToState(
        [ConnectivityState.CONNECTING, ConnectivityState.READY],
        ConnectivityState.TRANSIENT_FAILURE
      );
    };
    subChannel.once('close', this.subChannelCloseCallback);
  }

  constructor(
    address: string,
    readonly credentials: ChannelCredentials,
    private readonly options: Partial<ChannelOptions>
  ) {
    super();
    for (const option in options) {
      if (options.hasOwnProperty(option)) {
        if (!recognizedOptions.hasOwnProperty(option)) {
          console.warn(
            `Unrecognized channel argument '${option}' will be ignored.`
          );
        }
      }
    }
    if (credentials._isSecure()) {
      this.target = new url.URL(`https://${address}`);
    } else {
      this.target = new url.URL(`http://${address}`);
    }
    // TODO(murgatroid99): Add more centralized handling of channel options
    if (this.options['grpc.default_authority']) {
      this.defaultAuthority = this.options['grpc.default_authority'] as string;
    } else {
      this.defaultAuthority = this.target.host;
    }
    this.filterStackFactory = new FilterStackFactory([
      new CallCredentialsFilterFactory(this),
      new DeadlineFilterFactory(this),
      new MetadataStatusFilterFactory(this),
      new CompressionFilterFactory(this),
    ]);
    this.currentBackoffDeadline = new Date();
    /* The only purpose of these lines is to ensure that this.backoffTimerId has
     * a value of type NodeJS.Timer. */
    this.backoffTimerId = setTimeout(() => {}, 0);

    // Build user-agent string.
    this.userAgent = [
      options['grpc.primary_user_agent'],
      `grpc-node-js/${clientVersion}`,
      options['grpc.secondary_user_agent'],
    ]
      .filter(e => e)
      .join(' '); // remove falsey values first
  }

  _startHttp2Stream(
    authority: string,
    methodName: string,
    stream: Http2CallStream,
    metadata: Metadata
  ) {
    const finalMetadata: Promise<Metadata> = stream.filterStack.sendMetadata(
      Promise.resolve(metadata.clone())
    );
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
          const subChannel: Http2SubChannel = this.subChannel!;
          subChannel.startCallStream(metadataValue, stream);
        } else {
          /* In this case, we lost the connection while finalizing
           * metadata. That should be very unusual */
          setImmediate(() => {
            this._startHttp2Stream(authority, methodName, stream, metadata);
          });
        }
      })
      .catch((error: Error & { code: number }) => {
        // We assume the error code isn't 0 (Status.OK)
        stream.cancelWithStatus(
          error.code || Status.UNKNOWN,
          `Getting metadata from plugin failed with error: ${error.message}`
        );
      });
  }

  createCall(
    method: string,
    deadline: Deadline | null | undefined,
    host: string | null | undefined,
    parentCall: Call | null | undefined,
    propagateFlags: number | null | undefined
  ): Call {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    const finalOptions: CallStreamOptions = {
      deadline:
        deadline === null || deadline === undefined ? Infinity : deadline,
      flags: propagateFlags || 0,
      host: host || this.defaultAuthority,
      parentCall: parentCall || null,
    };
    const stream: Http2CallStream = new Http2CallStream(
      method,
      this,
      finalOptions,
      this.filterStackFactory
    );
    return stream;
  }

  /**
   * Attempts to connect, returning a Promise that resolves when the connection
   * is successful, or rejects if the channel is shut down.
   */
  private connect(): Promise<void> {
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
            [ConnectivityState.IDLE],
            ConnectivityState.CONNECTING
          );
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

  getConnectivityState(tryToConnect: boolean): ConnectivityState {
    if (tryToConnect) {
      this.transitionToState(
        [ConnectivityState.IDLE],
        ConnectivityState.CONNECTING
      );
    }
    return this.connectivityState;
  }

  watchConnectivityState(
    currentState: ConnectivityState,
    deadline: Date | number,
    callback: (error?: Error) => void
  ) {
    if (this.connectivityState !== currentState) {
      /* If the connectivity state is different from the provided currentState,
       * we assume that a state change has successfully occurred */
      setImmediate(callback);
    } else {
      let deadlineMs = 0;
      if (deadline instanceof Date) {
        deadlineMs = deadline.getTime();
      } else {
        deadlineMs = deadline;
      }
      let timeout: number = deadlineMs - Date.now();
      if (timeout < 0) {
        timeout = 0;
      }
      const timeoutId = setTimeout(() => {
        this.removeListener('connectivityStateChanged', eventCb);
        callback(new Error('Channel state did not change before deadline'));
      }, timeout);
      const eventCb = () => {
        clearTimeout(timeoutId);
        callback();
      };
      this.once('connectivityStateChanged', eventCb);
    }
  }

  getTarget() {
    return this.target.toString();
  }

  close() {
    if (this.connectivityState === ConnectivityState.SHUTDOWN) {
      throw new Error('Channel has been shut down');
    }
    this.transitionToState(
      [
        ConnectivityState.CONNECTING,
        ConnectivityState.READY,
        ConnectivityState.TRANSIENT_FAILURE,
        ConnectivityState.IDLE,
      ],
      ConnectivityState.SHUTDOWN
    );
  }
}
