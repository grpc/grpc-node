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

import * as grpc from '../src';
import { Client, Server, ServerCredentials } from '../src';
import { callErrorFromStatus } from '../src/call';
import { recognizedOptions } from '../src/channel-options';
import { ConnectivityState } from '../src/connectivity-state';

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

describe('Client caller stack traces opt-out', () => {
  it('should have grpc-node.enable_caller_stack_traces in recognizedOptions', () => {
    assert.strictEqual(
      recognizedOptions['grpc-node.enable_caller_stack_traces'],
      true
    );
  });

  describe('callErrorFromStatus', () => {
    it('should construct a ServiceError with status and caller stack', () => {
      const status = {
        code: grpc.status.INTERNAL,
        details: 'Internal error details',
        metadata: new grpc.Metadata(),
      };
      const error = callErrorFromStatus(status, 'test-caller-stack');
      assert.strictEqual(error.code, grpc.status.INTERNAL);
      assert.strictEqual(error.details, 'Internal error details');
      assert.strictEqual(error.metadata, status.metadata);
      assert.ok(error.stack);
      assert.ok(error.stack.includes('for call at\ntest-caller-stack'));
    });
  });

  describe('unary calls', () => {
    it('should include caller stack trace by default', done => {
      const client = new Client('localhost:1', clientInsecureCreds);
      client.makeUnaryRequest(
        '/service/method',
        x => x,
        x => x,
        Buffer.from([]),
        error => {
          assert(error);
          assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
          assert.ok(error?.stack?.includes('for call at'));
          assert.ok(
            !error?.stack?.includes('for call at\nno stack trace available')
          );
          client.close();
          done();
        }
      );
    });

    it('should include caller stack trace when explicitly enabled', done => {
      const client = new Client('localhost:1', clientInsecureCreds, {
        'grpc-node.enable_caller_stack_traces': 1,
      });
      client.makeUnaryRequest(
        '/service/method',
        x => x,
        x => x,
        Buffer.from([]),
        error => {
          assert(error);
          assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
          assert.ok(error?.stack?.includes('for call at'));
          assert.ok(
            !error?.stack?.includes('for call at\nno stack trace available')
          );
          client.close();
          done();
        }
      );
    });

    it('should omit caller stack trace when disabled with 0', done => {
      const client = new Client('localhost:1', clientInsecureCreds, {
        'grpc-node.enable_caller_stack_traces': 0,
      });
      client.makeUnaryRequest(
        '/service/method',
        x => x,
        x => x,
        Buffer.from([]),
        error => {
          assert(error);
          assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
          assert.ok(
            error?.stack?.includes('for call at\nno stack trace available')
          );
          client.close();
          done();
        }
      );
    });

    it('should omit caller stack trace when disabled with false', done => {
      const client = new Client('localhost:1', clientInsecureCreds, {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        'grpc-node.enable_caller_stack_traces': false as any,
      });
      client.makeUnaryRequest(
        '/service/method',
        x => x,
        x => x,
        Buffer.from([]),
        error => {
          assert(error);
          assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
          assert.ok(
            error?.stack?.includes('for call at\nno stack trace available')
          );
          client.close();
          done();
        }
      );
    });
  });

  describe('streaming calls', () => {
    it('should include caller stack trace on client-streaming error by default', done => {
      const client = new Client('localhost:1', clientInsecureCreds);
      const stream = client.makeClientStreamRequest(
        '/service/method',
        (x: Buffer) => x,
        x => x,
        error => {
          assert(error);
          assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
          assert.ok(error?.stack?.includes('for call at'));
          assert.ok(
            !error?.stack?.includes('for call at\nno stack trace available')
          );
          client.close();
          done();
        }
      );
      stream.write(Buffer.from([]));
    });

    it('should omit caller stack trace on client-streaming error when disabled', done => {
      const client = new Client('localhost:1', clientInsecureCreds, {
        'grpc-node.enable_caller_stack_traces': 0,
      });
      const stream = client.makeClientStreamRequest(
        '/service/method',
        (x: Buffer) => x,
        x => x,
        error => {
          assert(error);
          assert.strictEqual(error?.code, grpc.status.UNAVAILABLE);
          assert.ok(
            error?.stack?.includes('for call at\nno stack trace available')
          );
          client.close();
          done();
        }
      );
      stream.write(Buffer.from([]));
    });

    it('should include caller stack trace on server-streaming error by default', done => {
      const client = new Client('localhost:1', clientInsecureCreds);
      const stream = client.makeServerStreamRequest(
        '/service/method',
        x => x,
        x => x,
        Buffer.from([])
      );
      stream.on('error', (error: grpc.ServiceError) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNAVAILABLE);
        assert.ok(error.stack?.includes('for call at'));
        assert.ok(
          !error.stack?.includes('for call at\nno stack trace available')
        );
        client.close();
        done();
      });
    });

    it('should omit caller stack trace on server-streaming error when disabled', done => {
      const client = new Client('localhost:1', clientInsecureCreds, {
        'grpc-node.enable_caller_stack_traces': 0,
      });
      const stream = client.makeServerStreamRequest(
        '/service/method',
        x => x,
        x => x,
        Buffer.from([])
      );
      stream.on('error', (error: grpc.ServiceError) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNAVAILABLE);
        assert.ok(
          error.stack?.includes('for call at\nno stack trace available')
        );
        client.close();
        done();
      });
    });

    it('should include caller stack trace on bidi-streaming error by default', done => {
      const client = new Client('localhost:1', clientInsecureCreds);
      const stream = client.makeBidiStreamRequest(
        '/service/method',
        (x: Buffer) => x,
        x => x
      );
      stream.on('error', (error: grpc.ServiceError) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNAVAILABLE);
        assert.ok(error.stack?.includes('for call at'));
        assert.ok(
          !error.stack?.includes('for call at\nno stack trace available')
        );
        client.close();
        done();
      });
    });

    it('should omit caller stack trace on bidi-streaming error when disabled', done => {
      const client = new Client('localhost:1', clientInsecureCreds, {
        'grpc-node.enable_caller_stack_traces': 0,
      });
      const stream = client.makeBidiStreamRequest(
        '/service/method',
        (x: Buffer) => x,
        x => x
      );
      stream.on('error', (error: grpc.ServiceError) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNAVAILABLE);
        assert.ok(
          error.stack?.includes('for call at\nno stack trace available')
        );
        client.close();
        done();
      });
    });
  });
});
