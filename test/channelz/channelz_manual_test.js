/*
 *
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

'use strict';

require('../fixtures/js_js');
const interopClient = require('../interop/interop_client');
const interopServer = require('../interop/interop_server');
const serverGrpc = require('../any_grpc').server;

const hostOverride = 'foo.test.google.fr';

const testCases = [
  'empty_unary',
  'large_unary',
  'client_streaming',
  'server_streaming',
  'ping_pong',
  'empty_stream',
  'cancel_after_begin',
  'cancel_after_first_response',
  'timeout_on_sleeping_server',
  'custom_metadata',
  'status_code_and_message',
  'special_status_message',
  'unimplemented_service',
  'unimplemented_method'
];

function getRandomTest() {
  return testCases[(Math.random() * testCases.length) | 0];
}

let testCompleteCount = 0;

interopServer.getServer('0', true, (error, result) => {
  if (error) {
    throw error;
  }
  const channelzServer = new serverGrpc.Server();
  channelzServer.bindAsync('localhost:0', serverGrpc.ServerCredentials.createInsecure(), (error, port) => {
    if (error) {
      throw error;
    }
    console.log(`Serving channelz at port ${port}`);
    serverGrpc.addAdminServicesToServer(channelzServer);
    channelzServer.start();
    result.server.start();
    setInterval(() => {
      interopClient.runTest(`localhost:${result.port}`, hostOverride, getRandomTest(), true, true, () => {
        testCompleteCount += 1;
        if (testCompleteCount % 100 === 0) {
          console.log(`Completed ${testCompleteCount} tests`);
        }
      });
    }, 100);
  });
})