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

import * as http2 from 'http2';
import { ChannelCredentials } from './channel-credentials';
import { Metadata } from './metadata';
import { Http2CallStream } from './call-stream';
import { ChannelOptions } from './channel-options';
import { PeerCertificate, checkServerIdentity } from 'tls';

const { version: clientVersion } = require('../../package.json');

const MIN_CONNECT_TIMEOUT_MS = 20000;
const INITIAL_BACKOFF_MS = 1000;
const BACKOFF_MULTIPLIER = 1.6;
const MAX_BACKOFF_MS = 120000;
const BACKOFF_JITTER = 0.2;

/* setInterval and setTimeout only accept signed 32 bit integers. JS doesn't
 * have a constant for the max signed 32 bit integer, so this is a simple way
 * to calculate it */
const KEEPALIVE_TIME_MS = ~(1 << 31);
const KEEPALIVE_TIMEOUT_MS = 20000;

export enum SubchannelConnectivityState {
  READY,
  CONNECTING,
  TRANSIENT_FAILURE,
  IDLE
};

export type ConnectivityStateListener = (subchannel: Subchannel, previousState: SubchannelConnectivityState, newState: SubchannelConnectivityState) => void;

const {
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_TE,
  HTTP2_HEADER_USER_AGENT,
} = http2.constants;

function uniformRandom(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export class Subchannel {
  private connectivityState: SubchannelConnectivityState = SubchannelConnectivityState.IDLE;
  private session: http2.ClientHttp2Session | null = null;
  // Indicates that we should continue conection attempts after backoff time ends
  private continueConnecting: boolean = false;
  private stateListeners: ConnectivityStateListener[] = [];

  private backoffTimerId: NodeJS.Timer;
  // The backoff value that will be used the next time we try to connect
  private nextBackoff: number = INITIAL_BACKOFF_MS;

  private userAgent: string;

  private keepaliveTimeMs: number = KEEPALIVE_TIME_MS;
  private keepaliveTimeoutMs: number = KEEPALIVE_TIMEOUT_MS;
  private keepaliveIntervalId: NodeJS.Timer;
  private keepaliveTimeoutId: NodeJS.Timer;

  /**
   * Tracks calls with references to this subchannel
   */
  private callRefcount: number = 0;
  /**
   * Tracks channels and subchannel pools with references to this subchannel
   */
  private refcount: number = 0;

  constructor(private channelTarget: string,
    private subchannelAddress: string,
    private options: ChannelOptions,
    private credentials: ChannelCredentials) {
      // Build user-agent string.
      this.userAgent = [
        options['grpc.primary_user_agent'],
        `grpc-node-js/${clientVersion}`,
        options['grpc.secondary_user_agent'],
      ]
        .filter(e => e)
        .join(' '); // remove falsey values first

        /* The only purpose of these lines is to ensure that this.backoffTimerId has
         * a value of type NodeJS.Timer. */
        this.backoffTimerId = setTimeout(() => {}, 0);
        clearTimeout(this.backoffTimerId);

      if ('grpc.keepalive_time_ms' in options) {
        this.keepaliveTimeMs = options['grpc.keepalive_time_ms']!;
      }
      if ('grpc.keepalive_timeout_ms' in options) {
        this.keepaliveTimeoutMs = options['grpc.keepalive_timeout_ms']!;
      }
      this.keepaliveIntervalId = setTimeout(() => {}, 0);
      clearTimeout(this.keepaliveIntervalId);
      this.keepaliveTimeoutId = setTimeout(() => {}, 0);
      clearTimeout(this.keepaliveTimeoutId);
    }

  /**
   * Start a backoff timer with the current nextBackoff timeout
   */
  private startBackoff() {
    this.backoffTimerId = setTimeout(() => {
      
      if (this.continueConnecting) {
        this.transitionToState([SubchannelConnectivityState.TRANSIENT_FAILURE, SubchannelConnectivityState.CONNECTING], 
          SubchannelConnectivityState.CONNECTING);
      } else {
        this.transitionToState([SubchannelConnectivityState.TRANSIENT_FAILURE, SubchannelConnectivityState.CONNECTING],
          SubchannelConnectivityState.IDLE);
      }
    }, this.nextBackoff)
    const nextBackoff = Math.min(this.nextBackoff * BACKOFF_MULTIPLIER, MAX_BACKOFF_MS);
    const jitterMagnitude = nextBackoff * BACKOFF_JITTER;
    this.nextBackoff = nextBackoff + uniformRandom(-jitterMagnitude, jitterMagnitude);
  }

  private stopBackoff() {
    clearTimeout(this.backoffTimerId);
    this.nextBackoff = INITIAL_BACKOFF_MS;
  }

  private sendPing() {
    this.keepaliveTimeoutId = setTimeout(() => {
      // Not sure what to do when keepalive pings fail
    }, this.keepaliveTimeoutMs);
    this.session!.ping(
      (err: Error | null, duration: number, payload: Buffer) => {
        clearTimeout(this.keepaliveTimeoutId);
      }
    );
  }

  private startKeepalivePings() {
    this.keepaliveIntervalId = setInterval(() => {
      this.sendPing();
    }, this.keepaliveTimeMs);
    this.sendPing();
  }

  private stopKeepalivePings() {
    clearInterval(this.keepaliveIntervalId);
    clearTimeout(this.keepaliveTimeoutId);
  }

  private startConnectingInternal() {
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
    this.session = http2.connect(this.subchannelAddress, connectionOptions);
    this.session.unref();
    this.session.once('connect', () => {
      this.transitionToState([SubchannelConnectivityState.CONNECTING], SubchannelConnectivityState.READY);
    });
    this.session.once('close', () => {
      this.transitionToState([SubchannelConnectivityState.CONNECTING, SubchannelConnectivityState.READY],
        SubchannelConnectivityState.TRANSIENT_FAILURE);
    });
    this.session.once('goaway', () => {
      this.transitionToState([SubchannelConnectivityState.CONNECTING, SubchannelConnectivityState.READY],
        SubchannelConnectivityState.IDLE);
    });
  }

  /**
   * Initiate a state transition from any element of oldStates to the new
   * state. If the current connectivityState is not in oldStates, do nothing.
   * @param oldStates The set of states to transition from
   * @param newState The state to transition to
   * @returns True if the state changed, false otherwise
   */
  private transitionToState(
    oldStates: SubchannelConnectivityState[],
    newState: SubchannelConnectivityState
  ): boolean {
    if (oldStates.indexOf(this.connectivityState) === -1) {
      return false;
    }
    let previousState = this.connectivityState;
    this.connectivityState = newState;
    switch (newState) {
      case SubchannelConnectivityState.READY:
        this.stopBackoff();
        break;
      case SubchannelConnectivityState.CONNECTING:
        this.startBackoff();
        this.startConnectingInternal();
        this.continueConnecting = false;
        break;
      case SubchannelConnectivityState.TRANSIENT_FAILURE:
        this.session = null;
        break;
      case SubchannelConnectivityState.IDLE:
        /* Stopping the backoff timer here is probably redundant because we
         * should only transition to the IDLE state as a result of the timer
         * ending, but we still want to reset the backoff timeout. */
        this.stopBackoff();
        this.session = null;
    }
    /* We use a shallow copy of the stateListeners array in case a listener
     * is removed during this iteration */
    for (const listener of [...this.stateListeners]) {
      listener(this, previousState, newState);
    }
    return true;
  }

  private checkBothRefcounts() {
    /* If no calls, channels, or subchannel pools have any more references to
     * this subchannel, we can be sure it will never be used again. */
    if (this.callRefcount === 0 && this.refcount === 0) {
      this.transitionToState([SubchannelConnectivityState.CONNECTING, 
                              SubchannelConnectivityState.IDLE,
                              SubchannelConnectivityState.READY],
                             SubchannelConnectivityState.TRANSIENT_FAILURE);
    }
  }

  private callRef() {
    if (this.callRefcount === 0) {
      if (this.session) {
        this.session.ref();
      }
      this.startKeepalivePings();
    }
    this.callRefcount += 1;
  }

  private callUnref() {
    this.callRefcount -= 1;
    if (this.callRefcount === 0) {
      if (this.session) {
        this.session.unref();
      }
      this.stopKeepalivePings();
      this.checkBothRefcounts();
    }
  }

  ref() {
    this.refcount += 1;
  }

  unref() {
    this.refcount -= 1;
    this.checkBothRefcounts();
  }

  unrefIfOneRef(): boolean {
    if (this.refcount === 1) {
      this.unref();
      return true;
    }
    return false;
  }

  startCallStream(metadata: Metadata, callStream: Http2CallStream) {
    const headers = metadata.toHttp2Headers();
    headers[HTTP2_HEADER_AUTHORITY] = callStream.getHost();
    headers[HTTP2_HEADER_USER_AGENT] = this.userAgent;
    headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
    headers[HTTP2_HEADER_METHOD] = 'POST';
    headers[HTTP2_HEADER_PATH] = callStream.getMethod();
    headers[HTTP2_HEADER_TE] = 'trailers';
    const http2Stream = this.session!.request(headers);
    this.callRef();
    http2Stream.on('close', () => {
      this.callUnref();
    });
    callStream.attachHttp2Stream(http2Stream);
  }

  startConnecting() {
    /* First, try to transition from IDLE to connecting. If that doesn't happen
     * because the state is not currently IDLE, check if it is
     * TRANSIENT_FAILURE, and if so indicate that it should go back to
     * connecting after the backoff timer ends. Otherwise do nothing */
    if (!this.transitionToState([SubchannelConnectivityState.IDLE], SubchannelConnectivityState.CONNECTING)) {
      if (this.connectivityState === SubchannelConnectivityState.TRANSIENT_FAILURE) {
        this.continueConnecting = true;
      }
    }
  }

  getConnectivityState() {
    return this.connectivityState;
  }

  addConnectivityStateListener(listener: ConnectivityStateListener) {
    this.stateListeners.push(listener);
  }

  removeConnectivityStateListener(listener: ConnectivityStateListener) {
    const listenerIndex = this.stateListeners.indexOf(listener);
    if (listenerIndex > -1) {
      this.stateListeners.splice(listenerIndex, 1);
    }
  }

  resetBackoff() {
    this.nextBackoff = INITIAL_BACKOFF_MS;
    this.transitionToState([SubchannelConnectivityState.TRANSIENT_FAILURE], SubchannelConnectivityState.CONNECTING);
  }
}