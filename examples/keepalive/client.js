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
  // Ping the client every 10 seconds to ensure the connection is still active
  'grpc.keepalive_time_ms': 10_000,
  // Wait 1 second for the ping ack before assuming the connection is dead
  'grpc.keepalive_timeout_ms': 1_000,
  // send pings even without active streams
  'grpc.keepalive_permit_without_calls': 1
}

function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50052'}
  });
  const client = new echoProto.Echo(argv.target, grpc.credentials.createInsecure(), keepaliveOptions);
  client.unaryEcho({message: 'keepalive demo'}, (error, value) => {
    if (error) {
      console.log(`Unexpected error from UnaryEcho: ${error}`);
      return;
    }
    console.log(`RPC response: ${JSON.stringify(value)}`);
  });
  // Keep process alive forever; run with GRPC_TRACE=transport,keepalive GRPC_VERBOSITY=DEBUG to observe ping frames and GOAWAYs due to idleness.
  setInterval(() => {}, 1000);
}

main();
