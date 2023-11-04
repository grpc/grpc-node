import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { ReflectionV1Implementation } from './reflection-v1-implementation';
import { ReflectionV1AlphaImplementation } from './reflection-v1alpha';

interface ReflectionServerOptions {
  /** whitelist of fully-qualified service names to expose. (Default: expose all) */
  services?: string[];
}

/** Analyzes a gRPC package and exposes endpoints providing information about
 *  it according to the gRPC Server Reflection API Specification
 *
 * @see https://github.com/grpc/grpc/blob/master/doc/server-reflection.md
 *
 * @remarks
 *
 * in order to keep backwards compatibility as the reflection schema evolves
 * this service contains implementations for each of the published versions
 *
 * @privateRemarks
 *
 * this class acts mostly as a facade to several underlying implementations. This
 * allows us to add or remove support for different versions of the reflection
 * schema without affecting the consumer
 *
 */
export class ReflectionService {
  private readonly v1: ReflectionV1Implementation;
  private readonly v1Alpha: ReflectionV1AlphaImplementation;
  
  constructor(pkg: protoLoader.PackageDefinition, options?: ReflectionServerOptions) {

    if (options.services) {
      const whitelist = new Set(options.services);

      for (const key in Object.keys(pkg)) {
        const value = pkg[key];
        const isService = value.format !== 'Protocol Buffer 3 DescriptorProto' && value.format !== 'Protocol Buffer 3 EnumDescriptorProto';
        if (isService && !whitelist.has(key)) {
          delete pkg[key];
        }
      }
    }

    this.v1 = new ReflectionV1Implementation(pkg);
    this.v1Alpha = new ReflectionV1AlphaImplementation(pkg);
  }

  addToServer(server: Pick<grpc.Server, 'addService'>) {
    this.v1.addToServer(server);
    this.v1Alpha.addToServer(server);
  }
}
