import * as loader from '@grpc/proto-loader';
import * as path from 'node:path';

import {
  GrpcObject,
  ServiceClientConstructor,
  loadPackageDefinition,
} from '../../build/src/make-client';

const protoLoaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

export function loadProtoFile(file: string): GrpcObject {
  const packageDefinition = loader.loadSync(file, protoLoaderOptions);
  return loadPackageDefinition(packageDefinition);
}

const protoFile = path.join(
  __dirname,
  '../../test/fixtures',
  'echo_service.proto'
);
export const echoService = loadProtoFile(protoFile)
  .EchoService as ServiceClientConstructor;
