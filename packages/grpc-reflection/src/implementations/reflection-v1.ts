import * as path from 'path';
import {
  FileDescriptorProto,
  FileDescriptorSet,
} from 'google-protobuf/google/protobuf/descriptor_pb';

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

/** Analyzes a gRPC server and exposes methods to reflect on it
 *
 * NOTE: the files returned by this service may not match the handwritten ones 1:1.
 * This is because proto-loader reorients files based on their package definition,
 * combining any that have the same package.
 *
 * For example: if files 'a.proto' and 'b.proto' are both for the same package 'c' then
 * we will always return a reference to a combined 'c.proto' instead of the 2 files.
 */
export class ReflectionV1Implementation {

  /** The full list of proto files (including imported deps) that the gRPC server includes */
  private readonly fileDescriptorSet = new FileDescriptorSet();

  /** An index of proto files by file name (eg. 'sample.proto') */
  private readonly fileNameIndex: Record<string, FileDescriptorProto> = {};

  /** An index of proto files by type extension relationship
   *
   * extensionIndex[<pkg>.<msg>][<field#>] contains a reference to the file containing an
   * extension for the type "<pkg>.<msg>" and field number "<field#>"
   */
  private readonly extensionIndex: Record<string, Record<number, FileDescriptorProto>> = {};

  /** An index of fully qualified symbol names (eg. 'sample.Message') to the files that contain them */
  private readonly symbolMap: Record<string, FileDescriptorProto> = {};

  /** Options that the user provided for this service */
  private readonly options?: ReflectionServerOptions;

  constructor(root: protoLoader.PackageDefinition, options?: ReflectionServerOptions) {
    this.options = options;

    Object.values(root).forEach(({ fileDescriptorProtos }) => {
      // Add file descriptors to the FileDescriptorSet.
      // We use the Array check here because a ServiceDefinition could have a method named the same thing
      if (Array.isArray(fileDescriptorProtos)) {
        fileDescriptorProtos.forEach((bin) => {
          const proto = FileDescriptorProto.deserializeBinary(bin);
          const isFileInSet = this.fileDescriptorSet
            .getFileList()
            .map((f) => f.getName())
            .includes(proto.getName());
          if (!isFileInSet) {
            this.fileDescriptorSet.addFile(proto);
          }
        });
      }
    });

    this.fileNameIndex = Object.fromEntries(
      this.fileDescriptorSet.getFileList().map((f) => [f.getName(), f]),
    );

    // Pass 1: Index Values
    const index = (fqn: string, file: FileDescriptorProto) => (this.symbolMap[fqn] = file);
    this.fileDescriptorSet.getFileList().forEach((file) =>
      visit(file, {
        field: index,
        oneOf: index,
        message: index,
        service: index,
        method: index,
        enum: index,
        enumValue: index,
        extension: (fqn, file, ext) => {
          index(fqn, file);

          const extendeeName = ext.getExtendee() || '';
          this.extensionIndex[extendeeName] = {
            ...(this.extensionIndex[extendeeName] || {}),
            [ext.getNumber() || -1]: file,
          };
        },
      }),
    );

    // Pass 2: Link References To Values
    const addReference = (ref: string, sourceFile: FileDescriptorProto, pkgScope: string) => {
      if (!ref) {
        return; // nothing to do
      }

      let referencedFile: FileDescriptorProto | null = null;
      if (ref.startsWith('.')) {
        // absolute reference -- just remove the leading '.' and use the ref directly
        referencedFile = this.symbolMap[ref.replace(/^\./, '')];
      } else {
        // relative reference -- need to seek upwards up the current package scope until we find it
        let pkg = pkgScope;
        while (pkg && !referencedFile) {
          referencedFile = this.symbolMap[`${pkg}.${ref}`];
          pkg = scope(pkg);
        }

        // if we didn't find anything then try just a FQN lookup
        if (!referencedFile) {
          referencedFile = this.symbolMap[ref];
        }
      }

      if (!referencedFile) {
        console.warn(`Could not find file associated with reference ${ref}`);
        return;
      }

      const fname = referencedFile.getName();
      if (referencedFile !== sourceFile && fname) {
        sourceFile.addDependency(fname);
      }
    };

    this.fileDescriptorSet.getFileList().forEach((file) =>
      visit(file, {
        field: (fqn, file, field) => addReference(field.getTypeName() || '', file, scope(fqn)),
        extension: (fqn, file, ext) => addReference(ext.getTypeName() || '', file, scope(fqn)),
        method: (fqn, file, method) => {
          addReference(method.getInputType() || '', file, scope(fqn));
          addReference(method.getOutputType() || '', file, scope(fqn));
        },
      }),
    );
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
      originalRequest: message,
      fileDescriptorResponse: undefined,
      allExtensionNumbersResponse: undefined,
      listServicesResponse: undefined,
      errorResponse: undefined,
    };

    try {
      if (message.listServices !== undefined) {
        response.listServicesResponse = this.listServices(message.listServices);
      } else if (message.fileContainingSymbol !== undefined) {
        response.fileDescriptorResponse = this.fileContainingSymbol(message.fileContainingSymbol);
      } else if (message.fileByFilename !== undefined) {
        response.fileDescriptorResponse = this.fileByFilename(message.fileByFilename);
      } else if (message.fileContainingExtension !== undefined) {
        response.fileDescriptorResponse = this.fileContainingExtension(
          message.fileContainingExtension?.containingType || '',
          message.fileContainingExtension?.extensionNumber || -1
        );
      } else if (message.allExtensionNumbersOfType) {
        response.allExtensionNumbersResponse = this.allExtensionNumbersOfType(message.allExtensionNumbersOfType);
      } else {
        throw new ReflectionError(
          grpc.status.UNIMPLEMENTED,
          `Unimplemented method for request: ${message}`,
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
    const services = this.fileDescriptorSet
      .getFileList()
      .map((file) =>
        file.getServiceList().map((service) => `${file.getPackage()}.${service.getName()}`),
      )
      .flat();

    const whitelist = new Set(this.options?.services ?? undefined);
    const exposedServices = this.options?.services ?
      services.filter(service => whitelist.has(service))
      : services;

    return { service: exposedServices.map((service) => ({ name: service })) };
  }

  /** Find the proto file(s) that declares the given fully-qualified symbol name
   *
   * @param symbol fully-qualified name of the symbol to lookup
   * (e.g. package.service[.method] or package.type)
   *
   * @returns descriptors of the file which contains this symbol and its imports
   */
  fileContainingSymbol(symbol: string): FileDescriptorResponse__Output {
    const file = this.symbolMap[symbol];

    if (!file) {
      throw new ReflectionError(grpc.status.NOT_FOUND, `Symbol not found: ${symbol}`);
    }

    const deps = this.getFileDependencies(file);

    return {
      fileDescriptorProto: [file, ...deps].map((proto) => proto.serializeBinary()),
    };
  }

  /** Find a proto file by the file name
   *
   * @returns descriptors of the file which contains this symbol and its imports
   */
  fileByFilename(filename: string): FileDescriptorResponse__Output {
    const file = this.fileNameIndex[filename];

    if (!file) {
      throw new ReflectionError(grpc.status.NOT_FOUND, `Proto file not found: ${filename}`);
    }

    const deps = this.getFileDependencies(file);

    return {
      fileDescriptorProto: [file, ...deps].map((f) => f.serializeBinary()),
    };
  }

  /** Find a proto file containing an extension to a message type
   *
   * @returns descriptors of the file which contains this symbol and its imports
   */
  fileContainingExtension(symbol: string, field: number): FileDescriptorResponse__Output {
    const extensionsByFieldNumber = this.extensionIndex[symbol] || {};
    const file = extensionsByFieldNumber[field];

    if (!file) {
      throw new ReflectionError(
        grpc.status.NOT_FOUND,
        `Extension not found for symbol ${symbol} at field ${field}`,
      );
    }

    const deps = this.getFileDependencies(file);

    return {
      fileDescriptorProto: [file, ...deps].map((f) => f.serializeBinary()),
    };
  }

  allExtensionNumbersOfType(symbol: string): ExtensionNumberResponse__Output {
    if (!(symbol in this.extensionIndex)) {
      throw new ReflectionError(grpc.status.NOT_FOUND, `Extensions not found for symbol ${symbol}`);
    }

    const fieldNumbers = Object.keys(this.extensionIndex[symbol]).map((key) => Number(key));

    return {
      baseTypeName: symbol,
      extensionNumber: fieldNumbers,
    };
  }

  private getFileDependencies(
    file: FileDescriptorProto,
    visited: Set<FileDescriptorProto> = new Set(),
  ): FileDescriptorProto[] {
    const newVisited = visited.add(file);

    const directDeps = file.getDependencyList().map((dep) => this.fileNameIndex[dep]);
    const transitiveDeps = directDeps
      .filter((dep) => !newVisited.has(dep))
      .map((dep) => this.getFileDependencies(dep, newVisited))
      .flat();

    const allDeps = [...directDeps, ...transitiveDeps];

    return [...new Set(allDeps)];
  }
}
