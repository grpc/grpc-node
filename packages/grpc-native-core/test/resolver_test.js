/*
 *
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

'use strict';

var assert = require('assert');
var _ = require('lodash');

var grpc = require('..');

const insecureCreds = grpc.credentials.createInsecure();

describe('Name resolver', function() {
  let server;
  let port;
  before(function(done) {
    const insecureServerCreds = grpc.ServerCredentials.createInsecure();
    server = new grpc.Server();
    server.bindAsync('localhost:0', insecureServerCreds, (error, portVal) => {
      port = portVal;
      done(error);
    });
  });
  after(function() {
    server.forceShutdown();
  });
  // This test also seems to have problems with the native resolver on Windows
  it.skip('Should resolve a target to IPv4 addresses', function(done) {
    const client = new grpc.Client(`loopback4.unittest.grpc.io:${port}`, insecureCreds);
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    client.waitForReady(deadline, (error) => {
      assert.ifError(error);
      done();
    });
  });
  /* This test doesn't work with the native resolver on Windows on our test
   * machines because they don't have IPv6 addresses, so Windows omits IPv6
   * addresses from getaddrinfo results. */
  it.skip('Should resolve a target to IPv6 addresses', function(done) {
    const client = new grpc.Client(`loopback6.unittest.grpc.io:${port}`, insecureCreds);
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    client.waitForReady(deadline, (error) => {
      assert.ifError(error);
      done();
    });
  });
  it.skip('Should resolve a target to IPv4 and IPv6 addresses', function(done) {
    const client = new grpc.Client(`loopback46.unittest.grpc.io:${port}`, insecureCreds);
    let deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    client.waitForReady(deadline, (error) => {
      assert.ifError(error);
      done();
    });
  });
});