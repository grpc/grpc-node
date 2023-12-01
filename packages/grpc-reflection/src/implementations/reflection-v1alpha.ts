import * as path from 'path';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { ServerReflectionRequest } from '../generated/grpc/reflection/v1/ServerReflectionRequest';
import { ServerReflectionResponse } from '../generated/grpc/reflection/v1/ServerReflectionResponse';
import { PROTO_LOADER_OPTS } from './common/constants';
import { ReflectionV1Implementation } from './reflection-v1';


/** Analyzes a gRPC server and exposes methods to reflect on it
 *
 * NOTE: the files returned by this service may not match the handwritten ones 1:1.
 * This is because proto-loader reorients files based on their package definition,
 * combining any that have the same package.
 *
 * For example: if files 'a.proto' and 'b.proto' are both for the same package 'c' then
 * we will always return a reference to a combined 'c.proto' instead of the 2 files.
 *
 * @privateRemarks as the v1 and v1alpha specs are identical, this implementation extends
 * reflection-v1 and exposes it at the v1alpha package instead
 */
export class ReflectionV1AlphaImplementation extends ReflectionV1Implementation {
  addToServer(server: Pick<grpc.Server, 'addService'>) {
    const protoPath = path.join(__dirname, '../../proto/grpc/reflection/v1alpha/reflection.proto');
    const pkgDefinition = protoLoader.loadSync(protoPath, PROTO_LOADER_OPTS);
    const pkg = grpc.loadPackageDefinition(pkgDefinition) as any;

    server.addService(pkg.grpc.reflection.v1alpha.ServerReflection.service, {
      ServerReflectionInfo: (
        stream: grpc.ServerDuplexStream<ServerReflectionRequest, ServerReflectionResponse>
      ) => {
        stream.on('end', () => stream.end());

        stream.on('data', (message: ServerReflectionRequest) => {
          stream.write(this.handleServerReflectionRequest(message));
        });
      }
    });
  }
}
