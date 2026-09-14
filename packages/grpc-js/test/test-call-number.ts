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
import { execFile } from 'child_process';
import * as path from 'path';

import * as grpc from '../src';
import { Server, ServerCredentials } from '../src';
import { getNextCallNumber } from '../src/call-number';
import { ServiceClientConstructor } from '../src/make-client';

import { loadProtoFile } from './common';

const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
const EchoService = loadProtoFile(protoFile)
  .EchoService as ServiceClientConstructor;

describe('Call number unification', () => {
  let server: Server;
  let serverPort: number;

  before(done => {
    server = new Server();
    server.addService(EchoService.service, {
      echo(
        call: grpc.ServerUnaryCall<any, any>,
        callback: grpc.sendUnaryData<any>
      ) {
        const succeedOnRetryAttempt = call.metadata.get(
          'succeed-on-retry-attempt'
        );
        const previousAttempts = call.metadata.get(
          'grpc-previous-rpc-attempts'
        );
        if (
          succeedOnRetryAttempt.length === 0 ||
          (previousAttempts.length > 0 &&
            previousAttempts[0] === succeedOnRetryAttempt[0])
        ) {
          callback(null, call.request);
        } else {
          callback({
            code: grpc.status.UNAVAILABLE,
            details: `Failed on attempt ${previousAttempts[0] ?? 0}`,
          });
        }
      },
      echoClientStream(
        call: grpc.ServerReadableStream<any, any>,
        callback: grpc.sendUnaryData<any>
      ) {
        let lastMessage: any;
        call.on('data', message => {
          lastMessage = message;
        });
        call.on('end', () => {
          callback(null, lastMessage ?? { value: '', value2: 0 });
        });
      },
      echoServerStream(call: grpc.ServerWritableStream<any, any>) {
        call.write(call.request);
        call.end();
      },
      echoBidiStream(call: grpc.ServerDuplexStream<any, any>) {
        call.on('data', message => {
          call.write(message);
        });
        call.on('end', () => {
          call.end();
        });
      },
    });

    server.bindAsync(
      'localhost:0',
      ServerCredentials.createInsecure(),
      (error, port) => {
        assert.ifError(error);
        serverPort = port;
        done();
      }
    );
  });

  after(done => {
    server.tryShutdown(done);
  });

  it('getNextCallNumber increases monotonically', () => {
    const initialCallNumber = getNextCallNumber();
    assert.strictEqual(getNextCallNumber(), initialCallNumber + 1);
    assert.strictEqual(getNextCallNumber(), initialCallNumber + 2);
  });

  it('allocates exactly one call number per logical RPC', done => {
    const client = new EchoService(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );

    const callNumberBefore = getNextCallNumber();
    client.echo(
      { value: 'call-number-test', value2: 42 },
      (error: grpc.ServiceError | null, response: any) => {
        assert.ifError(error);
        assert.strictEqual(response.value, 'call-number-test');

        const callNumberAfter = getNextCallNumber();
        // callNumberBefore was N.
        // The RPC allocated exactly 1 call number: N + 1.
        // callNumberAfter is therefore N + 2.
        assert.strictEqual(
          callNumberAfter,
          callNumberBefore + 2,
          'Expected single RPC to consume exactly 1 call number'
        );

        // A second sequential RPC should allocate N + 3.
        client.echo(
          { value: 'second-call', value2: 43 },
          (secondError: grpc.ServiceError | null, secondResponse: any) => {
            assert.ifError(secondError);
            assert.strictEqual(secondResponse.value, 'second-call');

            const callNumberFinal = getNextCallNumber();
            // Second RPC consumed N + 3, so callNumberFinal is N + 4.
            assert.strictEqual(
              callNumberFinal,
              callNumberAfter + 2,
              'Expected sequential RPC to consume exactly 1 call number'
            );
            client.close();
            done();
          }
        );
      }
    );
  });

  it('allocates a new call number for retry attempts', done => {
    const serviceConfig = {
      methodConfig: [
        {
          name: [
            {
              service: 'EchoService',
            },
          ],
          retryPolicy: {
            maxAttempts: 3,
            initialBackoff: '0.01s',
            maxBackoff: '0.1s',
            backoffMultiplier: 1.2,
            retryableStatusCodes: [grpc.status.UNAVAILABLE],
          },
        },
      ],
    };

    const client = new EchoService(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure(),
      {
        'grpc.service_config': JSON.stringify(serviceConfig),
      }
    );

    const callNumberBefore = getNextCallNumber();
    const metadata = new grpc.Metadata();
    metadata.set('succeed-on-retry-attempt', '1');

    client.echo(
      { value: 'retry-test', value2: 100 },
      metadata,
      (error: grpc.ServiceError | null, response: any) => {
        assert.ifError(error);
        assert.strictEqual(response.value, 'retry-test');

        const callNumberAfter = getNextCallNumber();
        // Initial call allocated 1 call number (attempt 0),
        // and retry attempt 1 allocated 1 additional call number.
        // So exactly 2 call numbers were allocated for the retried RPC.
        assert.strictEqual(
          callNumberAfter,
          callNumberBefore + 3,
          'Expected retried RPC with 1 retry to consume exactly 2 call numbers'
        );
        client.close();
        done();
      }
    );
  });

  it('threads call number across InternalChannel call creation helpers', () => {
    const client = new grpc.Client(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );
    const internalChannel = (client.getChannel() as any).internalChannel;

    const customCallNumber = getNextCallNumber() + 100;
    const callConfig = {
      methodConfig: { name: [] },
      pickInformation: {},
      status: grpc.status.OK,
      dynamicFilterFactories: [],
    };

    // createRetryingCall accepts an optional callNumber
    const retryingCallWithId = internalChannel.createRetryingCall(
      callConfig,
      '/EchoService/echo',
      'localhost',
      grpc.credentials.createInsecure(),
      Infinity,
      customCallNumber
    );
    assert.strictEqual(retryingCallWithId.getCallNumber(), customCallNumber);

    // createRetryingCall generates a callNumber if omitted
    const retryingCallWithoutId = internalChannel.createRetryingCall(
      callConfig,
      '/EchoService/echo',
      'localhost',
      grpc.credentials.createInsecure(),
      Infinity
    );
    assert(typeof retryingCallWithoutId.getCallNumber() === 'number');

    // createLoadBalancingCall accepts an optional callNumber
    const loadBalancingCallWithId = internalChannel.createLoadBalancingCall(
      callConfig,
      '/EchoService/echo',
      'localhost',
      grpc.credentials.createInsecure(),
      Infinity,
      customCallNumber
    );
    assert.strictEqual(
      loadBalancingCallWithId.getCallNumber(),
      customCallNumber
    );

    // createLoadBalancingCall generates a callNumber if omitted
    const loadBalancingCallWithoutId = internalChannel.createLoadBalancingCall(
      callConfig,
      '/EchoService/echo',
      'localhost',
      grpc.credentials.createInsecure(),
      Infinity
    );
    assert(typeof loadBalancingCallWithoutId.getCallNumber() === 'number');
    client.close();
  });

  it('unifies call numbers across trace logs across all layers when tracing is enabled', function (done) {
    this.timeout(5000);
    const packageDirectory = __dirname.includes('build')
      ? path.resolve(__dirname, '../..')
      : path.resolve(__dirname, '..');
    const script = `
const grpc = require('./build/src');
const path = require('path');
const protoFile = path.join(
  __dirname, 'test', 'fixtures', 'echo_service.proto'
);
const { loadProtoFile } = require('./build/test/common');
const EchoService = loadProtoFile(protoFile).EchoService;

const server = new grpc.Server();
server.addService(EchoService.service, {
  echo(call, callback) { callback(null, call.request); }
});
server.bindAsync(
  'localhost:0',
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    const logs = [];
    grpc.setLogger({
      error(...args) { logs.push(args.join(' ')); }
    });
    grpc.setLogVerbosity(grpc.logVerbosity.DEBUG);

    const client = new EchoService(
      'localhost:' + port,
      grpc.credentials.createInsecure()
    );
    client.echo({ value: 'hi', value2: 1 }, (err, resp) => {
      client.close();
      server.forceShutdown();
      process.stdout.write(JSON.stringify(logs));
    });
  }
);
`;
    execFile(
      process.execPath,
      ['-e', script],
      {
        cwd: packageDirectory,
        env: {
          ...process.env,
          GRPC_TRACE: 'resolving_call,subchannel_call,load_balancing_call',
        },
      },
      (error, stdout) => {
        assert.ifError(error);
        const logs: string[] = JSON.parse(stdout);
        assert(logs.length > 0, 'Expected trace logs to be emitted');
        for (const line of logs) {
          assert(
            line.includes('[0]'),
            `Expected log line to contain [0]: ${line}`
          );
        }
        done();
      }
    );
  });

  it('allocates exactly one call number per client streaming RPC', done => {
    const client = new EchoService(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );

    const callNumberBefore = getNextCallNumber();
    const stream = client.echoClientStream(
      (error: grpc.ServiceError | null, response: any) => {
        assert.ifError(error);
        assert.strictEqual(response.value, 'streaming-test');
        const callNumberAfter = getNextCallNumber();
        assert.strictEqual(
          callNumberAfter,
          callNumberBefore + 2,
          'Expected client streaming RPC to consume exactly 1 call number'
        );
        client.close();
        done();
      }
    );
    stream.write({ value: 'streaming-test', value2: 1 });
    stream.end();
  });

  it('allocates exactly one call number per server streaming RPC', done => {
    const client = new EchoService(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );

    const callNumberBefore = getNextCallNumber();
    const stream = client.echoServerStream({
      value: 'server-streaming-test',
      value2: 2,
    });
    stream.on('data', (response: any) => {
      assert.strictEqual(response.value, 'server-streaming-test');
    });
    stream.on('end', () => {
      const callNumberAfter = getNextCallNumber();
      assert.strictEqual(
        callNumberAfter,
        callNumberBefore + 2,
        'Expected server streaming RPC to consume exactly 1 call number'
      );
      client.close();
      done();
    });
  });

  it('allocates exactly one call number per bidi streaming RPC', done => {
    const client = new EchoService(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );

    const callNumberBefore = getNextCallNumber();
    const stream = client.echoBidiStream();
    stream.on('data', (response: any) => {
      assert.strictEqual(response.value, 'bidi-test');
      stream.end();
    });
    stream.on('end', () => {
      const callNumberAfter = getNextCallNumber();
      assert.strictEqual(
        callNumberAfter,
        callNumberBefore + 2,
        'Expected bidi streaming RPC to consume exactly 1 call number'
      );
      client.close();
      done();
    });
    stream.write({ value: 'bidi-test', value2: 3 });
  });

  it('allocates new call numbers for transparent retries', () => {
    const client = new grpc.Client(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );
    const internalChannel = (client.getChannel() as any).internalChannel;
    const initialCallNumber = getNextCallNumber();
    const callConfig = {
      methodConfig: { name: [] },
      pickInformation: {},
      status: grpc.status.OK,
      dynamicFilterFactories: [],
    };

    const retryingCall = internalChannel.createRetryingCall(
      callConfig,
      '/EchoService/echo',
      'localhost',
      grpc.credentials.createInsecure(),
      Infinity,
      initialCallNumber
    ) as any;

    retryingCall.start(new grpc.Metadata(), {
      onReceiveMetadata: () => {},
      onReceiveMessage: () => {},
      onReceiveStatus: () => {},
    });

    // First attempt uses initial call number
    assert.strictEqual(retryingCall.underlyingCalls.length, 1);
    assert.strictEqual(
      retryingCall.underlyingCalls[0].call.getCallNumber(),
      initialCallNumber
    );

    // Simulate transparent retry (e.g. REFUSED)
    retryingCall.handleChildStatus(
      {
        code: grpc.status.UNAVAILABLE,
        details: 'Stream refused',
        metadata: new grpc.Metadata(),
        progress: 'REFUSED',
      },
      0
    );

    // Transparent retry attempt gets a fresh call number
    assert.strictEqual(retryingCall.underlyingCalls.length, 2);
    assert.strictEqual(
      retryingCall.underlyingCalls[1].call.getCallNumber(),
      initialCallNumber + 1
    );

    client.close();
  });

  it('allocates new call numbers for hedged attempts', () => {
    const client = new grpc.Client(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure()
    );
    const internalChannel = (client.getChannel() as any).internalChannel;
    const initialCallNumber = getNextCallNumber();
    const callConfig = {
      methodConfig: {
        name: [],
        hedgingPolicy: {
          maxAttempts: 3,
          hedgingDelay: '100s',
          nonFatalStatusCodes: [grpc.status.UNAVAILABLE],
        },
      },
      pickInformation: {},
      status: grpc.status.OK,
      dynamicFilterFactories: [],
    };

    const retryingCall = internalChannel.createRetryingCall(
      callConfig,
      '/EchoService/echo',
      'localhost',
      grpc.credentials.createInsecure(),
      Infinity,
      initialCallNumber
    ) as any;

    retryingCall.start(new grpc.Metadata(), {
      onReceiveMetadata: () => {},
      onReceiveMessage: () => {},
      onReceiveStatus: () => {},
    });

    assert.strictEqual(retryingCall.underlyingCalls.length, 1);
    assert.strictEqual(
      retryingCall.underlyingCalls[0].call.getCallNumber(),
      initialCallNumber
    );

    // Trigger hedging attempt
    retryingCall.maybeStartHedgingAttempt();

    assert.strictEqual(retryingCall.underlyingCalls.length, 2);
    assert.strictEqual(
      retryingCall.underlyingCalls[1].call.getCallNumber(),
      initialCallNumber + 1
    );

    retryingCall.cancelWithStatus(grpc.status.CANCELLED, 'test done');
    client.close();
  });

  it('propagates call number in SingleSubchannelChannel', async () => {
    let capturedCallId: number | undefined;
    const mockSubchannel: any = {
      getAddress: () => 'localhost:12345',
      getConnectivityState: () => 2, // READY
      getCallCredentials: () => ({
        generateMetadata: async () => new grpc.Metadata(),
      }),
      getChannelzRef: () => ({ id: 1, kind: 'subchannel', name: 'subchannel' }),
      createCall: (
        metadata: any,
        host: string,
        method: string,
        listener: any,
        callId?: number
      ) => {
        capturedCallId = callId;
        return {
          getPeer: () => 'localhost:12345',
          startRead: () => {},
          sendMessageWithContext: () => {},
          halfClose: () => {},
          cancelWithStatus: () => {},
          getCallNumber: () => callId,
        };
      },
    };

    const SingleSubchannelChannel =
      require('../src/single-subchannel-channel').SingleSubchannelChannel;
    const singleChannel = new SingleSubchannelChannel(
      mockSubchannel,
      { scheme: 'dns', path: 'localhost:12345' },
      { 'grpc.enable_channelz': 0 }
    );

    const callNumber = getNextCallNumber();
    // Next call from singleChannel.createCall should receive callNumber + 1
    const call = singleChannel.createCall('/service/method', Infinity);
    assert.strictEqual(call.getCallNumber(), callNumber + 1);

    await call.start(new grpc.Metadata(), {
      onReceiveMetadata: () => {},
      onReceiveMessage: () => {},
      onReceiveStatus: () => {},
    });

    // Verify mockSubchannel.createCall received the exact same callNumber
    assert.strictEqual(capturedCallId, callNumber + 1);
  });
});
