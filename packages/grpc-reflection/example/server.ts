import * as path from 'path';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { ReflectionService } from '../src';

const PROTO_PATH = path.join(__dirname, '../proto/sample/sample.proto');
const INCLUDE_PATH = path.join(__dirname, '../proto/sample/vendor');

const server = new grpc.Server();
const packageDefinition = protoLoader.loadSync(PROTO_PATH, { includeDirs: [INCLUDE_PATH] });
const reflection = new ReflectionService(packageDefinition);
reflection.addToServer(server);

server.bindAsync('localhost:5000', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});

// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);



