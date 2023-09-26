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

function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50052'}
  });
  const client = new echoProto.Echo(argv.target, grpc.credentials.createInsecure());
  const call = client.bidirectionalStreamingEcho();
  const EXPECTED_MESSAGES = 2;
  let receivedMessages = 0;
  call.on('data', value => {
    console.log(`received message "${value.message}"`)
    receivedMessages += 1;
    if (receivedMessages >= EXPECTED_MESSAGES) {
      console.log('cancelling call');
      call.cancel();
    }
  });
  call.on('status', statusObject => {
    console.log(`received call status with code ${grpc.status[statusObject.code]}`);
  });
  call.on('error', error => {
    console.log(`received error ${error}`);
  })
  console.log('sending message "hello"');
  call.write({message: 'hello'});
  console.log('sending message "world"')
  call.write({message: 'world'});
}

main();
