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

function unaryEcho(call, callback) {
  console.log(`unary echoing message ${call.request.message}`);
  callback(null, call.request);
}

function main() {
  const argv = parseArgs(process.argv.slice(2), {
    string: 'port',
    default: {port: '50051'}
  });
  const server = new grpc.Server();
  server.addService(echoProto.Echo.service, { unaryEcho });
  const clientCaFile = fs.readFileSync(`${DATA_DIR}/client_ca_cert.pem`);
  const keyFile = fs.readFileSync(`${DATA_DIR}/server_key.pem`);
  const certFile = fs.readFileSync(`${DATA_DIR}/server_cert.pem`);
  const credentials = grpc.ServerCredentials.createSsl(clientCaFile, [{ private_key: keyFile, cert_chain: certFile }], true);
  server.bindAsync(`0.0.0.0:${argv.port}`, credentials, (err, port) => {
    if (err != null) {
      return console.error(err);
    }
    console.log(`gRPC listening on ${port}`)
  });
}

main();
