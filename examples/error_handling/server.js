/*
 *
 * Copyright 2023 gRPC authors.
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

var PROTO_PATH = __dirname + '/../protos/helloworld.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  if (call.request.name === '') {
    callback({code: grpc.status.INVALID_ARGUMENT, details: 'request missing required field: name'});
  }
  callback(null, {message: 'Hello ' + call.request.name});
}

const REPLY_COUNT = 5;

function sayHelloStreamReply(call) {
  if (call.request.name === '') {
    call.emit('error', {code: grpc.status.INVALID_ARGUMENT, details: 'request missing required field: name'});
  } else {
    for (let i = 0; i < REPLY_COUNT; i++) {
      call.write({message: 'Hello ' + call.request.name});
    }
    call.end();
  }
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello, sayHelloStreamReply: sayHelloStreamReply});
  server.bindAsync('0.0.0.0:50052', grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
}

main();
