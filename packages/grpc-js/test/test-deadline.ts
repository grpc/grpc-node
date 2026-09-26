/*
 * Copyright 2021 gRPC authors.
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
import {
  formatDateDifference,
  getDeadlineTimeoutString,
  getRelativeTimeout,
  minDeadline,
} from '../src/deadline';
import { ServiceClient, ServiceClientConstructor } from '../src/make-client';
import { loadProtoFile } from './common';

const TIMEOUT_SERVICE_CONFIG: grpc.ServiceConfig = {
  loadBalancingConfig: [],
  methodConfig: [
    {
      name: [{ service: 'TestService' }],
      timeout: {
        seconds: 1,
        nanos: 0,
      },
    },
  ],
};

describe('Client with configured timeout', () => {
  let server: grpc.Server;
  let Client: ServiceClientConstructor;
  let client: ServiceClient;
  let serverPort: number;

  before(done => {
    Client = loadProtoFile(__dirname + '/fixtures/test_service.proto')
      .TestService as ServiceClientConstructor;
    server = new grpc.Server();
    server.addService(Client.service, {
      unary: () => {},
      clientStream: () => {},
      serverStream: () => {},
      bidiStream: () => {},
    });
    server.bindAsync(
      'localhost:0',
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          done(error);
          return;
        }
        serverPort = port;
        server.start();
        client = new Client(
          `localhost:${port}`,
          grpc.credentials.createInsecure(),
          { 'grpc.service_config': JSON.stringify(TIMEOUT_SERVICE_CONFIG) }
        );
        done();
      }
    );
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
  });

  it('Should end calls without explicit deadline with DEADLINE_EXCEEDED', done => {
    client.unary({}, (error: grpc.ServiceError, value: unknown) => {
      assert(error);
      assert.strictEqual(error.code, grpc.status.DEADLINE_EXCEEDED);
      assert.match(error.details, /Deadline exceeded after \d+\.\d{3}s/);
      done();
    });
  });

  it('Should end calls with a long explicit deadline with DEADLINE_EXCEEDED', done => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 20);
    client.unary({}, (error: grpc.ServiceError, value: unknown) => {
      assert(error);
      assert.strictEqual(error.code, grpc.status.DEADLINE_EXCEEDED);
      done();
    });
  });

  it('Should handle sub-millisecond fractional nanos in methodConfig timeout', done => {
    const fractionalTimeoutConfig: grpc.ServiceConfig = {
      loadBalancingConfig: [],
      methodConfig: [
        {
          name: [{ service: 'TestService' }],
          timeout: {
            seconds: 0,
            nanos: 50_500_000,
          },
        },
      ],
    };
    const fractionalClient = new Client(
      `localhost:${serverPort}`,
      grpc.credentials.createInsecure(),
      { 'grpc.service_config': JSON.stringify(fractionalTimeoutConfig) }
    );
    fractionalClient.unary({}, (error: grpc.ServiceError) => {
      assert(error);
      assert.strictEqual(error.code, grpc.status.DEADLINE_EXCEEDED);
      assert.match(error.details, /Deadline exceeded after \d+\.\d{3}s/);
      fractionalClient.close();
      done();
    });
  });
});

describe('deadline utility functions', () => {
  describe('formatDateDifference', () => {
    it('formats difference between Date objects', () => {
      const startDate = new Date(1000);
      const endDate = new Date(2500);
      assert.strictEqual(formatDateDifference(startDate, endDate), '1.500s');
    });

    it('formats difference between number timestamps', () => {
      const startTimestamp = 1000;
      const endTimestamp = 3250;
      assert.strictEqual(
        formatDateDifference(startTimestamp, endTimestamp),
        '2.250s'
      );
    });

    it('formats difference with mixed Date and number timestamps', () => {
      const startDate = new Date(5000);
      const endTimestamp = 6125;
      assert.strictEqual(
        formatDateDifference(startDate, endTimestamp),
        '1.125s'
      );
      assert.strictEqual(
        formatDateDifference(endTimestamp, startDate),
        '-1.125s'
      );
    });
  });

  describe('minDeadline', () => {
    it('returns the minimum deadline across Date and number values', () => {
      const firstDeadline = new Date(5000);
      const secondDeadline = 2000;
      const thirdDeadline = new Date(8000);
      const fourthDeadline = 3000;
      assert.strictEqual(
        minDeadline(
          firstDeadline,
          secondDeadline,
          thirdDeadline,
          fourthDeadline
        ),
        2000
      );
    });

    it('returns Infinity when given an empty list', () => {
      assert.strictEqual(minDeadline(), Infinity);
    });

    it('handles 0 timestamp correctly', () => {
      assert.strictEqual(minDeadline(0, 1000), 0);
      assert.strictEqual(minDeadline(1000, 0), 0);
      assert.strictEqual(minDeadline(new Date(0), 1000), 0);
    });
  });

  describe('getRelativeTimeout', () => {
    it('returns 0 for deadlines in the past', () => {
      const pastDate = new Date(Date.now() - 5000);
      const pastTimestamp = Date.now() - 5000;
      assert.strictEqual(getRelativeTimeout(pastDate), 0);
      assert.strictEqual(getRelativeTimeout(pastTimestamp), 0);
    });

    it('returns positive timeout for deadlines in the future', () => {
      const futureTimestamp = Date.now() + 5000;
      const futureDate = new Date(futureTimestamp);
      const timeoutFromDate = getRelativeTimeout(futureDate);
      const timeoutFromNumber = getRelativeTimeout(futureTimestamp);
      assert(timeoutFromDate > 0 && timeoutFromDate <= 5000);
      assert(timeoutFromNumber > 0 && timeoutFromNumber <= 5000);
    });

    it('returns Infinity for deadlines exceeding MAX_TIMEOUT_TIME', () => {
      const distantFuture = Date.now() + 3_000_000_000;
      assert.strictEqual(getRelativeTimeout(distantFuture), Infinity);
    });
  });

  describe('getDeadlineTimeoutString', () => {
    it('formats timeout string correctly for milliseconds', () => {
      const now = Date.now();
      const deadline = now + 500;
      const timeoutString = getDeadlineTimeoutString(deadline);
      assert(
        timeoutString.endsWith('m'),
        `Expected ${timeoutString} to end with m`
      );
    });

    it('formats timeout string for deadlines as Date instances', () => {
      const now = Date.now();
      const deadlineDate = new Date(now + 2500);
      const timeoutString = getDeadlineTimeoutString(deadlineDate);
      assert.match(
        timeoutString,
        /^\d+m$/,
        `Expected ${timeoutString} to match format e.g. 2500m`
      );
    });

    it('handles epoch 0 correctly', () => {
      assert.strictEqual(formatDateDifference(0, 1500), '1.500s');
      assert.strictEqual(formatDateDifference(1500, 0), '-1.500s');
      assert.strictEqual(getRelativeTimeout(0), 0);
    });

    it('throws when deadline is too far in the future', () => {
      const excessivelyFarDeadline =
        Date.now() + 100_000_000 * 60 * 60 * 1000 + 1000;
      assert.throws(
        () => getDeadlineTimeoutString(excessivelyFarDeadline),
        /Deadline is too far in the future/
      );
    });
  });
});

describe('Calls without deadlines', () => {
  let server: grpc.Server;
  let Client: ServiceClientConstructor;
  let client: ServiceClient;
  let originalSetTimeout: typeof setTimeout;

  before(done => {
    Client = loadProtoFile(__dirname + '/fixtures/test_service.proto')
      .TestService as ServiceClientConstructor;
    server = new grpc.Server();
    server.addService(Client.service, {
      unary: (
        call: grpc.ServerUnaryCall<unknown, unknown>,
        callback: grpc.sendUnaryData<Record<string, unknown>>
      ) => {
        callback(null, {});
      },
    });
    server.bindAsync(
      'localhost:0',
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {
        if (error) {
          done(error);
          return;
        }
        server.start();
        client = new Client(
          `localhost:${port}`,
          grpc.credentials.createInsecure()
        );
        client.waitForReady(Date.now() + 2000, done);
      }
    );
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
  });

  afterEach(() => {
    if (originalSetTimeout) {
      global.setTimeout = originalSetTimeout;
    }
  });

  it('Should not schedule any timer for calls with infinite deadline', done => {
    let timerCount = 0;
    originalSetTimeout = global.setTimeout;
    global.setTimeout = ((
      handler: (...args: any[]) => void,
      timeout?: number,
      ...args: any[]
    ) => {
      timerCount++;
      return originalSetTimeout(handler as any, timeout, ...args);
    }) as any;

    client.unary({}, (error: grpc.ServiceError | null) => {
      assert.ifError(error);
      assert.strictEqual(timerCount, 0);
      done();
    });
  });
});
