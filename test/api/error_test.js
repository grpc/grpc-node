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
const assert = require('assert');
const _ = require('lodash');
const anyGrpc = require('../any_grpc');
const clientGrpc = anyGrpc.client;
const serverGrpc = anyGrpc.server;
const protoLoader = require('../../packages/proto-loader', options);
const testServiceDef = protoLoader.loadSync(__dirname + '/../proto/test_service.proto');
const TestServiceClient = clientGrpc.loadPackageDefinition(testServiceDef).TestService;
const clientInsecureCreds = clientGrpc.credentials.createInsecure();
const serverInsecureCreds = serverGrpc.ServerCredentials.createInsecure();

describe('Client malformed response handling', function() {
    var server;
    var client;
    var badArg = Buffer.from([0xFF]);
    before(function() {
      var malformed_test_service = {
        unary: {
          path: '/TestService/Unary',
          requestStream: false,
          responseStream: false,
          requestDeserialize: _.identity,
          responseSerialize: _.identity
        },
        clientStream: {
          path: '/TestService/ClientStream',
          requestStream: true,
          responseStream: false,
          requestDeserialize: _.identity,
          responseSerialize: _.identity
        },
        serverStream: {
          path: '/TestService/ServerStream',
          requestStream: false,
          responseStream: true,
          requestDeserialize: _.identity,
          responseSerialize: _.identity
        },
        bidiStream: {
          path: '/TestService/BidiStream',
          requestStream: true,
          responseStream: true,
          requestDeserialize: _.identity,
          responseSerialize: _.identity
        }
      };
      server = new serverGrpc.Server();
      server.addService(malformed_test_service, {
        unary: function(call, cb) {
          cb(null, badArg);
        },
        clientStream: function(stream, cb) {
          stream.on('data', function() {/* Ignore requests */});
          stream.on('end', function() {
            cb(null, badArg);
          });
        },
        serverStream: function(stream) {
          stream.write(badArg);
          stream.end();
        },
        bidiStream: function(stream) {
          stream.on('data', function() {
            // Ignore requests
            stream.write(badArg);
          });
          stream.on('end', function() {
            stream.end();
          });
        }
      });
      var port = server.bind('localhost:0', serverInsecureCreds);
      client = new TestServiceClient('localhost:' + port, clientInsecureCreds);
      server.start();
    });
    after(function() {
      server.forceShutdown();
    });
    it('should get an INTERNAL status with a unary call', function(done) {
      client.unary({}, function(err, data) {
        assert(err);
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
    });
    it('should get an INTERNAL status with a client stream call', function(done) {
      var call = client.clientStream(function(err, data) {
        assert(err);
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
      call.write({});
      call.end();
    });
    it('should get an INTERNAL status with a server stream call', function(done) {
      var call = client.serverStream({});
      call.on('data', function(){});
      call.on('error', function(err) {
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
    });
    it('should get an INTERNAL status with a bidi stream call', function(done) {
      var call = client.bidiStream();
      call.on('data', function(){});
      call.on('error', function(err) {
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
      call.write({});
      call.end();
    });
  });
  describe('Server serialization failure handling', function() {
    function serializeFail(obj) {
      throw new Error('Serialization failed');
    }
    var client;
    var server;
    before(function() {
      var malformed_test_service = {
        unary: {
          path: '/TestService/Unary',
          requestStream: false,
          responseStream: false,
          requestDeserialize: _.identity,
          responseSerialize: serializeFail
        },
        clientStream: {
          path: '/TestService/ClientStream',
          requestStream: true,
          responseStream: false,
          requestDeserialize: _.identity,
          responseSerialize: serializeFail
        },
        serverStream: {
          path: '/TestService/ServerStream',
          requestStream: false,
          responseStream: true,
          requestDeserialize: _.identity,
          responseSerialize: serializeFail
        },
        bidiStream: {
          path: '/TestService/BidiStream',
          requestStream: true,
          responseStream: true,
          requestDeserialize: _.identity,
          responseSerialize: serializeFail
        }
      };
      server = new serverGrpc.Server();
      server.addService(malformed_test_service, {
        unary: function(call, cb) {
          cb(null, {});
        },
        clientStream: function(stream, cb) {
          stream.on('data', function() {/* Ignore requests */});
          stream.on('end', function() {
            cb(null, {});
          });
        },
        serverStream: function(stream) {
          stream.write({});
          stream.end();
        },
        bidiStream: function(stream) {
          stream.on('data', function() {
            // Ignore requests
            stream.write({});
          });
          stream.on('end', function() {
            stream.end();
          });
        }
      });
      var port = server.bind('localhost:0', serverInsecureCreds);
      client = new TestServiceClient('localhost:' + port, clientInsecureCreds);
      server.start();
    });
    after(function() {
      server.forceShutdown();
    });
    it('should get an INTERNAL status with a unary call', function(done) {
      client.unary({}, function(err, data) {
        assert(err);
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
    });
    it('should get an INTERNAL status with a client stream call', function(done) {
      var call = client.clientStream(function(err, data) {
        assert(err);
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
      call.write({});
      call.end();
    });
    it('should get an INTERNAL status with a server stream call', function(done) {
      var call = client.serverStream({});
      call.on('data', function(){});
      call.on('error', function(err) {
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
    });
    it('should get an INTERNAL status with a bidi stream call', function(done) {
      var call = client.bidiStream();
      call.on('data', function(){});
      call.on('error', function(err) {
        assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
        done();
      });
      call.write({});
      call.end();
    });
  });
  describe('Other conditions', function() {
    var Client;
    var client;
    var server;
    var port;
    before(function() {
      server = new serverGrpc.Server();
      var trailer_metadata = new serverGrpc.Metadata();
      trailer_metadata.add('trailer-present', 'yes');
      server.addService(TestServiceClient.service, {
        unary: function(call, cb) {
          var req = call.request;
          if (req.error) {
            var message = 'Requested error';
            if (req.message) {
              message = req.message;
            }
            cb({code: serverGrpc.status.UNKNOWN,
                details: message}, null, trailer_metadata);
          } else {
            cb(null, {count: 1}, trailer_metadata);
          }
        },
        clientStream: function(stream, cb){
          var count = 0;
          var errored;
          stream.on('data', function(data) {
            if (data.error) {
              var message = 'Requested error';
              if (data.message) {
                message = data.message;
              }
              errored = true;
              cb(new Error(message), null, trailer_metadata);
            } else {
              count += 1;
            }
          });
          stream.on('end', function() {
            if (!errored) {
              cb(null, {count: count}, trailer_metadata);
            }
          });
        },
        serverStream: function(stream) {
          var req = stream.request;
          if (req.error) {
            var message = 'Requested error';
            if (req.message) {
              message = req.message;
            }
            var err = {code: serverGrpc.status.UNKNOWN,
                       details: message};
            err.metadata = trailer_metadata;
            stream.emit('error', err);
          } else {
            for (var i = 0; i < 5; i++) {
              stream.write({count: i});
            }
            stream.end(trailer_metadata);
          }
        },
        bidiStream: function(stream) {
          var count = 0;
          stream.on('data', function(data) {
            if (data.error) {
              var message = 'Requested error';
              if (data.message) {
                message = data.message;
              }
              var err = new Error(message);
              err.metadata = trailer_metadata.clone();
              err.metadata.add('count', '' + count);
              stream.emit('error', err);
            } else {
              stream.write({count: count});
              count += 1;
            }
          });
          stream.on('end', function() {
            stream.end(trailer_metadata);
          });
        }
      });
      port = server.bind('localhost:0', serverInsecureCreds);
      client = new TestServiceClient('localhost:' + port, clientInsecureCreds);
      server.start();
    });
    after(function() {
      server.forceShutdown();
    });
    describe('Server recieving bad input', function() {
      var misbehavingClient;
      var badArg = Buffer.from([0xFF]);
      before(function() {
        var test_service_attrs = {
          unary: {
            path: '/TestService/Unary',
            requestStream: false,
            responseStream: false,
            requestSerialize: _.identity,
            responseDeserialize: _.identity
          },
          clientStream: {
            path: '/TestService/ClientStream',
            requestStream: true,
            responseStream: false,
            requestSerialize: _.identity,
            responseDeserialize: _.identity
          },
          serverStream: {
            path: '/TestService/ServerStream',
            requestStream: false,
            responseStream: true,
            requestSerialize: _.identity,
            responseDeserialize: _.identity
          },
          bidiStream: {
            path: '/TestService/BidiStream',
            requestStream: true,
            responseStream: true,
            requestSerialize: _.identity,
            responseDeserialize: _.identity
          }
        };
        var Client = clientGrpc.makeGenericClientConstructor(test_service_attrs,
                                                             'TestService');
        misbehavingClient = new Client('localhost:' + port, clientInsecureCreds);
      });
      it('should respond correctly to a unary call', function(done) {
        misbehavingClient.unary(badArg, function(err, data) {
          assert(err);
          assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
          done();
        });
      });
      it('should respond correctly to a client stream', function(done) {
        var call = misbehavingClient.clientStream(function(err, data) {
          assert(err);
          assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
          done();
        });
        call.write(badArg);
        // TODO(mlumish): Remove call.end()
        call.end();
      });
      it('should respond correctly to a server stream', function(done) {
        var call = misbehavingClient.serverStream(badArg);
        call.on('data', function(data) {
          assert.fail(data, null, 'Unexpected data', '===');
        });
        call.on('error', function(err) {
          assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
          done();
        });
      });
      it('should respond correctly to a bidi stream', function(done) {
        var call = misbehavingClient.bidiStream();
        call.on('data', function(data) {
          assert.fail(data, null, 'Unexpected data', '===');
        });
        call.on('error', function(err) {
          assert.strictEqual(err.code, clientGrpc.status.INTERNAL);
          done();
        });
        call.write(badArg);
        // TODO(mlumish): Remove call.end()
        call.end();
      });
    });
    describe('Trailing metadata', function() {
      it('should be present when a unary call succeeds', function(done) {
        var call = client.unary({error: false}, function(err, data) {
          assert.ifError(err);
        });
        call.on('status', function(status) {
          assert.deepEqual(status.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a unary call fails', function(done) {
        var call = client.unary({error: true}, function(err, data) {
          assert(err);
        });
        call.on('status', function(status) {
          assert.deepEqual(status.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a client stream call succeeds', function(done) {
        var call = client.clientStream(function(err, data) {
          assert.ifError(err);
        });
        call.write({error: false});
        call.write({error: false});
        call.end();
        call.on('status', function(status) {
          assert.deepEqual(status.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a client stream call fails', function(done) {
        var call = client.clientStream(function(err, data) {
          assert(err);
        });
        call.write({error: false});
        call.write({error: true});
        call.end();
        call.on('status', function(status) {
          assert.deepEqual(status.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a server stream call succeeds', function(done) {
        var call = client.serverStream({error: false});
        call.on('data', function(){});
        call.on('status', function(status) {
          assert.strictEqual(status.code, clientGrpc.status.OK);
          assert.deepEqual(status.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a server stream call fails', function(done) {
        var call = client.serverStream({error: true});
        call.on('data', function(){});
        call.on('error', function(error) {
          assert.deepEqual(error.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a bidi stream succeeds', function(done) {
        var call = client.bidiStream();
        call.write({error: false});
        call.write({error: false});
        call.end();
        call.on('data', function(){});
        call.on('status', function(status) {
          assert.strictEqual(status.code, clientGrpc.status.OK);
          assert.deepEqual(status.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
      it('should be present when a bidi stream fails', function(done) {
        var call = client.bidiStream();
        call.write({error: false});
        call.write({error: true});
        call.end();
        call.on('data', function(){});
        call.on('error', function(error) {
          assert.deepEqual(error.metadata.get('trailer-present'), ['yes']);
          done();
        });
      });
    });
    describe('Error object should contain the status', function() {
      it('for a unary call', function(done) {
        client.unary({error: true}, function(err, data) {
          assert(err);
          assert.strictEqual(err.code, clientGrpc.status.UNKNOWN);
          assert.strictEqual(err.details, 'Requested error');
          done();
        });
      });
      it('for a client stream call', function(done) {
        var call = client.clientStream(function(err, data) {
          assert(err);
          assert.strictEqual(err.code, clientGrpc.status.UNKNOWN);
          assert.strictEqual(err.details, 'Requested error');
          done();
        });
        call.write({error: false});
        call.write({error: true});
        call.end();
      });
      it('for a server stream call', function(done) {
        var call = client.serverStream({error: true});
        call.on('data', function(){});
        call.on('error', function(error) {
          assert.strictEqual(error.code, clientGrpc.status.UNKNOWN);
          assert.strictEqual(error.details, 'Requested error');
          done();
        });
      });
      it('for a bidi stream call', function(done) {
        var call = client.bidiStream();
        call.write({error: false});
        call.write({error: true});
        call.end();
        call.on('data', function(){});
        call.on('error', function(error) {
          assert.strictEqual(error.code, clientGrpc.status.UNKNOWN);
          assert.strictEqual(error.details, 'Requested error');
          done();
        });
      });
      it('for a UTF-8 error message', function(done) {
        client.unary({error: true, message: '測試字符串'}, function(err, data) {
          assert(err);
          assert.strictEqual(err.code, clientGrpc.status.UNKNOWN);
          assert.strictEqual(err.details, '測試字符串');
          done();
        });
      });
    });
});
