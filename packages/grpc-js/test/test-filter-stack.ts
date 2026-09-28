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
import * as zlib from 'zlib';

import { CallCredentials } from '../src/call-credentials';
import {
  InterceptingListener,
  StatusObject,
  WriteFlags,
  WriteObject,
} from '../src/call-interface';
import { Channel } from '../src/channel';
import { CompressionAlgorithms } from '../src/compression-algorithms';
import {
  CompressionFilter,
  CompressionFilterFactory,
} from '../src/compression-filter';
import { ConnectivityState } from '../src/connectivity-state';
import { Status } from '../src/constants';
import { BaseFilter, Filter, FilterFactory } from '../src/filter';
import { FilterStack, FilterStackFactory } from '../src/filter-stack';
import { InternalChannel } from '../src/internal-channel';
import { LoadBalancingCall } from '../src/load-balancing-call';
import { Metadata } from '../src/metadata';
import { PickResultType } from '../src/picker';
import { ResolvingCall } from '../src/resolving-call';

class NoopPassThroughFilter extends BaseFilter implements Filter {}

class NoopPassThroughFilterFactory
  implements FilterFactory<NoopPassThroughFilter>
{
  createFilter(): NoopPassThroughFilter {
    return new NoopPassThroughFilter();
  }
}

class AsyncHeaderFilter extends BaseFilter implements Filter {
  constructor(
    private readonly headerKey: string,
    private readonly headerValue: string
  ) {
    super();
  }

  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    const resolvedMetadata = await metadata;
    await Promise.resolve();
    resolvedMetadata.set(this.headerKey, this.headerValue);
    return resolvedMetadata;
  }

  async sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    const resolvedMessage = await message;
    await Promise.resolve();
    return {
      message: Buffer.concat([Buffer.from('prefix:'), resolvedMessage.message]),
      flags: resolvedMessage.flags,
    };
  }

  async receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    const resolvedMessage = await message;
    await Promise.resolve();
    return Buffer.concat([resolvedMessage, Buffer.from(':suffix')]);
  }
}

class AsyncHeaderFilterFactory implements FilterFactory<AsyncHeaderFilter> {
  constructor(
    private readonly headerKey: string,
    private readonly headerValue: string
  ) {}

  createFilter(): AsyncHeaderFilter {
    return new AsyncHeaderFilter(this.headerKey, this.headerValue);
  }
}

function createCustomThenable<T>(promise: Promise<T>): Promise<T> {
  return {
    then<TResult1 = T, TResult2 = never>(
      onFulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onRejected?:
        | ((reason: unknown) => TResult2 | PromiseLike<TResult2>)
        | null
    ) {
      return promise.then(onFulfilled, onRejected);
    },
  } as unknown as Promise<T>;
}

class ThenableLegacyFilter extends BaseFilter implements Filter {
  sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    return createCustomThenable(
      metadata.then(resolvedMetadata => {
        resolvedMetadata.set('x-thenable', 'true');
        return resolvedMetadata;
      })
    );
  }

  sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
    return createCustomThenable(
      message.then(resolvedMessage => ({
        message: Buffer.concat([
          Buffer.from('thenable:'),
          resolvedMessage.message,
        ]),
        flags: resolvedMessage.flags,
      }))
    );
  }

  receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
    return createCustomThenable(
      message.then(resolvedMessage =>
        Buffer.concat([resolvedMessage, Buffer.from(':thenable')])
      )
    );
  }
}

class ThenableLegacyFilterFactory
  implements FilterFactory<ThenableLegacyFilter>
{
  createFilter(): ThenableLegacyFilter {
    return new ThenableLegacyFilter();
  }
}

class MaybeSyncOnlyFilter extends BaseFilter implements Filter {
  sendMetadataMaybeSync(metadata: Metadata): Metadata {
    metadata.set('x-maybe-sync-only', 'true');
    return metadata;
  }

  sendMessageMaybeSync(message: WriteObject): WriteObject {
    return {
      message: Buffer.concat([Buffer.from('sync:'), message.message]),
      flags: message.flags,
    };
  }

  receiveMessageMaybeSync(message: Buffer): Buffer {
    return Buffer.concat([message, Buffer.from(':sync')]);
  }
}

class MaybeSyncOnlyFilterFactory implements FilterFactory<MaybeSyncOnlyFilter> {
  createFilter(): MaybeSyncOnlyFilter {
    return new MaybeSyncOnlyFilter();
  }
}

class AsyncMetadataOnlyFilter extends BaseFilter implements Filter {
  async sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
    const resolvedMetadata = await metadata;
    await Promise.resolve();
    resolvedMetadata.set('x-metadata-only-async', 'true');
    return resolvedMetadata;
  }
}

class AsyncMetadataOnlyFilterFactory
  implements FilterFactory<AsyncMetadataOnlyFilter>
{
  createFilter(): AsyncMetadataOnlyFilter {
    return new AsyncMetadataOnlyFilter();
  }
}

class RejectingMetadataFilter extends BaseFilter implements Filter {
  sendMetadata(_metadata: Promise<Metadata>): Promise<Metadata> {
    return Promise.reject({
      code: Status.PERMISSION_DENIED,
      details: 'Rejected by metadata filter',
      metadata: new Metadata(),
    });
  }
}

class RejectingMetadataFilterFactory
  implements FilterFactory<RejectingMetadataFilter>
{
  createFilter(): RejectingMetadataFilter {
    return new RejectingMetadataFilter();
  }
}

function frameMessage(payload: Buffer, compressed = false): Buffer {
  const framed = Buffer.allocUnsafe(payload.length + 5);
  framed.writeUInt8(compressed ? 1 : 0, 0);
  framed.writeUInt32BE(payload.length, 1);
  payload.copy(framed, 5);
  return framed;
}

describe('CompressionFilter and FilterStack synchronous fast paths', () => {
  const dummyChannel = {} as Channel;

  describe('CompressionFilter', () => {
    it('executes sendMetadataMaybeSync synchronously', () => {
      const factory = new CompressionFilterFactory(dummyChannel, {});
      const filter: CompressionFilter = factory.createFilter();
      const metadata = new Metadata();
      metadata.set('grpc-encoding', 'gzip');

      const result = filter.sendMetadataMaybeSync(metadata);
      assert(!(result instanceof Promise));
      assert.strictEqual(result, metadata);
      assert.deepStrictEqual(result.get('grpc-accept-encoding'), [
        'identity,deflate,gzip',
      ]);
      assert.deepStrictEqual(result.get('accept-encoding'), ['identity']);
      assert.deepStrictEqual(result.get('grpc-encoding'), []);
    });

    it('sets grpc-encoding synchronously when default compression is configured', () => {
      const factory = new CompressionFilterFactory(dummyChannel, {
        'grpc.default_compression_algorithm': CompressionAlgorithms.gzip,
      });
      const filter = factory.createFilter();
      const metadata = new Metadata();

      const result = filter.sendMetadataMaybeSync(metadata);
      assert(!(result instanceof Promise));
      assert.deepStrictEqual(result.get('grpc-encoding'), ['gzip']);
    });

    it('executes sendMessageMaybeSync synchronously for identity compression', () => {
      const factory = new CompressionFilterFactory(dummyChannel, {});
      const filter = factory.createFilter();
      const payload = Buffer.from('hello world');

      const result = filter.sendMessageMaybeSync({ message: payload });
      assert(!(result instanceof Promise));
      assert.strictEqual(result.flags, undefined);
      assert.strictEqual(result.message.readUInt8(0), 0);
      assert.strictEqual(result.message.readUInt32BE(1), payload.length);
      assert.deepStrictEqual(result.message.subarray(5), payload);
    });

    it('executes sendMessageMaybeSync synchronously when WriteFlags.NoCompress is set with gzip', () => {
      const factory = new CompressionFilterFactory(dummyChannel, {
        'grpc.default_compression_algorithm': CompressionAlgorithms.gzip,
      });
      const filter = factory.createFilter();
      const payload = Buffer.from('hello uncompressed');

      const result = filter.sendMessageMaybeSync({
        message: payload,
        flags: WriteFlags.NoCompress,
      });
      assert(!(result instanceof Promise));
      assert.strictEqual(result.flags, WriteFlags.NoCompress);
      assert.strictEqual(result.message.readUInt8(0), 0);
      assert.strictEqual(result.message.readUInt32BE(1), payload.length);
      assert.deepStrictEqual(result.message.subarray(5), payload);
    });

    it('returns a Promise from sendMessageMaybeSync when compressing with gzip', async () => {
      const factory = new CompressionFilterFactory(dummyChannel, {
        'grpc.default_compression_algorithm': CompressionAlgorithms.gzip,
      });
      const filter = factory.createFilter();
      const payload = Buffer.from('hello compressed world');

      const result = filter.sendMessageMaybeSync({
        message: payload,
        flags: 0,
      });
      assert(result instanceof Promise);
      const resolved = await result;
      assert.strictEqual(resolved.flags, 0);
      assert.strictEqual(resolved.message.readUInt8(0), 1);
      const compressedBytes = resolved.message.subarray(5);
      assert.strictEqual(
        resolved.message.readUInt32BE(1),
        compressedBytes.length
      );
      assert.deepStrictEqual(zlib.gunzipSync(compressedBytes), payload);
    });

    it('returns a rejected Promise from sendMessageMaybeSync when maxSendMessageLength is exceeded', async () => {
      const factory = new CompressionFilterFactory(dummyChannel, {
        'grpc.max_send_message_length': 5,
      });
      const filter = factory.createFilter();
      const payload = Buffer.from('message longer than 5 bytes');

      const result = filter.sendMessageMaybeSync({ message: payload });
      assert(result instanceof Promise);
      await assert.rejects(result, (error: StatusObject) => {
        assert.strictEqual(error.code, Status.RESOURCE_EXHAUSTED);
        return true;
      });
    });

    it('executes receiveMessageMaybeSync synchronously for uncompressed messages', () => {
      const factory = new CompressionFilterFactory(dummyChannel, {});
      const filter = factory.createFilter();
      const payload = Buffer.from('response payload');
      const framed = frameMessage(payload, false);

      const result = filter.receiveMessageMaybeSync(framed);
      assert(!(result instanceof Promise));
      assert.deepStrictEqual(result, payload);
    });

    it('returns a Promise from receiveMessageMaybeSync for compressed messages', async () => {
      const factory = new CompressionFilterFactory(dummyChannel, {});
      const filter = factory.createFilter();
      const responseMetadata = new Metadata();
      responseMetadata.set('grpc-encoding', 'gzip');
      filter.receiveMetadata(responseMetadata);

      const payload = Buffer.from('compressed response payload');
      const framed = frameMessage(zlib.gzipSync(payload), true);

      const result = filter.receiveMessageMaybeSync(framed);
      assert(result instanceof Promise);
      const decompressed = await result;
      assert.deepStrictEqual(decompressed, payload);
    });

    it('resets sendCompression to identity when server grpc-accept-encoding excludes configured algorithm', () => {
      const factory = new CompressionFilterFactory(dummyChannel, {
        'grpc.default_compression_algorithm': CompressionAlgorithms.gzip,
      });
      const filter = factory.createFilter();

      // Before receiveMetadata, sendMetadataMaybeSync sets grpc-encoding: gzip
      const initialMetadata = filter.sendMetadataMaybeSync(new Metadata());
      assert.deepStrictEqual(initialMetadata.get('grpc-encoding'), ['gzip']);

      // Server responds with grpc-accept-encoding that only supports identity
      const responseMetadata = new Metadata();
      responseMetadata.set('grpc-accept-encoding', 'identity');
      const filteredResponseMetadata = filter.receiveMetadata(responseMetadata);
      assert.deepStrictEqual(
        filteredResponseMetadata.get('grpc-accept-encoding'),
        []
      );

      // Current filter now frames messages synchronously with identity (uncompressed)
      const payload = Buffer.from('fallback to identity');
      const sendResult = filter.sendMessageMaybeSync({ message: payload });
      assert(!(sendResult instanceof Promise));
      assert.strictEqual(sendResult.message.readUInt8(0), 0);
      assert.strictEqual(sendResult.message.readUInt32BE(1), payload.length);
      assert.deepStrictEqual(sendResult.message.subarray(5), payload);

      // Subsequent filters created by the same factory also default to identity
      const nextFilter = factory.createFilter();
      const nextMetadata = nextFilter.sendMetadataMaybeSync(new Metadata());
      assert.deepStrictEqual(nextMetadata.get('grpc-encoding'), []);
      const nextSendResult = nextFilter.sendMessageMaybeSync({
        message: payload,
      });
      assert(!(nextSendResult instanceof Promise));
      assert.strictEqual(nextSendResult.message.readUInt8(0), 0);
    });
  });

  describe('FilterStack', () => {
    it('executes synchronously with CompressionFilter, MaybeSyncOnlyFilter, and BaseFilter pass-throughs', () => {
      const stackFactory = new FilterStackFactory([
        new NoopPassThroughFilterFactory(),
        new MaybeSyncOnlyFilterFactory(),
        new CompressionFilterFactory(dummyChannel, {}),
      ]);
      const stack: FilterStack = stackFactory.createFilter();

      const metadata = new Metadata();
      const metadataResult = stack.sendMetadataMaybeSync(metadata);
      assert(!(metadataResult instanceof Promise));
      assert.deepStrictEqual(metadataResult.get('x-maybe-sync-only'), ['true']);
      assert.deepStrictEqual(metadataResult.get('grpc-accept-encoding'), [
        'identity,deflate,gzip',
      ]);

      const payload = Buffer.from('sync stack message');
      const sendResult = stack.sendMessageMaybeSync({ message: payload });
      assert(!(sendResult instanceof Promise));
      assert.strictEqual(sendResult.message.readUInt8(0), 0);
      assert.deepStrictEqual(
        sendResult.message.subarray(5),
        Buffer.from('sync:sync stack message')
      );

      const receiveResult = stack.receiveMessageMaybeSync(sendResult.message);
      assert(!(receiveResult instanceof Promise));
      assert.deepStrictEqual(
        receiveResult,
        Buffer.from('sync:sync stack message:sync')
      );
    });

    it('transitions to Promise chaining when an async filter is in the stack', async () => {
      const stackFactory = new FilterStackFactory([
        new AsyncHeaderFilterFactory('x-custom-async', 'enabled'),
        new MaybeSyncOnlyFilterFactory(),
        new NoopPassThroughFilterFactory(),
        new CompressionFilterFactory(dummyChannel, {}),
      ]);
      const stack: FilterStack = stackFactory.createFilter();

      const metadata = new Metadata();
      const metadataResult = stack.sendMetadataMaybeSync(metadata);
      assert(metadataResult instanceof Promise);
      const resolvedMetadata = await metadataResult;
      assert.deepStrictEqual(resolvedMetadata.get('x-custom-async'), [
        'enabled',
      ]);
      assert.deepStrictEqual(resolvedMetadata.get('x-maybe-sync-only'), [
        'true',
      ]);
      assert.deepStrictEqual(resolvedMetadata.get('grpc-accept-encoding'), [
        'identity,deflate,gzip',
      ]);

      const payload = Buffer.from('body');
      const sendResult = stack.sendMessageMaybeSync({ message: payload });
      assert(sendResult instanceof Promise);
      const resolvedSend = await sendResult;
      const expectedSentPayload = Buffer.from('sync:prefix:body');
      assert.deepStrictEqual(
        resolvedSend.message.subarray(5),
        expectedSentPayload
      );

      // Test receiveMessageMaybeSync when inner CompressionFilter and MaybeSyncOnlyFilter are synchronous
      // and outer AsyncHeaderFilter transitions to a Promise
      const receiveResult = stack.receiveMessageMaybeSync(resolvedSend.message);
      assert(receiveResult instanceof Promise);
      const resolvedReceive = await receiveResult;
      assert.deepStrictEqual(
        resolvedReceive,
        Buffer.from('sync:prefix:body:sync:suffix')
      );

      // Test receiveMessageMaybeSync when inner CompressionFilter returns a Promise (gzip),
      // MaybeSyncOnlyFilter chains via result.then(...), and outer AsyncHeaderFilter chains onto that Promise
      const gzipResponseMetadata = new Metadata();
      gzipResponseMetadata.set('grpc-encoding', 'gzip');
      stack.receiveMetadata(gzipResponseMetadata);

      const framedCompressed = frameMessage(
        zlib.gzipSync(Buffer.from('compressed-body')),
        true
      );

      const compressedReceiveResult =
        stack.receiveMessageMaybeSync(framedCompressed);
      assert(compressedReceiveResult instanceof Promise);
      const resolvedCompressedReceive = await compressedReceiveResult;
      assert.deepStrictEqual(
        resolvedCompressedReceive,
        Buffer.from('compressed-body:sync:suffix')
      );
    });

    it('normalizes non-native thenables returned by legacy filters into Promises', async () => {
      const stackFactory = new FilterStackFactory([
        new ThenableLegacyFilterFactory(),
        new CompressionFilterFactory(dummyChannel, {}),
      ]);
      const stack: FilterStack = stackFactory.createFilter();

      const metadataResult = stack.sendMetadataMaybeSync(new Metadata());
      assert(metadataResult instanceof Promise);
      const resolvedMetadata = await metadataResult;
      assert.deepStrictEqual(resolvedMetadata.get('x-thenable'), ['true']);
      assert.deepStrictEqual(resolvedMetadata.get('grpc-accept-encoding'), [
        'identity,deflate,gzip',
      ]);

      const sendResult = stack.sendMessageMaybeSync({
        message: Buffer.from('msg'),
        flags: WriteFlags.NoCompress,
      });
      assert(sendResult instanceof Promise);
      const resolvedSend = await sendResult;
      assert.strictEqual(resolvedSend.flags, WriteFlags.NoCompress);
      assert.deepStrictEqual(
        resolvedSend.message.subarray(5),
        Buffer.from('thenable:msg')
      );

      const receiveResult = stack.receiveMessageMaybeSync(resolvedSend.message);
      assert(receiveResult instanceof Promise);
      const resolvedReceive = await receiveResult;
      assert.deepStrictEqual(
        resolvedReceive,
        Buffer.from('thenable:msg:thenable')
      );
    });

    it('preserves legacy async FilterStack and BaseFilter methods', async () => {
      const noopFilter = new NoopPassThroughFilter();
      // Verify BaseFilter methods always return a Promise even if called with a raw value
      const rawBufferPromise = noopFilter.receiveMessage(
        Buffer.from('raw') as unknown as Promise<Buffer>
      );
      assert(rawBufferPromise instanceof Promise);
      assert.deepStrictEqual(await rawBufferPromise, Buffer.from('raw'));

      const stackFactory = new FilterStackFactory([
        new NoopPassThroughFilterFactory(),
        new MaybeSyncOnlyFilterFactory(),
        new CompressionFilterFactory(dummyChannel, {}),
      ]);
      const stack: FilterStack = stackFactory.createFilter();

      const metadata = await stack.sendMetadata(
        Promise.resolve(new Metadata())
      );
      assert.deepStrictEqual(metadata.get('accept-encoding'), ['identity']);
      assert.deepStrictEqual(metadata.get('x-maybe-sync-only'), ['true']);

      const payload = Buffer.from('legacy test');
      const framed = await stack.sendMessage(
        Promise.resolve({ message: payload })
      );
      const deframed = await stack.receiveMessage(
        Promise.resolve(framed.message)
      );
      assert.deepStrictEqual(deframed, Buffer.from('sync:legacy test:sync'));
    });
  });

  describe('ResolvingCall filter execution', () => {
    function createMockChannel(
      dynamicFilterFactories: FilterFactory<Filter>[] = []
    ) {
      let childStartedMetadata: Metadata | null = null;
      let childListener: InterceptingListener | null = null;
      const sentMessages: Buffer[] = [];
      let halfClosed = false;
      let readStarted = false;
      let cancelledStatus: { code: Status; details: string } | null = null;
      let resolveHalfClose: () => void;
      const halfClosePromise = new Promise<void>(resolve => {
        resolveHalfClose = resolve;
      });
      let messageWaiter: (() => void) | null = null;

      const mockChild = {
        start(metadata: Metadata, listener: InterceptingListener) {
          childStartedMetadata = metadata;
          childListener = listener;
        },
        sendMessageWithContext(_context: unknown, message: Buffer) {
          sentMessages.push(message);
          if (messageWaiter) {
            const waiter = messageWaiter;
            messageWaiter = null;
            waiter();
          }
        },
        startRead() {
          readStarted = true;
        },
        halfClose() {
          halfClosed = true;
          resolveHalfClose();
        },
        cancelWithStatus(code: Status, details: string) {
          cancelledStatus = { code, details };
        },
        getCallNumber() {
          return 42;
        },
        getDeadlineInfo() {
          return [];
        },
        getPeer() {
          return 'localhost:50051';
        },
        getAuthContext() {
          return null;
        },
      };

      const mockChannel = {
        getConfig() {
          return {
            type: 'SUCCESS',
            config: {
              methodConfig: { name: [] },
              pickInformation: {},
              status: Status.OK,
              dynamicFilterFactories,
            },
          };
        },
        createRetryingCall() {
          return mockChild;
        },
        getTarget() {
          return 'dns:///localhost:50051';
        },
      };

      return {
        mockChannel: mockChannel as unknown as InternalChannel,
        getChildStartedMetadata: () => childStartedMetadata,
        getChildListener: () => childListener,
        sentMessages,
        isHalfClosed: () => halfClosed,
        isReadStarted: () => readStarted,
        getCancelledStatus: () => cancelledStatus,
        halfClosePromise,
        waitForNextSentMessage: () =>
          new Promise<void>(resolve => {
            messageWaiter = resolve;
          }),
      };
    }

    it('starts child, sends message, and receives message synchronously when using default CompressionFilter', done => {
      const {
        mockChannel,
        getChildStartedMetadata,
        getChildListener,
        sentMessages,
        isHalfClosed,
        isReadStarted,
      } = createMockChannel();
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        1
      );

      // Before start(), child is null so getPeer() returns the channel target
      assert.strictEqual(call.getPeer(), 'dns:///localhost:50051');

      let receivedMetadata: Metadata | null = null;
      let receivedMessage: Buffer | null = null;

      call.start(new Metadata(), {
        onReceiveMetadata(metadata) {
          receivedMetadata = metadata;
        },
        onReceiveMessage(message) {
          receivedMessage = message;
        },
        onReceiveStatus(status) {
          assert.strictEqual(status.code, Status.OK);
          done();
        },
      });

      // Child call must already be started synchronously after call.start(),
      // and getPeer() now delegates to child.getPeer()
      assert.strictEqual(call.getPeer(), 'localhost:50051');
      assert(getChildStartedMetadata() !== null);
      assert.deepStrictEqual(
        getChildStartedMetadata()!.get('grpc-accept-encoding'),
        ['identity,deflate,gzip']
      );

      call.startRead();
      assert.strictEqual(isReadStarted(), true);

      const requestPayload = Buffer.from('sync request');
      call.sendMessageWithContext({}, requestPayload);
      // Message must be framed and sent to child synchronously without waiting for a microtask
      assert.strictEqual(sentMessages.length, 1);
      assert.deepStrictEqual(sentMessages[0].subarray(5), requestPayload);

      call.halfClose();
      assert.strictEqual(isHalfClosed(), true);

      const childListener = getChildListener()!;
      const serverHeaders = new Metadata();
      serverHeaders.set('grpc-encoding', 'identity');
      childListener.onReceiveMetadata(serverHeaders);
      assert(receivedMetadata !== null);

      const responsePayload = Buffer.from('sync response');
      const framedResponse = frameMessage(responsePayload, false);

      childListener.onReceiveMessage(framedResponse);
      // Message must be deframed and delivered to listener synchronously
      assert.deepStrictEqual(receivedMessage, responsePayload);

      childListener.onReceiveStatus({
        code: Status.OK,
        details: 'OK',
        metadata: new Metadata(),
      });
    });

    it('handles sync sendMetadataMaybeSync with async gzip sendMessageMaybeSync and receiveMessageMaybeSync', async () => {
      const {
        mockChannel,
        getChildStartedMetadata,
        getChildListener,
        sentMessages,
        isHalfClosed,
        halfClosePromise,
        waitForNextSentMessage,
      } = createMockChannel();
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {
          'grpc.default_compression_algorithm': CompressionAlgorithms.gzip,
        }),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/GzipBidi',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        2
      );

      const events: string[] = [];
      const receivedMessages: Buffer[] = [];
      let resolveFirstReceivedMessage: () => void;
      const firstReceivedMessagePromise = new Promise<void>(resolve => {
        resolveFirstReceivedMessage = resolve;
      });
      let resolveStatus: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {
          events.push('metadata');
        },
        onReceiveMessage(message) {
          events.push('message');
          receivedMessages.push(message);
          if (receivedMessages.length === 1) {
            resolveFirstReceivedMessage();
          }
        },
        onReceiveStatus(status: StatusObject) {
          events.push('status');
          resolveStatus(status);
        },
      });

      // sendMetadataMaybeSync is still synchronous even when gzip compression is configured
      assert(getChildStartedMetadata() !== null);
      assert.deepStrictEqual(getChildStartedMetadata()!.get('grpc-encoding'), [
        'gzip',
      ]);

      // Send 1st message without calling halfClose() yet (covers pendingHalfClose === false branch)
      const firstRequestPayload = Buffer.from('first gzip request');
      const firstSentPromise = waitForNextSentMessage();
      call.sendMessageWithContext({}, firstRequestPayload);
      assert.strictEqual(sentMessages.length, 0);
      await firstSentPromise;
      assert.strictEqual(sentMessages.length, 1);
      assert.strictEqual(isHalfClosed(), false);

      // Send 2nd message and immediately call halfClose() while writeFilterPending is true
      const secondRequestPayload = Buffer.from('second gzip request');
      call.sendMessageWithContext({}, secondRequestPayload);
      call.halfClose();
      assert.strictEqual(isHalfClosed(), false);

      await halfClosePromise;
      assert.strictEqual(sentMessages.length, 2);
      assert.strictEqual(sentMessages[1].readUInt8(0), 1);
      assert.deepStrictEqual(
        zlib.gunzipSync(sentMessages[1].subarray(5)),
        secondRequestPayload
      );
      assert.strictEqual(isHalfClosed(), true);

      const childListener = getChildListener()!;
      const responseMetadata = new Metadata();
      responseMetadata.set('grpc-encoding', 'gzip');
      childListener.onReceiveMetadata(responseMetadata);

      // Receive 1st compressed message before status arrives (covers pendingChildStatus === null branch)
      const firstResponsePayload = Buffer.from('first gzip response');
      const firstFramedResponse = frameMessage(
        zlib.gzipSync(firstResponsePayload),
        true
      );

      childListener.onReceiveMessage(firstFramedResponse);
      await firstReceivedMessagePromise;
      assert.strictEqual(receivedMessages.length, 1);
      assert.deepStrictEqual(receivedMessages[0], firstResponsePayload);

      // Receive 2nd compressed message followed immediately by onReceiveStatus (covers pendingChildStatus !== null branch)
      const secondResponsePayload = Buffer.from('second gzip response');
      const secondFramedResponse = frameMessage(
        zlib.gzipSync(secondResponsePayload),
        true
      );

      childListener.onReceiveMessage(secondFramedResponse);
      childListener.onReceiveStatus({
        code: Status.OK,
        details: 'OK',
        metadata: new Metadata(),
      });

      const finalStatus = await statusPromise;
      assert.strictEqual(finalStatus.code, Status.OK);
      assert.deepStrictEqual(events, [
        'metadata',
        'message',
        'message',
        'status',
      ]);
      assert.deepStrictEqual(receivedMessages[1], secondResponsePayload);
    });

    it('handles async dynamic filters and defers status while readFilterPending is true', async () => {
      const {
        mockChannel,
        getChildStartedMetadata,
        getChildListener,
        sentMessages,
        isHalfClosed,
        isReadStarted,
        halfClosePromise,
      } = createMockChannel([
        new AsyncHeaderFilterFactory('x-dynamic-async', 'true'),
      ]);
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        3
      );

      const events: string[] = [];
      let receivedMessage: Buffer | null = null;
      let resolveStatus: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {
          events.push('metadata');
        },
        onReceiveMessage(message) {
          events.push('message');
          receivedMessage = message;
        },
        onReceiveStatus(status: StatusObject) {
          events.push('status');
          resolveStatus(status);
        },
      });

      // Child is not started synchronously because AsyncHeaderFilter.sendMetadata is async
      assert.strictEqual(getChildStartedMetadata(), null);
      assert.strictEqual(call.getPeer(), 'dns:///localhost:50051');

      call.startRead();
      call.sendMessageWithContext({}, Buffer.from('req'));
      call.halfClose();

      await halfClosePromise;
      assert.strictEqual(isReadStarted(), true);
      assert(getChildStartedMetadata() !== null);
      assert.deepStrictEqual(
        getChildStartedMetadata()!.get('x-dynamic-async'),
        ['true']
      );
      assert.strictEqual(sentMessages.length, 1);
      assert.deepStrictEqual(
        sentMessages[0].subarray(5),
        Buffer.from('prefix:req')
      );
      assert.strictEqual(isHalfClosed(), true);
      // Verify pendingMessage reference was cleared after flushing in startChild
      assert.strictEqual((call as any).pendingMessage, null);

      const childListener = getChildListener()!;
      childListener.onReceiveMetadata(new Metadata());

      const framedResponse = frameMessage(Buffer.from('resp'), false);

      // Trigger async receiveMessage filter followed immediately by onReceiveStatus
      childListener.onReceiveMessage(framedResponse);
      childListener.onReceiveStatus({
        code: Status.OK,
        details: 'OK',
        metadata: new Metadata(),
      });

      const finalStatus = await statusPromise;
      assert.strictEqual(finalStatus.code, Status.OK);
      assert.deepStrictEqual(events, ['metadata', 'message', 'status']);
      assert.deepStrictEqual(receivedMessage, Buffer.from('resp:suffix'));
    });

    it('flushes queued message and halfClose synchronously in startChild when only sendMetadata is async', async () => {
      const {
        mockChannel,
        getChildStartedMetadata,
        sentMessages,
        isHalfClosed,
        halfClosePromise,
      } = createMockChannel([new AsyncMetadataOnlyFilterFactory()]);
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        4
      );

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus() {},
      });

      assert.strictEqual(getChildStartedMetadata(), null);
      call.sendMessageWithContext({}, Buffer.from('sync-send-after-async-md'));
      call.halfClose();

      await halfClosePromise;
      assert.deepStrictEqual(
        getChildStartedMetadata()!.get('x-metadata-only-async'),
        ['true']
      );
      assert.strictEqual(sentMessages.length, 1);
      assert.deepStrictEqual(
        sentMessages[0].subarray(5),
        Buffer.from('sync-send-after-async-md')
      );
      assert.strictEqual(isHalfClosed(), true);
      assert.strictEqual((call as any).pendingMessage, null);
    });

    it('flushes pendingHalfClose in startChild when no message was queued', async () => {
      const { mockChannel, isHalfClosed, halfClosePromise } = createMockChannel(
        [new AsyncMetadataOnlyFilterFactory()]
      );
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/ClientStream',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        5
      );

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus() {},
      });

      call.halfClose();
      await halfClosePromise;
      assert.strictEqual(isHalfClosed(), true);
    });

    it('does not start child if call is cancelled while sendMetadataMaybeSync is pending', async () => {
      let releaseMetadataFilter!: () => void;
      const metadataFilterGate = new Promise<void>(resolve => {
        releaseMetadataFilter = resolve;
      });

      class GatedMetadataFilter extends BaseFilter implements Filter {
        sendMetadata(metadata: Promise<Metadata>): Promise<Metadata> {
          return metadata.then(async resolvedMetadata => {
            await metadataFilterGate;
            return resolvedMetadata;
          });
        }
      }

      const { mockChannel, getChildStartedMetadata } = createMockChannel([
        { createFilter: () => new GatedMetadataFilter() },
      ]);
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        6
      );

      let resolveStatus: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus(status) {
          resolveStatus(status);
        },
      });

      call.cancelWithStatus(Status.CANCELLED, 'Cancelled before metadata done');
      const status = await statusPromise;
      assert.strictEqual(status.code, Status.CANCELLED);

      // Release the gated filter and wait for the check phase so all chained
      // microtasks in FilterStack and ResolvingCall have drained.
      releaseMetadataFilter();
      await new Promise<void>(resolve => setImmediate(resolve));
      assert.strictEqual(getChildStartedMetadata(), null);
    });

    it('does not forward sent or received messages if call is cancelled while async message filters are pending', async () => {
      let releaseSendFilter!: () => void;
      const sendFilterGate = new Promise<void>(resolve => {
        releaseSendFilter = resolve;
      });
      let releaseReceiveFilter!: () => void;
      const receiveFilterGate = new Promise<void>(resolve => {
        releaseReceiveFilter = resolve;
      });

      class GatedMessageFilter extends BaseFilter implements Filter {
        sendMessage(message: Promise<WriteObject>): Promise<WriteObject> {
          return message.then(async resolvedMessage => {
            await sendFilterGate;
            return resolvedMessage;
          });
        }
        receiveMessage(message: Promise<Buffer>): Promise<Buffer> {
          return message.then(async resolvedMessage => {
            await receiveFilterGate;
            return resolvedMessage;
          });
        }
      }

      const { mockChannel, getChildListener, sentMessages, isHalfClosed } =
        createMockChannel([{ createFilter: () => new GatedMessageFilter() }]);
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/BidiStream',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        60
      );

      const receivedMessages: Buffer[] = [];
      let resolveStatus!: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage(message) {
          receivedMessages.push(message);
        },
        onReceiveStatus(status) {
          resolveStatus(status);
        },
      });

      call.sendMessageWithContext({}, Buffer.from('in-flight-request'));
      call.halfClose();
      getChildListener()!.onReceiveMessage(
        frameMessage(Buffer.from('in-flight-response'), false)
      );

      call.cancelWithStatus(
        Status.CANCELLED,
        'Cancelled while message filters pending'
      );
      const status = await statusPromise;
      assert.strictEqual(status.code, Status.CANCELLED);

      releaseSendFilter();
      releaseReceiveFilter();
      await new Promise<void>(resolve => setImmediate(resolve));

      assert.strictEqual(sentMessages.length, 0);
      assert.strictEqual(isHalfClosed(), false);
      assert.strictEqual(receivedMessages.length, 0);
    });

    it('outputs status when sendMetadataMaybeSync rejects', async () => {
      const { mockChannel, getChildStartedMetadata } = createMockChannel([
        new RejectingMetadataFilterFactory(),
      ]);
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {}),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        7
      );

      let resolveStatus: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus(status) {
          resolveStatus(status);
        },
      });

      const status = await statusPromise;
      assert.strictEqual(status.code, Status.PERMISSION_DENIED);
      assert.strictEqual(status.details, 'Rejected by metadata filter');
      assert.strictEqual(getChildStartedMetadata(), null);
    });

    it('cancels call with status when sendMessageMaybeSync rejects', async () => {
      const { mockChannel, getCancelledStatus } = createMockChannel();
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {
          'grpc.max_send_message_length': 4,
        }),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        8
      );

      let resolveStatus: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus(status) {
          resolveStatus(status);
        },
      });

      call.sendMessageWithContext({}, Buffer.from('message exceeding 4 bytes'));
      const status = await statusPromise;
      assert.strictEqual(status.code, Status.RESOURCE_EXHAUSTED);
      assert.strictEqual(getCancelledStatus()?.code, Status.RESOURCE_EXHAUSTED);
    });

    it('cancels call with status when receiveMessageMaybeSync rejects', async () => {
      const { mockChannel, getChildListener, getCancelledStatus } =
        createMockChannel();
      const stackFactory = new FilterStackFactory([
        new CompressionFilterFactory(dummyChannel, {
          'grpc.max_receive_message_length': 4,
        }),
      ]);

      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/Unary',
        {
          deadline: Infinity,
          flags: 0,
          host: 'localhost',
          parentCall: null,
        },
        stackFactory,
        9
      );

      let resolveStatus: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });

      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus(status) {
          resolveStatus(status);
        },
      });

      const childListener = getChildListener()!;
      const responseMetadata = new Metadata();
      responseMetadata.set('grpc-encoding', 'gzip');
      childListener.onReceiveMetadata(responseMetadata);

      const framedResponse = frameMessage(
        zlib.gzipSync(Buffer.from('decompressed payload exceeding 4 bytes')),
        true
      );

      childListener.onReceiveMessage(framedResponse);

      const status = await statusPromise;
      assert.strictEqual(status.code, Status.RESOURCE_EXHAUSTED);
      assert.strictEqual(getCancelledStatus()?.code, Status.RESOURCE_EXHAUSTED);
    });

    it('converts synchronous exceptions in MaybeSync filters into INTERNAL call status without throwing', async () => {
      class ThrowingSyncFilter extends BaseFilter implements Filter {
        constructor(
          private readonly throwOn:
            | 'metadata'
            | 'sendMessage'
            | 'receiveMessage'
        ) {
          super();
        }
        sendMetadataMaybeSync(metadata: Metadata): Metadata {
          if (this.throwOn === 'metadata') {
            throw Object.assign(new Error('sync metadata boom'), {
              code: 'ERR_SYNC_FILTER',
            });
          }
          return metadata;
        }
        sendMessageMaybeSync(message: WriteObject): WriteObject {
          if (this.throwOn === 'sendMessage') {
            throw Object.assign(new Error('sync send boom'), {
              code: 'ERR_SYNC_FILTER',
            });
          }
          return message;
        }
        receiveMessageMaybeSync(message: Buffer): Buffer {
          if (this.throwOn === 'receiveMessage') {
            throw Object.assign(new Error('sync receive boom'), {
              code: 'ERR_SYNC_FILTER',
            });
          }
          return message;
        }
      }

      // 1. Synchronous throw in sendMetadataMaybeSync
      {
        const { mockChannel, getChildStartedMetadata } = createMockChannel([
          { createFilter: () => new ThrowingSyncFilter('metadata') },
        ]);
        const call = new ResolvingCall(
          mockChannel,
          '/test.Service/Unary',
          { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
          new FilterStackFactory([
            new CompressionFilterFactory(dummyChannel, {}),
          ]),
          11
        );
        let resolveStatus!: (status: StatusObject) => void;
        const statusPromise = new Promise<StatusObject>(resolve => {
          resolveStatus = resolve;
        });
        call.start(new Metadata(), {
          onReceiveMetadata() {},
          onReceiveMessage() {},
          onReceiveStatus(status) {
            resolveStatus(status);
          },
        });
        const status = await statusPromise;
        assert.strictEqual(status.code, Status.INTERNAL);
        assert(status.details.includes('sync metadata boom'));
        assert.strictEqual(getChildStartedMetadata(), null);
      }

      // 2. Synchronous throw in sendMessageMaybeSync
      {
        const { mockChannel, getCancelledStatus } = createMockChannel([
          { createFilter: () => new ThrowingSyncFilter('sendMessage') },
        ]);
        const call = new ResolvingCall(
          mockChannel,
          '/test.Service/Unary',
          { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
          new FilterStackFactory([
            new CompressionFilterFactory(dummyChannel, {}),
          ]),
          12
        );
        let resolveStatus!: (status: StatusObject) => void;
        const statusPromise = new Promise<StatusObject>(resolve => {
          resolveStatus = resolve;
        });
        call.start(new Metadata(), {
          onReceiveMetadata() {},
          onReceiveMessage() {},
          onReceiveStatus(status) {
            resolveStatus(status);
          },
        });
        call.sendMessageWithContext({}, Buffer.from('msg'));
        const status = await statusPromise;
        assert.strictEqual(status.code, Status.INTERNAL);
        assert(status.details.includes('sync send boom'));
        assert.strictEqual(getCancelledStatus()?.code, Status.INTERNAL);
      }

      // 3. Synchronous throw in receiveMessageMaybeSync
      {
        const { mockChannel, getChildListener, getCancelledStatus } =
          createMockChannel([
            { createFilter: () => new ThrowingSyncFilter('receiveMessage') },
          ]);
        const call = new ResolvingCall(
          mockChannel,
          '/test.Service/Unary',
          { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
          new FilterStackFactory([
            new CompressionFilterFactory(dummyChannel, {}),
          ]),
          13
        );
        let resolveStatus!: (status: StatusObject) => void;
        const statusPromise = new Promise<StatusObject>(resolve => {
          resolveStatus = resolve;
        });
        call.start(new Metadata(), {
          onReceiveMetadata() {},
          onReceiveMessage() {},
          onReceiveStatus(status) {
            resolveStatus(status);
          },
        });
        const framed = frameMessage(Buffer.from('resp'), false);
        getChildListener()!.onReceiveMessage(framed);

        const status = await statusPromise;
        assert.strictEqual(status.code, Status.INTERNAL);
        assert(status.details.includes('sync receive boom'));
        assert.strictEqual(getCancelledStatus()?.code, Status.INTERNAL);
      }

      // 4. Synchronous throw in sendMessageMaybeSync when flushing a queued message inside getConfig()
      {
        let configResolved = false;
        const queuedCalls: ResolvingCall[] = [];
        const baseMock = createMockChannel([
          { createFilter: () => new ThrowingSyncFilter('sendMessage') },
        ]);
        const delayedMockChannel = {
          getConfig(method: string, metadata: Metadata) {
            if (!configResolved) {
              return { type: 'NONE' as const };
            }
            return baseMock.mockChannel.getConfig(method, metadata);
          },
          queueCallForConfig(queuedCall: ResolvingCall) {
            queuedCalls.push(queuedCall);
          },
          createRetryingCall: baseMock.mockChannel.createRetryingCall,
          getTarget: baseMock.mockChannel.getTarget,
        } as unknown as InternalChannel;

        const call = new ResolvingCall(
          delayedMockChannel,
          '/test.Service/Unary',
          { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
          new FilterStackFactory([
            new CompressionFilterFactory(dummyChannel, {}),
          ]),
          14
        );
        let resolveStatus!: (status: StatusObject) => void;
        const statusPromise = new Promise<StatusObject>(resolve => {
          resolveStatus = resolve;
        });
        call.start(new Metadata(), {
          onReceiveMetadata() {},
          onReceiveMessage() {},
          onReceiveStatus(status) {
            resolveStatus(status);
          },
        });
        call.sendMessageWithContext({}, Buffer.from('queued-msg'));
        assert.strictEqual(queuedCalls.length, 1);

        // Resolving config and draining queuedCalls must not throw out of getConfig()
        configResolved = true;
        for (const queuedCall of queuedCalls) {
          queuedCall.getConfig();
        }

        const status = await statusPromise;
        assert.strictEqual(status.code, Status.INTERNAL);
        assert(status.details.includes('sync send boom'));
        assert.strictEqual(
          baseMock.getCancelledStatus()?.code,
          Status.INTERNAL
        );
      }

      // 5. Synchronous throw in MaybeSync filter preceded by an async filter (Error rejection normalization)
      for (const stage of [
        'metadata',
        'sendMessage',
        'receiveMessage',
      ] as const) {
        const dynamicFactories: FilterFactory<Filter>[] =
          stage === 'receiveMessage'
            ? [
                { createFilter: () => new ThrowingSyncFilter(stage) },
                new AsyncHeaderFilterFactory('x-async', '1'),
              ]
            : [
                new AsyncHeaderFilterFactory('x-async', '1'),
                { createFilter: () => new ThrowingSyncFilter(stage) },
              ];
        const { mockChannel, getChildListener } =
          createMockChannel(dynamicFactories);
        const call = new ResolvingCall(
          mockChannel,
          '/test.Service/Unary',
          { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
          new FilterStackFactory([
            new CompressionFilterFactory(dummyChannel, {}),
          ]),
          140
        );
        let resolveStatus!: (status: StatusObject) => void;
        const statusPromise = new Promise<StatusObject>(resolve => {
          resolveStatus = resolve;
        });
        call.start(new Metadata(), {
          onReceiveMetadata() {},
          onReceiveMessage() {},
          onReceiveStatus(status) {
            resolveStatus(status);
          },
        });
        if (stage === 'sendMessage') {
          call.sendMessageWithContext({}, Buffer.from('msg'));
        } else if (stage === 'receiveMessage') {
          await new Promise<void>(resolve => setImmediate(resolve));
          getChildListener()!.onReceiveMessage(
            frameMessage(Buffer.from('resp'), false)
          );
        }
        const status = await statusPromise;
        assert.strictEqual(status.code, Status.INTERNAL);
        assert(status.details.includes('boom'));
      }
    });

    it('cancels child and outputs INTERNAL status if child.start throws synchronously in startChild', async () => {
      let childCancelledWith = null as {
        code: Status;
        details: string;
      } | null;
      const throwingChildChannel = {
        getConfig() {
          return {
            type: 'SUCCESS' as const,
            config: {
              methodConfig: { name: [] },
              status: Status.OK,
              dynamicFilterFactories: [],
              pickInformation: {},
            },
          };
        },
        createRetryingCall() {
          return {
            start() {
              throw new Error('sync child.start boom');
            },
            cancelWithStatus(code: Status, details: string) {
              childCancelledWith = { code, details };
            },
            getCallNumber: () => 99,
          };
        },
        getTarget: () => 'dns:///localhost:50051',
      } as unknown as InternalChannel;

      const call = new ResolvingCall(
        throwingChildChannel,
        '/test.Service/Unary',
        { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
        new FilterStackFactory([
          new CompressionFilterFactory(dummyChannel, {}),
        ]),
        15
      );
      let resolveStatus!: (status: StatusObject) => void;
      const statusPromise = new Promise<StatusObject>(resolve => {
        resolveStatus = resolve;
      });
      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus(status) {
          resolveStatus(status);
        },
      });
      const status = await statusPromise;
      assert.strictEqual(status.code, Status.INTERNAL);
      assert(status.details.includes('sync child.start boom'));
      assert.strictEqual(childCancelledWith?.code, Status.INTERNAL);
    });

    it('propagates an exception thrown by listener.onReceiveMessage synchronously for uncompressed messages', () => {
      const { mockChannel, getChildListener } = createMockChannel();
      const call = new ResolvingCall(
        mockChannel,
        '/test.Service/ServerStream',
        { deadline: Infinity, flags: 0, host: 'localhost', parentCall: null },
        new FilterStackFactory([
          new CompressionFilterFactory(dummyChannel, {}),
        ]),
        16
      );
      call.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {
          throw new Error('listener boom');
        },
        onReceiveStatus() {},
      });
      const framed = frameMessage(Buffer.from('resp'), false);
      // Like onReceiveMetadata and onReceiveStatus, a listener exception is
      // not caught or converted to a call status: it propagates to the caller.
      assert.throws(
        () => getChildListener()!.onReceiveMessage(framed),
        /listener boom/
      );
    });
  });

  describe('LoadBalancingCall', () => {
    it('flushes pendingMessage and clears it to null once generateMetadata resolves', async () => {
      const sentMessages: Buffer[] = [];
      let resolveChildSent: () => void;
      const childSentPromise = new Promise<void>(resolve => {
        resolveChildSent = resolve;
      });

      const mockSubchannelCall = {
        getCallNumber: () => 42,
        startRead: () => {},
        sendMessageWithContext: (_context: unknown, message: Buffer) => {
          sentMessages.push(message);
          resolveChildSent();
        },
        halfClose: () => {},
      };

      const mockSubchannel = {
        getCallCredentials: () => CallCredentials.createEmpty(),
        getConnectivityState: () => ConnectivityState.READY,
        getRealSubchannel: () => ({
          createCall: () => mockSubchannelCall,
        }),
        getChannelzRef: () => ({ id: 1 }),
        getAddress: () => '127.0.0.1:50051',
      };

      const mockInternalChannel = {
        doPick: () => ({
          pickResultType: PickResultType.COMPLETE,
          subchannel: mockSubchannel,
          status: null,
          onCallStarted: null,
          onCallEnded: null,
        }),
      };

      const loadBalancingCall = new LoadBalancingCall(
        mockInternalChannel as unknown as InternalChannel,
        {
          methodConfig: { name: [] },
          status: Status.OK,
          dynamicFilterFactories: [],
          pickInformation: {},
        },
        '/test.Service/ServerStream',
        'localhost',
        CallCredentials.createEmpty(),
        Infinity,
        10
      );

      loadBalancingCall.start(new Metadata(), {
        onReceiveMetadata() {},
        onReceiveMessage() {},
        onReceiveStatus() {},
      });

      const requestPayload = Buffer.from('framed-request-payload');
      // CallCredentials.generateMetadata resolves asynchronously on a microtask,
      // so sendMessageWithContext queues onto loadBalancingCall.pendingMessage
      loadBalancingCall.sendMessageWithContext({}, requestPayload);
      assert.notStrictEqual((loadBalancingCall as any).pendingMessage, null);

      await childSentPromise;
      assert.strictEqual(sentMessages.length, 1);
      assert.strictEqual(sentMessages[0], requestPayload);
      assert.strictEqual((loadBalancingCall as any).pendingMessage, null);
    });
  });
});
