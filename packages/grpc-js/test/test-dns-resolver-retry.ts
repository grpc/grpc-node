/*
 * Copyright 2026 gRPC authors.
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
import { promises as dnsPromises } from 'dns';
import * as grpc from '../src';
import { ConnectivityState } from '../src/connectivity-state';
import { TestClient, TestServer } from './common';

const HOST = 'late.invalid';

/**
 * Controllable stand-in for dns.promises.lookup. Offline and deterministic.
 * The resolver imports that same promises object and reads `.lookup` at
 * call time, so replacing the method is enough.
 */
class LookupController {
  fail = true;
  lookupCount = 0;
  inFlight = 0;
  maxInFlight = 0;
  private original = dnsPromises.lookup;

  install() {
    dnsPromises.lookup = ((hostname: string) => {
      this.lookupCount += 1;
      this.inFlight += 1;
      this.maxInFlight = Math.max(this.maxInFlight, this.inFlight);
      return new Promise((resolve, reject) => {
        setImmediate(() => {
          this.inFlight -= 1;
          if (this.fail) {
            reject(new Error(`ENOTFOUND ${hostname}`));
            return;
          }
          resolve([{ address: '127.0.0.1', family: 4 }]);
        });
      });
    }) as typeof dnsPromises.lookup;
  }

  restore() {
    dnsPromises.lookup = this.original;
  }

  waitForCount(count: number, timeoutMs: number): Promise<void> {
    const start = Date.now();
    return new Promise((resolve, reject) => {
      const check = () => {
        if (this.lookupCount >= count) {
          resolve();
          return;
        }
        if (Date.now() - start > timeoutMs) {
          reject(
            new Error(
              `timed out waiting for ${count} lookups, saw ${this.lookupCount}`
            )
          );
          return;
        }
        setTimeout(check, 10);
      };
      check();
    });
  }
}

const channelOptions = {
  'grpc.initial_reconnect_backoff_ms': 20,
  'grpc.max_reconnect_backoff_ms': 40,
  'grpc.service_config_disable_resolution': 1,
  'grpc.enable_http_proxy': 0,
  'grpc.enable_channelz': 0,
};

describe('DNS resolver retry on failure', () => {
  let server: TestServer;
  let port: number;
  let controller: LookupController;
  let client: TestClient | null = null;

  before(async () => {
    server = new TestServer(false);
    await server.start();
    port = Number(server.getTarget().split(':')[1]);
  });

  beforeEach(() => {
    controller = new LookupController();
    controller.install();
  });

  afterEach(() => {
    client?.close();
    client = null;
    controller.restore();
  });

  after(() => {
    server.shutdown();
  });

  function target(): string {
    return `dns:${HOST}:${port}`;
  }

  function openClient(extra?: grpc.ChannelOptions): TestClient {
    client = new TestClient(target(), false, {
      ...channelOptions,
      ...extra,
    });
    return client;
  }

  /* TestClient keeps its Client private. Connectivity tests need the channel. */
  function getChannel(opened: TestClient): grpc.Channel {
    return (
      opened as unknown as { client: { getChannel(): grpc.Channel } }
    ).client.getChannel();
  }

  it('reaches READY via watchConnectivityState after DNS starts succeeding', function (done) {
    this.timeout(4000);
    const opened = openClient();
    const channel = getChannel(opened);
    const deadline = Date.now() + 3000;
    const watch = () => {
      const state = channel.getConnectivityState(true);
      if (state === ConnectivityState.READY) {
        try {
          assert.ok(controller.lookupCount >= 2);
          assert.strictEqual(controller.maxInFlight, 1);
          done();
        } catch (error) {
          done(error);
        }
        return;
      }
      channel.watchConnectivityState(state, deadline, (err?: Error) => {
        if (err) {
          done(err);
          return;
        }
        watch();
      });
    };
    watch();
    controller.waitForCount(2, 2000).then(
      () => {
        controller.fail = false;
      },
      error => done(error)
    );
  });

  it('reaches READY via waitForReady after DNS starts succeeding', function (done) {
    this.timeout(4000);
    const opened = openClient();
    opened.waitForReady(Date.now() + 3000, (err?: Error) => {
      try {
        assert.ifError(err);
        assert.strictEqual(
          getChannel(opened).getConnectivityState(false),
          ConnectivityState.READY
        );
        assert.ok(controller.lookupCount >= 2);
        done();
      } catch (error) {
        done(error);
      }
    });
    controller.waitForCount(2, 2000).then(
      () => {
        controller.fail = false;
      },
      error => done(error)
    );
  });

  it('completes one queued wait-for-ready RPC without a later RPC to kick resolution', function (done) {
    this.timeout(4000);
    const opened = openClient();
    let calls = 0;
    opened.sendRequestWithMetadata(
      new grpc.Metadata({ waitForReady: true }),
      (err?: grpc.ServiceError) => {
        calls += 1;
        try {
          assert.ifError(err);
          assert.strictEqual(calls, 1);
          assert.ok(controller.lookupCount >= 2);
          assert.strictEqual(controller.maxInFlight, 1);
          done();
        } catch (error) {
          done(error);
        }
      }
    );
    controller.waitForCount(2, 2000).then(
      () => {
        controller.fail = false;
      },
      error => done(error)
    );
  });

  it('stops retries when the channel goes IDLE', function (done) {
    this.timeout(5000);
    const opened = openClient({ 'grpc.client_idle_timeout_ms': 1000 });
    const channel = getChannel(opened);
    channel.getConnectivityState(true);
    const started = Date.now();
    const waitForIdle = () => {
      if (channel.getConnectivityState(false) === ConnectivityState.IDLE) {
        const frozen = controller.lookupCount;
        assert.ok(frozen >= 2, `lookupCount=${frozen}`);
        setTimeout(() => {
          try {
            assert.strictEqual(controller.lookupCount, frozen);
            assert.strictEqual(
              channel.getConnectivityState(false),
              ConnectivityState.IDLE
            );
            done();
          } catch (error) {
            done(error);
          }
        }, 300);
        return;
      }
      if (Date.now() - started > 3500) {
        done(
          new Error(
            `channel did not go IDLE (lookups=${controller.lookupCount})`
          )
        );
        return;
      }
      setTimeout(waitForIdle, 50);
    };
    setTimeout(waitForIdle, 200);
  });

  it('does not restart resolution when a SHUTDOWN watcher calls getConnectivityState(true)', function (done) {
    this.timeout(3000);
    const opened = openClient();
    const channel = getChannel(opened);
    let connectAttemptsAfterShutdown = 0;
    const watch = () => {
      let state: ConnectivityState;
      try {
        state = channel.getConnectivityState(false);
      } catch (error) {
        done(error);
        return;
      }
      if (state === ConnectivityState.SHUTDOWN) {
        const before = controller.lookupCount;
        /* Same call Client.waitForReady makes from a synchronous watcher. */
        channel.getConnectivityState(true);
        connectAttemptsAfterShutdown = controller.lookupCount - before;
        return;
      }
      channel.watchConnectivityState(state, Infinity, () => {
        watch();
      });
    };
    watch();
    channel.getConnectivityState(true);
    controller.waitForCount(2, 2000).then(
      () => {
        const atClose = controller.lookupCount;
        opened.close();
        client = null;
        setTimeout(() => {
          try {
            assert.strictEqual(connectAttemptsAfterShutdown, 0);
            assert.strictEqual(controller.lookupCount, atClose);
            assert.strictEqual(controller.inFlight, 0);
            done();
          } catch (error) {
            done(error);
          }
        }, 250);
      },
      error => done(error)
    );
  });

  it('does not restart resolution when waitForReady observes close()', function (done) {
    this.timeout(3000);
    const opened = openClient();
    let readyError: Error | null = null;
    opened.waitForReady(Date.now() + 3000, (err?: Error) => {
      if (!err) {
        readyError = new Error('waitForReady resolved after close');
      }
    });
    controller.waitForCount(2, 2000).then(
      () => {
        const atClose = controller.lookupCount;
        opened.close();
        client = null;
        setTimeout(() => {
          try {
            assert.strictEqual(readyError, null);
            assert.strictEqual(controller.lookupCount, atClose);
            done();
          } catch (error) {
            done(error);
          }
        }, 250);
      },
      error => done(error)
    );
  });
});
