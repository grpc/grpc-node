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

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
};
const path = require('path');
const fs = require('fs');
const assert = require('assert');
const _ = require('lodash');
const anyGrpc = require('../any_grpc');
const clientGrpc = anyGrpc.client;
const serverGrpc = anyGrpc.server;
const protoLoader = require('../../packages/proto-loader', options);
const testServiceDef = protoLoader.loadSync(__dirname + '/../proto/test_service.proto');
const TestService = serverGrpc.loadPackageDefinition(testServiceDef).TestService.service;
const TestServiceClient = clientGrpc.loadPackageDefinition(testServiceDef).TestService;

const keyPath = path.join(__dirname, '../data/server1.key');
const pemPath = path.join(__dirname, '../data/server1.pem');
const caPath = path.join(__dirname, '../data/ca.pem');
const keyData = fs.readFileSync(keyPath);
const pemData = fs.readFileSync(pemPath);
const caData = fs.readFileSync(caPath);

const clientCreds = clientGrpc.credentials.createSsl(caData);
const dummyCallCreds = clientGrpc.credentials.createFromMetadataGenerator((options, callback) => {
  const metadata = new clientGrpc.Metadata();
  metadata.add('authorization', 'test');
  callback(null, metadata);
});
const combinedClientCreds = clientGrpc.credentials.combineChannelCredentials(clientCreds, dummyCallCreds);
const serverCreds = serverGrpc.ServerCredentials.createSsl(null, [{private_key: keyData, cert_chain: pemData}]);

const hostOverride = 'foo.test.google.fr';
const clientOptions = {
  'grpc.ssl_target_name_override': hostOverride,
  'grpc.default_authority': hostOverride
}

describe('Sending metadata', function() {
  let server;
  let port;
  before(function() {
    server = new serverGrpc.Server();
    server.addService(TestService, {
      unary: function(call, cb) {
        cb(null, {});
      },
      clientStream: function(stream, cb){
        stream.on('data', function(data) {});
        stream.on('end', function() {
          cb(null, {});
        });
      },
      serverStream: function(stream) {
        stream.end();
      },
      bidiStream: function(stream) {
        stream.on('data', function(data) {});
        stream.on('end', function() {
          stream.end();
        });
      }
    });
    port = server.bind('localhost:0', serverCreds);
    server.start();
    client = new TestServiceClient(`localhost:${port}`, combinedClientCreds, clientOptions);
  });
  after(function() {
    server.forceShutdown();
  });
  it('Should be able to send the same metadata on two calls with call creds', function(done) {
    const metadata = new clientGrpc.Metadata();
    client.unary({}, metadata, (err, data) => {
      assert.ifError(err);
      client.unary({}, metadata, (err, data) => {
        assert.ifError(err);
        done();
      });
    });
  });
});