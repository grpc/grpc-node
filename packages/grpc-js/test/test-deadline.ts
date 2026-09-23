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
