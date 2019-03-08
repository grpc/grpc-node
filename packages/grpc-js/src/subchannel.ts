import {EventEmitter} from 'events';
import * as http2 from 'http2';
import * as url from 'url';

import {Call, Http2CallStream} from './call-stream';
import {ChannelOptions} from './channel-options';
import {Metadata} from './metadata';

const {
  HTTP2_HEADER_AUTHORITY,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_METHOD,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_TE,
  HTTP2_HEADER_USER_AGENT
} = http2.constants;

/* setInterval and setTimeout only accept signed 32 bit integers. JS doesn't
 * have a constant for the max signed 32 bit integer, so this is a simple way
 * to calculate it */
const KEEPALIVE_TIME_MS = ~(1 << 31);
const KEEPALIVE_TIMEOUT_MS = 20000;

export interface SubChannel extends EventEmitter {
  /**
   * Attach a call stream to this subchannel's connection to start it
   * @param headers The headers to start the stream with
   * @param callStream The stream to start
   */
  startCallStream(metadata: Metadata, callStream: Call): void;
  close(): void;
}

export class Http2SubChannel extends EventEmitter implements SubChannel {
  private session: http2.ClientHttp2Session;
  private refCount = 0;
  private userAgent: string;

  private keepaliveTimeMs: number = KEEPALIVE_TIME_MS;
  private keepaliveTimeoutMs: number = KEEPALIVE_TIMEOUT_MS;
  private keepaliveIntervalId: NodeJS.Timer;
  private keepaliveTimeoutId: NodeJS.Timer;

  constructor(
      target: url.URL, connectionOptions: http2.SecureClientSessionOptions,
      userAgent: string, channelArgs: Partial<ChannelOptions>) {
    super();
    this.session = http2.connect(target, connectionOptions);
    this.session.unref();
    this.session.on('connect', () => {
      this.emit('connect');
    });
    this.session.on('close', () => {
      this.stopKeepalivePings();
      this.emit('close');
    });
    this.session.on('error', () => {
      this.stopKeepalivePings();
      this.emit('close');
    });
    this.userAgent = userAgent;

    if (channelArgs['grpc.keepalive_time_ms']) {
      this.keepaliveTimeMs = channelArgs['grpc.keepalive_time_ms']!;
    }
    if (channelArgs['grpc.keepalive_timeout_ms']) {
      this.keepaliveTimeoutMs = channelArgs['grpc.keepalive_timeout_ms']!;
    }
    this.keepaliveIntervalId = setTimeout(() => {}, 0);
    clearTimeout(this.keepaliveIntervalId);
    this.keepaliveTimeoutId = setTimeout(() => {}, 0);
    clearTimeout(this.keepaliveTimeoutId);
  }

  private ref() {
    if (this.refCount === 0) {
      this.session.ref();
      this.startKeepalivePings();
    }
    this.refCount += 1;
  }

  private unref() {
    this.refCount -= 1;
    if (this.refCount === 0) {
      this.session.unref();
      this.stopKeepalivePings();
    }
  }

  private sendPing() {
    this.keepaliveTimeoutId = setTimeout(() => {
      this.emit('close');
    }, this.keepaliveTimeoutMs);
    this.session.ping((err: Error|null, duration: number, payload: Buffer) => {
      clearTimeout(this.keepaliveTimeoutId);
    });
  }

  /* TODO(murgatroid99): refactor subchannels so that keepalives can be handled
   * per subchannel */
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

  // Prerequisite: this subchannel is connected
  startCallStream(metadata: Metadata, callStream: Http2CallStream) {
    const headers = metadata.toHttp2Headers();
    headers[HTTP2_HEADER_AUTHORITY] = callStream.getHost();
    headers[HTTP2_HEADER_USER_AGENT] = this.userAgent;
    headers[HTTP2_HEADER_CONTENT_TYPE] = 'application/grpc';
    headers[HTTP2_HEADER_METHOD] = 'POST';
    headers[HTTP2_HEADER_PATH] = callStream.getMethod();
    headers[HTTP2_HEADER_TE] = 'trailers';
    const http2Stream = this.session.request(headers);
    this.ref();
    http2Stream.on('close', () => {
      this.unref();
    });
    callStream.attachHttp2Stream(http2Stream);
  }

  close() {
    this.session.close();
  }
}
