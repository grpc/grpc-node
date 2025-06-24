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

function serverBindPort(server, port) {
  return new Promise((resolve, reject) => {
    server.bindAsync(port, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        reject(error);
      } else {
        resolve(port);
      }
    })
  });
}

const addressString = 'ipv4:///127.0.0.1:10001,127.0.0.1:10002,127.0.0.1:10003';

function callSayHello(client, name) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setMilliseconds(deadline.getMilliseconds() + 150);
    client.sayHello({name}, {deadline}, (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

async function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: ['addr', 'name'],
    default: {addr: 'localhost:50051', name: 'world'}
  });

  // Set up the server serving channelz service.
  const channelzServer = new grpc.Server();
  grpc.addAdminServicesToServer(channelzServer);
  await serverBindPort(channelzServer, argv.addr);

  const roundRobinServiceConfig = {
    methodConfig: [],
    loadBalancingConfig: [{ round_robin: {} }]
  };
  const client = new helloProto.Greeter(addressString, grpc.credentials.createInsecure(), {'grpc.service_config': JSON.stringify(roundRobinServiceConfig)});

  // Contact the server and print out its response

  // Make 100 SayHello RPCs
  for (let i = 0; i < 100; i++) {
    try {
      const response = await callSayHello(client, argv.name);
      console.log(`Greeting: ${response.message}`);
    } catch (e) {
      console.log(`could not greet: ${e.message}`);
    }
  }

  // Unless you exit the program (e.g. CTRL+C), channelz data will be available for querying.
	// Users can take time to examine and learn about the info provided by channelz.
  setInterval(() => {}, 10000);
}

main();
