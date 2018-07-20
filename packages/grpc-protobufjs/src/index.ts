/**
 * @license
 * Copyright 2018 gRPC authors.
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
import * as Protobuf from 'protobufjs';
import * as fs from 'fs';
import * as path from 'path';
import * as _ from 'lodash';

export interface Serialize<T> {
  (value: T): Buffer;
}

export interface Deserialize<T> {
  (bytes: Buffer): T;
}

export interface MethodDefinition<RequestType, ResponseType> {
  path: string;
  requestStream: boolean;
  responseStream: boolean;
  requestSerialize: Serialize<RequestType>;
  responseSerialize: Serialize<ResponseType>;
  requestDeserialize: Deserialize<RequestType>;
  responseDeserialize: Deserialize<ResponseType>;
  originalName?: string;
}

export interface ServiceDefinition {
  [index: string]: MethodDefinition<object, object>;
}

export interface PackageDefinition {
  [index: string]: ServiceDefinition
}

export interface LoadResultType {
  packageDefinition: PackageDefinition;
  messageTypes: Array<[string, Protobuf.Type]>;
}

export type Options = Protobuf.IParseOptions & Protobuf.IConversionOptions & {
  includeDirs?: string[];
};

function joinName(baseName: string, name: string): string {
  if (baseName === '') {
    return name;
  } else {
    return baseName + '.' + name;
  }
}

class ServicesAndMessages {
  constructor (
    public services: Array<[string, Protobuf.Service]>,
    public messages: Array<[string, Protobuf.Type]>
  ) {
  }

  concat(that: ServicesAndMessages) {
    return new ServicesAndMessages(
      this.services.concat(that.services),
      this.messages.concat(that.messages)
    )
  }
};


function getAllServicesAndMessages(obj: Protobuf.NamespaceBase, parentName: string): ServicesAndMessages {
  const objName = joinName(parentName, obj.name);
  if (obj instanceof Protobuf.Service) {
    return new ServicesAndMessages([[objName, obj]], []);
  } else if (obj instanceof Protobuf.Type) {
    return new ServicesAndMessages([], [[objName, obj]]);
  } else {
    return obj.nestedArray.map((child) => {
      if (child.hasOwnProperty('nested')) {
        return getAllServicesAndMessages(child as Protobuf.NamespaceBase, objName);
      } else {
        return new ServicesAndMessages([], []);
      }
    }).reduce((accumulator, currentValue) => accumulator.concat(currentValue), new ServicesAndMessages([], []));
  }
}

function createDeserializer(cls: Protobuf.Type, options: Options): Deserialize<object> {
  return function deserialize(argBuf: Buffer): object {
    return cls.toObject(cls.decode(argBuf), options);
  };
}

function createSerializer(cls: Protobuf.Type): Serialize<object> {
  return function serialize(arg: object): Buffer {
    const message = cls.fromObject(arg);
    return cls.encode(message).finish() as Buffer;
  };
}

function createMethodDefinition(method: Protobuf.Method, serviceName: string, options: Options): MethodDefinition<object, object> {
  return {
    path: '/' + serviceName + '/' + method.name,
    requestStream: !!method.requestStream,
    responseStream: !!method.responseStream,
    requestSerialize: createSerializer(method.resolvedRequestType as Protobuf.Type),
    requestDeserialize: createDeserializer(method.resolvedRequestType as Protobuf.Type, options),
    responseSerialize: createSerializer(method.resolvedResponseType as Protobuf.Type),
    responseDeserialize: createDeserializer(method.resolvedResponseType as Protobuf.Type, options),
    // TODO(murgatroid99): Find a better way to handle this
    originalName: _.camelCase(method.name)
  };
}

function createServiceDefinition(service: Protobuf.Service, name: string, options: Options): ServiceDefinition {
  const def: ServiceDefinition = {};
  for (const method of service.methodsArray) {
    def[method.name] = createMethodDefinition(method, name, options);
  }
  return def;
}

function createPackageDefinition(
  root: Protobuf.Root,
  options: Options,
  services: Array<[string, Protobuf.Service]>,
): PackageDefinition {
  const def: PackageDefinition = {};
  for (const [name, service] of services) {
    def[name] = createServiceDefinition(service, name, options);
  }
  return def;
}

function addIncludePathResolver(root: Protobuf.Root, includePaths: string[]) {
  root.resolvePath = (origin: string, target: string) => {
    for (const directory of includePaths) {
      const fullPath: string = path.join(directory, target);
      try {
        fs.accessSync(fullPath, fs.constants.R_OK);
        return fullPath;
      } catch (err) {
        continue;
      }
    }
    return null;
  };
}

export abstract class GrpcClient {};

/* From grpc-native-core */
export interface GrpcObject {
  [name: string]: GrpcObject | typeof GrpcClient | Protobuf.Type;
}

/* mostly taken from grpc-native-core's loadPackageDefinition */
export function addTypesToGrpcObject(obj: GrpcObject, types: Array<[string, Protobuf.Type]>) {
  const result = obj;
  for (const [name, aType] of types) {
    console.log('adding to grpc object', name)
    const nameComponents = name.split('.');
    const typeName = nameComponents[nameComponents.length-1];
    let current : GrpcObject = result;
    for (const packageName of nameComponents.slice(0, -1)) {
      console.log('>', packageName)
      if (!current[packageName]) {
        current[packageName] = {};
      }
      current = current[packageName] as GrpcObject;
    }
    console.log('>>', typeName)
    current[typeName] = aType;
  }
  return result;
};

/**
 * Load a .proto file with the specified options.
 * @param filename The file path to load. Can be an absolute path or relative to
 *     an include path.
 * @param options.keepCase Preserve field names. The default is to change them
 *     to camel case.
 * @param options.longs The type that should be used to represent `long` values.
 *     Valid options are `Number` and `String`. Defaults to a `Long` object type
 *     from a library.
 * @param options.enums The type that should be used to represent `enum` values.
 *     The only valid option is `String`. Defaults to the numeric value.
 * @param options.bytes The type that should be used to represent `bytes`
 *     values. Valid options are `Array` and `String`. The default is to use
 *     `Buffer`.
 * @param options.defaults Set default values on output objects. Defaults to
 *     `false`.
 * @param options.arrays Set empty arrays for missing array values even if
 *     `defaults` is `false`. Defaults to `false`.
 * @param options.objects Set empty objects for missing object values even if
 *     `defaults` is `false`. Defaults to `false`.
 * @param options.oneofs Set virtual oneof properties to the present field's
 *     name
 * @param options.includeDirs Paths to search for imported `.proto` files.
 */
export function load(filename: string, options?: Options): Promise<LoadResultType> {
  const root: Protobuf.Root = new Protobuf.Root();
  options = options || {};
  if (!!options.includeDirs) {
    if (!(options.includeDirs instanceof Array)) {
      return Promise.reject(new Error('The includeDirs option must be an array'));
    }
    addIncludePathResolver(root, options.includeDirs as string[]);
  }
  return root.load(filename, options).then((loadedRoot) => {
    loadedRoot.resolveAll();
    const servicesAndMessages = getAllServicesAndMessages(root, '');
    console.log('found services and messages:', servicesAndMessages);
    const packageDefinition = createPackageDefinition(root, options!, servicesAndMessages.services);
    return {
      packageDefinition: packageDefinition,
      messageTypes: servicesAndMessages.messages
    }
  });
}

export function loadSync(filename: string, options?: Options): LoadResultType {
  const root: Protobuf.Root = new Protobuf.Root();
  options = options || {};
  if (!!options.includeDirs) {
    if (!(options.includeDirs instanceof Array)) {
      throw new Error('The include option must be an array');
    }
    addIncludePathResolver(root, options.includeDirs as string[]);
  }
  const loadedRoot = root.loadSync(filename, options);
  loadedRoot.resolveAll();
  const servicesAndMessages = getAllServicesAndMessages(root, '');
  console.log('found services and messages:', servicesAndMessages);
  const packageDefinition = createPackageDefinition(root, options!, servicesAndMessages.services)
  return {
    packageDefinition: packageDefinition,
    messageTypes: servicesAndMessages.messages
  }
}
