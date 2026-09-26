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

import * as assert from 'assert';
import { EventEmitter } from 'events';
import * as http2 from 'http2';

import * as grpc from '../src';
import { Client, Metadata, Server, ServerCredentials } from '../src';
import { ConnectivityState } from '../src/connectivity-state';
import { Http2SubchannelCall } from '../src/subchannel-call';

const clientInsecureCreds = grpc.credentials.createInsecure();
const serverInsecureCreds = ServerCredentials.createInsecure();

describe('Client', () => {
  let server: Server;
  let client: Client;

  before(done => {
    server = new Server();

    server.bindAsync('localhost:0', serverInsecureCreds, (err, port) => {
      assert.ifError(err);
      client = new Client(`localhost:${port}`, clientInsecureCreds);
      server.start();
      done();
    });
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
  });

  it('should call the waitForReady callback only once, when channel connectivity state is READY', done => {
    const deadline = Date.now() + 100;
    let calledTimes = 0;
    client.waitForReady(deadline, err => {
      assert.ifError(err);
      assert.equal(
        client.getChannel().getConnectivityState(true),
        ConnectivityState.READY
      );
      calledTimes += 1;
    });
    setTimeout(() => {
      assert.equal(calledTimes, 1);
      done();
    }, deadline - Date.now());
  });
});

describe('Client HTTP/2 stream lifecycle', () => {
  let originalConnect: typeof http2.connect;
  let testServer: Server | null = null;
  let testClient: Client | null = null;

  beforeEach(() => {
    originalConnect = http2.connect;
  });

  afterEach(done => {
    (http2 as any).connect = originalConnect;
    testClient?.close();
    testClient = null;
    if (testServer) {
      testServer.forceShutdown();
      testServer = null;
    }
    done();
  });

  it('should not redundantly call http2Stream.end when stream is already ended', done => {
    let streamEndCount = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (http2 as any).connect = function (
      this: unknown,
      ...connectArguments: any[]
    ) {
      const session = Reflect.apply(originalConnect, this, connectArguments);
      const originalRequest = session.request;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.request = function (this: unknown, ...requestArguments: any[]) {
        const stream = Reflect.apply(
          originalRequest,
          this,
          requestArguments
        ) as http2.ClientHttp2Stream;
        const originalEnd = stream.end;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stream.end = function (this: unknown, ...endArguments: any[]) {
          streamEndCount++;
          return Reflect.apply(originalEnd, this, endArguments);
        };
        return stream;
      };
      return session;
    };
    testServer = new Server();
    testServer.bindAsync(
      'localhost:0',
      serverInsecureCreds,
      (bindError, port) => {
        assert.ifError(bindError);
        testClient = new Client(`localhost:${port}`, clientInsecureCreds);
        testServer!.start();
        testClient.makeUnaryRequest(
          '/service/method',
          message => message,
          message => message,
          Buffer.from([]),
          () => {
            assert.strictEqual(streamEndCount, 1);
            done();
          }
        );
      }
    );
  });

  it('should call http2Stream.end when server ends call early on an un-ended client stream', done => {
    let streamEndCount = 0;
    let writableEndedBeforeEndCall: boolean | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (http2 as any).connect = function (
      this: unknown,
      ...connectArguments: any[]
    ) {
      const session = Reflect.apply(originalConnect, this, connectArguments);
      const originalRequest = session.request;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.request = function (this: unknown, ...requestArguments: any[]) {
        const stream = Reflect.apply(
          originalRequest,
          this,
          requestArguments
        ) as http2.ClientHttp2Stream;
        const originalEnd = stream.end;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        stream.end = function (this: unknown, ...endArguments: any[]) {
          streamEndCount++;
          writableEndedBeforeEndCall = (this as { writableEnded?: boolean })
            .writableEnded;
          return Reflect.apply(originalEnd, this, endArguments);
        };
        return stream;
      };
      return session;
    };
    testServer = new Server();
    testServer.bindAsync(
      'localhost:0',
      serverInsecureCreds,
      (bindError, port) => {
        assert.ifError(bindError);
        testClient = new Client(`localhost:${port}`, clientInsecureCreds);
        testServer!.start();
        const clientStream = testClient.makeClientStreamRequest<Buffer, Buffer>(
          '/service/method',
          message => message,
          message => message,
          callError => {
            assert(callError);
            assert.strictEqual(streamEndCount, 1);
            assert.strictEqual(writableEndedBeforeEndCall, false);
            done();
          }
        );
        // Write data without ending the client stream so that writableEnded remains false
        clientStream.write(Buffer.from('hello'));
      }
    );
  });

  it('should not call http2Stream.end when halfClose is called on an ended or destroyed stream', () => {
    let streamEndCount = 0;
    const mockHttp2Stream = Object.assign(new EventEmitter(), {
      destroyed: false,
      writableEnded: false,
      end() {
        streamEndCount++;
        this.writableEnded = true;
      },
      rstCode: 0,
    });
    const mockTransport = {
      getOptions: () => ({}),
      getPeerName: () => 'localhost',
      getAuthContext: () => null,
    };
    const mockTracker = {
      addMessageReceived: () => {},
      addMessageSent: () => {},
      onStreamEnd: () => {},
    };
    const mockListener = {
      onReceiveMetadata: () => {},
      onReceiveMessage: () => {},
      onReceiveStatus: () => {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subchannelCall = new Http2SubchannelCall(
      mockHttp2Stream as any,
      mockTracker as any,
      mockListener as any,
      mockTransport as any,
      1
    );

    // Initial halfClose calls http2Stream.end()
    subchannelCall.halfClose();
    assert.strictEqual(streamEndCount, 1);

    // Subsequent halfClose when writableEnded is true is a no-op
    subchannelCall.halfClose();
    assert.strictEqual(streamEndCount, 1);

    // halfClose when destroyed is true is a no-op even if writableEnded were false
    mockHttp2Stream.destroyed = true;
    mockHttp2Stream.writableEnded = false;
    subchannelCall.halfClose();
    assert.strictEqual(streamEndCount, 1);
  });
});

describe('Http2SubchannelCall trailers handling', () => {
  let originalGetMap: typeof Metadata.prototype.getMap;
  let getMapCallCount = 0;

  beforeEach(() => {
    originalGetMap = Metadata.prototype.getMap;
    getMapCallCount = 0;
    Metadata.prototype.getMap = function (...args) {
      getMapCallCount++;
      return originalGetMap.apply(this, args);
    };
  });

  afterEach(() => {
    Metadata.prototype.getMap = originalGetMap;
  });

  function createMockSubchannelCall(
    onReceiveStatus: (status: grpc.StatusObject) => void
  ) {
    const mockHttp2Stream = Object.assign(new EventEmitter(), {
      destroyed: false,
      writableEnded: false,
      end() {},
      rstCode: 0,
      close() {},
      resume() {},
      pause() {},
    });
    const mockTransport = {
      getOptions: () => ({}),
      getPeerName: () => 'localhost',
      getAuthContext: () => null,
    };
    const mockTracker = {
      addMessageReceived: () => {},
      addMessageSent: () => {},
      onStreamEnd: () => {},
      onCallEnd: () => {},
    };
    const mockListener = {
      onReceiveMetadata: () => {},
      onReceiveMessage: () => {},
      onReceiveStatus,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new Http2SubchannelCall(
      mockHttp2Stream as any,
      mockTracker as any,
      mockListener as any,
      mockTransport as any,
      1
    );

    return mockHttp2Stream;
  }

  it('should parse grpc-status and grpc-message from trailers without calling getMap()', done => {
    const mockHttp2Stream = createMockSubchannelCall(status => {
      assert.strictEqual(status.code, grpc.status.OK);
      assert.strictEqual(status.details, 'All Good');
      assert.strictEqual(getMapCallCount, 0);
      assert.strictEqual(status.metadata.get('grpc-status').length, 0);
      assert.strictEqual(status.metadata.get('grpc-message').length, 0);
      assert.deepStrictEqual(status.metadata.get('custom-trailer'), [
        'custom-val',
      ]);
      done();
    });

    mockHttp2Stream.emit('trailers', {
      'grpc-status': '0',
      'grpc-message': 'All%20Good',
      'custom-trailer': 'custom-val',
    });
    mockHttp2Stream.emit('end');
  });

  it('should handle trailers without grpc-message', done => {
    const mockHttp2Stream = createMockSubchannelCall(status => {
      assert.strictEqual(status.code, grpc.status.OK);
      assert.strictEqual(status.details, '');
      assert.strictEqual(getMapCallCount, 0);
      assert.strictEqual(status.metadata.get('grpc-status').length, 0);
      assert.strictEqual(status.metadata.get('grpc-message').length, 0);
      done();
    });

    mockHttp2Stream.emit('trailers', {
      'grpc-status': '0',
    });
    mockHttp2Stream.emit('end');
  });

  it('should fall back to raw string when grpc-message has invalid percent-encoding', done => {
    const mockHttp2Stream = createMockSubchannelCall(status => {
      assert.strictEqual(status.code, grpc.status.INTERNAL);
      assert.strictEqual(status.details, 'Invalid%2');
      assert.strictEqual(getMapCallCount, 0);
      assert.strictEqual(status.metadata.get('grpc-status').length, 0);
      assert.strictEqual(status.metadata.get('grpc-message').length, 0);
      done();
    });

    mockHttp2Stream.emit('trailers', {
      'grpc-status': String(grpc.status.INTERNAL),
      'grpc-message': 'Invalid%2',
    });
    mockHttp2Stream.emit('end');
  });
});

describe('Client without a server', () => {
  let client: Client;
  before(() => {
    // Arbitrary target that should not have a running server
    client = new Client('localhost:12345', clientInsecureCreds);
  });
  after(() => {
    client.close();
  });
  it('should fail multiple calls to the nonexistent server', function (done) {
    this.timeout(5000);
    // Regression test for https://github.com/grpc/grpc-node/issues/1411
    client.makeUnaryRequest(
      '/service/method',
      x => x,
      x => x,
      Buffer.from([]),
      (error, value) => {
        assert(error);
        assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
        client.makeUnaryRequest(
          '/service/method',
          x => x,
          x => x,
          Buffer.from([]),
          (error, value) => {
            assert(error);
            assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
            done();
          }
        );
      }
    );
  });
  it('close should force calls to end', done => {
    client.makeUnaryRequest(
      '/service/method',
      x => x,
      x => x,
      Buffer.from([]),
      new grpc.Metadata({waitForReady: true}),
      (error, value) => {
        assert(error);
        assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
        done();
      }
    );
    client.close();
  });
});

describe('Client with a nonexistent target domain', () => {
  let client: Client;
  before(() => {
    // DNS name that does not exist per RFC 6761 section 6.4
    client = new Client('host.invalid', clientInsecureCreds);
  });
  after(() => {
    client.close();
  });
  it('should fail multiple calls', function (done) {
    this.timeout(process.platform === 'win32' ? 15000 : 5000);
    // Regression test for https://github.com/grpc/grpc-node/issues/1411
    client.makeUnaryRequest(
      '/service/method',
      x => x,
      x => x,
      Buffer.from([]),
      (error, value) => {
        assert(error);
        assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
        client.makeUnaryRequest(
          '/service/method',
          x => x,
          x => x,
          Buffer.from([]),
          (error, value) => {
            assert(error);
            assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
            done();
          }
        );
      }
    );
  });
  it('close should force calls to end', done => {
    client.makeUnaryRequest(
      '/service/method',
      x => x,
      x => x,
      Buffer.from([]),
      new grpc.Metadata({waitForReady: true}),
      (error, value) => {
        assert(error);
        assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
        done();
      }
    );
    client.close();
  });
});
