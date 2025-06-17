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

const addressString = 'ipv4:///127.0.0.1:50051,127.0.0.1:50052';

function callUnaryEcho(client, message) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 1);
    client.unaryEcho({message}, {deadline}, (error, response) => {
      if (error) {
        reject(error);
      } else {
        console.log(response.message);
        resolve(response);
      }
    });
  });
}

async function makeRPCs(client, count) {
  for (let i = 0; i < count; i++) {
    await callUnaryEcho(client, "this is examples/load_balancing");
  }
}

async function main() {
  // "pick_first" is the default, so there's no need to set the load balancing policy.
  const pickFirstClient = new echoProto.Echo(addressString, grpc.credentials.createInsecure());
  console.log("--- calling helloworld.Greeter/SayHello with pick_first ---");
  await makeRPCs(pickFirstClient, 10);
  console.log();

  const roundRobinServiceConfig = {
    methodConfig: [],
    loadBalancingConfig: [{ round_robin: {} }]
  };
  const roundRobinClient = new echoProto.Echo(addressString, grpc.credentials.createInsecure(), {'grpc.service_config': JSON.stringify(roundRobinServiceConfig)});
  console.log("--- calling helloworld.Greeter/SayHello with round_robin ---");
  await makeRPCs(roundRobinClient, 10);
  pickFirstClient.close();
  roundRobinClient.close();
}

main();
