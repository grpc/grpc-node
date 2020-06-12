#!/usr/bin/env node
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

import * as mkdirp from 'mkdirp';
import * as Protobuf from 'protobufjs';
import * as yargs from 'yargs';

import camelCase = require('lodash.camelcase');

type GeneratorOptions = Protobuf.IParseOptions & Protobuf.IConversionOptions & {
  includeDirs?: string[];
  grpcLib: string;
  outDir: string;
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

function isNamespaceBase(obj: Protobuf.ReflectionObject): obj is Protobuf.NamespaceBase {
  return Array.isArray((obj as Protobuf.NamespaceBase).nestedArray);
}

function stripLeadingPeriod(name: string) {
  return name.startsWith('.') ? name.substring(1) : name;
}

function getImportPath(to: Protobuf.Type | Protobuf.Enum) {
  return stripLeadingPeriod(to.fullName).replace(/\./g, '/');
}

function getPath(to: Protobuf.Type | Protobuf.Enum) {
  return stripLeadingPeriod(to.fullName).replace(/\./g, '/') + '.d.ts';
}

function getRelativeImportPath(from: Protobuf.Type, to: Protobuf.Type | Protobuf.Enum) {
  const depth = stripLeadingPeriod(from.fullName).split('.').length - 1;
  let path = '';
  for (let i = 0; i < depth; i++) {
    path += '../';
  }
  return path + getImportPath(to);
}

function getTypeInterfaceName(type: Protobuf.Type | Protobuf.Enum) {
  return type.fullName.replace(/\./g, '_');
}

function getImportLine(dependency: Protobuf.Type | Protobuf.Enum, from?: Protobuf.Type) {
  const filePath = from === undefined ? './' + getImportPath(dependency) : getRelativeImportPath(from, dependency);
  const typeInterfaceName = getTypeInterfaceName(dependency);
  const importedTypes = dependency instanceof Protobuf.Type ? `${dependency.name} as ${typeInterfaceName}, ${dependency.name}__Output as ${typeInterfaceName}__Output` : `${dependency.name} as ${typeInterfaceName}`;
  return `import { ${importedTypes} } from '${filePath}';`
}

function generatePermissiveMessageInterface(formatter: TextFormatter, messageType: Protobuf.Type) {
  formatter.writeLine(`export interface ${messageType.name} {`);
  formatter.indent();
  for (const field of messageType.fieldsArray) {
    const repeatedString = field.repeated ? '[]' : '';
    let type: string;
    switch (field.type) {
      case 'double':
      case 'float':
      case 'int32':
      case 'uint32':
      case 'sint32':
      case 'fixed32':
      case 'sfixed32':
        type = 'number';
        break;
      case 'int64':
      case 'uint64':
      case 'sint64':
      case 'fixed64':
      case 'sfixed64':
        type = 'number | string | Long';
        break;
      case 'bool':
        type = 'boolean';
        break;
      case 'string':
        type = 'string';
        break;
      case 'bytes':
        type = 'Buffer | UInt8Array | String';
        break;
      default:
        if (field.resolvedType === null) {
          throw new Error('Found field with no usable type');
        }
        const typeInterfaceName = getTypeInterfaceName(field.resolvedType);
        if (field.resolvedType instanceof Protobuf.Type) {
          type = typeInterfaceName;
        } else {
          type = `${typeInterfaceName} | keyof typeof ${typeInterfaceName}`;
        }
    }
    formatter.writeLine(`${field.name}?: (${type})${repeatedString};`);
  }
  for (const oneof of messageType.oneofsArray) {
    const typeString = oneof.fieldsArray.map(field => `"${field.name}"`).join('|');
    formatter.writeLine(`${oneof.name}?: ${typeString};`);
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateRestrictedMessageInterface(formatter: TextFormatter, messageType: Protobuf.Type, options: Protobuf.IConversionOptions) {
  formatter.writeLine(`export interface ${messageType.name}__Output {`);
  formatter.indent();
  for (const field of messageType.fieldsArray) {
    const repeatedString = field.repeated ? '[]' : '';
    let fieldGuaranteed = options.defaults || (field.repeated && options.arrays);
    let type: string;
    switch (field.type) {
      case 'double':
      case 'float':
      case 'int32':
      case 'uint32':
      case 'sint32':
      case 'fixed32':
      case 'sfixed32':
        type = 'number';
        break;
      case 'int64':
      case 'uint64':
      case 'sint64':
      case 'fixed64':
      case 'sfixed64':
        if (options.longs === Number) {
          type = 'number';
        } else if (options.longs === String) {
          type = 'string';
        } else {
          type = 'Long';
        }
        break;
      case 'bool':
        type = 'boolean';
        break;
      case 'string':
        type = 'string';
        break;
      case 'bytes':
        if (options.bytes === Array) {
          type = 'Uint8Array';
        } else if (options.bytes === String) {
          type = 'String';
        } else {
          type = 'Buffer';
        }
        break;
      default:
        if (field.resolvedType === null) {
          throw new Error('Found field with no usable type');
        }
        const typeInterfaceName = getTypeInterfaceName(field.resolvedType);
        if (field.resolvedType instanceof Protobuf.Type) {
          fieldGuaranteed = fieldGuaranteed || options.objects;
          type = typeInterfaceName + '__Output';
        } else {
          if (options.enums == String) {
            type = `keyof typeof ${typeInterfaceName}`;
          } else {
            type = typeInterfaceName;
          }
        }
    }
    if (field.partOf) {
      fieldGuaranteed = false;
    }
    const optionalString = fieldGuaranteed ? '' : '?';
    formatter.writeLine(`${field.name}${optionalString}: (${type})${repeatedString};`);
  }
  if (options.oneofs) {
    for (const oneof of messageType.oneofsArray) {
      const typeString = oneof.fieldsArray.map(field => `"${field.name}"`).join('|');
      formatter.writeLine(`${oneof.name}: ${typeString};`);
    }
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateMessageInterfaces(formatter: TextFormatter, messageType: Protobuf.Type, options: Protobuf.IConversionOptions) {
  let usesLong: boolean = false;
  let seenDeps: Set<string> = new Set<string>();
  for (const field of messageType.fieldsArray) {
    if (field.resolvedType) {
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
  if (usesLong) {
    formatter.writeLine("import { Long } from '@grpc/proto-loader';");
  }
  formatter.writeLine('');

  generatePermissiveMessageInterface(formatter, messageType);
  formatter.writeLine('');
  generateRestrictedMessageInterface(formatter, messageType, options);
}

function generateEnumInterface(formatter: TextFormatter, enumType: Protobuf.Enum) {
  formatter.writeLine(`export enum ${enumType.name} {`);
  formatter.indent();
  for (const key of Object.keys(enumType.values)) {
    formatter.writeLine(`${key} = ${enumType.values[key]},`);
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateMessageAndEnumImports(formatter: TextFormatter, namespace: Protobuf.NamespaceBase) {
  for (const nested of namespace.nestedArray) {
    if (nested instanceof Protobuf.Type || nested instanceof Protobuf.Enum) {
      formatter.writeLine(getImportLine(nested));
    }
    if (isNamespaceBase(nested)) {
      generateMessageAndEnumImports(formatter, nested);
    }
  }
}

function generateMessageAndEnumExports(formatter: TextFormatter, namespace: Protobuf.NamespaceBase, nameOverride?: string) {
  formatter.writeLine(`export namespace ${nameOverride ?? namespace.name} {`);
  formatter.indent();
  for (const nested of namespace.nestedArray) {
    if (nested instanceof Protobuf.Enum || nested instanceof Protobuf.Type) {
      formatter.writeLine(`export type ${nested.name} = ${getTypeInterfaceName(nested)};`);
      if (nested instanceof Protobuf.Type) {
        formatter.writeLine(`export type ${nested.name}__Output = ${getTypeInterfaceName(nested)}__Output;`);
      }
    } else if (isNamespaceBase(nested)) {
      generateMessageAndEnumExports(formatter, nested);
    }
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateServiceClientInterface(formatter: TextFormatter, serviceType: Protobuf.Service) {
  formatter.writeLine(`interface ${serviceType.name}Client extends grpc.Client {`);
  formatter.indent();
  for (const methodName of Object.keys(serviceType.methods)) {
    const method = serviceType.methods[methodName];
    for (const name of [methodName, camelCase(methodName)]) {
      const requestType = 'messages.' + stripLeadingPeriod(method.resolvedRequestType!.fullName);
      const responseType = 'messages.' + stripLeadingPeriod(method.resolvedResponseType!.fullName) + '__Output';
      const callbackType = `(error?: grpc.ServiceError, result?: ${responseType}) => void`;
      if (method.requestStream) {
        if (method.responseStream) {
          // Bidi streaming
          const callType = `grpc.ClientDuplexStream<${requestType}, ${responseType}>`;
          formatter.writeLine(`${name}(metadata: grpc.Metadata, options?: grpc.CallOptions): ${callType};`);
          formatter.writeLine(`${name}(options?: grpc.CallOptions): ${callType};`);
        } else {
          // Client streaming
          const callType = `grpc.ClientWritableStream<${responseType}>`;
          formatter.writeLine(`${name}(metadata: grpc.Metadata, options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(metadata: grpc.Metadata, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(metadata: grpc.Metadata, options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(metadata: grpc.Metadata, callback: ${callbackType}): ${callType};`);
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
          formatter.writeLine(`${name}(argument: ${requestType}, metadata: grpc.Metadata, options: grpc.CallOptions, callback: ${callbackType}): ${callType};`);
          formatter.writeLine(`${name}(argument: ${requestType}, metadata: grpc.Metadata, callback: ${callbackType}): ${callType};`);
        }
      }
    }
    formatter.writeLine('');
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateAllServiceClientInterfaces(formatter: TextFormatter, namespace: Protobuf.NamespaceBase) {
  for (const nested of namespace.nestedArray) {
    if (nested instanceof Protobuf.Service) {
      generateServiceClientInterface(formatter, nested);
    } else if (isNamespaceBase(nested)) {
      generateAllServiceClientInterfaces(formatter, nested);
    }
  }
}

function generateSingleLoadedDefinitionType(formatter: TextFormatter, nested: Protobuf.ReflectionObject) {
  if (nested instanceof Protobuf.Service) {
    formatter.writeLine(`${nested.name}: SubtypeConstructor<typeof grpc.Client, ${nested.name}Client> & { service: ServiceDefinition }`)
  } else if (nested instanceof Protobuf.Enum) {
    formatter.writeLine(`${nested.name}: EnumTypeDefinition`);
  } else if (nested instanceof Protobuf.Type) {
    formatter.writeLine(`${nested.name}: MessageTypeDefinition`);
  } else if (isNamespaceBase(nested)) {
    generateLoadedDefinitionTypes(formatter, nested);
  }
}

function generateLoadedDefinitionTypes(formatter: TextFormatter, namespace: Protobuf.NamespaceBase) {
  formatter.writeLine(`${namespace.name}: {`);
  formatter.indent();
  for (const nested of namespace.nestedArray) {
    generateSingleLoadedDefinitionType(formatter, nested);
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateServiceHandlerInterface(formatter: TextFormatter, serviceType: Protobuf.Service) {
  formatter.writeLine(`export interface ${serviceType.name} {`);
  formatter.indent();
  for (const methodName of Object.keys(serviceType.methods)) {
    const method = serviceType.methods[methodName];
    const requestType = 'messages.' + stripLeadingPeriod(method.resolvedRequestType!.fullName) + '__Output';
    const responseType = 'messages.' + stripLeadingPeriod(method.resolvedResponseType!.fullName);
    if (method.requestStream) {
      if (method.responseStream) {
        // Bidi streaming
        formatter.writeLine(`${methodName}(call: grpc.ServerDuplexStream<${requestType}, ${responseType}>): void;`);
      } else {
        // Client streaming
        formatter.writeLine(`${methodName}(call: grpc.ServerReadableStream<${requestType}>, callback: grpc.SendUnaryData<${responseType}>): void;`);
      }
    } else {
      if (method.responseStream) {
        // Server streaming
        formatter.writeLine(`${methodName}(call: grpc.ServerWriteableStream<${requestType}, ${responseType}>): void;`);
      } else {
        // Unary
        formatter.writeLine(`${methodName}(call: grpc.ServerUnaryCall<${requestType}>, callback: grpc.SendUnaryData<${responseType}>): void;`);
      }
    }
    formatter.writeLine('');
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateAllServiceHandlerInterfaces(formatter: TextFormatter, namespace: Protobuf.NamespaceBase, nameOverride?: string) {
  formatter.writeLine(`export namespace ${nameOverride ?? namespace.name} {`);
  formatter.indent();
  for (const nested of namespace.nestedArray) {
    if (nested instanceof Protobuf.Service) {
      generateServiceHandlerInterface(formatter, nested);
    } else if (isNamespaceBase(nested)) {
      generateAllServiceHandlerInterfaces(formatter, nested);
    }
  }
  formatter.unindent();
  formatter.writeLine('}');
}

function generateMasterFile(formatter: TextFormatter, root: Protobuf.Root, options: GeneratorOptions) {
  formatter.writeLine(`import * as grpc from '${options.grpcLib}';`);
  formatter.writeLine("import { ServiceDefinition, EnumTypeDefinition, MessageTypeDefinition } from '@grpc/proto-loader';");
  formatter.writeLine('');

  generateMessageAndEnumImports(formatter, root);
  formatter.writeLine('');

  generateMessageAndEnumExports(formatter, root, 'messages');
  formatter.writeLine('');

  generateAllServiceClientInterfaces(formatter, root);
  formatter.writeLine('');

  formatter.writeLine('type ConstructorArguments<Constructor> = Constructor extends new (...args: infer Args) => any ? Args: never;');
  formatter.writeLine('type SubtypeConstructor<Constructor, Subtype> = {');
  formatter.writeLine('  new(args: ConstructorArguments<Constructor>): Subtype;');
  formatter.writeLine('}');
  formatter.writeLine('');

  formatter.writeLine('export interface ProtoGrpcType {');
  formatter.indent();
  for (const nested of root.nestedArray) {
    generateSingleLoadedDefinitionType(formatter, nested);
  }
  formatter.unindent();
  formatter.writeLine('}');
  formatter.writeLine('');

  generateAllServiceHandlerInterfaces(formatter, root, 'ServiceHandlers');
}

function writeFile(filename: string, contents: string): Promise<void> {
  return mkdirp(path.dirname(filename)).then(
    () => fs.promises.writeFile(filename, contents)
  );
}

function generateFilesForNamespace(namespace: Protobuf.NamespaceBase, options: GeneratorOptions): Promise<void>[] {
  const filePromises : Promise<void>[] = [];
  for (const nested of namespace.nestedArray) {
    const fileFormatter = new TextFormatter();
    if (nested instanceof Protobuf.Type) {
      generateMessageInterfaces(fileFormatter, nested, options);
      console.log(`Writing ${options.outDir}/${getPath(nested)}`);
      filePromises.push(writeFile(`${options.outDir}/${getPath(nested)}`, fileFormatter.getFullText()));
    } else if (nested instanceof Protobuf.Enum) {
      generateEnumInterface(fileFormatter, nested);
      console.log(`Writing ${options.outDir}/${getPath(nested)}`);
      filePromises.push(writeFile(`${options.outDir}/${getPath(nested)}`, fileFormatter.getFullText()));
    }
    if (isNamespaceBase(nested)) {
      filePromises.push(...generateFilesForNamespace(nested, options));
    }
  }
  return filePromises;
}

function writeFilesForRoot(root: Protobuf.Root, masterFileName: string, options: GeneratorOptions): Promise<void>[] {
  const filePromises: Promise<void>[] = [];

  const masterFileFormatter = new TextFormatter();
  generateMasterFile(masterFileFormatter, root, options);
  console.log(`Writing ${options.outDir}/${masterFileName}`);
  filePromises.push(writeFile(`${options.outDir}/${masterFileName}`, masterFileFormatter.getFullText()));

  filePromises.push(...generateFilesForNamespace(root, options));

  return filePromises;
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
    process.emitWarning(`${target} not found in any of the include paths ${includePaths}`);
    return originalResolvePath(origin, target);
  };
}

async function writeAllFiles(protoFiles: string[], options: GeneratorOptions) {
  await mkdirp(options.outDir);
  for (const filename of protoFiles) {
    console.log(`Processing ${filename}`);
    const root: Protobuf.Root = new Protobuf.Root();
    options = options || {};
    if (!!options.includeDirs) {
      if (!Array.isArray(options.includeDirs)) {
        throw new Error('The includeDirs option must be an array');
      }
      addIncludePathResolver(root, options.includeDirs as string[]);
    }
    const loadedRoot = await root.load(filename, options);
    root.resolveAll();
    writeFilesForRoot(loadedRoot, path.basename(filename).replace('.proto', '.d.ts'), options);
  }
}

function runScript() {
  const argv = yargs
    .string(['includeDirs', 'grpcLib'])
    .normalize(['includeDirs', 'outDir'])
    .array('includeDirs')
    .boolean(['keepCase', 'defaults', 'arrays', 'objects', 'oneofs'])
//    .choices('longs', ['String', 'Number'])
//    .choices('enums', ['String'])
//    .choices('bytes', ['Array', 'String'])
    .string(['longs', 'enums', 'bytes'])
    .middleware(argv => {
      if (argv.longs) {
        switch (argv.longs) {
          case 'String': argv.longsArg = String;
        }
      }
    })
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
      outDir: 'O'
    }).describe({
      keepCase: 'Preserve the case of field names',
      longs: 'The type that should be used to output 64 bit integer values',
      enums: 'The type that should be used to output enum fields',
      bytes: 'The type that should be used to output bytes fields',
      defaults: 'Output default values for omitted fields',
      arrays: 'Output default values for omitted repeated fields even if --defaults is not set',
      objects: 'Output default values for omitted message fields even if --defaults is not set',
      oneofs: 'Output virtual oneof fields set to the present field\'s name',
      includeDirs: 'Directories to search for included files',
      outDir: 'Directory in which to output files',
      grpcLib: 'The gRPC implementation library that these types will be used with'
    }).demandOption(['outDir', 'grpcLib'])
    .demand(1)
    .usage('$0 [options] filenames...')
    .epilogue('WARNING: This tool is in alpha. The CLI and generated code are subject to change')
    .argv;
    console.log(argv);
    writeAllFiles(argv._, argv).then(() => {
      console.log('Success');
    }, (error) => {
      throw error;
    })
}

if (require.main === module) {
  runScript();
}