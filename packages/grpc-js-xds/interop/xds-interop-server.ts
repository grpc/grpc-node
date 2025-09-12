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
import * as os from 'os';
import { HealthImplementation } from 'grpc-health-check';
import { Empty__Output, Empty } from './generated/grpc/testing/Empty';
import { SimpleRequest__Output } from './generated/grpc/testing/SimpleRequest';
import { SimpleResponse } from './generated/grpc/testing/SimpleResponse';
import { ReflectionService } from '@grpc/reflection';

grpc_xds.register();

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

const TEST_SERVICE_NAME = '/grpc.testing.TestService/';

function testInfoInterceptor(methodDescriptor: grpc.ServerMethodDefinition<any, any>, call: grpc.ServerInterceptingCallInterface) {
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
            return;
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

function adminServiceInterceptor(methodDescriptor: grpc.ServerMethodDefinition<any, any>, call: grpc.ServerInterceptingCallInterface): grpc.ServerInterceptingCall {
  const listener: grpc.ServerListener = {
    onReceiveMessage: (message, next) => {
      console.log(`Received request to method ${methodDescriptor.path}: ${JSON.stringify(message)}`);
      next(message);
    }
  }
  const responder: grpc.Responder = {
    start: next => {
      next(listener);
    },
    sendMessage: (message, next) => {
      console.log(`Responded to request to method ${methodDescriptor.path}: ${JSON.stringify(message)}`);
      next(message);
    }
  };
  return new grpc.ServerInterceptingCall(call, responder);
}

function unifiedInterceptor(methodDescriptor: grpc.ServerMethodDefinition<any, any>, call: grpc.ServerInterceptingCallInterface): grpc.ServerInterceptingCall {
  if (methodDescriptor.path.startsWith(TEST_SERVICE_NAME)) {
    return testInfoInterceptor(methodDescriptor, call);
  } else {
    return adminServiceInterceptor(methodDescriptor, call);
  }
}

const testServiceHandler = {
  EmptyCall: (call: grpc.ServerUnaryCall<Empty__Output, Empty>, callback: grpc.sendUnaryData<Empty>) => {
    callback(null, {});
  },
  UnaryCall: (call: grpc.ServerUnaryCall<SimpleRequest__Output, SimpleResponse>, callback: grpc.sendUnaryData<SimpleResponse>) => {
    callback(null, {
      hostname: HOSTNAME,
      payload: {
        body: Buffer.from('0'.repeat(call.request.response_size))
      }
    });
  }
};

function serverBindPromise(server: grpc.Server, port: string, credentials: grpc.ServerCredentials): Promise<number> {
  return new Promise((resolve, reject) => {
    server.bindAsync(port, credentials, (error, port) => {
      if (error) {
        reject(error);
      } else {
        resolve(port);
      }
    })
  })
}

function getIPv4Address(): string | null {
  for (const [name, addressList] of Object.entries(os.networkInterfaces())) {
    if (name === 'lo' || !addressList) {
      continue;
    }
    for (const address of addressList) {
      if (address.family === 'IPv4') {
        return address.address;
      }
    }
  }
  return null;
}

function getIPv6Addresses(): string[] {
  const ipv6Addresses: string[] = [];
  for (const [name, addressList] of Object.entries(os.networkInterfaces())) {
    if (name === 'lo' || !addressList) {
      continue;
    }
    for (const address of addressList) {
      if (address.family === 'IPv6') {
        ipv6Addresses.push(address.address);
      }
    }
  }
  return ipv6Addresses;
}

interface ConfiguredMetrics {
  qps?: number;
  applicationUtilization?: number;
  eps?: number;
}

function createInBandMetricsInterceptor(metrics: ConfiguredMetrics) {
  return function inBandMetricsInterceptor(methodDescriptor: grpc.ServerMethodDefinition<any, any>, call: grpc.ServerInterceptingCallInterface): grpc.ServerInterceptingCall {
    const metricsRecorder = call.getMetricsRecorder()
    if (metrics.qps) {
      metricsRecorder.recordQpsMetric(metrics.qps);
    }
    if (metrics.applicationUtilization) {
      metricsRecorder.recordApplicationUtilizationMetric(metrics.applicationUtilization);
    }
    if (metrics.eps) {
      metricsRecorder.recordEpsMetric(metrics.eps);
    }
    return new grpc.ServerInterceptingCall(call);
  }
}

async function main() {
  const argv = yargs
    .string(['port', 'maintenance_port', 'address_type', 'secure_mode', 'metrics_mode'])
    .number(['qps', 'application_utilization', 'eps'])
    .demandOption(['port'])
    .default('address_type', 'IPV4_IPV6')
    .default('secure_mode', 'false')
    .default('metrics_mode', 'NONE')
    .parse()
    console.log('Starting xDS interop server. Args: ', argv);
  const healthImpl = new HealthImplementation({'': 'NOT_SERVING'});
  const xdsUpdateHealthServiceImpl = {
    SetServing(call: grpc.ServerUnaryCall<Empty, Empty__Output>, callback: grpc.sendUnaryData<Empty__Output>) {
      healthImpl.setStatus('', 'SERVING');
      callback(null, {});
    },
    SetNotServing(call: grpc.ServerUnaryCall<Empty, Empty__Output>, callback: grpc.sendUnaryData<Empty__Output>) {
      healthImpl.setStatus('', 'NOT_SERVING');
      callback(null, {});
    }
  }
  const reflection = new ReflectionService(packageDefinition, {
    services: ['grpc.testing.TestService']
  });
  let metricInterceptor: grpc.ServerInterceptor | null = null;
  const metricsMode = argv.metrics_mode.toUpperCase();
  let metricRecorder: grpc.ServerMetricRecorder | null = null;
  if (metricsMode === 'IN_BAND') {
    metricInterceptor = createInBandMetricsInterceptor({
      qps: argv.qps,
      applicationUtilization: argv.application_utilization,
      eps: argv.eps
    });
  } else if (metricsMode === 'OUT_OF_BAND') {
    metricRecorder = new grpc.ServerMetricRecorder();
    if (argv.qps) {
      metricRecorder.setQpsMetric(argv.qps);
    }
    if (argv.application_utilization) {
      metricRecorder.setApplicationUtilizationMetric(argv.application_utilization);
    }
    if (argv.eps) {
      metricRecorder.setEpsMetric(argv.eps);
    }
  }
  const addressType = argv.address_type.toUpperCase();
  const secureMode = argv.secure_mode.toLowerCase() == 'true';
  if (secureMode) {
    if (addressType !== 'IPV4_IPV6') {
      throw new Error('Secure mode only supports IPV4_IPV6 address type');
    }
    const maintenanceServer = new grpc.Server({interceptors: [adminServiceInterceptor]});
    maintenanceServer.addService(loadedProto.grpc.testing.XdsUpdateHealthService.service, xdsUpdateHealthServiceImpl)
    healthImpl.addToServer(maintenanceServer);
    reflection.addToServer(maintenanceServer);
    grpc.addAdminServicesToServer(maintenanceServer);

    const interceptorList = [testInfoInterceptor];
    if (metricInterceptor) {
      interceptorList.push(metricInterceptor);
    }
    const server = new grpc_xds.XdsServer({interceptors: interceptorList});
    server.addService(loadedProto.grpc.testing.TestService.service, testServiceHandler);
    if (metricRecorder) {
      metricRecorder.addToServer(server);
    }
    const xdsCreds = new grpc_xds.XdsServerCredentials(grpc.ServerCredentials.createInsecure());
    await Promise.all([
      serverBindPromise(maintenanceServer, `[::]:${argv.maintenance_port}`, grpc.ServerCredentials.createInsecure()),
      serverBindPromise(server, `0.0.0.0:${argv.port}`, xdsCreds)
    ]);
  } else {
    const interceptorList = [unifiedInterceptor];
    if (metricInterceptor) {
      interceptorList.push(metricInterceptor);
    }
    const server = new grpc.Server({interceptors: [unifiedInterceptor]});
    server.addService(loadedProto.grpc.testing.XdsUpdateHealthService.service, xdsUpdateHealthServiceImpl);
    healthImpl.addToServer(server);
    reflection.addToServer(server);
    grpc.addAdminServicesToServer(server);
    if (metricRecorder) {
      metricRecorder.addToServer(server);
    }
    server.addService(loadedProto.grpc.testing.TestService.service, testServiceHandler);
    const creds = grpc.ServerCredentials.createInsecure();
    switch (addressType) {
      case 'IPV4_IPV6':
        await serverBindPromise(server, `[::]:${argv.port}`, creds);
        break;
      case 'IPV4':
        await serverBindPromise(server, `127.0.0.1:${argv.port}`, creds);
        const address = getIPv4Address();
        if (address) {
          await serverBindPromise(server, `${address}:${argv.port}`, creds);
        }
        break;
      case 'IPV6':
        await serverBindPromise(server, `[::1]:${argv.port}`, creds);
        for (const address of getIPv6Addresses()) {
          try {
            await serverBindPromise(server, `[${address}]:${argv.port}`, creds);
          } catch (e) {
            console.log(`Binding ${address} failed with error ${(e as Error).message}`);
          }
        }
        break;
      default:
        throw new Error(`Unknown address type: ${argv.address_type}`);
    }
  }
  healthImpl.setStatus('', 'SERVING');
}

if (require.main === module) {
  main();
}
