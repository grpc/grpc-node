/*
 *
 * Copyright 2018 gRPC authors.
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

const assert = require('assert');
const interopServer = require('../../interop/interop_server.js');

interopServer.getServer(0, true, (err, serverObj) => {
  assert.ifError(err);
  serverObj.server.start();
  process.send({port: serverObj.port});
  // The only message from the driver should be to stop the server
  process.on('message', (message) => {
    serverObj.server.forceShutdown();
  });
});
