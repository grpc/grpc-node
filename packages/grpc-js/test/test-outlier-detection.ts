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

function multiDone(done: Mocha.Done, target: number) {
  let count = 0;
  return (error?: any) => {
    if (error) {
      done(error);
    }
    count++;
    if (count >= target) {
      done();
    }
  }
}

const defaultOutlierDetectionServiceConfig = {
  methodConfig: [],
  loadBalancingConfig: [
    {
      outlier_detection: {
        success_rate_ejection: {},
        failure_percentage_ejection: {},
        child_policy: [{round_robin: {}}]
      }
    }
  ]
};

const defaultOutlierDetectionServiceConfigString = JSON.stringify(defaultOutlierDetectionServiceConfig);

const goodService = {
  echo: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    callback(null, call.request)
  }
};

const badService = {
  echo: (call: grpc.ServerUnaryCall<any, any>, callback: grpc.sendUnaryData<any>) => {
    callback({
      code: grpc.status.PERMISSION_DENIED,
      details: 'Permission denied'
    })
  }
}

const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
const EchoService = loadProtoFile(protoFile)
  .EchoService as grpc.ServiceClientConstructor;

describe('Outlier detection', () => {
  const GOOD_PORTS = 4;
  let goodServer: grpc.Server;
  let badServer: grpc.Server;
  const goodPorts: number[] = [];
  let badPort: number;
  before(done => {
    const eachDone = multiDone(() => {
      goodServer.start();
      badServer.start();
      done();
    }, GOOD_PORTS + 1);
    goodServer = new grpc.Server();
    goodServer.addService(EchoService.service, goodService);
    for (let i = 0; i < GOOD_PORTS; i++) {
      goodServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
        if (error) {
          eachDone(error);
          return;
        }
        goodPorts.push(port);
        eachDone();
      });
    }
    badServer = new grpc.Server();
    badServer.addService(EchoService.service, badService);
    badServer.bindAsync('localhost:0', grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        eachDone(error);
        return;
      }
      badPort = port;
      eachDone();
    });
  });
  after(() => {
    goodServer.forceShutdown();
    badServer.forceShutdown();
  });

  it('Should allow normal operation with one server', done => {
    const client = new EchoService(`localhost:${goodPorts[0]}`, grpc.credentials.createInsecure(), {'grpc.service_config': defaultOutlierDetectionServiceConfigString});
    client.echo(
      { value: 'test value', value2: 3 },
      (error: grpc.ServiceError, response: any) => {
        assert.ifError(error);
        assert.deepStrictEqual(response, { value: 'test value', value2: 3 });
        done();
      }
    );
  });
});