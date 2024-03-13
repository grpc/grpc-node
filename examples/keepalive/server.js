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

const keepaliveOptions = {
  // If a client is idle for 15 seconds, send a GOAWAY
  'grpc.max_connection_idle_ms': 15_000,
  // If any connection is alive for more than 30 seconds, send a GOAWAY
  'grpc.max_connection_age_ms': 30_000,
  // Allow 5 seconds for pending RPCs to complete before forcibly closing connections
  'grpc.max_connection_age_grace_ms': 5_000,
  // Ping the client every 5 seconds to ensure the connection is still active
  'grpc.keepalive_time_ms': 5_000,
  // Wait 1 second for the ping ack before assuming the connection is dead
  'grpc.keepalive_timeout_ms': 1_000
}

function unaryEcho(call, callback) {
  callback(null, call.request);
}

const serviceImplementation = {
  unaryEcho
};

function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: 'port',
    default: {port: '50052'}
  });
  const server = new grpc.Server(keepaliveOptions);
  server.addService(echoProto.Echo.service, serviceImplementation);
  server.bindAsync(`0.0.0.0:${argv.port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err != null) {
      return console.error(err);
    }
    console.log(`gRPC listening on ${port}`)
  });
}

main();
