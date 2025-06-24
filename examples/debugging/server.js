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

var PROTO_PATH = __dirname + '/../protos/helloworld.proto';

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
var helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld;

const greeterImplementation = {
  sayHello: (call, callback) => {
    callback(null, { message: `Hello ${call.request.name}`});
  }
};

const slowGreeterImplementation = {
  sayHello: (call, callback) => {
    const waitTimeMs = 100 + (Math.random() * 100)|0;
    setTimeout(() => {
      callback(null, { message: `Hello ${call.request.name}`});
    }, waitTimeMs);
  }
}

function serverBindPort(server, port) {
  return new Promise((resolve, reject) => {
    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        reject(error);
      } else {
        resolve(port);
      }
    })
  });
}

async function main() {
  const channelzServer = new grpc.Server();
  grpc.addAdminServicesToServer(channelzServer);
  await serverBindPort(channelzServer, 50052);

  const server1 = new grpc.Server();
  server1.addService(helloProto.Greeter.service, greeterImplementation);
  await serverBindPort(server1, 10001);

  const server2 = new grpc.Server();
  server2.addService(helloProto.Greeter.service, greeterImplementation);
  await serverBindPort(server2, 10002);

  const server3 = new grpc.Server();
  server3.addService(helloProto.Greeter.service, slowGreeterImplementation);
  await serverBindPort(server3, 10003);
}

main();
