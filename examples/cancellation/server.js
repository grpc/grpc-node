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

function bidirectionalStreamingEcho(call) {
  call.on('data', value => {
    const message = value.message;
    console.log(`echoing message "${message}"`);
    call.write({message: message});
  });
  // Either 'end' or 'cancelled' will be emitted when the call is cancelled
  call.on('end', () => {
    console.log('server received end event')
    call.end();
  });
  call.on('cancelled', () => {
    console.log('server received cancelled event');
  });
}

const serviceImplementation = {
  bidirectionalStreamingEcho
}

function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: 'port',
    default: {port: '50052'}
  });
  const server = new grpc.Server();
  server.addService(echoProto.Echo.service, serviceImplementation);
  server.bindAsync(`0.0.0.0:${argv.port}`, grpc.ServerCredentials.createInsecure(), () => {
    server.start();
  });
  client = new echoProto.Echo(`localhost:${argv.port}`, grpc.credentials.createInsecure());
}

main();
