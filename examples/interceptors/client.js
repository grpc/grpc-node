/*
 *
 * Copyright 2024 gRPC authors.
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

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const parseArgs = require('minimist');

const PROTO_PATH = __dirname + '/../protos/echo.proto';

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const echoProto = grpc.loadPackageDefinition(packageDefinition).grpc.examples.echo;

function authInterceptor(options, nextCall) {
  const requester = (new grpc.RequesterBuilder())
    .withStart((metadata, listener, next) => {
      metadata.set('authorization', 'some-secret-token');
      next(metadata, listener);
    }).build();
  return new grpc.InterceptingCall(nextCall(options), requester);
}

// logger is to mock a sophisticated logging system. To simplify the example, we just print out the content.
function logger(format, ...args) {
  console.log(`LOG (client):\t${format}\n`, ...args);
}

function loggingInterceptor(options, nextCall) {
  const listener = (new grpc.ListenerBuilder())
    .withOnReceiveMessage((message, next) => {
      logger(`Receive a message ${JSON.stringify(message)} at ${(new Date()).toISOString()}`);
      next(message);
    }).build();
  const requester = (new grpc.RequesterBuilder())
    .withSendMessage((message, next) => {
      logger(`Send a message ${JSON.stringify(message)} at ${(new Date()).toISOString()}`);
      next(message);
    }).build();
  return new grpc.InterceptingCall(nextCall(options), requester);
}

function callUnaryEcho(client, message) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    client.unaryEcho({message: message}, {deadline}, (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`UnaryEcho: ${JSON.stringify(value)}`);
      resolve();
    });
  });
}

function callBidiStreamingEcho(client) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    const call = client.bidirectionalStreamingEcho({deadline});
    call.on('data', value => {
      console.log(`BidiStreamingEcho: ${JSON.stringify(value)}`);
    });
    call.on('status', status => {
      if (status.code === grpc.status.OK) {
        resolve();
      } else {
        reject(status);
      }
    });
    call.on('error', () => {
      // Ignore error event
    });
    for (let i = 0; i < 5; i++) {
      call.write({message: `Request ${i + 1}`});
    }
    call.end();
  });
}

async function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50051'}
  });
  const client = new echoProto.Echo(argv.target, grpc.credentials.createInsecure(), {interceptors: [authInterceptor, loggingInterceptor]});
  await callUnaryEcho(client, 'hello world');
  await callBidiStreamingEcho(client);
}

main();
