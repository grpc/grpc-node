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

function unaryCall(client, requestId, message, expectedCode) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    client.unaryEcho({message: message}, {deadline}, (error, value) => {
      let code;
      if (error) {
        code = error.code;
      } else {
        code = grpc.status.OK;
      }
      console.log(`[${requestId}] wanted = ${grpc.status[expectedCode]} got = ${grpc.status[code]}`);
      resolve();
    });
  });
}

function streamingCall(client, requestId, message, expectedCode) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    const call = client.bidirectionalStreamingEcho({deadline});
    call.on('data', () => {
      // Consume all response messages
    });
    call.on('status', status => {
      console.log(`[${requestId}] wanted = ${grpc.status[expectedCode]} got = ${grpc.status[status.code]}`);
      resolve();
    });
    call.on('error', () => {
      // Ignore error event
    });
    call.write({message});
    call.end();
  });
}

async function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50052'}
  });
  const client = new echoProto.Echo(argv.target, grpc.credentials.createInsecure());
  // A successful request
  await unaryCall(client, 1, 'world', grpc.status.OK);
  // Exceeds deadline
  await unaryCall(client, 2, 'delay', grpc.status.DEADLINE_EXCEEDED);
  // A successful request with propagated deadline
  await unaryCall(client, 3, '[propagate me]world', grpc.status.OK);
  // Exceeds propagated deadline
  await unaryCall(client, 4, '[propagate me][propagate me]world', grpc.status.DEADLINE_EXCEEDED);
  // Receives a response from the stream successfully
  await streamingCall(client, 5, '[propagate me]world', grpc.status.OK);
  // Exceeds propagated deadline before receiving a response
  await streamingCall(client, 6, '[propagate me][propagate me]world', grpc.status.DEADLINE_EXCEEDED);
}

main();
