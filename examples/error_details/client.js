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

var PROTO_PATH = __dirname + '/../protos/helloworld.proto';

var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

// Extract Deserializers from the service definition
var serviceDef = hello_proto.Greeter.service;
var decodeStatus = serviceDef['_DecodeStatus'].responseDeserialize;
var decodeBadRequest = serviceDef['_DecodeBadRequest'].responseDeserialize;

var client = new hello_proto.Greeter('localhost:50051', grpc.credentials.createInsecure());

function main() {
  client.sayHello({ name: 'World' }, function (err, response) {
    if (err) {
      console.error('Success call failed:', err);
      return;
    }
    console.log('Greeting:', response.message);

    client.sayHello({ name: '' }, function (err, response) {
      if (err) {
        console.log('\n--- Standard gRPC Error Received ---');
        console.log(`Code: ${err.code}`);
        console.log(`Status: ${grpc.status[err.code]}`);
        console.log(`Message: ${err.message}`);

        // Rich Error Decoding
        const [statusBuffer] = err.metadata?.get('grpc-status-details-bin') || [];
        if (statusBuffer) {
          console.log('\n--- Rich Error Details---');
          var statusObj = decodeStatus(statusBuffer);

          if (statusObj.details) {
            statusObj.details.forEach(detail => {
              if (detail.type_url === 'type.googleapis.com/google.rpc.BadRequest') {
                var badRequestObj = decodeBadRequest(detail.value);
                console.log('Violation:', JSON.stringify(badRequestObj.field_violations, null, 2));
              }
            });
          }
        }
        
      } else {
        console.log('Failing call unexpectedly succeeded:', response.message);
      }
    });
  });
}

main();