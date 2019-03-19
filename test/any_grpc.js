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

// TODO: Instead of attempting to expose both implementations of gRPC in
// a single object, the tests should be re-written in a way that makes it clear
// that two separate implementations are being tested against one another.

const _ = require('lodash');

function getImplementation(globalField) {
  const impl = global[globalField];

  if (impl === 'js') {
    return require(`../packages/grpc-${impl}`);
  } else if (impl === 'native') {
    return require(`../packages/grpc-${impl}-core`);
  }

  throw new Error([
    `Invalid value for global.${globalField}: ${global.globalField}.`,
    'If running from the command line, please --require a fixture first.'
  ].join(' '));
}

const clientImpl = getImplementation('_client_implementation');
const serverImpl = getImplementation('_server_implementation');

module.exports = {
  client: clientImpl,
  server: serverImpl
};
