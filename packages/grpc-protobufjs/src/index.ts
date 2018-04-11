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
  [index: string]: ServiceDefinition;
}

export type Options = Protobuf.IParseOptions & Protobuf.IConversionOptions & {
  include?: string[];
};

function joinName(baseName: string, name: string): string {
  if (baseName === '') {
    return name;
  } else {
    return baseName + '.' + name;
  }
}

function getAllServices(obj: Protobuf.NamespaceBase, parentName: string): Array<[string, Protobuf.Service]> {
  const objName = joinName(parentName, obj.name);
  if (obj.hasOwnProperty('methods')) {
    return [[objName, obj as Protobuf.Service]];
  } else {
    return obj.nestedArray.map((child) => {
      if (child.hasOwnProperty('nested')) {
        return getAllServices(child as Protobuf.NamespaceBase, objName);
      } else {
        return [];
      }
    }).reduce((accumulator, currentValue) => accumulator.concat(currentValue), []);
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

function createPackageDefinition(root: Protobuf.Root, options: Options): PackageDefinition {
  const def: PackageDefinition = {};
  for (const [name, service] of getAllServices(root, '')) {
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
 * @param options.include Paths to search for imported `.proto` files.
 */
export function load(filename: string, options: Options): Promise<PackageDefinition> {
  const root: Protobuf.Root = new Protobuf.Root();
  if (!!options.include) {
    if (!(options.include instanceof Array)) {
      return Promise.reject(new Error('The include option must be an array'));
    }
    addIncludePathResolver(root, options.include as string[]);
  }
  return root.load(filename, options).then((loadedRoot) => {
    loadedRoot.resolveAll();
    return createPackageDefinition(root, options);
  });
}

export function loadSync(filename: string, options: Options): PackageDefinition {
  const root: Protobuf.Root = new Protobuf.Root();
  if (!!options.include) {
    if (!(options.include instanceof Array)) {
      throw new Error('The include option must be an array');
    }
    addIncludePathResolver(root, options.include as string[]);
  }
  const loadedRoot = root.loadSync(filename, options);
  loadedRoot.resolveAll();
  return createPackageDefinition(root, options);
}
