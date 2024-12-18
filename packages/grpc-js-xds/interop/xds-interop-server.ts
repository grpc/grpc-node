/*
 * Copyright 2020 gRPC authors.
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

import * as grpc from '@grpc/grpc-js';

import * as grpc_xds from '../src';

import { ProtoGrpcType } from './generated/test';

import * as protoLoader from '@grpc/proto-loader';
import * as yargs from 'yargs';
import { TestServiceHandlers } from './generated/grpc/testing/TestService';
import * as os from 'os';
import { HealthImplementation } from 'grpc-health-check';

const packageDefinition = protoLoader.loadSync('grpc/testing/test.proto', {
  keepCase: true,
  defaults: true,
  oneofs: true,
  json: true,
  longs: String,
  enums: String,
  includeDirs: [__dirname + '/../../proto']
});

const loadedProto = grpc.loadPackageDefinition(packageDefinition) as unknown as ProtoGrpcType;

function setAsyncTimeout(delayMs: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, delayMs);
  });
}

const HOSTNAME = os.hostname();

function testInfoInterceptor(methodDescriptor: grpc.MethodDefinition<any, any>, call: grpc.ServerInterceptingCall) {
  const listener: grpc.ServerListener = {
    onReceiveMetadata: async (metadata, next) => {
      let attemptNum = 0;
      const attemptNumHeader = metadata.get('grpc-previous-rpc-attempts');
      if (attemptNumHeader.length > 0) {
        attemptNum = Number(attemptNumHeader[0]);
        if (Number.isNaN(attemptNum)) {
          call.sendStatus({
            code: grpc.status.INVALID_ARGUMENT,
            details: 'Invalid format for grpc-previous-rpc-attempts header: ' + attemptNumHeader[0]
          });
          return;
        }
      }
      const rpcBehavior = metadata.get('rpc-behavior').filter(v => typeof v === 'string').join(',');
      for (const value of rpcBehavior.split(',')) {
        let behaviorEntry: string;
        if (value.startsWith('hostname=')) {
          const splitValue = value.split(' ');
          if (splitValue.length > 1) {
            if (splitValue[0].substring('hostname='.length) !== HOSTNAME) {
              continue;
            }
            behaviorEntry = splitValue[1];
          } else {
            call.sendStatus({
              code: grpc.status.INVALID_ARGUMENT,
              details: 'Invalid format for rpc-behavior header: ' + value
            });
            return;
          }
        } else {
          behaviorEntry = value;
        }
        if (behaviorEntry.startsWith('sleep-')) {
          const delaySec = Number(behaviorEntry.substring('sleep-'.length));
          if (Number.isNaN(delaySec)) {
            call.sendStatus({
              code: grpc.status.INVALID_ARGUMENT,
              details: 'Invalid format for rpc-behavior header: ' + value
            });
            return;
          }
          await setAsyncTimeout(delaySec * 1000);
        }
        if (behaviorEntry === 'keep-open') {
          return;
        }
        if (behaviorEntry.startsWith('error-code-')) {
          const errorCode = Number(behaviorEntry.substring('error-code-'.length));
          if (Number.isNaN(errorCode)) {
            call.sendStatus({
              code: grpc.status.INVALID_ARGUMENT,
              details: 'Invalid format for rpc-behavior header: ' + value
            });
            return;
          }
          call.sendStatus({
            code: errorCode,
            details: 'RPC failed as directed by rpc-behavior header value ' + value
          });
          return;
        }
        if (behaviorEntry.startsWith('succeed-on-retry-attempt-')) {
          const targetAttempt = Number(behaviorEntry.substring('succeed-on-retry-attempt-'.length));
          if (Number.isNaN(targetAttempt)) {
            call.sendStatus({
              code: grpc.status.INVALID_ARGUMENT,
              details: 'Invalid format for rpc-behavior header: ' + value
            });
            return;
          }
          if (attemptNum === targetAttempt) {
            next(metadata);
          }
        }
      }
      next(metadata);
    }
  };
  const responder: grpc.Responder = {
    start: next => {
      next(listener);
    },
    sendMetadata: (metadata, next) => {
      metadata.add('hostname', HOSTNAME);
      next(metadata);
    }
  }
  return new grpc.ServerInterceptingCall(call, responder);
};

const testServiceHandler: Partial<TestServiceHandlers> = {
  EmptyCall: (call, callback) => {
    callback(null, {});
  },
  UnaryCall: (call, callback) => {
    callback(null, {
      hostname: HOSTNAME,
      payload: {
        body: Buffer.from('0'.repeat(call.request.response_size))
      }
    });
  }
};



function main() {
  const argv = yargs
    .string(['port', 'maintenance_port', 'address_type'])
    .boolean(['secure_mode'])
    .demandOption(['port', 'maintenance_port'])
    .default('address_type', 'IPV4_IPV6')
    .default('secure_mode', false)
    .parse()
    console.log('Starting xDS interop server. Args: ', argv);
  const healthImpl = new HealthImplementation({'': 'SERVING'});

}
