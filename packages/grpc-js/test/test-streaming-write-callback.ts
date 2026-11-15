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
import * as http2 from 'http2';
import * as net from 'net';
import * as grpc from '../src';
import { ClientDuplexStreamImpl, ClientWritableStreamImpl } from '../src/call';
import { MessageContext, statusOrFromValue } from '../src/call-interface';
import { InterceptingCallInterface } from '../src/client-interceptors';
import { Resolver, ResolverListener, registerResolver } from '../src/resolver';
import { Endpoint } from '../src/subchannel-address';
import { GrpcUri } from '../src/uri-parser';

const CLIENT_PATH = '/test.WriteCallback/Upload';
const BIDI_PATH = '/test.WriteCallback/Chat';
const identity = (value: Buffer): Buffer => value;

const clientMethod = {
  path: CLIENT_PATH,
  requestStream: true,
  responseStream: false,
  requestSerialize: identity,
  requestDeserialize: identity,
  responseSerialize: identity,
  responseDeserialize: identity,
};

const bidiMethod = {
  path: BIDI_PATH,
  requestStream: true,
  responseStream: true,
  requestSerialize: identity,
  requestDeserialize: identity,
  responseSerialize: identity,
  responseDeserialize: identity,
};

const LARGE = Buffer.alloc(64 * 1024);

interface HeldWrite {
  held: Promise<Error | null | undefined>;
  queued: Promise<Error | null | undefined>;
  invocationCount: () => number;
  writeCount: number;
}

/**
 * Write until one callback stays pending, then queue one more write behind it.
 * Successful writes are followed immediately. Waiting out the full stall between
 * them lets the transport drain the retry buffer, so no callback stays pending.
 */
function writeUntilHeld(
  call: grpc.ClientWritableStream<Buffer>,
  stallMs = 200
): Promise<HeldWrite> {
  return new Promise((resolve, reject) => {
    let invocations = 0;
    let started = 0;
    const attempt = (index: number) => {
      if (index > 64) {
        reject(new Error('write never stalled under backpressure'));
        return;
      }
      let settled = false;
      started += 1;
      const held = new Promise<Error | null | undefined>(done => {
        call.write(LARGE, (error?: Error | null) => {
          invocations += 1;
          settled = true;
          done(error);
        });
      });
      const startedAt = Date.now();
      const check = () => {
        if (settled) {
          attempt(index + 1);
          return;
        }
        if (Date.now() - startedAt < stallMs) {
          setTimeout(check, 10);
          return;
        }
        started += 1;
        const queued = new Promise<Error | null | undefined>(done => {
          call.write(Buffer.alloc(1), (error?: Error | null) => {
            invocations += 1;
            done(error);
          });
        });
        resolve({
          held,
          queued,
          invocationCount: () => invocations,
          writeCount: started,
        });
      };
      setTimeout(check, 10);
    };
    attempt(0);
  });
}

function assertWriteError(
  error: Error | null | undefined,
  code?: grpc.status
): void {
  assert.ok(error instanceof Error, `expected an Error, got ${error}`);
  if (code !== undefined) {
    assert.strictEqual(
      (error as Error & { code?: number }).code,
      code,
      error.message
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface TrackedCallback {
  count: number;
  error: Error | null | undefined;
  invoke: (error?: Error | null) => void;
  done: Promise<Error | null | undefined>;
}

function trackCallback(): TrackedCallback {
  let finish: (error: Error | null | undefined) => void = () => {};
  const done = new Promise<Error | null | undefined>(resolve => {
    finish = resolve;
  });
  const tracked: TrackedCallback = {
    count: 0,
    error: undefined,
    done,
    invoke: error => {
      tracked.count += 1;
      tracked.error = error;
      if (tracked.count === 1) {
        finish(error);
      }
    },
  };
  return tracked;
}

function assertCancelledOnce(tracked: TrackedCallback): void {
  assert.strictEqual(tracked.count, 1, `callback count ${tracked.count}`);
  assertWriteError(tracked.error, grpc.status.CANCELLED);
}

function assertSucceededOnce(tracked: TrackedCallback): void {
  assert.strictEqual(tracked.count, 1, `callback count ${tracked.count}`);
  assert.strictEqual(tracked.error ?? null, null);
}

function surfaceCall(
  send: InterceptingCallInterface['sendMessageWithContext']
): InterceptingCallInterface {
  return {
    cancelWithStatus() {},
    getPeer: () => 'test',
    start() {},
    sendMessageWithContext: send,
    sendMessage() {},
    startRead() {},
    halfClose() {},
    getAuthContext: () => null,
  };
}

/**
 * `write()` only starts the next `_write` after the previous one settles, so
 * a second `write()` stays in Node's buffer while the first is held. Pushing
 * the later message through the same call the surface uses puts it in the
 * layer that is still holding the first callback.
 */
function sendWhileHeld(
  call: grpc.ClientWritableStream<Buffer>,
  message: Buffer,
  callback: (error?: Error | null) => void
): void {
  call.call!.sendMessageWithContext({ callback }, message);
}

let releaseHold: (() => void) | undefined;

function publishResolution(): void {
  const publish = releaseHold;
  if (!publish) {
    throw new Error('name resolution was not started');
  }
  publish();
}

class HoldResolution implements Resolver {
  private released = false;
  private readonly endpoints: Endpoint[];

  constructor(target: GrpcUri, private readonly listener: ResolverListener) {
    const [host, portText] = target.path.split(':');
    this.endpoints = [{ addresses: [{ host, port: Number(portText) }] }];
    releaseHold = () => {
      this.publish();
    };
  }

  private publish(): void {
    if (this.released) {
      return;
    }
    this.released = true;
    process.nextTick(() => {
      this.listener(statusOrFromValue(this.endpoints), {}, null, '');
    });
  }

  updateResolution(): void {
    if (this.released) {
      process.nextTick(() => {
        this.listener(statusOrFromValue(this.endpoints), {}, null, '');
      });
    }
  }

  destroy(): void {}

  static getDefaultAuthority(_target: GrpcUri): string {
    return 'localhost';
  }
}

registerResolver('writecbhold', HoldResolution);

function listenPort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.listen(0, '127.0.0.1', () => {
      const address = probe.address();
      if (!address || typeof address !== 'object') {
        reject(new Error('failed to reserve a port'));
        return;
      }
      const reserved = address.port;
      probe.close(error => {
        if (error) {
          reject(error);
          return;
        }
        resolve(reserved);
      });
    });
  });
}

function onceWithin(
  promise: Promise<Error | null | undefined>,
  ms: number
): Promise<Error | null | undefined> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`write callback still pending after ${ms}ms`));
    }, ms);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      err => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

describe('streaming write callbacks when the call ends', () => {
  let server: grpc.Server;
  let client: grpc.Client;
  let port: number;

  afterEach(async () => {
    client?.close();
    const serverToClose = server;
    if (!serverToClose) {
      return;
    }
    // Capture the server and cancel the fallback timer. The callback closes
    // over `server`, so a timer left running shuts down the next test's server.
    await new Promise<void>(resolve => {
      const timer = setTimeout(() => {
        serverToClose.forceShutdown();
        resolve();
      }, 500);
      serverToClose.tryShutdown(error => {
        clearTimeout(timer);
        if (error) {
          serverToClose.forceShutdown();
        }
        resolve();
      });
    });
  });

  async function startServer(
    handlers: grpc.UntypedServiceImplementation,
    clientOptions?: grpc.ClientOptions,
    serverOptions?: grpc.ServerOptions
  ): Promise<void> {
    server = new grpc.Server(serverOptions);
    server.addService(
      {
        upload: clientMethod,
        chat: bidiMethod,
      },
      handlers
    );
    port = await new Promise<number>((resolve, reject) => {
      server.bindAsync(
        '127.0.0.1:0',
        grpc.ServerCredentials.createInsecure(),
        (error, boundPort) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(boundPort);
        }
      );
    });
    client = new grpc.Client(
      `127.0.0.1:${port}`,
      grpc.credentials.createInsecure(),
      {
        // The process-wide pool reuses a subchannel after the previous server
        // has shut it down. That surfaces as RST_STREAM CANCEL and the write
        // callbacks settle instead of staying blocked on flow control.
        'grpc.use_local_subchannel_pool': 1,
        ...clientOptions,
      }
    );
  }

  function clientStream(
    metadata?: grpc.Metadata,
    options?: grpc.CallOptions
  ): grpc.ClientWritableStream<Buffer> {
    return client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      metadata ?? new grpc.Metadata(),
      options ?? {},
      () => {}
    );
  }

  it('settles a held client-streaming write when the call is cancelled', async () => {
    await startServer({
      upload: (call: grpc.ServerReadableStream<Buffer, Buffer>) => {
        call.sendMetadata(new grpc.Metadata());
      },
    });
    const call = clientStream();
    await new Promise<void>(resolve => call.once('metadata', () => resolve()));
    const { held, queued, invocationCount, writeCount } = await writeUntilHeld(
      call
    );
    call.cancel();
    const [heldError, queuedError] = await Promise.all([
      onceWithin(held, 1000),
      onceWithin(queued, 1000),
    ]);
    assertWriteError(heldError, grpc.status.CANCELLED);
    assertWriteError(queuedError, grpc.status.CANCELLED);
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    assert.strictEqual(invocationCount(), writeCount);
  });

  it('settles a held write when the deadline is exceeded', async () => {
    // A grpc.Server enforces grpc-timeout on the same deadline. With a 1-byte
    // window that timer can reset the stream as CANCELLED before trailers
    // arrive. This peer never ends the call, so only the client deadline does.
    const http2Server = http2.createServer({
      settings: { initialWindowSize: 1 },
    });
    http2Server.on('stream', (stream: http2.ServerHttp2Stream) => {
      stream.pause();
      stream.respond({
        ':status': 200,
        'content-type': 'application/grpc',
      });
    });
    const port = await new Promise<number>((resolve, reject) => {
      http2Server.listen(0, '127.0.0.1', () => {
        const address = http2Server.address();
        if (address && typeof address === 'object') {
          resolve(address.port);
          return;
        }
        reject(new Error('http2 server did not bind'));
      });
    });
    client = new grpc.Client(
      `127.0.0.1:${port}`,
      grpc.credentials.createInsecure(),
      {
        'grpc.use_local_subchannel_pool': 1,
      }
    );
    try {
      const call = clientStream(new grpc.Metadata(), {
        deadline: Date.now() + 1000,
      });
      await new Promise<void>(resolve =>
        call.once('metadata', () => resolve())
      );
      const { held, queued } = await writeUntilHeld(call, 50);
      const [heldError, queuedError] = await Promise.all([
        onceWithin(held, 3000),
        onceWithin(queued, 3000),
      ]);
      assertWriteError(heldError, grpc.status.DEADLINE_EXCEEDED);
      assertWriteError(queuedError, grpc.status.DEADLINE_EXCEEDED);
    } finally {
      await new Promise<void>(resolve => {
        http2Server.close(() => resolve());
      });
    }
  });

  it('settles a held write when the server ends the call with OK', async () => {
    let finish: (() => void) | undefined;
    await startServer({
      upload: (
        call: grpc.ServerReadableStream<Buffer, Buffer>,
        callback: grpc.sendUnaryData<Buffer>
      ) => {
        call.sendMetadata(new grpc.Metadata());
        finish = () => callback(null, Buffer.alloc(0));
      },
    });
    const call = clientStream();
    await new Promise<void>(resolve => call.once('metadata', () => resolve()));
    const { held, queued } = await writeUntilHeld(call);
    finish!();
    const [heldError, queuedError] = await Promise.all([
      onceWithin(held, 1000),
      onceWithin(queued, 1000),
    ]);
    assertWriteError(heldError);
    assertWriteError(queuedError);
  });

  it('settles a held write when the server ends the call with an error', async () => {
    let finish: (() => void) | undefined;
    await startServer({
      upload: (
        call: grpc.ServerReadableStream<Buffer, Buffer>,
        callback: grpc.sendUnaryData<Buffer>
      ) => {
        call.sendMetadata(new grpc.Metadata());
        finish = () =>
          callback({
            code: grpc.status.INTERNAL,
            details: 'server failed',
          });
      },
    });
    const call = clientStream();
    await new Promise<void>(resolve => call.once('metadata', () => resolve()));
    const { held, queued } = await writeUntilHeld(call);
    finish!();
    const [heldError, queuedError] = await Promise.all([
      onceWithin(held, 1000),
      onceWithin(queued, 1000),
    ]);
    assertWriteError(heldError, grpc.status.INTERNAL);
    assertWriteError(queuedError, grpc.status.INTERNAL);
  });

  async function assertBidiResponsesSurvive(
    endCall: (call: grpc.ServerDuplexStream<Buffer, Buffer>) => void,
    expectedCode?: grpc.status
  ): Promise<void> {
    let serverCall: grpc.ServerDuplexStream<Buffer, Buffer> | undefined;
    await startServer({
      chat: (call: grpc.ServerDuplexStream<Buffer, Buffer>) => {
        serverCall = call;
        call.sendMetadata(new grpc.Metadata());
      },
    });
    const call = client.makeBidiStreamRequest(
      BIDI_PATH,
      identity,
      identity,
      new grpc.Metadata()
    );
    const messages: string[] = [];
    let ended = false;
    let streamError: Error | undefined;
    call.on('data', (message: Buffer) => {
      messages.push(message.toString());
    });
    call.on('end', () => {
      ended = true;
    });
    call.on('error', (error: Error) => {
      streamError = error;
    });
    await new Promise<void>(resolve => call.once('metadata', () => resolve()));
    const { held, queued, invocationCount, writeCount } = await writeUntilHeld(
      call
    );
    endCall(serverCall!);
    const [heldError, queuedError] = await Promise.all([
      onceWithin(held, 1000),
      onceWithin(queued, 1000),
    ]);
    assertWriteError(heldError, expectedCode);
    assertWriteError(queuedError, expectedCode);
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    assert.strictEqual(invocationCount(), writeCount);
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(
        () => reject(new Error('bidi readable end was not delivered')),
        1000
      );
      if (ended) {
        clearTimeout(timer);
        resolve();
        return;
      }
      call.once('end', () => {
        clearTimeout(timer);
        resolve();
      });
    });
    assert.deepStrictEqual(messages, ['one', 'two', 'three']);
    assert.strictEqual(ended, true);
    if (expectedCode === undefined) {
      assert.strictEqual(streamError, undefined);
    } else {
      assert.strictEqual(
        (streamError as (Error & { code?: number }) | undefined)?.code,
        expectedCode
      );
    }
  }

  it('keeps buffered bidi responses when the server ends with OK', async () => {
    await assertBidiResponsesSurvive(call => {
      call.write(Buffer.from('one'));
      call.write(Buffer.from('two'));
      call.write(Buffer.from('three'));
      call.end();
    });
  });

  it('keeps buffered bidi responses when the server ends with an error', async () => {
    await assertBidiResponsesSurvive(call => {
      call.write(Buffer.from('one'));
      call.write(Buffer.from('two'));
      call.write(Buffer.from('three'));
      call.emit('error', {
        code: grpc.status.INTERNAL,
        details: 'server failed',
      });
    }, grpc.status.INTERNAL);
  });

  it('settles a write held before name resolution when the call is cancelled', async () => {
    // The system resolver reports ENOTFOUND immediately. No subchannel is
    // picked, so the write stays queued until the call ends.
    client = new grpc.Client(
      'dns://192.0.2.1:53/write-callback-held.test:1',
      grpc.credentials.createInsecure(),
      { 'grpc.service_config_disable_resolution': 1 }
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata({ waitForReady: true }),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    let invocations = 0;
    let error: Error | null | undefined;
    const pending = new Promise<void>(resolve => {
      call.write(
        Buffer.from('before-resolution'),
        (writeError?: Error | null) => {
          invocations += 1;
          error = writeError;
          resolve();
        }
      );
    });
    await new Promise<void>(resolve => setTimeout(resolve, 50));
    assert.strictEqual(invocations, 0);
    call.cancel();
    await onceWithin(
      pending.then(() => error),
      1000
    );
    assert.strictEqual(invocations, 1);
    assertWriteError(error, grpc.status.CANCELLED);
    await new Promise<void>(resolve => setTimeout(resolve, 100));
    assert.strictEqual(invocations, 1);
  });

  it('settles a write held before the subchannel is ready when the call is cancelled', async () => {
    client = new grpc.Client(
      'ipv4:192.0.2.1:1',
      grpc.credentials.createInsecure(),
      { 'grpc.per_rpc_retry_buffer_size': 0 }
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata({ waitForReady: true }),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    let invocations = 0;
    let error: Error | null | undefined;
    const pending = new Promise<void>(resolve => {
      call.write(
        Buffer.from('before-subchannel'),
        (writeError?: Error | null) => {
          invocations += 1;
          error = writeError;
          resolve();
        }
      );
    });
    await new Promise<void>(resolve => setTimeout(resolve, 50));
    assert.strictEqual(invocations, 0);
    call.cancel();
    await onceWithin(
      pending.then(() => error),
      1000
    );
    assert.strictEqual(invocations, 1);
    assertWriteError(error, grpc.status.CANCELLED);
    await new Promise<void>(resolve => setTimeout(resolve, 100));
    assert.strictEqual(invocations, 1);
  });

  it('still completes an unblocked write without an error', async () => {
    await startServer({
      upload: (
        call: grpc.ServerReadableStream<Buffer, Buffer>,
        callback: grpc.sendUnaryData<Buffer>
      ) => {
        call.sendMetadata(new grpc.Metadata());
        call.on('data', () => {});
        call.on('end', () => callback(null, Buffer.from('ok')));
      },
    });
    const call = clientStream();
    await new Promise<void>(resolve => call.once('metadata', () => resolve()));
    const error = await new Promise<Error | null | undefined>(resolve => {
      call.write(Buffer.from('hello'), resolve);
    });
    assert.strictEqual(error ?? null, null);
    call.end();
  });

  async function expectQueuedWritesShareOneFailure(
    stream:
      | ClientWritableStreamImpl<Buffer>
      | ClientDuplexStreamImpl<Buffer, Buffer>
  ): Promise<void> {
    const sent: string[] = [];
    let firstCallback: MessageContext['callback'];
    const sawFirst = new Promise<void>(resolve => {
      stream.call = surfaceCall((context, message) => {
        sent.push((message as Buffer).toString());
        if (sent.length === 1) {
          firstCallback = context.callback;
          resolve();
        }
      });
    });
    stream.on('error', () => {});
    const tracked = ['a', 'b', 'c'].map(text => {
      const write = trackCallback();
      stream.write(Buffer.from(text), write.invoke);
      return write;
    });
    await Promise.race([
      sawFirst,
      sleep(1000).then(() => {
        throw new Error('first queued write was not sent');
      }),
    ]);
    const failure = Object.assign(new Error('1 CANCELLED: cancelled'), {
      code: grpc.status.CANCELLED,
    });
    firstCallback!(failure);
    assert.deepStrictEqual(sent, ['a']);
    for (const write of tracked) {
      assert.strictEqual(write.count, 1);
      assert.strictEqual(write.error, failure);
    }
    await sleep(20);
    for (const write of tracked) {
      assert.strictEqual(write.count, 1);
    }
  }

  it('fails every queued client-streaming write with the first transport error', async () => {
    await expectQueuedWritesShareOneFailure(
      new ClientWritableStreamImpl<Buffer>(identity)
    );
  });

  it('fails every queued bidi write with the first transport error', async () => {
    await expectQueuedWritesShareOneFailure(
      new ClientDuplexStreamImpl<Buffer, Buffer>(identity, identity)
    );
  });

  it('still emits finish and readable bidi bytes when the write callback fails', async () => {
    const duplex = new ClientDuplexStreamImpl<Buffer, Buffer>(
      identity,
      identity
    );
    const held: MessageContext[] = [];
    duplex.call = surfaceCall(context => {
      held.push(context);
    });
    const received: string[] = [];
    let streamError: Error | undefined;
    duplex.on('data', (chunk: Buffer) => {
      received.push(chunk.toString());
    });
    duplex.on('error', (error: Error) => {
      streamError = error;
    });
    duplex.push(Buffer.from('one'));
    duplex.push(Buffer.from('two'));
    const write = trackCallback();
    duplex.write(Buffer.from('req'), write.invoke);
    await sleep(20);
    assert.strictEqual(held.length, 1);
    let finishCount = 0;
    duplex.on('finish', () => {
      finishCount += 1;
    });
    let endCount = 0;
    let endError: Error | null | undefined;
    const ended = new Promise<void>(resolve => {
      duplex.end((error?: Error | null) => {
        endCount += 1;
        endError = error;
        resolve();
      });
    });
    const failure = Object.assign(new Error('1 CANCELLED: cancelled'), {
      code: grpc.status.CANCELLED,
    });
    held[0].callback!(failure);
    await ended;
    duplex.push(Buffer.from('three'));
    duplex.push(null);
    await new Promise<void>((resolve, reject) => {
      if (duplex.readableEnded) {
        resolve();
        return;
      }
      const timer = setTimeout(
        () => reject(new Error('bidi readable end was not delivered')),
        1000
      );
      duplex.once('end', () => {
        clearTimeout(timer);
        resolve();
      });
    });
    assert.strictEqual(write.count, 1);
    assert.strictEqual(write.error, failure);
    assert.strictEqual(endCount, 1);
    assert.strictEqual(endError ?? null, null);
    assert.strictEqual(finishCount, 1);
    assert.deepStrictEqual(received, ['one', 'two', 'three']);
    assert.strictEqual(streamError, undefined);
  });

  for (const spec of [
    {
      name: 'client-streaming',
      create: () => new ClientWritableStreamImpl<Buffer>(identity),
    },
    {
      name: 'bidi',
      create: () =>
        new ClientDuplexStreamImpl<Buffer, Buffer>(identity, identity),
    },
  ]) {
    for (const shape of [
      'write(chunk, cb)',
      'write(chunk, flags, cb)',
    ] as const) {
      const writeAfterClose = (
        stream:
          | ClientWritableStreamImpl<Buffer>
          | ClientDuplexStreamImpl<Buffer, Buffer>,
        callback: (error?: Error | null) => void
      ): void => {
        if (shape === 'write(chunk, cb)') {
          stream.write(Buffer.from('late'), callback);
          return;
        }
        stream.write(Buffer.from('late'), 1, callback);
      };

      it(`invokes ${shape} once after end() on a ${spec.name} stream`, async () => {
        const stream = spec.create();
        stream.on('error', () => {});
        stream.call = surfaceCall(context => {
          process.nextTick(() => context.callback?.());
        });
        stream.write(Buffer.from('early'));
        await sleep(20);
        stream.end();
        const late = trackCallback();
        writeAfterClose(stream, late.invoke);
        await onceWithin(late.done, 1000);
        assert.strictEqual(late.count, 1);
        assert.ok(late.error instanceof Error);
        await sleep(30);
        assert.strictEqual(late.count, 1);
      });

      it(`invokes ${shape} once after destroy() on a ${spec.name} stream`, async () => {
        const stream = spec.create();
        stream.on('error', () => {});
        stream.call = surfaceCall(context => {
          process.nextTick(() => context.callback?.());
        });
        stream.write(Buffer.from('early'));
        await sleep(20);
        stream.destroy();
        assert.strictEqual(stream.destroyed, true);
        const late = trackCallback();
        writeAfterClose(stream, late.invoke);
        await onceWithin(late.done, 1000);
        assert.strictEqual(late.count, 1);
        assert.ok(late.error instanceof Error);
        await sleep(30);
        assert.strictEqual(late.count, 1);
      });
    }
  }

  it('cancels both small writes buffered before the subchannel is ready', async () => {
    client = new grpc.Client(
      'ipv4:192.0.2.1:1',
      grpc.credentials.createInsecure()
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata({ waitForReady: true }),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    const first = trackCallback();
    const second = trackCallback();
    call.write(Buffer.from('one'), first.invoke);
    await sleep(50);
    assert.strictEqual(first.count, 0);
    sendWhileHeld(call, Buffer.from('two'), second.invoke);
    await sleep(50);
    assert.strictEqual(
      second.count,
      0,
      'a write queued behind a held one was acknowledged'
    );
    call.cancel();
    await Promise.all([
      onceWithin(first.done, 1000),
      onceWithin(second.done, 1000),
    ]);
    assertCancelledOnce(first);
    assertCancelledOnce(second);
    await sleep(50);
    assert.strictEqual(first.count, 1);
    assert.strictEqual(second.count, 1);
  });

  it('cancels two write() calls issued before the subchannel is ready', async () => {
    client = new grpc.Client(
      'ipv4:192.0.2.1:1',
      grpc.credentials.createInsecure()
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata({ waitForReady: true }),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    const first = trackCallback();
    const second = trackCallback();
    call.write(Buffer.from('one'), first.invoke);
    call.write(Buffer.from('two'), second.invoke);
    await sleep(50);
    assert.strictEqual(first.count, 0);
    assert.strictEqual(second.count, 0);
    call.cancel();
    await Promise.all([
      onceWithin(first.done, 1000),
      onceWithin(second.done, 1000),
    ]);
    assertCancelledOnce(first);
    assertCancelledOnce(second);
  });

  async function bindRecordingServer(boundPort: number, seen: string[]) {
    server = new grpc.Server();
    server.addService(
      { upload: clientMethod, chat: bidiMethod },
      {
        upload: (call: grpc.ServerReadableStream<Buffer, Buffer>) => {
          call.on('data', (message: Buffer) => {
            seen.push(message.toString());
          });
        },
      }
    );
    await new Promise<void>((resolve, reject) => {
      server.bindAsync(
        `127.0.0.1:${boundPort}`,
        grpc.ServerCredentials.createInsecure(),
        error => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });
  }

  it('delivers two small writes in order when a subchannel becomes ready', async () => {
    const boundPort = await listenPort();
    const seen: string[] = [];
    client = new grpc.Client(
      `127.0.0.1:${boundPort}`,
      grpc.credentials.createInsecure(),
      {
        'grpc.initial_reconnect_backoff_ms': 100,
        'grpc.max_reconnect_backoff_ms': 200,
        'grpc.use_local_subchannel_pool': 1,
      }
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata({ waitForReady: true }),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    const first = trackCallback();
    const second = trackCallback();
    call.write(Buffer.from('one'), first.invoke);
    call.write(Buffer.from('two'), second.invoke);
    await sleep(50);
    assert.strictEqual(first.count, 0);
    assert.strictEqual(second.count, 0);
    await bindRecordingServer(boundPort, seen);
    await Promise.all([
      onceWithin(first.done, 5000),
      onceWithin(second.done, 5000),
    ]);
    assertSucceededOnce(first);
    assertSucceededOnce(second);
    await sleep(200);
    assert.deepStrictEqual(seen, ['one', 'two']);
  });

  it('does not ack a buffered write until the held write can complete', async () => {
    const boundPort = await listenPort();
    const seen: string[] = [];
    client = new grpc.Client(
      `127.0.0.1:${boundPort}`,
      grpc.credentials.createInsecure(),
      {
        'grpc.initial_reconnect_backoff_ms': 100,
        'grpc.max_reconnect_backoff_ms': 200,
        'grpc.use_local_subchannel_pool': 1,
      }
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata({ waitForReady: true }),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    const first = trackCallback();
    const second = trackCallback();
    call.write(Buffer.from('one'), first.invoke);
    await sleep(50);
    sendWhileHeld(call, Buffer.from('two'), second.invoke);
    await sleep(50);
    assert.strictEqual(first.count, 0);
    assert.strictEqual(
      second.count,
      0,
      'a write queued behind a held one was acknowledged'
    );
    await bindRecordingServer(boundPort, seen);
    await Promise.all([
      onceWithin(first.done, 5000),
      onceWithin(second.done, 5000),
    ]);
    assertSucceededOnce(first);
    assertSucceededOnce(second);
    await sleep(200);
    assert.deepStrictEqual(seen, ['one', 'two']);
  });

  it('cancels every write queued before name resolution', async () => {
    releaseHold = undefined;
    client = new grpc.Client(
      'writecbhold:///127.0.0.1:1',
      grpc.credentials.createInsecure(),
      { 'grpc.service_config_disable_resolution': 1 }
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata(),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    const writes = [trackCallback(), trackCallback(), trackCallback()];
    call.write(Buffer.from('one'), writes[0].invoke);
    await sleep(50);
    sendWhileHeld(call, Buffer.from('two'), writes[1].invoke);
    sendWhileHeld(call, Buffer.from('three'), writes[2].invoke);
    await sleep(30);
    for (const write of writes) {
      assert.strictEqual(write.count, 0);
    }
    call.cancel();
    await Promise.all(writes.map(write => onceWithin(write.done, 1000)));
    for (const write of writes) {
      assertCancelledOnce(write);
    }
  });

  it('flushes every write queued before name resolution, in order', async () => {
    releaseHold = undefined;
    const seen: string[] = [];
    await startServer({
      upload: (call: grpc.ServerReadableStream<Buffer, Buffer>) => {
        call.on('data', (message: Buffer) => {
          seen.push(message.toString());
        });
      },
    });
    client.close();
    client = new grpc.Client(
      `writecbhold:///127.0.0.1:${port}`,
      grpc.credentials.createInsecure(),
      { 'grpc.service_config_disable_resolution': 1 }
    );
    const call = client.makeClientStreamRequest(
      CLIENT_PATH,
      identity,
      identity,
      new grpc.Metadata(),
      { deadline: Date.now() + 10000 },
      () => {}
    );
    const first = trackCallback();
    const second = trackCallback();
    call.write(Buffer.from('one'), first.invoke);
    await sleep(50);
    sendWhileHeld(call, Buffer.from('two'), second.invoke);
    await sleep(30);
    assert.strictEqual(first.count, 0);
    assert.strictEqual(second.count, 0);
    publishResolution();
    await Promise.all([
      onceWithin(first.done, 3000),
      onceWithin(second.done, 3000),
    ]);
    assertSucceededOnce(first);
    assertSucceededOnce(second);
    await sleep(200);
    assert.deepStrictEqual(seen, ['one', 'two']);
  });

  it('fails a write whose next() runs only after cancel, once', async () => {
    let heldNext: ((message: Buffer) => void) | undefined;
    await startServer(
      {
        upload: (call: grpc.ServerReadableStream<Buffer, Buffer>) => {
          call.on('data', () => {});
        },
      },
      {
        interceptors: [
          (options, nextCall) =>
            new grpc.InterceptingCall(nextCall(options), {
              sendMessage: (message, next) => {
                heldNext = next;
              },
            }),
        ],
      }
    );
    const call = clientStream();
    const write = trackCallback();
    call.write(Buffer.from('held'), write.invoke);
    await Promise.race([
      (async () => {
        while (!heldNext) {
          await sleep(5);
        }
      })(),
      sleep(1000).then(() => {
        throw new Error('interceptor did not observe the write');
      }),
    ]);
    assert.strictEqual(write.count, 0);
    call.cancel();
    heldNext!(Buffer.from('held'));
    await onceWithin(write.done, 1000);
    assertCancelledOnce(write);
    heldNext!(Buffer.from('held'));
    await sleep(50);
    assert.strictEqual(write.count, 1);
  });

  it('does not run a write callback again when next() is repeated after cancel', async () => {
    interface InflightWrite {
      count: number;
      error: Error | null | undefined;
      next?: (message: Buffer) => void;
      done: Promise<Error | null | undefined>;
      invoke: (error?: Error | null) => void;
    }
    let inflight: InflightWrite | undefined;
    await startServer(
      {
        upload: (call: grpc.ServerReadableStream<Buffer, Buffer>) => {
          call.sendMetadata(new grpc.Metadata());
        },
      },
      {
        interceptors: [
          (options, nextCall) =>
            new grpc.InterceptingCall(nextCall(options), {
              sendMessage: (message, next) => {
                if (inflight) {
                  inflight.next = next;
                }
                next(message);
              },
            }),
        ],
      }
    );
    const call = clientStream();
    call.on('error', () => {});
    // The surface write callback ignores a second invocation. Count the
    // context callback the interceptor and the child actually share.
    let rawCount = 0;
    const intercepted = call.call!;
    const forward = intercepted.sendMessageWithContext.bind(intercepted);
    intercepted.sendMessageWithContext = (context, message) => {
      const downstream = context.callback;
      context.callback = error => {
        rawCount += 1;
        downstream?.(error);
      };
      forward(context, message);
    };
    await new Promise<void>(resolve => call.once('metadata', () => resolve()));
    let stalled: InflightWrite | undefined;
    for (let index = 0; index < 64 && !stalled; index++) {
      let finish: (error: Error | null | undefined) => void = () => {};
      const attempt: InflightWrite = {
        count: 0,
        error: undefined,
        done: new Promise(resolve => {
          finish = resolve;
        }),
        invoke: error => {
          attempt.count += 1;
          attempt.error = error;
          if (attempt.count === 1) {
            finish(error);
          }
        },
      };
      inflight = attempt;
      call.write(LARGE, attempt.invoke);
      const startedAt = Date.now();
      while (attempt.count === 0 && Date.now() - startedAt < 200) {
        await sleep(10);
      }
      if (attempt.count === 0) {
        stalled = attempt;
      }
    }
    assert.ok(stalled, 'write never stalled under backpressure');
    assert.ok(stalled.next, 'stalled write was not forwarded');
    assert.strictEqual(stalled.count, 0);
    call.cancel();
    await onceWithin(stalled.done, 1000);
    assertCancelledOnce(stalled);
    const callsBeforeRepeat = rawCount;
    stalled.next!(LARGE);
    assert.strictEqual(rawCount, callsBeforeRepeat);
    await sleep(50);
    assert.strictEqual(rawCount, callsBeforeRepeat);
    assert.strictEqual(stalled.count, 1);
  });

  for (const spec of [
    {
      name: 'client-streaming',
      create: () => new ClientWritableStreamImpl<Buffer>(identity),
    },
    {
      name: 'bidi',
      create: () =>
        new ClientDuplexStreamImpl<Buffer, Buffer>(identity, identity),
    },
  ]) {
    it(`does not desynchronize callbacks after write(null, cb) throws on a ${spec.name} stream`, async () => {
      const stream = spec.create();
      stream.on('error', () => {});
      const sent: string[] = [];
      stream.call = surfaceCall((context, message) => {
        sent.push((message as Buffer).toString());
        process.nextTick(() => context.callback?.());
      });
      const nullWrite = trackCallback();
      assert.throws(() => {
        stream.write(null as unknown as Buffer, nullWrite.invoke);
      });
      const firstValid = trackCallback();
      const secondValid = trackCallback();
      stream.write(Buffer.from('first'), firstValid.invoke);
      stream.write(Buffer.from('second'), secondValid.invoke);
      await Promise.all([
        onceWithin(firstValid.done, 1000),
        onceWithin(secondValid.done, 1000),
      ]);
      assertSucceededOnce(firstValid);
      assertSucceededOnce(secondValid);
      assert.strictEqual(nullWrite.count, 0);
      assert.deepStrictEqual(sent, ['first', 'second']);
    });
  }

  it('does not run a write callback again when metadata-buffered next() is repeated after cancel', () => {
    let flushMetadata: (() => void) | undefined;
    let repeatSendNext: ((message: Buffer) => void) | undefined;
    let childContext: MessageContext | undefined;
    const childCall: InterceptingCallInterface = {
      cancelWithStatus() {
        childContext?.callback?.(
          Object.assign(new Error('1 CANCELLED: from child'), {
            code: grpc.status.CANCELLED,
          })
        );
      },
      getPeer: () => 'test',
      start() {},
      sendMessageWithContext(context) {
        childContext = context;
      },
      sendMessage() {},
      startRead() {},
      halfClose() {},
      getAuthContext: () => null,
    };
    const intercepting = new grpc.InterceptingCall(childCall, {
      start: (metadata, listener, next) => {
        flushMetadata = () => next(metadata, listener);
      },
      sendMessage: (message, next) => {
        repeatSendNext = next;
        next(message);
      },
    });
    intercepting.start(new grpc.Metadata());
    const tracked = trackCallback();
    intercepting.sendMessageWithContext(
      { callback: tracked.invoke },
      Buffer.from('buffered')
    );
    assert.strictEqual(tracked.count, 0);
    assert.strictEqual(childContext, undefined);
    flushMetadata!();
    assert.ok(childContext, 'pending message was not flushed to child');
    intercepting.cancelWithStatus(grpc.status.CANCELLED, 'bye');
    assertCancelledOnce(tracked);
    repeatSendNext!(Buffer.from('buffered'));
    assert.strictEqual(tracked.count, 1);
  });

  it('queues multiple transformed messages while interceptor metadata is pending and flushes or cancels in order', () => {
    for (const outcome of ['cancel', 'flush'] as const) {
      let flushMetadata: (() => void) | undefined;
      const forwarded: Array<{ context: MessageContext; text: string }> = [];
      const childCall: InterceptingCallInterface = {
        cancelWithStatus() {},
        getPeer: () => 'test',
        start() {},
        sendMessageWithContext(context, message) {
          forwarded.push({
            context,
            text: (message as Buffer).toString(),
          });
        },
        sendMessage() {},
        startRead() {},
        halfClose() {},
        getAuthContext: () => null,
      };
      const intercepting = new grpc.InterceptingCall(childCall, {
        start: (metadata, listener, next) => {
          flushMetadata = () => next(metadata, listener);
        },
        sendMessage: (message, next) => {
          next(Buffer.from((message as Buffer).toString().toUpperCase()));
        },
      });
      intercepting.start(new grpc.Metadata());
      const first = trackCallback();
      const second = trackCallback();
      intercepting.sendMessageWithContext(
        { callback: first.invoke },
        Buffer.from('alpha')
      );
      intercepting.sendMessageWithContext(
        { callback: second.invoke },
        Buffer.from('beta')
      );
      assert.strictEqual(first.count, 0);
      assert.strictEqual(second.count, 0);
      if (outcome === 'cancel') {
        intercepting.cancelWithStatus(grpc.status.CANCELLED, 'cancelled');
        assertCancelledOnce(first);
        assertCancelledOnce(second);
        assert.strictEqual(forwarded.length, 0);
      } else {
        flushMetadata!();
        assert.deepStrictEqual(
          forwarded.map(entry => entry.text),
          ['ALPHA', 'BETA']
        );
        forwarded[0].context.callback?.();
        forwarded[1].context.callback?.();
        assertSucceededOnce(first);
        assertSucceededOnce(second);
      }
    }
  });

  it('queues multiple writes in SingleSubchannelChannel before childCall exists', async () => {
    const { SingleSubchannelChannel } = await import(
      '../src/single-subchannel-channel'
    );
    const { ConnectivityState } = await import('../src/connectivity-state');
    for (const outcome of ['cancel', 'flush'] as const) {
      let finishCreds: ((md: grpc.Metadata) => void) | undefined;
      const forwarded: Array<{ context: MessageContext; text: string }> = [];
      const fakeSubchannel = {
        getConnectivityState: () => ConnectivityState.READY,
        getAddress: () => '127.0.0.1:1234',
        getChannelzRef: () => ({ id: 1, kind: 'subchannel', name: 'fake' }),
        getCallCredentials: () => ({
          generateMetadata: () =>
            new Promise<grpc.Metadata>(resolve => {
              finishCreds = resolve;
            }),
        }),
        createCall: () => ({
          cancelWithStatus() {},
          getPeer: () => '127.0.0.1:1234',
          sendMessageWithContext(context: MessageContext, message: Buffer) {
            forwarded.push({
              context,
              text: message.subarray(5).toString(),
            });
          },
          startRead() {},
          halfClose() {},
          getCallNumber: () => 1,
          getDeadlineInfo: () => [],
          getConfigReceivedTime: () => null,
          getCredentials: () => grpc.CallCredentials.createEmpty(),
          getAuthContext: () => null,
        }),
      };
      const channel = new SingleSubchannelChannel(
        fakeSubchannel as never,
        { scheme: 'ipv4', path: '127.0.0.1:1234' },
        { 'grpc.enable_channelz': 0 }
      );
      const call = channel.createCall(CLIENT_PATH, Infinity);
      call.start(new grpc.Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus() {},
      });
      const first = trackCallback();
      const second = trackCallback();
      call.sendMessageWithContext(
        { callback: first.invoke },
        Buffer.from('m1')
      );
      call.sendMessageWithContext(
        { callback: second.invoke },
        Buffer.from('m2')
      );
      await sleep(20);
      assert.strictEqual(first.count, 0);
      assert.strictEqual(second.count, 0);
      if (outcome === 'cancel') {
        call.cancelWithStatus(grpc.status.CANCELLED, 'cancelled');
        assertCancelledOnce(first);
        assertCancelledOnce(second);
        finishCreds?.(new grpc.Metadata());
        await sleep(20);
        assert.strictEqual(forwarded.length, 0);
        assert.strictEqual(first.count, 1);
        assert.strictEqual(second.count, 1);
      } else {
        finishCreds!(new grpc.Metadata());
        await sleep(20);
        assert.deepStrictEqual(
          forwarded.map(entry => entry.text),
          ['m1', 'm2']
        );
        forwarded[0].context.callback?.();
        forwarded[1].context.callback?.();
        assertSucceededOnce(first);
        assertSucceededOnce(second);
      }
      channel.close();
    }
  });
});
