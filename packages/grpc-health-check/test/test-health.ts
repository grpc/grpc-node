/*
 *
 * Copyright 2023 gRPC authors.
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
import * as grpc from '@grpc/grpc-js';
import { HealthImplementation, ServingStatusMap, service as healthServiceDefinition } from '../src/health';
import { HealthClient } from './generated/grpc/health/v1/Health';
import { HealthCheckResponse__Output, _grpc_health_v1_HealthCheckResponse_ServingStatus__Output } from './generated/grpc/health/v1/HealthCheckResponse';

describe('Health checking', () => {
  const statusMap: ServingStatusMap = {
    '': 'SERVING',
    'grpc.test.TestServiceNotServing': 'NOT_SERVING',
    'grpc.test.TestServiceServing': 'SERVING'
  };
  let healthServer: grpc.Server;
  let healthClient: HealthClient;
  let healthImpl: HealthImplementation;
  beforeEach(done => {
    healthServer = new grpc.Server();
    healthImpl = new HealthImplementation(statusMap);
    healthImpl.addToServer(healthServer);
    healthServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        done(error);
        return;
      }
      const HealthClientConstructor = grpc.makeClientConstructor(healthServiceDefinition, 'grpc.health.v1.HealthService');
      healthClient = new HealthClientConstructor(`localhost:${port}`, grpc.credentials.createInsecure()) as unknown as HealthClient;
      healthServer.start();
      done();
    });
  });
  afterEach((done) => {
    healthClient.close();
    healthServer.tryShutdown(done);
  });
  describe('check', () => {
    it('Should say that an enabled service is SERVING', done => {
      healthClient.check({service: ''}, (error, value) => {
        assert.ifError(error);
        assert.strictEqual(value?.status, 'SERVING');
        done();
      });
    });
    it('Should say that a disabled service is NOT_SERVING', done => {
      healthClient.check({service: 'grpc.test.TestServiceNotServing'}, (error, value) => {
        assert.ifError(error);
        assert.strictEqual(value?.status, 'NOT_SERVING');
        done();
      });
    });
    it('Should get NOT_FOUND if the service is not registered', done => {
      healthClient.check({service: 'not_registered'}, (error, value) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.NOT_FOUND);
        done();
      });
    });
    it('Should get a different response if the health status changes', done => {
      healthClient.check({service: 'transient'}, (error, value) => {
        assert(error);
        assert.strictEqual(error.code, grpc.status.NOT_FOUND);
        healthImpl.setStatus('transient', 'SERVING');
        healthClient.check({service: 'transient'}, (error, value) => {
          assert.ifError(error);
          assert.strictEqual(value?.status, 'SERVING');
          done();
        });
      });
    });
  });
  describe('watch', () => {
    it('Should respond with the health status for an existing service', done => {
      const call = healthClient.watch({service: ''});
      call.on('data', (response: HealthCheckResponse__Output) => {
        assert.strictEqual(response.status, 'SERVING');
        call.cancel();
      });
      call.on('error', () => {});
      call.on('status', status => {
        assert.strictEqual(status.code, grpc.status.CANCELLED);
        done();
      });
    });
    it('Should send a new update when the status changes', done => {
      const receivedStatusList: _grpc_health_v1_HealthCheckResponse_ServingStatus__Output[] = [];
      const call = healthClient.watch({service: 'grpc.test.TestServiceServing'});
      call.on('data', (response: HealthCheckResponse__Output) => {
        switch (receivedStatusList.length) {
          case 0:
            assert.strictEqual(response.status, 'SERVING');
            healthImpl.setStatus('grpc.test.TestServiceServing', 'NOT_SERVING');
            break;
          case 1:
            assert.strictEqual(response.status, 'NOT_SERVING');
            call.cancel();
            break;
          default:
            assert.fail(`Unexpected third status update ${response.status}`);
        }
        receivedStatusList.push(response.status);
      });
      call.on('error', () => {});
      call.on('status', status => {
        assert.deepStrictEqual(receivedStatusList, ['SERVING', 'NOT_SERVING']);
        assert.strictEqual(status.code, grpc.status.CANCELLED);
        done();
      });
    });
    it('Should update when a service that did not exist is added', done => {
      const receivedStatusList: _grpc_health_v1_HealthCheckResponse_ServingStatus__Output[] = [];
      const call = healthClient.watch({service: 'transient'});
      call.on('data', (response: HealthCheckResponse__Output) => {
        switch (receivedStatusList.length) {
          case 0:
            assert.strictEqual(response.status, 'SERVICE_UNKNOWN');
            healthImpl.setStatus('transient', 'SERVING');
            break;
          case 1:
            assert.strictEqual(response.status, 'SERVING');
            call.cancel();
            break;
          default:
            assert.fail(`Unexpected third status update ${response.status}`);
        }
        receivedStatusList.push(response.status);
      });
      call.on('error', () => {});
      call.on('status', status => {
        assert.deepStrictEqual(receivedStatusList, ['SERVICE_UNKNOWN', 'SERVING']);
        assert.strictEqual(status.code, grpc.status.CANCELLED);
        done();
      });
    })
  });
});
