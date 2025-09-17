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
const fs = require('fs');

const PROTO_PATH = __dirname + '/../../protos/echo.proto';

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {keepCase: true,
   longs: String,
   enums: String,
   defaults: true,
   oneofs: true
  });
const echoProto = grpc.loadPackageDefinition(packageDefinition).grpc.examples.echo;

const DATA_DIR = `${__dirname}/../../data/x509`;

function callUnaryEcho(client, message) {
  return new Promise((resolve, reject) => {
    const deadline = new Date();
    deadline.setSeconds(deadline.getSeconds() + 10);
    client.unaryEcho({message: message}, {deadline}, (error, value) => {
      if (error) {
        reject(error);
        return;
      }
      console.log(`UnaryEcho: ${JSON.stringify(value)}`);
      resolve();
    });
  });
}

async function main() {
  let argv = parseArgs(process.argv.slice(2), {
    string: 'target',
    default: {target: 'localhost:50051'}
  });
  const caFile = fs.readFileSync(`${DATA_DIR}/ca_cert.pem`);
  const credentials = grpc.credentials.createSsl(caFile)
  const client = new echoProto.Echo(argv.target, credentials, {'grpc.ssl_target_name_override': 'x.test.example.com'});
  await callUnaryEcho(client, 'hello world');
}

main()
