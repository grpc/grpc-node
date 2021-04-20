#!/usr/bin/env node
/**
 * @license
 * Copyright 2020 gRPC authors.
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
import * as yargs from 'yargs';

import camelCase = require('lodash.camelcase');
import { loadProtosWithOptions, addCommonProtos } from '../src/util';

type GeneratorOptions = Protobuf.IParseOptions & Protobuf.IConversionOptions & {
  includeDirs?: string[];
  grpcLib: string;
  outDir: string;
  verbose?: boolean;
  includeComments?: boolean;
}

class TextFormatter {
  private readonly indentText = '  ';
  private indentValue = 0;
  private textParts: string[] = [];
  constructor() {}

  indent() {
    this.indentValue += 1;
  }

  unindent() {
    this.indentValue -= 1;
  }

  writeLine(line: string) {
    for (let i = 0; i < this.indentValue; i+=1) {
      this.textParts.push(this.indentText);
    }
    this.textParts.push(line);
    this.textParts.push('\n');
  }

  getFullText() {
    return this.textParts.join('');
  }
}

// GENERATOR UTILITY FUNCTIONS

function compareName(x: {name: string}, y: {name: string}): number {
  if (x.name < y.name) {
    return -1;
  } else if (x.name > y.name) {
    return 1
  } else {
    return 0;
  }
}

function isNamespaceBase(obj: Protobuf.ReflectionObject): obj is Protobuf.NamespaceBase {
  return Array.isArray((obj as Protobuf.NamespaceBase).nestedArray);
}

function stripLeadingPeriod(name: string) {
  return name.startsWith('.') ? name.substring(1) : name;
}

function getImportPath(to: Protobuf.Type | Protobuf.Enum | Protobuf.Service): string {
  /* If the thing we are importing is defined in a message, it is generated in
   * the same file as that message. */
  if (to.parent instanceof Protobuf.Type) {
    return getImportPath(to.parent);
  }
  return stripLeadingPeriod(to.fullName).replace(/\./g, '/');
}

function getPath(to: Protobuf.Type | Protobuf.Enum | Protobuf.Service) {
  return stripLeadingPeriod(to.fullName).replace(/\./g, '/') + '.ts';
}

function getPathToRoot(from: Protobuf.NamespaceBase) {
  const depth = stripLeadingPeriod(from.fullName).split('.').length - 1;
  if (depth === 0) {
    return './';
  }
  let path = '';
  for (let i = 0; i < depth; i++) {
    path += '../';
  }
  return path;
}

function getRelativeImportPath(from: Protobuf.Type | Protobuf.Service, to: Protobuf.Type | Protobuf.Enum | Protobuf.Service) {
  return getPathToRoot(from) + getImportPath(to);
}

function getTypeInterfaceName(type: Protobuf.Type | Protobuf.Enum | Protobuf.Service) {
  return type.fullName.replace(/\./g, '_');
}

function getImportLine(dependency: Protobuf.Type | Protobuf.Enum | Protobuf.Service, from?: Protobuf.Type | Protobuf.Service) {
  const filePath = from === undefined ? './' + getImportPath(dependency) : getRelativeImportPath(from, dependency);
  const typeInterfaceName = getTypeInterfaceName(dependency);
  let importedTypes: string;
  /* If the dependency is defined within a message, it will be generated in that
   * message's file and exported using its typeInterfaceName. */
  if (dependency.parent instanceof Protobuf.Type) {
    if (dependency instanceof Protobuf.Type) {
      importedTypes = `${typeInterfaceName}, ${typeInterfaceName}__Output`;
    } else if (dependency instanceof Protobuf.Enum) {
      importedTypes = `${typeInterfaceName}`;
    } else if (dependency instanceof Protobuf.Service) {
      importedTypes = `${typeInterfaceName}Client, ${typeInterfaceName}Definition`;
    } else {
      throw new Error('Invalid object passed to getImportLine');
    }
  } else {
    if (dependency instanceof Protobuf.Type) {
      importedTypes = `${dependency.name} as ${typeInterfaceName}, ${dependency.name}__Output as ${typeInterfaceName}__Output`;
    } else if (dependency instanceof Protobuf.Enum) {
      importedTypes = `${dependency.name} as ${typeInterfaceName}`;
    } else if (dependency instanceof Protobuf.Service) {
      importedTypes = `${dependency.name}Client as ${typeInterfaceName}Client, ${dependency.name}Definition as ${typeInterfaceName}Definition`;
    } else {
      throw new Error('Invalid object passed to getImportLine');
    }
  }
  return `import type { ${importedTypes} } from '${filePath}';`
}

function getChildMessagesAndEnums(namespace: Protobuf.NamespaceBase): (Protobuf.Type | Protobuf.Enum)[] {
  const messageList: (Protobuf.Type | Protobuf.Enum)[] = [];
  for (const nested of namespace.nestedArray) {
    if (nested instanceof Protobuf.Type || nested instanceof Protobuf.Enum) {
      messageList.push(nested);
    }
    if (isNamespaceBase(nested)) {
      messageList.push(...getChildMessagesAndEnums(nested));
    }
  }
  return messageList;
}

function formatComment(formatter: TextFormatter, comment?: string | null) {
  if (!comment) {
    return;
  }
  formatter.writeLine('/**');
  for(const line of comment.split('\n')) {
    formatter.writeLine(` * ${line.replace(/\*\//g, '* /')}`);
  }
  formatter.writeLine(' */');
}

// GENERATOR FUNCTIONS

function getTypeNamePermissive(fieldType: string, resolvedType: Protobuf.Type | Protobuf.Enum | null, repeated: boolean, map: boolean): string {
  switch (fieldType) {
    case 'double':
    case 'float':
      return 'number | string';
    case 'int32':
    case 'uint32':
    case 'sint32':
    case 'fixed32':
    case 'sfixed32':
      return 'number';
    case 'int64':
    case 'uint64':
    case 'sint64':
    case 'fixed64':
    case 'sfixed64':
      return 'number | string | Long';
    case 'bool':
      return 'boolean';
    case 'string':
      return 'string';
    case 'bytes':
      return 'Buffer | Uint8Array | string';
    default:
      if (resolvedType === null) {
        throw new Error('Found field with no usable type');
      }
      const typeInterfaceName = getTypeInterfaceName(resolvedType);
      if (resolvedType instanceof Protobuf.Type) {
        if (repeated || map) {
          return typeInterfaceName;
        } else {
          return `${typeInterfaceName} | null`;
        }
      } else {
        return `${typeInterfaceName} | keyof typeof ${typeInterfaceName}`;
      }
  }
}

function getFieldTypePermissive(field: Protobuf.FieldBase): string {
  const valueType = getTypeNamePermissive(field.type, field.resolvedType, field.repeated, field.map);
  if (field instanceof Protobuf.MapField) {
    const keyType = field.keyType === 'string' ? 'string' : 'number';
    return `{[key: ${keyType}]: ${valueType}}`;
  } else {
    return valueType;
  }
}

function generatePermissiveMessageInterface(formatter: TextFormatter, messageType: Protobuf.Type, options: GeneratorOptions, nameOverride?: string) {
  if (options.includeComments) {
    formatComment(formatter, messageType.comment);
  }
  if (messageType.fullName === '.google.protobuf.Any') {
    /* This describes the behavior of the Protobuf.js Any wrapper fromObject
     * replacement function */
    formatter.writeLine('export type Any = AnyExtension | {');
    formatter.writeLine('  type_url: string;');
    formatter.writeLine('  value: Buffer | Uint8Array | string;');
    formatter.writeLine('}');
    return;
  }
  formatter.writeLine(`export interface ${nameOverride ?? messageType.name} {`);
  formatter.indent();
  for (const field of messageType.fieldsArray) {
    const repeatedString = field.repeated ? '[]' : '';
    const type: string = getFieldTypePermissive(field);
    if (options.includeComments) {
      formatComment(formatter, field.comment);
    }
    formatter.writeLine(`'${field.name}'?: (${type})${repeatedString};`);
  }
  for (const oneof of messageType.oneofsArray) {
    const typeString = oneof.fieldsArray.map(field => `"${field.name}"`).join('|');
    if (options.includeComments) {
      formatComment(formatter, oneof.comment);
    }
    formatter.writeLine(`'${oneof.name}'?: ${typeString};`);
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function getTypeNameRestricted(fieldType: string, resolvedType: Protobuf.Type | Protobuf.Enum | null, repeated: boolean, map: boolean, options: GeneratorOptions): string {
  switch (fieldType) {
    case 'double':
    case 'float':
      if (options.json) {
        return 'number | string';
      } else {
        return 'number';
      }
    case 'int32':
    case 'uint32':
    case 'sint32':
    case 'fixed32':
    case 'sfixed32':
      return 'number';
    case 'int64':
    case 'uint64':
    case 'sint64':
    case 'fixed64':
    case 'sfixed64':
      if (options.longs === Number) {
        return 'number';
      } else if (options.longs === String) {
        return 'string';
      } else {
        return 'Long';
      }
    case 'bool':
      return 'boolean';
    case 'string':
      return 'string';
    case 'bytes':
      if (options.bytes === Array) {
        return 'Uint8Array';
      } else if (options.bytes === String) {
        return 'string';
      } else {
        return 'Buffer';
      }
    default:
      if (resolvedType === null) {
        throw new Error('Found field with no usable type');
      }
      const typeInterfaceName = getTypeInterfaceName(resolvedType);
      if (resolvedType instanceof Protobuf.Type) {
        /* null is only used to represent absent message values if the defaults
         * option is set, and only for non-repeated, non-map fields. */
        if (options.defaults && !repeated && !map) {
          return `${typeInterfaceName}__Output | null`;
        } else {
          return `${typeInterfaceName}__Output`;
        }
      } else {
        if (options.enums == String) {
          return `keyof typeof ${typeInterfaceName}`;
        } else {
          return typeInterfaceName;
        }
      }
  }
}

function getFieldTypeRestricted(field: Protobuf.FieldBase, options: GeneratorOptions): string {
  const valueType = getTypeNameRestricted(field.type, field.resolvedType, field.repeated, field.map, options);
  if (field instanceof Protobuf.MapField) {
    const keyType = field.keyType === 'string' ? 'string' : 'number';
    return `{[key: ${keyType}]: ${valueType}}`;
  } else {
    return valueType;
  }
}

function generateRestrictedMessageInterface(formatter: TextFormatter, messageType: Protobuf.Type, options: GeneratorOptions, nameOverride?: string) {
  if (options.includeComments) {
    formatComment(formatter, messageType.comment);
  }
  if (messageType.fullName === '.google.protobuf.Any' && options.json) {
    /* This describes the behavior of the Protobuf.js Any wrapper toObject
     * replacement function */
    let optionalString = options.defaults ? '' : '?';
    formatter.writeLine('export type Any__Output = AnyExtension | {');
    formatter.writeLine(`  type_url${optionalString}: string;`);
    formatter.writeLine(`  value${optionalString}: ${getTypeNameRestricted('bytes', null, false, false, options)};`);
    formatter.writeLine('}');
    return;
  }
  formatter.writeLine(`export interface ${nameOverride ?? messageType.name}__Output {`);
  formatter.indent();
  for (const field of messageType.fieldsArray) {
    let fieldGuaranteed: boolean;
    if (field.partOf) {
      // The field is not guaranteed populated if it is part of a oneof
      fieldGuaranteed = false;
    } else if (field.repeated) {
      fieldGuaranteed = (options.defaults || options.arrays) ?? false;
    } else if (field.map) {
      fieldGuaranteed = (options.defaults || options.objects) ?? false;
    } else {
      fieldGuaranteed = options.defaults ?? false;
    }
    const optionalString = fieldGuaranteed ? '' : '?';
    const repeatedString = field.repeated ? '[]' : '';
    const type = getFieldTypeRestricted(field, options);
    if (options.includeComments) {
      formatComment(formatter, field.comment);
    }
    formatter.writeLine(`'${field.name}'${optionalString}: (${type})${repeatedString};`);
  }
  if (options.oneofs) {
    for (const oneof of messageType.oneofsArray) {
      const typeString = oneof.fieldsArray.map(field => `"${field.name}"`).join('|');
      if (options.includeComments) {
        formatComment(formatter, oneof.comment);
      }
      formatter.writeLine(`'${oneof.name}': ${typeString};`);
    }
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateMessageInterfaces(formatter: TextFormatter, messageType: Protobuf.Type, options: GeneratorOptions) {
  let usesLong: boolean = false;
  let seenDeps: Set<string> = new Set<string>();
  const childTypes = getChildMessagesAndEnums(messageType);
  formatter.writeLine(`// Original file: ${messageType.filename}`);
  formatter.writeLine('');
  messageType.fieldsArray.sort((fieldA, fieldB) => fieldA.id - fieldB.id);
  for (const field of messageType.fieldsArray) {
    if (field.resolvedType && childTypes.indexOf(field.resolvedType) < 0) {
      const dependency = field.resolvedType;
      if (seenDeps.has(dependency.fullName)) {
        continue;
      }
      seenDeps.add(dependency.fullName);
      formatter.writeLine(getImportLine(dependency, messageType));
    }
    if (field.type.indexOf('64') >= 0) {
      usesLong = true;
    }
  }
  for (const childType of childTypes) {
    if (childType instanceof Protobuf.Type) {
      for (const field of childType.fieldsArray) {
        if (field.resolvedType && childTypes.indexOf(field.resolvedType) < 0) {
          const dependency = field.resolvedType;
          if (seenDeps.has(dependency.fullName)) {
            continue;
          }
          seenDeps.add(dependency.fullName);
          formatter.writeLine(getImportLine(dependency, messageType));
        }
        if (field.type.indexOf('64') >= 0) {
          usesLong = true;
        }
      }
    }
  }
  if (usesLong) {
    formatter.writeLine("import type { Long } from '@grpc/proto-loader';");
  }
  if (messageType.fullName === '.google.protobuf.Any') {
    formatter.writeLine("import type { AnyExtension } from '@grpc/proto-loader';")
  }
  formatter.writeLine('');
  for (const childType of childTypes.sort(compareName)) {
    const nameOverride = getTypeInterfaceName(childType);
    if (childType instanceof Protobuf.Type) {
      generatePermissiveMessageInterface(formatter, childType, options, nameOverride);
      formatter.writeLine('');
      generateRestrictedMessageInterface(formatter, childType, options, nameOverride);
    } else {
      generateEnumInterface(formatter, childType, options, nameOverride);
    }
    formatter.writeLine('');
  }

  generatePermissiveMessageInterface(formatter, messageType, options);
  formatter.writeLine('');
  generateRestrictedMessageInterface(formatter, messageType, options);
}

function generateEnumInterface(formatter: TextFormatter, enumType: Protobuf.Enum, options: GeneratorOptions, nameOverride?: string) {
  formatter.writeLine(`// Original file: ${enumType.filename}`);
  formatter.writeLine('');
  if (options.includeComments) {
    formatComment(formatter, enumType.comment);
  }
  formatter.writeLine(`export enum ${nameOverride ?? enumType.name} {`);
  formatter.indent();
  for (const key of Object.keys(enumType.values)) {
    if (options.includeComments) {
      formatComment(formatter, enumType.comments[key]);
    }
    formatter.writeLine(`${key} = ${enumType.values[key]},`);
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateServiceClientInterface(formatter: TextFormatter, serviceType: Protobuf.Service, options: GeneratorOptions) {
  if (options.includeComments) {
    formatComment(formatter, serviceType.comment);
  }
  formatter.writeLine(`export interface ${serviceType.name}Client extends grpc.Client {`);
  formatter.indent();
  for (const methodName of Object.keys(serviceType.methods).sort()) {
    const method = serviceType.methods[methodName];
    for (const name of [methodName, camelCase(methodName)]) {
      if (options.includeComments) {
        formatComment(formatter, method.comment);
      }
      const requestType = getTypeInterfaceName(method.resolvedRequestType!);
      const responseType = getTypeInterfaceName(method.resolvedResponseType!) + '__Output';
      const callbackType = `(error?: grpc.ServiceError, result?: ${responseType}) => void`;
      if (method.requestStream) {
        if (method.responseStream) {
          // Bidi streaming
          const callType = `grpc.ClientDuplexStream<${requestType}, ${responseType}>`;
          formatter.writeLine(`${name}(metadata: grpc.Metadata, options?: grpc.CallOptions): ${callType};`);
          formatter.writeLine(`${name}(options?: grpc.CallOptions): ${callType};`);
        } else {
          // Client streaming
          const callType = `grpc.ClientWritableStream<${requestType}>`;
          formatter.writeLine(`${name}(metadata: grpc.Metadata, options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(metadata: grpc.Metadata, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(callback: ${callbackType}): ${callType};`);
        }
      } else {
        if (method.responseStream) {
          // Server streaming
          const callType = `grpc.ClientReadableStream<${responseType}>`;
          formatter.writeLine(`${name}(argument: ${requestType}, metadata: grpc.Metadata, options?: grpc.CallOptions): ${callType};`);
          formatter.writeLine(`${name}(argument: ${requestType}, options?: grpc.CallOptions): ${callType};`);
        } else {
          // Unary
          const callType = 'grpc.ClientUnaryCall';
          formatter.writeLine(`${name}(argument: ${requestType}, metadata: grpc.Metadata, options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(argument: ${requestType}, metadata: grpc.Metadata, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(argument: ${requestType}, options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(argument: ${requestType}, callback: ${callbackType}): ${callType};`);
        }
      }
    }
    formatter.writeLine('');
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateServiceHandlerInterface(formatter: TextFormatter, serviceType: Protobuf.Service, options: GeneratorOptions) {
  if (options.includeComments) {
    formatComment(formatter, serviceType.comment);
  }
  formatter.writeLine(`export interface ${serviceType.name}Handlers extends grpc.UntypedServiceImplementation {`);
  formatter.indent();
  for (const methodName of Object.keys(serviceType.methods).sort()) {
    const method = serviceType.methods[methodName];
    if (options.includeComments) {
      formatComment(formatter, method.comment);
    }
    const requestType = getTypeInterfaceName(method.resolvedRequestType!) + '__Output';
    const responseType = getTypeInterfaceName(method.resolvedResponseType!);
    if (method.requestStream) {
      if (method.responseStream) {
        // Bidi streaming
        formatter.writeLine(`${methodName}: grpc.handleBidiStreamingCall<${requestType}, ${responseType}>;`);
      } else {
        // Client streaming
        formatter.writeLine(`${methodName}: grpc.handleClientStreamingCall<${requestType}, ${responseType}>;`);
      }
    } else {
      if (method.responseStream) {
        // Server streaming
        formatter.writeLine(`${methodName}: grpc.handleServerStreamingCall<${requestType}, ${responseType}>;`);
      } else {
        // Unary
        formatter.writeLine(`${methodName}: grpc.handleUnaryCall<${requestType}, ${responseType}>;`);
      }
    }
    formatter.writeLine('');
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateServiceDefinitionInterface(formatter: TextFormatter, serviceType: Protobuf.Service) {
  formatter.writeLine(`export interface ${serviceType.name}Definition {`);
  formatter.indent();
  for (const methodName of Object.keys(serviceType.methods).sort()) {
    const method = serviceType.methods[methodName];
    const requestType = getTypeInterfaceName(method.resolvedRequestType!);
    const responseType = getTypeInterfaceName(method.resolvedResponseType!);
    formatter.writeLine(`${methodName}: MethodDefinition<${requestType}, ${responseType}, ${requestType}__Output, ${responseType}__Output>`);
  }
  formatter.unindent();
  formatter.writeLine('}')
}

function generateServiceInterfaces(formatter: TextFormatter, serviceType: Protobuf.Service, options: GeneratorOptions) {
  formatter.writeLine(`// Original file: ${serviceType.filename}`);
  formatter.writeLine('');
  const grpcImportPath = options.grpcLib.startsWith('.') ? getPathToRoot(serviceType) + options.grpcLib : options.grpcLib;
  formatter.writeLine(`import type * as grpc from '${grpcImportPath}'`);
  formatter.writeLine(`import type { MethodDefinition } from '@grpc/proto-loader'`)
  const dependencies: Set<Protobuf.Type> = new Set<Protobuf.Type>();
  for (const method of serviceType.methodsArray) {
    dependencies.add(method.resolvedRequestType!);
    dependencies.add(method.resolvedResponseType!);
  }
  for (const dep of Array.from(dependencies.values()).sort(compareName)) {
    formatter.writeLine(getImportLine(dep, serviceType));
  }
  formatter.writeLine('');

  generateServiceClientInterface(formatter, serviceType, options);
  formatter.writeLine('');

  generateServiceHandlerInterface(formatter, serviceType, options);
  formatter.writeLine('');

  generateServiceDefinitionInterface(formatter, serviceType);
}

function generateServiceImports(formatter: TextFormatter, namespace: Protobuf.NamespaceBase, options: GeneratorOptions) {
  for (const nested of namespace.nestedArray.sort(compareName)) {
    if (nested instanceof Protobuf.Service) {
      formatter.writeLine(getImportLine(nested));
    } else if (isNamespaceBase(nested) && !(nested instanceof Protobuf.Type) && !(nested instanceof Protobuf.Enum)) {
      generateServiceImports(formatter, nested, options);
    }
  }
}

function generateSingleLoadedDefinitionType(formatter: TextFormatter, nested: Protobuf.ReflectionObject, options: GeneratorOptions) {
  if (nested instanceof Protobuf.Service) {
    if (options.includeComments) {
      formatComment(formatter, nested.comment);
    }
    const typeInterfaceName = getTypeInterfaceName(nested);
    formatter.writeLine(`${nested.name}: SubtypeConstructor<typeof grpc.Client, ${typeInterfaceName}Client> & { service: ${typeInterfaceName}Definition }`);
  } else if (nested instanceof Protobuf.Enum) {
    formatter.writeLine(`${nested.name}: EnumTypeDefinition`);
  } else if (nested instanceof Protobuf.Type) {
    formatter.writeLine(`${nested.name}: MessageTypeDefinition`);
  } else if (isNamespaceBase(nested)) {
    generateLoadedDefinitionTypes(formatter, nested, options);
  }
}

function generateLoadedDefinitionTypes(formatter: TextFormatter, namespace: Protobuf.NamespaceBase, options: GeneratorOptions) {
  formatter.writeLine(`${namespace.name}: {`);
  formatter.indent();
  for (const nested of namespace.nestedArray.sort(compareName)) {
    generateSingleLoadedDefinitionType(formatter, nested, options);
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateRootFile(formatter: TextFormatter, root: Protobuf.Root, options: GeneratorOptions) {
  formatter.writeLine(`import type * as grpc from '${options.grpcLib}';`);
  formatter.writeLine("import type { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';");
  formatter.writeLine('');

  generateServiceImports(formatter, root, options);
  formatter.writeLine('');

  formatter.writeLine('type SubtypeConstructor<Constructor extends new (...args: any) => any, Subtype> = {');
  formatter.writeLine('  new(...args: ConstructorParameters<Constructor>): Subtype;');
  formatter.writeLine('};');
  formatter.writeLine('');

  formatter.writeLine('export interface ProtoGrpcType {');
  formatter.indent();
  for (const nested of root.nestedArray) {
    generateSingleLoadedDefinitionType(formatter, nested, options);
  }
  formatter.unindent();
  formatter.writeLine('}');
  formatter.writeLine('');
}

async function writeFile(filename: string, contents: string): Promise<void> {
  await fs.promises.mkdir(path.dirname(filename), {recursive: true});
  return fs.promises.writeFile(filename, contents);
}

function generateFilesForNamespace(namespace: Protobuf.NamespaceBase, options: GeneratorOptions): Promise<void>[] {
  const filePromises : Promise<void>[] = [];
  for (const nested of namespace.nestedArray) {
    const fileFormatter = new TextFormatter();
    if (nested instanceof Protobuf.Type) {
      generateMessageInterfaces(fileFormatter, nested, options);
      if (options.verbose) {
        console.log(`Writing ${options.outDir}/${getPath(nested)} from file ${nested.filename}`);
      }
      filePromises.push(writeFile(`${options.outDir}/${getPath(nested)}`, fileFormatter.getFullText()));
    } else if (nested instanceof Protobuf.Enum) {
      generateEnumInterface(fileFormatter, nested, options);
      if (options.verbose) {
        console.log(`Writing ${options.outDir}/${getPath(nested)} from file ${nested.filename}`);
      }
      filePromises.push(writeFile(`${options.outDir}/${getPath(nested)}`, fileFormatter.getFullText()));
    } else if (nested instanceof Protobuf.Service) {
      generateServiceInterfaces(fileFormatter, nested, options);
      if (options.verbose) {
        console.log(`Writing ${options.outDir}/${getPath(nested)} from file ${nested.filename}`);
      }
      filePromises.push(writeFile(`${options.outDir}/${getPath(nested)}`, fileFormatter.getFullText()));
    } else if (isNamespaceBase(nested)) {
      filePromises.push(...generateFilesForNamespace(nested, options));
    }
  }
  return filePromises;
}

function writeFilesForRoot(root: Protobuf.Root, masterFileName: string, options: GeneratorOptions): Promise<void>[] {
  const filePromises: Promise<void>[] = [];

  const masterFileFormatter = new TextFormatter();
  generateRootFile(masterFileFormatter, root, options);
  if (options.verbose) {
    console.log(`Writing ${options.outDir}/${masterFileName}`);
  }
  filePromises.push(writeFile(`${options.outDir}/${masterFileName}`, masterFileFormatter.getFullText()));

  filePromises.push(...generateFilesForNamespace(root, options));

  return filePromises;
}

async function writeAllFiles(protoFiles: string[], options: GeneratorOptions) {
  await fs.promises.mkdir(options.outDir, {recursive: true});
  const basenameMap = new Map<string, string[]>();
  for (const filename of protoFiles) {
    const basename = path.basename(filename).replace(/\.proto$/, '.ts');
    if (basenameMap.has(basename)) {
      basenameMap.get(basename)!.push(filename);
    } else {
      basenameMap.set(basename, [filename]);
    }
  }
  for (const [basename, filenames] of basenameMap.entries()) {
    const loadedRoot = await loadProtosWithOptions(filenames, options);
    writeFilesForRoot(loadedRoot, basename, options);
  }
}

function runScript() {
  const argv = yargs
    .parserConfiguration({
      'parse-positional-numbers': false
    })
    .string(['includeDirs', 'grpcLib'])
    .normalize(['includeDirs', 'outDir'])
    .array('includeDirs')
    .boolean(['keepCase', 'defaults', 'arrays', 'objects', 'oneofs', 'json', 'verbose', 'includeComments'])
    .string(['longs', 'enums', 'bytes'])
    .default('keepCase', false)
    .default('defaults', false)
    .default('arrays', false)
    .default('objects', false)
    .default('oneofs', false)
    .default('json', false)
    .default('includeComments', false)
    .default('longs', 'Long')
    .default('enums', 'number')
    .default('bytes', 'Buffer')
    .coerce('longs', value => {
      switch (value) {
        case 'String': return String;
        case 'Number': return Number;
        default: return undefined;
      }
    }).coerce('enums', value => {
      if (value === 'String') {
        return String;
      } else {
        return undefined;
      }
    }).coerce('bytes', value => {
      switch (value) {
        case 'Array': return Array;
        case 'String': return String;
        default: return undefined;
      }
    }).alias({
      includeDirs: 'I',
      outDir: 'O',
      verbose: 'v'
    }).describe({
      keepCase: 'Preserve the case of field names',
      longs: 'The type that should be used to output 64 bit integer values. Can be String, Number',
      enums: 'The type that should be used to output enum fields. Can be String',
      bytes: 'The type that should be used to output bytes fields. Can be String, Array',
      defaults: 'Output default values for omitted fields',
      arrays: 'Output default values for omitted repeated fields even if --defaults is not set',
      objects: 'Output default values for omitted message fields even if --defaults is not set',
      oneofs: 'Output virtual oneof fields set to the present field\'s name',
      json: 'Represent Infinity and NaN as strings in float fields. Also decode google.protobuf.Any automatically',
      includeComments: 'Generate doc comments from comments in the original files',
      includeDirs: 'Directories to search for included files',
      outDir: 'Directory in which to output files',
      grpcLib: 'The gRPC implementation library that these types will be used with'
    }).demandOption(['outDir', 'grpcLib'])
    .demand(1)
    .usage('$0 [options] filenames...')
    .epilogue('WARNING: This tool is in alpha. The CLI and generated code are subject to change')
    .argv;
  if (argv.verbose) {
    console.log('Parsed arguments:', argv);
  }
  addCommonProtos();
  writeAllFiles(argv._ as string[], {...argv, alternateCommentMode: true}).then(() => {
    if (argv.verbose) {
      console.log('Success');
    }
  }, (error) => {
    console.error(error)
    process.exit(1);
  });
}

if (require.main === module) {
  runScript();
}
