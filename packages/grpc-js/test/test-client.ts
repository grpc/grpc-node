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

// Allow `any` data type for testing runtime type checking.
// tslint:disable no-any
import * as assert from 'assert';
import * as path from 'path';

import * as grpc from '../src';
import { Server, ServerCredentials } from '../src';
import { ServiceClient, ServiceClientConstructor } from '../src/make-client';
import { sendUnaryData, ServerUnaryCall } from '../src/server-call';

import { loadProtoFile } from './common';
import { ConnectivityState } from '../src/channel';

const clientInsecureCreds = grpc.credentials.createInsecure();
const serverInsecureCreds = ServerCredentials.createInsecure();

describe('Client', () => {
  let server: Server;
  let client: ServiceClient;

  before(done => {
    const protoFile = path.join(__dirname, 'fixtures', 'echo_service.proto');
    const echoService = loadProtoFile(protoFile)
      .EchoService as ServiceClientConstructor;

    server = new Server();

    server.bindAsync(
      'localhost:0',
      serverInsecureCreds,
      (err, port) => {
        assert.ifError(err);
        client = new echoService(
          `localhost:${port}`,
          clientInsecureCreds
        );
        server.start();
        done();
      }
    );
  });

  after(done => {
    client.close();
    server.tryShutdown(done);
  });

  it('should call the waitForReady callback only once when channel connectivity state is READY', done => {
    const deadline = Date.now() + 100;
    let calledTimes = 0;
    client.waitForReady(deadline, err => {
      assert.ifError(err);
      assert.equal(
        client.getChannel().getConnectivityState(true),
        ConnectivityState.READY
      );
      calledTimes += 1;
    });
    setTimeout(() => {
      assert.equal(calledTimes, 1);
      done();
    }, deadline - Date.now());
  });
});
