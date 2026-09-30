/*
 * Copyright 2022 gRPC authors.
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
import { loadProtoFile } from './common';

const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
const EchoService = loadProtoFile(protoFile)
  .EchoService as grpc.ServiceClientConstructor;

const serviceImpl = {
  echo: (
    call: grpc.ServerUnaryCall<any, any>,
    callback: grpc.sendUnaryData<any>
  ) => {
    const succeedOnRetryAttempt = call.metadata.get('succeed-on-retry-attempt');
    const previousAttempts = call.metadata.get('grpc-previous-rpc-attempts');
    if (
      succeedOnRetryAttempt.length === 0 ||
      (previousAttempts.length > 0 &&
        previousAttempts[0] === succeedOnRetryAttempt[0])
    ) {
      callback(null, call.request);
    } else {
      const statusCode = call.metadata.get('respond-with-status');
      const code = statusCode[0]
        ? Number.parseInt(statusCode[0] as string)
        : grpc.status.UNKNOWN;
      callback({
        code: code,
        details: `Failed on retry ${previousAttempts[0] ?? 0}`,
      });
    }
  },
};

describe('Retries', () => {
  let server: grpc.Server;
  let port: number;
  const originalClone = grpc.Metadata.prototype.clone;

  before(done => {
    server = new grpc.Server();
    server.addService(EchoService.service, serviceImpl);
    server.bindAsync(
      'localhost:0',
      grpc.ServerCredentials.createInsecure(),
      (error, portNumber) => {
        if (error) {
          done(error);
          return;
        }
        port = portNumber;
        server.start();
        done();
      }
    );
  });

  afterEach(() => {
    grpc.Metadata.prototype.clone = originalClone;
  });

  after(() => {
    server.forceShutdown();
  });

  describe('Client with retries disabled', () => {
    let client: InstanceType<grpc.ServiceClientConstructor>;
    before(() => {
      client = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
        { 'grpc.enable_retries': 0 }
      );
    });

    after(() => {
      client.close();
    });

    it('Should be able to make a basic request', done => {
      client.echo(
        { value: 'test value', value2: 3 },
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should fail if the server fails the first request', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '1');
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.details, 'Failed on retry 0');
          done();
        }
      );
    });
  });

  describe('Client with retries enabled but not configured', () => {
    let client: InstanceType<grpc.ServiceClientConstructor>;
    before(() => {
      client = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure()
      );
    });

    after(() => {
      client.close();
    });

    it('Should be able to make a basic request', done => {
      client.echo(
        { value: 'test value', value2: 3 },
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should fail if the server fails the first request', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '1');
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.details, 'Failed on retry 0');
          done();
        }
      );
    });
  });

  describe('Client with retries configured', () => {
    let client: InstanceType<grpc.ServiceClientConstructor>;
    before(() => {
      const serviceConfig = {
        loadBalancingConfig: [],
        methodConfig: [
          {
            name: [
              {
                service: 'EchoService',
              },
            ],
            retryPolicy: {
              maxAttempts: 3,
              initialBackoff: '0.1s',
              maxBackoff: '10s',
              backoffMultiplier: 1.2,
              retryableStatusCodes: [14, 'RESOURCE_EXHAUSTED'],
            },
          },
        ],
        retryThrottling: {
          maxTokens: 1000,
          tokenRatio: 0.1,
        },
      };
      client = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
        { 'grpc.service_config': JSON.stringify(serviceConfig) }
      );
    });

    after(() => {
      client.close();
    });

    it('Should be able to make a basic request', done => {
      client.echo(
        { value: 'test value', value2: 3 },
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should succeed with few required attempts', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should fail with many required attempts', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '4');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.details, 'Failed on retry 2');
          done();
        }
      );
    });

    it('Should fail with a fatal status code', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', `${grpc.status.NOT_FOUND}`);
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.details, 'Failed on retry 0');
          done();
        }
      );
    });

    it('Should not be able to make more than 5 attempts', done => {
      const serviceConfig = {
        loadBalancingConfig: [],
        methodConfig: [
          {
            name: [
              {
                service: 'EchoService',
              },
            ],
            retryPolicy: {
              maxAttempts: 10,
              initialBackoff: '0.1s',
              maxBackoff: '10s',
              backoffMultiplier: 1.2,
              retryableStatusCodes: [14, 'RESOURCE_EXHAUSTED'],
            },
          },
        ],
      };
      const client2 = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
        { 'grpc.service_config': JSON.stringify(serviceConfig) }
      );
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '6');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client2.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.details, 'Failed on retry 4');
          done();
        }
      );
    });

    it('Should be able to make more than 5 attempts with a channel argument', done => {
      const serviceConfig = {
        loadBalancingConfig: [],
        methodConfig: [
          {
            name: [
              {
                service: 'EchoService',
              },
            ],
            retryPolicy: {
              maxAttempts: 10,
              initialBackoff: '0.1s',
              maxBackoff: '10s',
              backoffMultiplier: 1.2,
              retryableStatusCodes: [14, 'RESOURCE_EXHAUSTED'],
            },
          },
        ],
      };
      const client2 = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
        {
          'grpc.service_config': JSON.stringify(serviceConfig),
          'grpc-node.retry_max_attempts_limit': 8
        }
      );
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '7');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client2.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should not retry on custom error code', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', '300');
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert.strictEqual(error.code, 300);
          assert.strictEqual(error.details, 'Failed on retry 0');
          done();
        }
      );
    });

    it('Should not clone metadata in RetryingCall on the initial attempt', done => {
      const metadata = new grpc.Metadata();
      metadata.set('custom-header', 'custom-value');
      const clonedInstances: grpc.Metadata[] = [];
      grpc.Metadata.prototype.clone = function (this: grpc.Metadata) {
        const cloned = originalClone.call(this);
        clonedInstances.push(cloned);
        return cloned;
      };
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        { deadline: Date.now() + 10000 },
        (error: grpc.ServiceError, response: any) => {
          grpc.Metadata.prototype.clone = originalClone;
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          // Cloned only in ResolvingCall.start and LoadBalancingCall.doPick
          assert.strictEqual(clonedInstances.length, 2);
          // Caller metadata remains unmutated
          assert.deepStrictEqual(metadata.getMap(), {
            'custom-header': 'custom-value',
          });
          // First clone (RetryingCall.initialMetadata / LoadBalancingCall.metadata)
          // must not be mutated by LoadBalancingCall.doPick (e.g. grpc-timeout)
          const retryingCallInitialMetadata = clonedInstances[0];
          assert.strictEqual(
            retryingCallInitialMetadata.get('grpc-timeout').length,
            0
          );
          // Second clone (finalMetadata in LoadBalancingCall.doPick) receives grpc-timeout
          const loadBalancingFinalMetadata = clonedInstances[1];
          assert.strictEqual(
            loadBalancingFinalMetadata.get('grpc-timeout').length,
            1
          );
          done();
        }
      );
    });

    it('Should clone metadata on retry attempts without mutating RetryingCall initialMetadata', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      const callCredentials = grpc.credentials.createFromMetadataGenerator(
        (_options, callback) => {
          const credentialsMetadata = new grpc.Metadata();
          credentialsMetadata.set('authorization', 'Bearer test-token');
          callback(null, credentialsMetadata);
        }
      );
      const clonedInstances: grpc.Metadata[] = [];
      grpc.Metadata.prototype.clone = function (this: grpc.Metadata) {
        const cloned = originalClone.call(this);
        clonedInstances.push(cloned);
        return cloned;
      };
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        { credentials: callCredentials, deadline: Date.now() + 10000 },
        (error: grpc.ServiceError, response: any) => {
          grpc.Metadata.prototype.clone = originalClone;
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          // 1 in ResolvingCall.start + 2 in RetryingCall (attempts 2 & 3) + 3 in LoadBalancingCall.doPick
          assert.strictEqual(clonedInstances.length, 6);
          assert.strictEqual(
            metadata.get('grpc-previous-rpc-attempts').length,
            0
          );
          assert.strictEqual(metadata.get('authorization').length, 0);
          assert.strictEqual(metadata.get('grpc-timeout').length, 0);
          // First clone (RetryingCall.initialMetadata, passed uncloned to LoadBalancingCall on attempt 1)
          // must not be polluted by RetryingCall, LoadBalancingCall, or post-start caller mutations
          const retryingCallInitialMetadata = clonedInstances[0];
          assert.strictEqual(
            retryingCallInitialMetadata.get('grpc-previous-rpc-attempts')
              .length,
            0
          );
          assert.strictEqual(
            retryingCallInitialMetadata.get('authorization').length,
            0
          );
          assert.strictEqual(
            retryingCallInitialMetadata.get('grpc-timeout').length,
            0
          );
          assert.strictEqual(
            retryingCallInitialMetadata.get('mutated-after-start').length,
            0
          );
          done();
        }
      );
      // Mutate caller metadata while the RPC and its retry attempts are in flight
      metadata.set('mutated-after-start', 'true');
      metadata.set('succeed-on-retry-attempt', '99');
    });
  });

  describe('Client with hedging configured', () => {
    let client: InstanceType<grpc.ServiceClientConstructor>;
    before(() => {
      const serviceConfig = {
        loadBalancingConfig: [],
        methodConfig: [
          {
            name: [
              {
                service: 'EchoService',
              },
            ],
            hedgingPolicy: {
              maxAttempts: 3,
              nonFatalStatusCodes: [14, 'RESOURCE_EXHAUSTED'],
            },
          },
        ],
      };
      client = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
        { 'grpc.service_config': JSON.stringify(serviceConfig) }
      );
    });

    after(() => {
      client.close();
    });

    it('Should be able to make a basic request', done => {
      client.echo(
        { value: 'test value', value2: 3 },
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should succeed with few required attempts', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          done();
        }
      );
    });

    it('Should fail with many required attempts', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '4');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert(error.details.startsWith('Failed on retry'));
          done();
        }
      );
    });

    it('Should fail with a fatal status code', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', `${grpc.status.NOT_FOUND}`);
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert(error.details.startsWith('Failed on retry'));
          done();
        }
      );
    });

    it('Should not be able to make more than 5 attempts', done => {
      const serviceConfig = {
        loadBalancingConfig: [],
        methodConfig: [
          {
            name: [
              {
                service: 'EchoService',
              },
            ],
            hedgingPolicy: {
              maxAttempts: 10,
              nonFatalStatusCodes: [14, 'RESOURCE_EXHAUSTED'],
            },
          },
        ],
      };
      const client2 = new EchoService(
        `localhost:${port}`,
        grpc.credentials.createInsecure(),
        { 'grpc.service_config': JSON.stringify(serviceConfig) }
      );
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '6');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      client2.echo(
        { value: 'test value', value2: 3 },
        metadata,
        (error: grpc.ServiceError, response: any) => {
          assert(error);
          assert(error.details.startsWith('Failed on retry'));
          done();
        }
      );
    });

    it('Should clone metadata on hedged attempts without mutating RetryingCall initialMetadata', done => {
      const metadata = new grpc.Metadata();
      metadata.set('succeed-on-retry-attempt', '2');
      metadata.set('respond-with-status', `${grpc.status.RESOURCE_EXHAUSTED}`);
      const callCredentials = grpc.credentials.createFromMetadataGenerator(
        (_options, callback) => {
          const credentialsMetadata = new grpc.Metadata();
          credentialsMetadata.set('authorization', 'Bearer test-token');
          callback(null, credentialsMetadata);
        }
      );
      const clonedInstances: grpc.Metadata[] = [];
      grpc.Metadata.prototype.clone = function (this: grpc.Metadata) {
        const cloned = originalClone.call(this);
        clonedInstances.push(cloned);
        return cloned;
      };
      client.echo(
        { value: 'test value', value2: 3 },
        metadata,
        { credentials: callCredentials, deadline: Date.now() + 10000 },
        (error: grpc.ServiceError, response: any) => {
          grpc.Metadata.prototype.clone = originalClone;
          assert.ifError(error);
          assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
          // 1 in ResolvingCall.start + 2 in RetryingCall (hedged attempts 2 & 3) + 3 in LoadBalancingCall.doPick
          assert.strictEqual(clonedInstances.length, 6);
          const retryingCallInitialMetadata = clonedInstances[0];
          assert.strictEqual(
            retryingCallInitialMetadata.get('grpc-previous-rpc-attempts')
              .length,
            0
          );
          assert.strictEqual(
            retryingCallInitialMetadata.get('authorization').length,
            0
          );
          assert.strictEqual(
            retryingCallInitialMetadata.get('grpc-timeout').length,
            0
          );
          done();
        }
      );
    });
  });
});
