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
var grpc = require('../src/grpc_extension');
var constants = require('../src/constants');

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

var insecureCreds = grpc.ChannelCredentials.createInsecure();

describe('end-to-end', function() {
  var server;
  var channel;
  before(function() {
    server = new grpc.Server();
    var port_num = server.addHttp2Port('0.0.0.0:0',
                                       grpc.ServerCredentials.createInsecure());
    server.start();
    channel = new grpc.Channel('localhost:' + port_num, insecureCreds);
  });
  after(function() {
    server.forceShutdown();
  });
  it('should start and end a request without error', function(complete) {
    var done = multiDone(complete, 2);
    var status_text = 'xyz';
    var call = channel.createCall(
                             'dummy_method',
                             Infinity);
    var client_batch = {};
    client_batch[grpc.opType.SEND_INITIAL_METADATA] = {metadata: {}};
    client_batch[grpc.opType.SEND_CLOSE_FROM_CLIENT] = true;
    client_batch[grpc.opType.RECV_INITIAL_METADATA] = true;
    client_batch[grpc.opType.RECV_STATUS_ON_CLIENT] = true;
    call.startBatch(client_batch, function(err, response) {
      assert.ifError(err);
      assert.deepEqual(response, {
        send_metadata: true,
        client_close: true,
        metadata: {
          metadata: {},
          flags: 0
        },
        status: {
          code: constants.status.OK,
          details: status_text,
          metadata: {
            metadata: {},
            flags: 0
          }
        }
      });
      done();
    });

    server.requestCall(function(err, call_details) {
      var new_call = call_details.new_call;
      assert.notEqual(new_call, null);
      var server_call = new_call.call;
      assert.notEqual(server_call, null);
      var server_batch = {};
      server_batch[grpc.opType.SEND_INITIAL_METADATA] = {metadata: {}};
      server_batch[grpc.opType.SEND_STATUS_FROM_SERVER] = {
        metadata: {metadata: {}},
        code: constants.status.OK,
        details: status_text
      };
      server_batch[grpc.opType.RECV_CLOSE_ON_SERVER] = true;
      server_call.startBatch(server_batch, function(err, response) {
        assert.ifError(err);
        assert.deepEqual(response, {
          send_metadata: true,
          send_status: true,
          cancelled: false
        });
       done();
      });
    });
  });
  it('should successfully send and receive metadata', function(complete) {
    var done = multiDone(complete, 2);
    var status_text = 'xyz';
    var call = channel.createCall(
                             'dummy_method',
                             Infinity);
    var client_batch = {};
    client_batch[grpc.opType.SEND_INITIAL_METADATA] = {
      metadata: {
        client_key: ['client_value']
      }
    };
    client_batch[grpc.opType.SEND_CLOSE_FROM_CLIENT] = true;
    client_batch[grpc.opType.RECV_INITIAL_METADATA] = true;
    client_batch[grpc.opType.RECV_STATUS_ON_CLIENT] = true;
    call.startBatch(client_batch, function(err, response) {
      assert.ifError(err);
      assert.deepEqual(response,{
        send_metadata: true,
        client_close: true,
        metadata: {metadata: {
          server_key: ['server_value']}, 
          flags: 0
        },
        status: {code: constants.status.OK,
                 details: status_text,
                 metadata: {metadata: {}, flags: 0}}
      });
      done();
    });

    server.requestCall(function(err, call_details) {
      var new_call = call_details.new_call;
      assert.notEqual(new_call, null);
      assert.strictEqual(new_call.metadata.metadata.client_key[0],
                         'client_value');
      var server_call = new_call.call;
      assert.notEqual(server_call, null);
      var server_batch = {};
      server_batch[grpc.opType.SEND_INITIAL_METADATA] = {
        metadata: {
          server_key: ['server_value']
        }
      };
      server_batch[grpc.opType.SEND_STATUS_FROM_SERVER] = {
        metadata: {metadata: {}},
        code: constants.status.OK,
        details: status_text
      };
      server_batch[grpc.opType.RECV_CLOSE_ON_SERVER] = true;
      server_call.startBatch(server_batch, function(err, response) {
        assert.ifError(err);
        assert.deepEqual(response, {
          send_metadata: true,
          send_status: true,
          cancelled: false
        });
       done();
      });
    });
  });
  it('should send and receive data without error', function(complete) {
    var req_text = 'client_request';
    var reply_text = 'server_response';
    var done = multiDone(complete, 2);
    var status_text = 'success';
    var call = channel.createCall(
                             'dummy_method',
                             Infinity);
    var client_batch = {};
    client_batch[grpc.opType.SEND_INITIAL_METADATA] = {metadata: {}};
    client_batch[grpc.opType.SEND_MESSAGE] = Buffer.from(req_text);
    client_batch[grpc.opType.SEND_CLOSE_FROM_CLIENT] = true;
    client_batch[grpc.opType.RECV_INITIAL_METADATA] = true;
    client_batch[grpc.opType.RECV_MESSAGE] = true;
    client_batch[grpc.opType.RECV_STATUS_ON_CLIENT] = true;
    call.startBatch(client_batch, function(err, response) {
      assert.ifError(err);
      assert(response.send_metadata);
      assert(response.client_close);
      assert.deepEqual(response.metadata, {metadata: {}, flags: 0});
      assert(response.send_message);
      assert.strictEqual(response.read.toString(), reply_text);
      assert.deepEqual(response.status, {code: constants.status.OK,
                                         details: status_text,
                                         metadata: {metadata: {}, flags: 0}});
      done();
    });

    server.requestCall(function(err, call_details) {
      var new_call = call_details.new_call;
      assert.notEqual(new_call, null);
      var server_call = new_call.call;
      assert.notEqual(server_call, null);
      var server_batch = {};
      server_batch[grpc.opType.SEND_INITIAL_METADATA] = {metadata: {}};
      server_batch[grpc.opType.RECV_MESSAGE] = true;
      server_call.startBatch(server_batch, function(err, response) {
        assert.ifError(err);
        assert(response.send_metadata);
        assert.strictEqual(response.read.toString(), req_text);
        var response_batch = {};
        response_batch[grpc.opType.SEND_MESSAGE] = Buffer.from(reply_text);
        response_batch[grpc.opType.SEND_STATUS_FROM_SERVER] = {
          metadata: {metadata: {}},
          code: constants.status.OK,
          details: status_text
        };
        response_batch[grpc.opType.RECV_CLOSE_ON_SERVER] = true;
        server_call.startBatch(response_batch, function(err, response) {
          assert(response.send_status);
          assert(!response.cancelled);
          done();
        });
      });
    });
  });
  it('should send multiple messages', function(complete) {
    var done = multiDone(complete, 2);
    var requests = ['req1', 'req2'];
    var status_text = 'xyz';
    var call = channel.createCall(
                             'dummy_method',
                             Infinity);
    var client_batch = {};
    client_batch[grpc.opType.SEND_INITIAL_METADATA] = {metadata: {}};
    client_batch[grpc.opType.SEND_MESSAGE] = Buffer.from(requests[0]);
    client_batch[grpc.opType.RECV_INITIAL_METADATA] = true;
    call.startBatch(client_batch, function(err, response) {
      assert.ifError(err);
      assert.deepEqual(response, {
        send_metadata: true,
        send_message: true,
        metadata: {metadata: {}, flags: 0}
      });
      var req2_batch = {};
      req2_batch[grpc.opType.SEND_MESSAGE] = Buffer.from(requests[1]);
      req2_batch[grpc.opType.SEND_CLOSE_FROM_CLIENT] = true;
      req2_batch[grpc.opType.RECV_STATUS_ON_CLIENT] = true;
      call.startBatch(req2_batch, function(err, resp) {
        assert.ifError(err);
        assert.deepEqual(resp, {
          send_message: true,
          client_close: true,
          status: {
            code: constants.status.OK,
            details: status_text,
            metadata: {metadata: {}, flags: 0}
          }
        });
        done();
      });
    });

    server.requestCall(function(err, call_details) {
      var new_call = call_details.new_call;
      assert.notEqual(new_call, null);
      var server_call = new_call.call;
      assert.notEqual(server_call, null);
      var server_batch = {};
      server_batch[grpc.opType.SEND_INITIAL_METADATA] = {metadata: {}};
      server_batch[grpc.opType.RECV_MESSAGE] = true;
      server_call.startBatch(server_batch, function(err, response) {
        assert.ifError(err);
        assert(response.send_metadata);
        assert.strictEqual(response.read.toString(), requests[0]);
        var snd_batch = {};
        snd_batch[grpc.opType.RECV_MESSAGE] = true;
        server_call.startBatch(snd_batch, function(err, response) {
          assert.ifError(err);
          assert.strictEqual(response.read.toString(), requests[1]);
          var end_batch = {};
          end_batch[grpc.opType.RECV_CLOSE_ON_SERVER] = true;
          end_batch[grpc.opType.SEND_STATUS_FROM_SERVER] = {
            metadata: {metadata: {}},
            code: constants.status.OK,
            details: status_text
          };
          server_call.startBatch(end_batch, function(err, response) {
            assert.ifError(err);
            assert(response.send_status);
            assert(!response.cancelled);
            done();
          });
        });
      });
    });
  });
});
