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

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const parseArgs = require('minimist');
const os = require('os');

const PROTO_PATH = __dirname + '/../protos/helloworld.proto';

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function unaryCall(client, requestId, name, expectedCode) {
  console.log(`[${requestId}] Calling SayHello with name:"${name}"`);
  return new Promise((resolve, reject) => {
    client.sayHello({name: name}, (error, value) => {
      if (error) {
        if (error.code === expectedCode) {
          console.log(`[${requestId}] Received error ${error.message}`);
        } else {
          console.log(`[${requestId}] Received unexpected error ${error.message}`);
        }
      }
      if (value) {
        console.log(`[${requestId}] Received response ${value.message}`);
      }
      resolve();
    });
  });
}

function streamingCall(client, requestId, name, expectedCode) {
  console.log(`[${requestId}] Calling SayHelloStreamReply with name:"${name}"`);
  return new Promise((resolve, reject) => {
    const call = client.sayHelloStreamReply({name: name});
    call.on('data', value => {
      console.log(`[${requestId}] Received response ${value.message}`);
    });
    call.on('status', status => {
      console.log(`[${requestId}] Received status with code=${grpc.status[status.code]} details=${status.details}`);
      resolve();
    });
    call.on('error', error => {
      if (error.code === expectedCode) {
        console.log(`[${requestId}] Received expected error ${error.message}`);
      } else {
        console.log(`[${requestId}] Received unexpected error ${error.message}`);
      }
    });
  });
}

async function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50052'}
  });
  const client = new helloProto.Greeter(argv.target, grpc.credentials.createInsecure());
  const name = os.userInfo().username ?? 'unknown';
  await unaryCall(client, 1, '', grpc.status.INVALID_ARGUMENT);
  await unaryCall(client, 2, name, grpc.status.OK);
  await streamingCall(client, 3, '', grpc.status.INVALID_ARGUMENT);
  await streamingCall(client, 4, name, grpc.status.OK);
}

main();
