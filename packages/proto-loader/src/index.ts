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
import * as fs from 'fs';
import * as path from 'path';
import * as Protobuf from 'protobufjs';
import * as descriptor from 'protobufjs/ext/descriptor';

import camelCase = require('lodash.camelcase');

declare module 'protobufjs' {
  interface Type {
    toDescriptor(protoVersion: string): Protobuf
        .Message<descriptor.IDescriptorProto>&descriptor.IDescriptorProto;
  }

  interface Root {
    toDescriptor(protoVersion: string): Protobuf
        .Message<descriptor.IFileDescriptorSet>&descriptor.IFileDescriptorSet;
  }

  interface Enum {
    toDescriptor(protoVersion: string):
        Protobuf.Message<descriptor.IEnumDescriptorProto>&
        descriptor.IEnumDescriptorProto;
  }
}

export interface Serialize<T> { (value: T): Buffer; }

export interface Deserialize<T> { (bytes: Buffer): T; }

export interface ProtobufTypeDefinition {
  format: string;
  type: object;
  fileDescriptorProtos: Buffer[];
}

export interface MessageTypeDefinition extends ProtobufTypeDefinition {
  format: 'Protocol Buffer 3 DescriptorProto';
}

export interface EnumTypeDefinition extends ProtobufTypeDefinition {
  format: 'Protocol Buffer 3 EnumDescriptorProto';
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
  requestType: MessageTypeDefinition;
  responseType: MessageTypeDefinition;
}

export interface ServiceDefinition {
  [index: string]: MethodDefinition<object, object>;
}

export type AnyDefinition =
    ServiceDefinition|MessageTypeDefinition|EnumTypeDefinition;

export interface PackageDefinition { [index: string]: AnyDefinition; }

export type Options = Protobuf.IParseOptions&Protobuf.IConversionOptions&{
  includeDirs?: string[];
};

const descriptorOptions: Protobuf.IConversionOptions = {
  longs: String,
  enums: String,
  bytes: String,
  defaults: true,
  oneofs: true,
  json: true
};

function joinName(baseName: string, name: string): string {
  if (baseName === '') {
    return name;
  } else {
    return baseName + '.' + name;
  }
}

type HandledReflectionObject = Protobuf.Service|Protobuf.Type|Protobuf.Enum;

function isHandledReflectionObject(obj: Protobuf.ReflectionObject):
    obj is HandledReflectionObject {
  return obj instanceof Protobuf.Service || obj instanceof Protobuf.Type ||
      obj instanceof Protobuf.Enum;
}

function isNamespaceBase(obj: Protobuf.ReflectionObject):
    obj is Protobuf.NamespaceBase {
  return obj instanceof Protobuf.Namespace || obj instanceof Protobuf.Root;
}

function getAllHandledReflectionObjects(
    obj: Protobuf.ReflectionObject,
    parentName: string): Array<[string, HandledReflectionObject]> {
  const objName = joinName(parentName, obj.name);
  if (isHandledReflectionObject(obj)) {
    return [[objName, obj]];
  } else {
    if (isNamespaceBase(obj) && typeof obj.nested !== undefined) {
      return Object.keys(obj.nested!)
          .map((name) => {
            return getAllHandledReflectionObjects(obj.nested![name], objName);
          })
          .reduce(
              (accumulator, currentValue) => accumulator.concat(currentValue),
              []);
    }
  }
  return [];
}

function createDeserializer(
    cls: Protobuf.Type, options: Options): Deserialize<object> {
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

function createMethodDefinition(
    method: Protobuf.Method, serviceName: string,
    options: Options): MethodDefinition<object, object> {
  /* This is only ever called after the corresponding root.resolveAll(), so we
   * can assume that the resolved request and response types are non-null */
  const requestType: Protobuf.Type = method.resolvedRequestType!;
  const responseType: Protobuf.Type = method.resolvedResponseType!;
  return {
    path: '/' + serviceName + '/' + method.name,
    requestStream: !!method.requestStream,
    responseStream: !!method.responseStream,
    requestSerialize: createSerializer(requestType),
    requestDeserialize: createDeserializer(requestType, options),
    responseSerialize: createSerializer(responseType),
    responseDeserialize: createDeserializer(responseType, options),
    // TODO(murgatroid99): Find a better way to handle this
    originalName: camelCase(method.name),
    requestType: createMessageDefinition(requestType),
    responseType: createMessageDefinition(responseType)
  };
}

function createServiceDefinition(
    service: Protobuf.Service, name: string,
    options: Options): ServiceDefinition {
  const def: ServiceDefinition = {};
  for (const method of service.methodsArray) {
    def[method.name] = createMethodDefinition(method, name, options);
  }
  return def;
}

const fileDescriptorCache: Map<Protobuf.Root, Buffer[]> =
    new Map<Protobuf.Root, Buffer[]>();
function getFileDescriptors(root: Protobuf.Root): Buffer[] {
  if (fileDescriptorCache.has(root)) {
    return fileDescriptorCache.get(root)!;
  } else {
    const descriptorList: descriptor.IFileDescriptorProto[] =
        root.toDescriptor('proto3').file;
    const bufferList: Buffer[] = descriptorList.map(
        value =>
            Buffer.from(descriptor.FileDescriptorProto.encode(value).finish()));
    fileDescriptorCache.set(root, bufferList);
    return bufferList;
  }
}

function createMessageDefinition(message: Protobuf.Type):
    MessageTypeDefinition {
  const messageDescriptor: protobuf.Message<descriptor.IDescriptorProto> =
      message.toDescriptor('proto3');
  return {
    format: 'Protocol Buffer 3 DescriptorProto',
    type:
        messageDescriptor.$type.toObject(messageDescriptor, descriptorOptions),
    fileDescriptorProtos: getFileDescriptors(message.root)
  };
}

function createEnumDefinition(enumType: Protobuf.Enum): EnumTypeDefinition {
  const enumDescriptor: protobuf.Message<descriptor.IEnumDescriptorProto> =
      enumType.toDescriptor('proto3');
  return {
    format: 'Protocol Buffer 3 EnumDescriptorProto',
    type: enumDescriptor.$type.toObject(enumDescriptor, descriptorOptions),
    fileDescriptorProtos: getFileDescriptors(enumType.root)
  };
}

/**
 * function createDefinition(obj: Protobuf.Service, name: string, options:
 * Options): ServiceDefinition; function createDefinition(obj: Protobuf.Type,
 * name: string, options: Options): MessageTypeDefinition; function
 * createDefinition(obj: Protobuf.Enum, name: string, options: Options):
 * EnumTypeDefinition;
 */
function createDefinition(
    obj: HandledReflectionObject, name: string,
    options: Options): AnyDefinition {
  if (obj instanceof Protobuf.Service) {
    return createServiceDefinition(obj, name, options);
  } else if (obj instanceof Protobuf.Type) {
    return createMessageDefinition(obj);
  } else if (obj instanceof Protobuf.Enum) {
    return createEnumDefinition(obj);
  } else {
    throw new Error('Type mismatch in reflection object handling');
  }
}

function createPackageDefinition(
    root: Protobuf.Root, options: Options): PackageDefinition {
  const def: PackageDefinition = {};
  root.resolveAll();
  for (const [name, obj] of getAllHandledReflectionObjects(root, '')) {
    def[name] = createDefinition(obj, name, options);
  }
  return def;
}

function addIncludePathResolver(root: Protobuf.Root, includePaths: string[]) {
  const originalResolvePath = root.resolvePath;
  root.resolvePath = (origin: string, target: string) => {
    if (path.isAbsolute(target)) {
      return target;
    }
    for (const directory of includePaths) {
      const fullPath: string = path.join(directory, target);
      try {
        fs.accessSync(fullPath, fs.constants.R_OK);
        return fullPath;
      } catch (err) {
        continue;
      }
    }
    return originalResolvePath(origin, target);
  };
}

/**
 * Load a .proto file with the specified options.
 * @param filename One or multiple file paths to load. Can be an absolute path
 *     or relative to an include path.
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
export function load(
    filename: string | string[], options?: Options): Promise<PackageDefinition> {
  const root: Protobuf.Root = new Protobuf.Root();
  options = options || {};
  if (!!options.includeDirs) {
    if (!(Array.isArray(options.includeDirs))) {
      return Promise.reject(
          new Error('The includeDirs option must be an array'));
    }
    addIncludePathResolver(root, options.includeDirs as string[]);
  }
  return root.load(filename, options).then((loadedRoot) => {
    loadedRoot.resolveAll();
    return createPackageDefinition(root, options!);
  });
}

export function loadSync(
    filename: string | string[], options?: Options): PackageDefinition {
  const root: Protobuf.Root = new Protobuf.Root();
  options = options || {};
  if (!!options.includeDirs) {
    if (!(Array.isArray(options.includeDirs))) {
      throw new Error('The includeDirs option must be an array');
    }
    addIncludePathResolver(root, options.includeDirs as string[]);
  }
  const loadedRoot = root.loadSync(filename, options);
  loadedRoot.resolveAll();
  return createPackageDefinition(root, options!);
}

// Load Google's well-known proto files that aren't exposed by Protobuf.js.
{
  // Protobuf.js exposes: any, duration, empty, field_mask, struct, timestamp,
  // and wrappers. compiler/plugin is excluded in Protobuf.js and here.
  const wellKnownProtos = ['api', 'descriptor', 'source_context', 'type'];
  const sourceDir = path.join(
      path.dirname(require.resolve('protobufjs')), 'google', 'protobuf');

  for (const proto of wellKnownProtos) {
    const file = path.join(sourceDir, `${proto}.proto`);
    const descriptor = Protobuf.loadSync(file).toJSON();

    // @ts-ignore
    Protobuf.common(proto, descriptor.nested.google.nested);
  }
}
