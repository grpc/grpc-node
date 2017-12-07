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

var assert = require('assert');
var fs = require('fs');
var path = require('path');

var anyGrpc = require('../any_grpc');
// TODO(kjin): Google credentials are currently not implemented in the
// JS client.
var maybeSkip = anyGrpc.skipIfJsClient;

/**
 * This is used for testing functions with multiple asynchronous calls that
 * can happen in different orders. This should be passed the number of async
 * function invocations that can occur last, and each of those should call this
 * function's return value
 * @param {function()} done The function that should be called when a test is
 *     complete.
 * @param {number} count The number of calls to the resulting function if the
 *     test passes.
 * @return {function()} The function that should be called at the end of each
 *     sequence of asynchronous functions.
 */
function multiDone(done, count) {
  return function() {
    count -= 1;
    if (count <= 0) {
      done();
    }
  };
}

var fakeSuccessfulGoogleCredentials = {
  getRequestMetadata: function(service_url, callback) {
    setTimeout(function() {
      callback(null, {Authorization: 'success'});
    }, 0);
  }
};

var fakeFailingGoogleCredentials = {
  getRequestMetadata: function(service_url, callback) {
    setTimeout(function() {
      // Google credentials currently adds string error codes to auth errors
      var error = new Error('Authentication failure');
      error.code = 'ENOENT';
      callback(error);
    }, 0);
  }
};

var key_data, pem_data, ca_data;

before(function() {
  var key_path = path.join(__dirname, '../data/server1.key');
  var pem_path = path.join(__dirname, '../data/server1.pem');
  var ca_path = path.join(__dirname, '../data/ca.pem');
  key_data = fs.readFileSync(key_path);
  pem_data = fs.readFileSync(pem_path);
  ca_data = fs.readFileSync(ca_path);
});

describe('client credentials', function() {
  var grpc = anyGrpc.requireAsClient('grpc');
  var Client;
  var server;
  var port;
  var client_ssl_creds;
  var client_options = {};
  before(function() {
    anyGrpc.runAsServer((grpc) => {
      var proto = grpc.load(__dirname + '/test_service.proto');
      server = new grpc.Server();
      server.addService(proto.TestService.service, {
        unary: function(call, cb) {
          call.sendMetadata(call.metadata);
          cb(null, {});
        },
        clientStream: function(stream, cb){
          stream.on('data', function(data) {});
          stream.on('end', function() {
            stream.sendMetadata(stream.metadata);
            cb(null, {});
          });
        },
        serverStream: function(stream) {
          stream.sendMetadata(stream.metadata);
          stream.end();
        },
        bidiStream: function(stream) {
          stream.on('data', function(data) {});
          stream.on('end', function() {
            stream.sendMetadata(stream.metadata);
            stream.end();
          });
        }
      });
      var creds = grpc.ServerCredentials.createSsl(null,
          [{private_key: key_data, cert_chain: pem_data}]);
      port = server.bind('localhost:0', creds);
      server.start();
    });

    var proto = grpc.load(__dirname + '/test_service.proto');
    Client = proto.TestService;
    client_ssl_creds = grpc.credentials.createSsl(ca_data);
    var host_override = 'foo.test.google.fr';
    client_options['grpc.ssl_target_name_override'] = host_override;
    client_options['grpc.default_authority'] = host_override;
  });
  after(function() {
    server.forceShutdown();
  });
  it('Should accept SSL creds for a client', function(done) {
    var client = new Client('localhost:' + port, client_ssl_creds,
                            client_options);
    client.unary({}, function(err, data) {
      assert.ifError(err);
      done();
    });
  });
  it('Should update metadata with SSL creds', function(done) {
    var metadataUpdater = function(service_url, callback) {
      var metadata = new grpc.Metadata();
      metadata.set('plugin_key', 'plugin_value');
      callback(null, metadata);
    };
    var creds = grpc.credentials.createFromMetadataGenerator(metadataUpdater);
    var combined_creds = grpc.credentials.combineChannelCredentials(
        client_ssl_creds, creds);
    var client = new Client('localhost:' + port, combined_creds,
                            client_options);
    var call = client.unary({}, function(err, data) {
      assert.ifError(err);
    });
    call.on('metadata', function(metadata) {
      assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
      done();
    });
  });
  it('Should update metadata for two simultaneous calls', function(done) {
    done = multiDone(done, 2);
    var metadataUpdater = function(service_url, callback) {
      var metadata = new grpc.Metadata();
      metadata.set('plugin_key', 'plugin_value');
      callback(null, metadata);
    };
    var creds = grpc.credentials.createFromMetadataGenerator(metadataUpdater);
    var combined_creds = grpc.credentials.combineChannelCredentials(
        client_ssl_creds, creds);
    var client = new Client('localhost:' + port, combined_creds,
                            client_options);
    var call = client.unary({}, function(err, data) {
      assert.ifError(err);
    });
    call.on('metadata', function(metadata) {
      assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
      done();
    });
    var call2 = client.unary({}, function(err, data) {
      assert.ifError(err);
    });
    call2.on('metadata', function(metadata) {
      assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
      done();
    });
  });
  it('should propagate errors that the updater emits', function(done) {
    var metadataUpdater = function(service_url, callback) {
      var error = new Error('Authentication error');
      error.code = grpc.status.UNAUTHENTICATED;
      callback(error);
    };
    var creds = grpc.credentials.createFromMetadataGenerator(metadataUpdater);
    var combined_creds = grpc.credentials.combineChannelCredentials(
        client_ssl_creds, creds);
    var client = new Client('localhost:' + port, combined_creds,
                            client_options);
    client.unary({}, function(err, data) {
      assert(err);
      assert.strictEqual(err.message,
                         'Getting metadata from plugin failed with error: ' +
                         'Authentication error');
      assert.strictEqual(err.code, grpc.status.UNAUTHENTICATED);
      done();
    });
  });
  maybeSkip(it)('should successfully wrap a Google credential', function(done) {
    var creds = grpc.credentials.createFromGoogleCredential(
        fakeSuccessfulGoogleCredentials);
    var combined_creds = grpc.credentials.combineChannelCredentials(
        client_ssl_creds, creds);
    var client = new Client('localhost:' + port, combined_creds,
                            client_options);
    var call = client.unary({}, function(err, data) {
      assert.ifError(err);
    });
    call.on('metadata', function(metadata) {
      assert.deepEqual(metadata.get('authorization'), ['success']);
      done();
    });
  });
  it('Should not add metadata with just SSL credentials', function(done) {
    // Tests idempotency of credentials composition
    var metadataUpdater = function(service_url, callback) {
      var metadata = new grpc.Metadata();
      metadata.set('plugin_key', 'plugin_value');
      callback(null, metadata);
    };
    var creds = grpc.credentials.createFromMetadataGenerator(metadataUpdater);
    grpc.credentials.combineChannelCredentials(client_ssl_creds, creds);
    var client = new Client('localhost:' + port, client_ssl_creds,
                            client_options);
    var call = client.unary({}, function(err, data) {
      assert.ifError(err);
    });
    call.on('metadata', function(metadata) {
      assert.deepEqual(metadata.get('plugin_key'), []);
      done();
    });
  });
  maybeSkip(it)('should get an error from a Google credential', function(done) {
    var creds = grpc.credentials.createFromGoogleCredential(
        fakeFailingGoogleCredentials);
    var combined_creds = grpc.credentials.combineChannelCredentials(
        client_ssl_creds, creds);
    var client = new Client('localhost:' + port, combined_creds,
                            client_options);
    client.unary({}, function(err, data) {
      assert(err);
      assert.strictEqual(err.message,
                         'Getting metadata from plugin failed with error: ' +
                         'Authentication failure');
      done();
    });
  });
  describe('Per-rpc creds', function() {
    var client;
    var updater_creds;
    before(function() {
      client = new Client('localhost:' + port, client_ssl_creds,
                          client_options);
      var metadataUpdater = function(service_url, callback) {
        var metadata = new grpc.Metadata();
        metadata.set('plugin_key', 'plugin_value');
        callback(null, metadata);
      };
      updater_creds = grpc.credentials.createFromMetadataGenerator(
          metadataUpdater);
    });
    it('Should update metadata on a unary call', function(done) {
      var call = client.unary({}, {credentials: updater_creds},
                              function(err, data) {
                                assert.ifError(err);
                              });
      call.on('metadata', function(metadata) {
        assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
        done();
      });
    });
    it('should update metadata on a client streaming call', function(done) {
      var call = client.clientStream({credentials: updater_creds},
                                     function(err, data) {
                                       assert.ifError(err);
                                     });
      call.on('metadata', function(metadata) {
        assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
        done();
      });
      call.end();
    });
    it('should update metadata on a server streaming call', function(done) {
      var call = client.serverStream({}, {credentials: updater_creds});
      call.on('data', function() {});
      call.on('metadata', function(metadata) {
        assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
        done();
      });
    });
    it('should update metadata on a bidi streaming call', function(done) {
      var call = client.bidiStream({credentials: updater_creds});
      call.on('data', function() {});
      call.on('metadata', function(metadata) {
        assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
        done();
      });
      call.end();
    });
    it('should be able to use multiple plugin credentials', function(done) {
      var altMetadataUpdater = function(service_url, callback) {
        var metadata = new grpc.Metadata();
        metadata.set('other_plugin_key', 'other_plugin_value');
        callback(null, metadata);
      };
      var alt_updater_creds = grpc.credentials.createFromMetadataGenerator(
          altMetadataUpdater);
      var combined_updater = grpc.credentials.combineCallCredentials(
          updater_creds, alt_updater_creds);
      var call = client.unary({}, {credentials: combined_updater},
                              function(err, data) {
                                assert.ifError(err);
                              });
      call.on('metadata', function(metadata) {
        assert.deepEqual(metadata.get('plugin_key'), ['plugin_value']);
        assert.deepEqual(metadata.get('other_plugin_key'),
                         ['other_plugin_value']);
        done();
      });
    });
  });
});
