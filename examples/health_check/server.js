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
const { HealthImplementation } = require('grpc-health-check');

/**
 * Starts an RPC server that toggles health checks status.
 */
function main() {
  const server = new grpc.Server();

  // Set up the health check service
  const statusMap = {
    '': 'SERVING',
  };
  const healthImpl = new HealthImplementation(statusMap);
  healthImpl.addToServer(server);

  // Toggle the health status continuously
  let nextStatus = 'NOT_SERVING';
  setInterval(() => {
    healthImpl.setStatus('', nextStatus);
    nextStatus = nextStatus === 'SERVING' ? 'NOT_SERVING' : 'SERVING';
  }, 3000);

  server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Server running at http://0.0.0.0:50051');
  });
}

main();
