/*
 *
 * Copyright 2025 gRPC authors.
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

const serviceConfig = {
  loadBalancingConfig: [],
  methodConfig: [
    {
      name: [
        {
          service: 'grpc.examples.echo.Echo',
        },
      ],
      retryPolicy: {
        maxAttempts: 4,
        initialBackoff: '0.01s',
        maxBackoff: '0.01s',
        backoffMultiplier: 1.0,
        retryableStatusCodes: ['UNAVAILABLE'],
      },
    },
  ],
};

function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50052'}
  });

	// Set up a connection to the server with service config and create the channel.
	// However, the recommended approach is to fetch the retry configuration
	// (which is part of the service config) from the name resolver rather than
	// defining it on the client side.
  const client = new echoProto.Echo('localhost:50052', grpc.credentials.createInsecure(), { 'grpc.service_config': JSON.stringify(serviceConfig) });
  client.unaryEcho({message: 'Try and Success'}, (error, value) => {
    if (error) {
      console.log(`Unexpected error from UnaryEcho: ${error}`);
      return;
    }
    console.log(`RPC response: ${JSON.stringify(value)}`);
  });
}

main();
