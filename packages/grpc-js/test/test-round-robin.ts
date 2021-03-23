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
import * as path from 'path';

import * as grpc from '../src';
import { ServiceClient, ServiceClientConstructor } from '../src/make-client';
import { loadProtoFile } from './common';

const ROUND_ROBIN_SERVICE_CONFIG = JSON.stringify({
  loadBalancingConfig: [
    {round_robin: {}}
  ]
});


const protoFile = path.join(__dirname, 'fixtures', 'test_service.proto');
const testServiceDef = loadProtoFile(protoFile);
const TestServiceClient = testServiceDef.TestService as ServiceClientConstructor;

describe('Round robin load balancing policy', () => {
  const serviceImpl = {
    unary: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      callback(null, {});
    }
  };
  let server: grpc.Server;
  let port: number;
  let client: ServiceClient;
  beforeEach((done) => {
    server = new grpc.Server();
    server.addService(TestServiceClient.service, {
      unary: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
        callback(null, {});
      }
    });
    server.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, serverPort) => {
      if (error) {
        done(error);
      }
      port = serverPort;
      server.start();
      client = new TestServiceClient(`localhost:${port}`, grpc.credentials.createInsecure(), {"grpc.service_config": ROUND_ROBIN_SERVICE_CONFIG});
      done();
    });
  });
  afterEach(() => {
    server.forceShutdown();
  });
  it('Should connect to a server', (done) => {
    client.unary({}, (error: grpc.ServiceError, response: any) => {
      assert.ifError(error);
      done();
    });
  });
  /* Trace logs show that the client correctly tries to reconnect after losing
   * the connection to the original server, but it gets ECONNREFUSED for some
   * reason, so the test does not work. There may be some kind of interference
   * between the two servers. */
  it.skip('Should reconnect after a connection is dropped', (done) => {
    client.unary({}, (error: grpc.ServiceError, response: any) => {
      assert.ifError(error);
      server.tryShutdown(() => {
        server = new grpc.Server();
        server.addService(TestServiceClient.service, serviceImpl);
        server.bindAsync(`localhost:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
          server.start();
          client.unary({}, (error: grpc.ServiceError, response: any) => {
            assert.ifError(error);
            done();
          });
        });
      });
    });
  });
});