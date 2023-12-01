import * as path from 'path';
import {
  FileDescriptorProto,
  IFileDescriptorProto,
  IServiceDescriptorProto
} from 'protobufjs/ext/descriptor';

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

import { ExtensionNumberResponse__Output } from '../generated/grpc/reflection/v1/ExtensionNumberResponse';
import { FileDescriptorResponse__Output } from '../generated/grpc/reflection/v1/FileDescriptorResponse';
import { ListServiceResponse__Output } from '../generated/grpc/reflection/v1/ListServiceResponse';
import { ServerReflectionRequest } from '../generated/grpc/reflection/v1/ServerReflectionRequest';
import { ServerReflectionResponse } from '../generated/grpc/reflection/v1/ServerReflectionResponse';
import { visit } from './common/protobuf-visitor';
import { scope } from './common/utils';
import { PROTO_LOADER_OPTS } from './common/constants';
import { ReflectionServerOptions } from './common/interfaces';

export class ReflectionError extends Error {
  constructor(
    readonly statusCode: grpc.status,
    readonly message: string,
  ) {
    super(message);
  }
}

/** Analyzes a gRPC package definition and exposes methods to reflect on it
 *
 * NOTE: the files returned by this service may not match the handwritten ones 1:1.
 * This is because proto-loader reorients files based on their package definition,
 * combining any that have the same package.
 *
 * For example: if files 'a.proto' and 'b.proto' are both for the same package 'c' then
 * we will always return a reference to a combined 'c.proto' instead of the 2 files.
 */
export class ReflectionV1Implementation {

  /** An index of proto files by file name (eg. 'sample.proto') */
  private readonly files: Record<string, IFileDescriptorProto> = {};

  /** A graph of file dependencies */
  private readonly fileDependencies = new Map<IFileDescriptorProto, IFileDescriptorProto[]>();

  /** Pre-computed encoded-versions of each file */
  private readonly fileEncodings = new Map<IFileDescriptorProto, Uint8Array>();

  /** An index of proto files by type extension relationship
   *
   * extensionIndex[<pkg>.<msg>][<field#>] contains a reference to the file containing an
   * extension for the type "<pkg>.<msg>" and field number "<field#>"
   */
  private readonly extensions: Record<string, Record<number, IFileDescriptorProto>> = {};

  /** An index of fully qualified symbol names (eg. 'sample.Message') to the files that contain them */
  private readonly symbols: Record<string, IFileDescriptorProto> = {};

  /** An index of the services in the analyzed package(s) */
  private readonly services: Record<string, IServiceDescriptorProto> = {};


  constructor(root: protoLoader.PackageDefinition, options?: ReflectionServerOptions) {
    Object.values(root).forEach(({ fileDescriptorProtos }) => {
      if (Array.isArray(fileDescriptorProtos)) { // we use an array check to narrow the type
        fileDescriptorProtos.forEach((bin) => {
          const proto = FileDescriptorProto.decode(bin) as IFileDescriptorProto;

          if (proto.name && !this.files[proto.name]) {
            this.files[proto.name] = proto;
          }
        });
      }
    });

    // Pass 1: Index Values
    const serviceWhitelist = new Set(options?.services);
    const index = (fqn: string, file: IFileDescriptorProto) => (this.symbols[fqn] = file);
    Object.values(this.files).forEach((file) =>
      visit(file, {
        field: index,
        oneOf: index,
        message: index,
        method: index,
        enum: index,
        enumValue: index,
        service: (fqn, file, service) => {
          index(fqn, file);

          if (options?.services === undefined || serviceWhitelist.has(fqn)) {
            this.services[fqn] = service;
          }
        },
        extension: (fqn, file, ext) => {
          index(fqn, file);

          const extendeeName = ext.extendee || '';
          this.extensions[extendeeName] = {
            ...(this.extensions[extendeeName] || {}),
            [ext.number || -1]: file,
          };
        },
      }),
    );

    // Pass 2: Link References To Values
    // NOTE: this should be unnecessary after https://github.com/grpc/grpc-node/issues/2595 is resolved
    const addReference = (ref: string, sourceFile: IFileDescriptorProto, pkgScope: string) => {
      if (!ref) {
        return; // nothing to do
      }

      let referencedFile: IFileDescriptorProto | null = null;
      if (ref.startsWith('.')) {
        // absolute reference -- just remove the leading '.' and use the ref directly
        referencedFile = this.symbols[ref.replace(/^\./, '')];
      } else {
        // relative reference -- need to seek upwards up the current package scope until we find it
        let pkg = pkgScope;
        while (pkg && !referencedFile) {
          referencedFile = this.symbols[`${pkg}.${ref}`];
          pkg = scope(pkg);
        }

        // if we didn't find anything then try just a FQN lookup
        if (!referencedFile) {
          referencedFile = this.symbols[ref];
        }
      }

      if (!referencedFile) {
        console.warn(`Could not find file associated with reference ${ref}`);
        return;
      }

      if (referencedFile !== sourceFile) {
        const existingDeps = this.fileDependencies.get(sourceFile) || [];
        this.fileDependencies.set(sourceFile, [referencedFile, ...existingDeps]);
      }
    };

    Object.values(this.files).forEach((file) =>
      visit(file, {
        field: (fqn, file, field) => addReference(field.typeName || '', file, scope(fqn)),
        extension: (fqn, file, ext) => addReference(ext.typeName || '', file, scope(fqn)),
        method: (fqn, file, method) => {
          addReference(method.inputType || '', file, scope(fqn));
          addReference(method.outputType || '', file, scope(fqn));
        },
      }),
    );

    // Pass 3: pre-compute file encoding since that can be slow and is done frequently
    Object.values(this.files).forEach(file => {
      this.fileEncodings.set(file, FileDescriptorProto.encode(file).finish())
    });
  }

  addToServer(server: Pick<grpc.Server, 'addService'>) {
    const protoPath = path.join(__dirname, '../../proto/grpc/reflection/v1/reflection.proto');
    const pkgDefinition = protoLoader.loadSync(protoPath, PROTO_LOADER_OPTS);
    const pkg = grpc.loadPackageDefinition(pkgDefinition) as any;

    server.addService(pkg.grpc.reflection.v1.ServerReflection.service, {
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

  /** Assemble a response for a single server reflection request in the stream */
  handleServerReflectionRequest(message: ServerReflectionRequest): ServerReflectionResponse {
    const response: ServerReflectionResponse = {
      validHost: message.host,
      originalRequest: message
    };

    try {
      switch(message.messageRequest) {
        case 'listServices':
          response.listServicesResponse = this.listServices(message.listServices || '');
          break;
        case 'fileContainingSymbol':
          response.fileDescriptorResponse = this.fileContainingSymbol(message.fileContainingSymbol || '');
          break;
        case 'fileByFilename':
          response.fileDescriptorResponse = this.fileByFilename(message.fileByFilename || '');
          break;
        case 'fileContainingExtension':
          response.fileDescriptorResponse = this.fileContainingExtension(
            message.fileContainingExtension?.containingType || '',
            message.fileContainingExtension?.extensionNumber || -1
          );
          break;
        case 'allExtensionNumbersOfType':
          response.allExtensionNumbersResponse = this.allExtensionNumbersOfType(message.allExtensionNumbersOfType || '');
          break;
        default:
          throw new ReflectionError(
            grpc.status.UNIMPLEMENTED,
            `Unimplemented method for request: ${message.messageRequest}`,
          );
      }
    } catch (e) {
      if (e instanceof ReflectionError) {
        response.errorResponse = {
          errorCode: e.statusCode,
          errorMessage: e.message,
        };
      } else {
        response.errorResponse = {
          errorCode: grpc.status.UNKNOWN,
          errorMessage: 'Failed to process gRPC reflection request: unknown error',
        };
      }
    }

    return response;
  }

  /** List the full names of registered gRPC services
   *
   * note: the spec is unclear as to what the 'listServices' param can be; most
   * clients seem to only pass '*' but unsure if this should behave like a
   * filter. Until we know how this should behave with different inputs this
   * just always returns *all* services.
   *
   * @returns full-qualified service names (eg. 'sample.SampleService')
   */
  listServices(listServices: string): ListServiceResponse__Output {
    return { service: Object.keys(this.services).map((service) => ({ name: service })) };
  }

  /** Find the proto file(s) that declares the given fully-qualified symbol name
   *
   * @param symbol fully-qualified name of the symbol to lookup
   * (e.g. package.service[.method] or package.type)
   *
   * @returns descriptors of the file which contains this symbol and its imports
   */
  fileContainingSymbol(symbol: string): FileDescriptorResponse__Output {
    const file = this.symbols[symbol];

    if (!file) {
      throw new ReflectionError(grpc.status.NOT_FOUND, `Symbol not found: ${symbol}`);
    }

    const deps = this.getFileDependencies(file);

    return {
      fileDescriptorProto: [file, ...deps].map((file) => this.fileEncodings.get(file) || new Uint8Array())
    };
  }

  /** Find a proto file by the file name
   *
   * @returns descriptors of the file which contains this symbol and its imports
   */
  fileByFilename(filename: string): FileDescriptorResponse__Output {
    const file = this.files[filename];

    if (!file) {
      throw new ReflectionError(grpc.status.NOT_FOUND, `Proto file not found: ${filename}`);
    }

    const deps = this.getFileDependencies(file);

    return {
      fileDescriptorProto: [file, ...deps].map((file) => this.fileEncodings.get(file) || new Uint8Array),
    };
  }

  /** Find a proto file containing an extension to a message type
   *
   * @returns descriptors of the file which contains this symbol and its imports
   */
  fileContainingExtension(symbol: string, field: number): FileDescriptorResponse__Output {
    const extensionsByFieldNumber = this.extensions[symbol] || {};
    const file = extensionsByFieldNumber[field];

    if (!file) {
      throw new ReflectionError(
        grpc.status.NOT_FOUND,
        `Extension not found for symbol ${symbol} at field ${field}`,
      );
    }

    const deps = this.getFileDependencies(file);

    return {
      fileDescriptorProto: [file, ...deps].map((file) => this.fileEncodings.get(file) || new Uint8Array()),
    };
  }

  allExtensionNumbersOfType(symbol: string): ExtensionNumberResponse__Output {
    if (!(symbol in this.extensions)) {
      throw new ReflectionError(grpc.status.NOT_FOUND, `Extensions not found for symbol ${symbol}`);
    }

    const fieldNumbers = Object.keys(this.extensions[symbol]).map((key) => Number(key));

    return {
      baseTypeName: symbol,
      extensionNumber: fieldNumbers,
    };
  }

  private getFileDependencies(file: IFileDescriptorProto): IFileDescriptorProto[] {
    const visited: Set<IFileDescriptorProto> = new Set();
    const toVisit: IFileDescriptorProto[] = this.fileDependencies.get(file) || [];

    while (toVisit.length > 0) {
      const current = toVisit.pop();

      if (!current || visited.has(current)) {
        continue;
      }

      visited.add(current);
      toVisit.push(...this.fileDependencies.get(current)?.filter((dep) => !visited.has(dep)) || []);
    }

    return Array.from(visited);
  }

}
