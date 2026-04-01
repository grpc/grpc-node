/*
 *
 * Copyright 2026 gRPC authors.
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
const { protoPath: HEALTH_PROTO_PATH } = require('grpc-health-check');

const packageDefinition = protoLoader.loadSync(
  HEALTH_PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const healthProto = grpc.loadPackageDefinition(packageDefinition).grpc.health.v1;

function main() {
  const healthClient = new healthProto.Health('localhost:50051', grpc.credentials.createInsecure());

  const watchStream = healthClient.watch({ service: '' });

  watchStream.on('data', function (response) {
    console.log(`Health check status: ${response.status}`);
  });

  watchStream.on('error', function (error) {
    console.error('Health check error:', error.message);
  });

  watchStream.on('end', function () {
    console.log('Health check stream ended.');
  });
}

main();
