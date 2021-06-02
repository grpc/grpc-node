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

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const interopServer = require('../interop/interop_server.js');
const anyGrpc = require('../any_grpc');
const grpc = anyGrpc.client;
var protoLoader = require('../../packages/proto-loader');

const protoPackage = protoLoader.loadSync(
  'src/proto/grpc/testing/test.proto',
  {keepCase: true,
   defaults: true,
   enums: String,
   includeDirs: [__dirname + '/../proto/']});
const testProto = grpc.loadPackageDefinition(protoPackage).grpc.testing;

function multiDone(done, count) {
  return function() {
    count -= 1;
    if (count <= 0) {
      done();
    }
  };
}

function echoMetadataGenerator(options, callback) {
  const metadata = new grpc.Metadata();
  metadata.set('x-grpc-test-echo-initial', 'test_initial_metadata_value');
  callback(null, metadata);
}

const credentials = grpc.credentials.createFromMetadataGenerator(echoMetadataGenerator);

describe(`${anyGrpc.clientName} client -> ${anyGrpc.serverName} server`, function() {
  describe('Interop-adjacent tests', function() {
    let server;
    let client;
    let port;
    before(function(done) {
      /* To make testing max message size enforcement easier, the we explicitly
       * remove the limit on the size of messages the server can receive, and
       * we expect that the size of messages it can send is unlimited by
       * default. On the other side, we explicitly limit the size of messages
       * the client can send to 4 MB, and we expect that the size of messages
       * it can receive is limited to 4 MB by default */
      interopServer.getServer(0, true, (err, serverObj) => {
        if (err) {
          done(err);
        } else {
          server = serverObj.server;
          port = serverObj.port;
          server.start();
          const ca_path = path.join(__dirname, '../data/ca.pem');
          const ca_data = fs.readFileSync(ca_path);
          const creds = grpc.credentials.createSsl(ca_data);
          const options = {
            'grpc.ssl_target_name_override': 'foo.test.google.fr',
            'grpc.default_authority': 'foo.test.google.fr',
            'grpc.max_send_message_length': 4*1024*1024,
            'grpc.max_metadata_size': 4*1024*1024
          };
          client = new testProto.TestService(`localhost:${port}`, creds, options);
          done();
        }
      }, {
        'grpc.max_receive_message_length': -1,
        'grpc.max_metadata_size': 4*1024*1024
      });
    });
    after(function() {
      server.forceShutdown();
    });
    it('Should be able to start many concurrent calls', function(done) {
      const callCount = 100;
      done = multiDone(done, callCount);
      for (let i = 0; i < callCount; i++) {
        client.unaryCall({}, (error, result) => {
          assert.ifError(error);
          done();
        });
      }
    });
    it('Should echo metadata from call credentials', function(done) {
      done = multiDone(done, 2);
      const call = client.unaryCall({}, {credentials}, (error, result) => {
        assert.ifError(error);
        done();
      });
      call.on('metadata', (metadata) => {
        assert.deepEqual(metadata.get('x-grpc-test-echo-initial'),
                        ['test_initial_metadata_value']);
        done();
      });
    });
    it('Should be able to send the same metadata on two calls with call creds', function(done) {
      done = multiDone(done, 5);
      const metadata = new grpc.Metadata();
      metadata.set('x-grpc-test-echo-trailing-bin', Buffer.from('ababab', 'hex'));
      const call1 = client.unaryCall({}, metadata, {credentials}, (error, result) => {
        assert.ifError(error);
        const call2 = client.unaryCall({}, metadata, {credentials}, (error, result) => {
          assert.ifError(error);
          done();
        });
        call2.on('metadata', (metadata) => {
          assert.deepEqual(metadata.get('x-grpc-test-echo-initial'),
                          ['test_initial_metadata_value']);
          done();
        });
        call2.on('status', function(status) {
          var echo_trailer = status.metadata.get('x-grpc-test-echo-trailing-bin');
          assert(echo_trailer.length === 1);
          assert.strictEqual(echo_trailer[0].toString('hex'), 'ababab');
          done();
        });
      });
      call1.on('metadata', (metadata) => {
        assert.deepEqual(metadata.get('x-grpc-test-echo-initial'),
                        ['test_initial_metadata_value']);
        done();
      });
      call1.on('status', function(status) {
        var echo_trailer = status.metadata.get('x-grpc-test-echo-trailing-bin');
        assert(echo_trailer.length === 1);
        assert.strictEqual(echo_trailer[0].toString('hex'), 'ababab');
        done();
      });
    });
    it('should receive all messages in a long stream', function(done) {
      // the test is slow under aarch64 emulator
      this.timeout(80000);
      var arg = {
        response_type: 'COMPRESSABLE',
        response_parameters: [
        ]
      };
      for (let i = 0; i < 100000; i++) {
        arg.response_parameters.push({size: 0});
      }
      var call = client.streamingOutputCall(arg);
      let responseCount = 0;
      call.on('data', (value) => {
        responseCount++;
      });
      call.on('status', (status) => {
        assert.strictEqual(status.code, grpc.status.OK);
        assert.strictEqual(responseCount, arg.response_parameters.length);
        done();
      });
      call.on('error', (error) => {
        assert.ifError(error);
      });
    });
    /* The test against the JS server does not work because of
     * https://github.com/nodejs/node/issues/35218. The test against the native
     * server fails because of an unidentified timeout issue. */
    it.skip('should be able to send very large headers and trailers', function(done) {
      done = multiDone(done, 3);
      const header = 'X'.repeat(64 * 1024);
      const trailer = Buffer.from('Y'.repeat(64 * 1024));
      const metadata = new grpc.Metadata();
      metadata.set('x-grpc-test-echo-initial', header);
      metadata.set('x-grpc-test-echo-trailing-bin', trailer);
      const call = client.unaryCall({}, metadata, (error, result) => {
        assert.ifError(error);
        done();
      });
      call.on('metadata', (metadata) => {
        assert.deepStrictEqual(metadata.get('x-grpc-test-echo-initial'),
                               [header]);
        done();
      });
      call.on('status', (status) => {
        var echo_trailer = status.metadata.get('x-grpc-test-echo-trailing-bin');
        assert(echo_trailer.length === 1);
        assert.strictEqual(echo_trailer[0].toString('ascii'), 'Y'.repeat(64 * 1024));
        done();
      });
    });
    describe('max message size', function() {
      // with the default timeout the test times out under aarch64 emulator
      this.timeout(6000);
      // A size that is larger than the default limit
      const largeMessageSize = 8 * 1024 * 1024;
      const largeMessage = Buffer.alloc(largeMessageSize);
      it('should get an error when sending a large message', function(done) {
        done = multiDone(done, 2);
        const unaryMessage = {payload: {body: largeMessage}};
        client.unaryCall(unaryMessage, (error, result) => {
          assert(error);
          assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
          done();
        });
        const stream = client.fullDuplexCall();
        stream.write({payload: {body: largeMessage}});
        stream.end();
        stream.on('data', () => {});
        stream.on('status', (status) => {
          assert.strictEqual(status.code, grpc.status.RESOURCE_EXHAUSTED);
          done();
        });
        stream.on('error', (error) => {
        });
      });
      it('should get an error when receiving a large message', function(done) {
        done = multiDone(done, 2);
        client.unaryCall({response_size: largeMessageSize}, (error, result) => {
          assert(error);
          assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
          done();
        });
        const stream = client.fullDuplexCall();
        stream.write({response_parameters: [{size: largeMessageSize}]});
        stream.end();
        stream.on('data', () => {});
        stream.on('status', (status) => {
          assert.strictEqual(status.code, grpc.status.RESOURCE_EXHAUSTED);
          done();
        });
        stream.on('error', (error) => {
        });
      });
      describe('with a client with no message size limits', function() {
        // with the default timeout the test times out under aarch64 emulator
        this.timeout(6000);
        let unrestrictedClient;
        before(function() {
          const ca_path = path.join(__dirname, '../data/ca.pem');
          const ca_data = fs.readFileSync(ca_path);
          const creds = grpc.credentials.createSsl(ca_data);
          const options = {
            'grpc.ssl_target_name_override': 'foo.test.google.fr',
            'grpc.default_authority': 'foo.test.google.fr',
            'grpc.max_send_message_length': -1,
            'grpc.max_receive_message_length': -1
          };
          unrestrictedClient = new testProto.TestService(`localhost:${port}`, creds, options);
        });
        it('should not get an error when sending or receiving a large message', function(done) {
          done = multiDone(done, 2);
          const unaryRequestMessage = {
            response_size: largeMessageSize,
            payload: {
              body: largeMessage
            }
          };
          unrestrictedClient.unaryCall(unaryRequestMessage, (error, result) => {
            assert.ifError(error);
            assert.strictEqual(result.payload.body.length, largeMessageSize);
            done();
          });
          const streamingRequestMessage = {
            response_parameters: [{size: largeMessageSize}],
            payload: {body: largeMessage}
          };
          const stream = unrestrictedClient.fullDuplexCall();
          stream.write(streamingRequestMessage);
          stream.end();
          stream.on('data', (result) => {
            assert.strictEqual(result.payload.body.length, largeMessageSize);
          });
          stream.on('status', () => {
            done();
          });
          stream.on('error', (error) => {
            assert.ifError(error);
          });
        });
      });
      describe('with a server with message size limits and a client without limits', function() {
        // with the default timeout the test times out under aarch64 emulator
        this.timeout(6000);
        let restrictedServer;
        let restrictedServerClient;
        let restrictedServerClient2;
        let restrictedServerClient3;
        let restrictedServerClient4;
        before(function(done) {
          interopServer.getServer(0, true, (err, serverObj) => {
            if (err) {
              done(err);
            } else {
              restrictedServer = serverObj.server;
              restrictedServer.start();
              const ca_path = path.join(__dirname, '../data/ca.pem');
              const ca_data = fs.readFileSync(ca_path);
              const creds = grpc.credentials.createSsl(ca_data);
              const options = {
                'grpc.ssl_target_name_override': 'foo.test.google.fr',
                'grpc.default_authority': 'foo.test.google.fr',
                'grpc.max_receive_message_length': -1
              };
              restrictedServerClient = new testProto.TestService(`localhost:${serverObj.port}`, creds, options);
              restrictedServerClient2 = new testProto.TestService(`localhost:${serverObj.port}`, creds, {...options, unique: 1});
              restrictedServerClient3 = new testProto.TestService(`localhost:${serverObj.port}`, creds, {...options, unique: 2});
              restrictedServerClient4 = new testProto.TestService(`localhost:${serverObj.port}`, creds, {...options, unique: 3});
              done();
            }
          }, {'grpc.max_send_message_length': 4 * 1024 * 1024});
        });
        after(function() {
          restrictedServer.forceShutdown();
        });
        it('should get an error when sending a large message', function(done) {
          restrictedServerClient.unaryCall({payload: {body: largeMessage}}, (error, result) => {
            assert(error);
            assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
            const stream = restrictedServerClient2.fullDuplexCall();
            stream.write({payload: {body: largeMessage}});
            stream.end();
            stream.on('data', () => {});
            stream.on('status', (status) => {
              assert.strictEqual(status.code, grpc.status.RESOURCE_EXHAUSTED);
              done();
            });
            stream.on('error', (error) => {
            });
          });
        });
        it('should get an error when requesting a large message', function(done) {
          restrictedServerClient3.unaryCall({response_size: largeMessageSize}, (error, result) => {
            assert(error);
            assert.strictEqual(error.code, grpc.status.RESOURCE_EXHAUSTED);
            const stream = restrictedServerClient4.fullDuplexCall();
            stream.write({response_parameters: [{size: largeMessageSize}]});
            stream.end();
            stream.on('data', () => {});
            stream.on('status', (status) => {
              assert.strictEqual(status.code, grpc.status.RESOURCE_EXHAUSTED);
              done();
            });
            stream.on('error', (error) => {
            });
          });
        });
      });
    });
  });
});