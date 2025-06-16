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

function startServer(address) {
  return new Promise((resolve, reject) => {
    const server = new grpc.Server();
    server.addService(echoProto.Echo.service, {
      unaryEcho: (call, callback) => {
        callback(null, {message: `${call.request.message} (from ${address})`});
      }
    });
    server.bindAsync(address, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        reject(error);
      } else {
        resolve(server);
      }
    });
  });
}

const addresses = ['0.0.0.0:50051', '0.0.0.0:50052'];

async function main() {
  for (const address of addresses) {
    await startServer(address)
  }
}

main();
