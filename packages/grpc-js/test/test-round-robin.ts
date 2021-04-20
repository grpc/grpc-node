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

function makeServiceImpl(responseText: string) {
  return {
    unary: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
      callback(null, {text: responseText});
    }
  };
}

describe('Round robin load balancing policy', () => {
  let server1: grpc.Server;
  let server2: grpc.Server;
  let server3: grpc.Server;
  let client: ServiceClient;

  before((done) => {
    server1 = new grpc.Server();
    server1.addService(TestServiceClient.service, makeServiceImpl('server1'));
    server2 = new grpc.Server();
    server2.addService(TestServiceClient.service, makeServiceImpl('server2'));
    server3 = new grpc.Server();
    server3.addService(TestServiceClient.service, makeServiceImpl('server3'));
    const serverCredentials = grpc.ServerCredentials.createInsecure();
    server1.bindAsync('localhost:0', serverCredentials, (error, port1) => {
      if (error) {
        done(error);
        return;
      }
      server2.bindAsync('localhost:0', serverCredentials, (error, port2) => {
        if (error) {
          done(error);
          return;
        }
        server3.bindAsync('localhost:0', serverCredentials, (error, port3) => {
          if (error) {
            done(error);
            return;
          }
          server1.start();
          server2.start();
          server3.start();
          client = new TestServiceClient(`ipv4:127.0.0.1:${port1},127.0.0.1:${port2},127.0.0.1:${port3}`, grpc.credentials.createInsecure(), {"grpc.service_config": ROUND_ROBIN_SERVICE_CONFIG});
          done();
        });
      });
    });
  });
  after(() => {
    server1.forceShutdown();
    server2.forceShutdown();
    server3.forceShutdown();
  });
  it('Should send requests to all servers', (done) => {
    const responseCounts: {[serverName: string]: number} = {
      'server1': 0,
      'server2': 0,
      'server3': 0
    };
    const totalRequestCount = 30;
    let requestsSucceeded = 0;
    function makeNextRequest() {
      client.unary({}, (error: grpc.ServiceError, response: any) => {
        assert.ifError(error);
        responseCounts[response.text]++;
        requestsSucceeded++;
        if (requestsSucceeded >= totalRequestCount) {
          console.log(responseCounts);
          assert(responseCounts.server1 > 0 && responseCounts.server2 > 0 && responseCounts.server3 > 0);
          done();
        } else {
          makeNextRequest();
        }
      });
    }
    makeNextRequest();
  });
});