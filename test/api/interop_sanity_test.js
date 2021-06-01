/*
 *
 * Copyright 2015 gRPC authors.
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

var childProcess = require('child_process');
const anyGrpc = require('../any_grpc');

var port;

var name_override = 'foo.test.google.fr';

var serverProcess;

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

var childExecArgv = [];

describe(`${anyGrpc.clientName} client -> ${anyGrpc.serverName} server`, function() {
  describe('Interop tests', function() {
    // with the default timeout the test times out under aarch64 emulator
    this.timeout(10000);
    before(function(done) {
      for (let arg of process.argv) {
        if (arg.startsWith('--require=')) {
    childExecArgv.push('--require');
    childExecArgv.push(arg.substring('--require='.length));
        }
      }
      serverProcess = childProcess.fork(`${__dirname}/interop_helper/server.js`, {
        execArgv: childExecArgv
      });
      serverProcess.on('message', (message) => {
        port = message.port;
        done();
      });
      serverProcess.on('exit', (code, signal) => {
        if (code !== 0) {
    if (code !== null) {
      throw new Error(`Server exited with error code ${code}`);
    } else {
      throw new Error(`Server exited with signal ${signal}`);
    }
        }
      });
    });
    after(function() {
      serverProcess.send({});
    });
    for (let testName of testCases) {
      it(`should pass ${testName}`, function(done) {
        /* We need to run a client process per test to most closely match
        * how the main interop test suite works */
        let clientProcess = childProcess.fork(`${__dirname}/../interop/interop_client`, [
    '--server_host=localhost',
    `--server_port=${port}`,
    `--server_host_override=${name_override}`,
    `--test_case=${testName}`,
    '--use_tls=true',
    '--use_test_ca=true'
        ], {
    execArgv: childExecArgv
        });
        clientProcess.on('exit', (code, signal) => {
    if (code === 0) {
      done();
    } else {
      if (code !== null) {
        done(new Error(`Client exited with error code ${code}`));
      } else {
        done(new Error(`Client exited with signal ${signal}`));
      }
    }
        });
      });
    }
  });
});