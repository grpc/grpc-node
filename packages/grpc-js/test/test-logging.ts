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
import * as logging from '../src/logging';

describe('Logging', () => {
  afterEach(() => {
    // Ensure that the logger is restored to its defaults after each test.
    grpc.setLogger(console);
    grpc.setLogVerbosity(grpc.logVerbosity.DEBUG);
  });

  it('sets the logger to a new value', () => {
    const logger: Partial<Console> = {};

    logging.setLogger(logger);
    assert.strictEqual(logging.getLogger(), logger);
  });

  it('gates logging based on severity', () => {
    const output: Array<string | string[]> = [];
    const logger: Partial<Console> = {
      error(...args: string[]): void {
        output.push(args);
      },
    };

    logging.setLogger(logger);

    // The default verbosity (DEBUG) should log everything.
    logging.log(grpc.logVerbosity.DEBUG, 'a', 'b', 'c');
    logging.log(grpc.logVerbosity.INFO, 'd', 'e');
    logging.log(grpc.logVerbosity.ERROR, 'f');

    // The INFO verbosity should not log DEBUG data.
    logging.setLoggerVerbosity(grpc.logVerbosity.INFO);
    logging.log(grpc.logVerbosity.DEBUG, 1, 2, 3);
    logging.log(grpc.logVerbosity.INFO, 'g');
    logging.log(grpc.logVerbosity.ERROR, 'h', 'i');

    // The ERROR verbosity should not log DEBUG or INFO data.
    logging.setLoggerVerbosity(grpc.logVerbosity.ERROR);
    logging.log(grpc.logVerbosity.DEBUG, 4, 5, 6);
    logging.log(grpc.logVerbosity.INFO, 7, 8);
    logging.log(grpc.logVerbosity.ERROR, 'j', 'k');

    assert.deepStrictEqual(output, [
      ['a', 'b', 'c'],
      ['d', 'e'],
      ['f'],
      ['g'],
      ['h', 'i'],
      ['j', 'k'],
    ]);
  });

  describe('isTracerEnabled and trace', () => {
    function reloadLoggingWithEnv(env: {
      grpcTrace?: string;
      grpcNodeTrace?: string;
    }): typeof logging {
      const originalGrpcTrace = process.env.GRPC_TRACE;
      const originalGrpcNodeTrace = process.env.GRPC_NODE_TRACE;
      const resolvedPath = require.resolve('../src/logging');
      const originalModule = require.cache[resolvedPath];

      try {
        if (env.grpcTrace !== undefined) {
          process.env.GRPC_TRACE = env.grpcTrace;
        } else {
          delete process.env.GRPC_TRACE;
        }
        if (env.grpcNodeTrace !== undefined) {
          process.env.GRPC_NODE_TRACE = env.grpcNodeTrace;
        } else {
          delete process.env.GRPC_NODE_TRACE;
        }
        delete require.cache[resolvedPath];
        return require('../src/logging');
      } finally {
        if (originalGrpcTrace !== undefined) {
          process.env.GRPC_TRACE = originalGrpcTrace;
        } else {
          delete process.env.GRPC_TRACE;
        }
        if (originalGrpcNodeTrace !== undefined) {
          process.env.GRPC_NODE_TRACE = originalGrpcNodeTrace;
        } else {
          delete process.env.GRPC_NODE_TRACE;
        }
        if (originalModule) {
          require.cache[resolvedPath] = originalModule;
        } else {
          delete require.cache[resolvedPath];
        }
      }
    }

    it('returns false when no tracers are configured', () => {
      const reloaded = reloadLoggingWithEnv({});
      assert.strictEqual(reloaded.isTracerEnabled('channel'), false);
      assert.strictEqual(reloaded.isTracerEnabled('subchannel'), false);
      assert.strictEqual(reloaded.isTracerEnabled('all'), false);
    });

    it('enables specified comma-separated tracers and ignores empty entries', () => {
      const reloaded = reloadLoggingWithEnv({
        grpcTrace: ',channel,,subchannel,',
      });
      assert.strictEqual(reloaded.isTracerEnabled('channel'), true);
      assert.strictEqual(reloaded.isTracerEnabled('subchannel'), true);
      assert.strictEqual(reloaded.isTracerEnabled('transport'), false);
    });

    it('supports all and disabled tracers', () => {
      const reloaded = reloadLoggingWithEnv({
        grpcTrace: 'all,-channel',
      });
      assert.strictEqual(reloaded.isTracerEnabled('channel'), false);
      assert.strictEqual(reloaded.isTracerEnabled('subchannel'), true);
      assert.strictEqual(reloaded.isTracerEnabled('other_tracer'), true);
    });

    it('prefers GRPC_NODE_TRACE over GRPC_TRACE', () => {
      const reloaded = reloadLoggingWithEnv({
        grpcTrace: 'channel',
        grpcNodeTrace: 'subchannel',
      });
      assert.strictEqual(reloaded.isTracerEnabled('subchannel'), true);
      assert.strictEqual(reloaded.isTracerEnabled('channel'), false);
    });

    it('does not log when tracer is disabled', () => {
      const output: Array<string | string[]> = [];
      const logger: Partial<Console> = {
        error(...args: string[]): void {
          output.push(args);
        },
      };
      const reloaded = reloadLoggingWithEnv({});
      reloaded.setLogger(logger);
      reloaded.setLoggerVerbosity(grpc.logVerbosity.DEBUG);

      reloaded.trace(grpc.logVerbosity.DEBUG, 'channel', 'test message');
      assert.strictEqual(output.length, 0);
    });

    it('logs formatted message when tracer is enabled', () => {
      const output: Array<string | string[]> = [];
      const logger: Partial<Console> = {
        error(...args: string[]): void {
          output.push(args);
        },
      };
      const reloaded = reloadLoggingWithEnv({
        grpcTrace: 'test_tracer',
      });
      reloaded.setLogger(logger);
      reloaded.setLoggerVerbosity(grpc.logVerbosity.DEBUG);
      reloaded.trace(
        grpc.logVerbosity.DEBUG,
        'test_tracer',
        'hello trace message'
      );
      assert.strictEqual(output.length, 1);
      const loggedLine = String(output[0]);
      assert(loggedLine.includes('test_tracer'));
      assert(loggedLine.includes('hello trace message'));
    });

    it('correctly enables specific built-in tracers', () => {
      const reloaded = reloadLoggingWithEnv({
        grpcTrace:
          'channel_stacktrace,subchannel_refcount,transport_internals,keepalive,transport_flowctrl,backoff',
      });
      assert.strictEqual(reloaded.isTracerEnabled('channel_stacktrace'), true);
      assert.strictEqual(reloaded.isTracerEnabled('subchannel_refcount'), true);
      assert.strictEqual(reloaded.isTracerEnabled('transport_internals'), true);
      assert.strictEqual(reloaded.isTracerEnabled('keepalive'), true);
      assert.strictEqual(reloaded.isTracerEnabled('transport_flowctrl'), true);
      assert.strictEqual(reloaded.isTracerEnabled('backoff'), true);
      assert.strictEqual(reloaded.isTracerEnabled('unrelated_tracer'), false);
    });

    it('does not evaluate expensive trace arguments when tracing is disabled (negative proof)', () => {
      const circularOptions: Record<string, unknown> = {};
      circularOptions.self = circularOptions;

      // When channel tracer is disabled, creating the client succeeds without triggering JSON.stringify
      assert.doesNotThrow(() => {
        const client = new grpc.Client(
          'localhost:1234',
          grpc.credentials.createInsecure(),
          circularOptions
        );
        client.close();
      });

      // A deadline with a throwing toISOString method will throw if deadlineToString is evaluated
      const throwingDeadline = new Date(Date.now() + 10000);
      throwingDeadline.toISOString = () => {
        throw new Error('deadlineToString should not be evaluated');
      };
      const client = new grpc.Client(
        'localhost:1234',
        grpc.credentials.createInsecure()
      );
      const internalChannel = (client.getChannel() as any).internalChannel;
      assert.doesNotThrow(() => {
        internalChannel.createResolvingCall(
          '/Service/Method',
          throwingDeadline as any,
          'localhost',
          null,
          null
        );
      });
      client.close();
    });
  });
});
