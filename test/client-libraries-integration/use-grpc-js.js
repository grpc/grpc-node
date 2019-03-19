/*
 * Copyright 2019 gRPC authors.
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

require('source-map-support/register');
const Module = require('module');
const shimmer = require('shimmer');

const grpcPJson = require('../../packages/grpc-js/package');
const grpcImpl = require('../../packages/grpc-js');
const grpcProtobuf = require('../../packages/proto-loader');

if (!process.env.USE_GRPC_NATIVE) {
  shimmer.wrap(Module, '_load', (moduleLoad) => {
    return function Module_load(moduleName, parent) {
      if (moduleName === 'grpc') {
        // load grpc-js when grpc is requested.
        return grpcImpl;
      } else if (moduleName.startsWith('grpc/package')) {
        // load grpc-js's package.json when grpc's package.json is requested.
        return grpcPJson;
      } else {
        const result = moduleLoad.apply(this, arguments);
        // monkeypatch google-gax and @google-cloud/common-grpc to avoid all
        // references to grpc.load and grpc.loadObject, implementing functions
        // on top of the new API for loading proto files.
        if (moduleName === 'google-gax') {
          if (!result.grpc.prototype.load.__wrapped) {
            shimmer.wrap(result.grpc.prototype, 'load', (gaxLoad) => {
              return function (filename, format, options) {
                if (Array.isArray(filename)) {
                  options = filename[2];
                  filename = filename[0];
                }
                options = Object.assign({
                  convertFieldsToCamelCase: true, // gax load uses hardcoded convertFieldsToCamelCase = true if it's not specified.
                  binaryAsBase64: false, // gRPC default option
                  longsAsStrings: true, // gRPC default option
                  enumsAsStrings: true, // gRPC default option
                }, options);
                const packageDef = grpcProtobuf.loadSync(filename.file, {
                  keepCase: !options.convertFieldsToCamelCase,
                  defaults: true,
                  bytes: options.binaryAsBase64 ? String : Buffer,
                  longs: options.longsAsString ? String : null,
                  enums: options.enumsAsStrings ? String : null,
                  oneofs: true,
                  include: [filename.root]
                });
                return grpcImpl.loadPackageDefinition(packageDef);
              }
            });
          }
          if (!result.grpc.prototype.loadProto.__wrapped) {
            shimmer.wrap(result.grpc.prototype, 'loadProto', (gaxLoadProto) => {
              const path = require('path');
              const googleProtoFilesDir = require('google-proto-files')('..');
              return function (protoPath, filename) {
                // loadProto does not accept options, so the options passed
                // here correspond to defaultGrpcOptions.
                const packageDef = grpcProtobuf.loadSync(filename, {
                  keepCase: false,
                  defaults: true,
                  bytes: Buffer,
                  longs: String,
                  enums: String,
                  oneofs: true,
                  include: [protoPath, googleProtoFilesDir]
                });
                return grpcImpl.loadPackageDefinition(packageDef);
              };
            });
          }
        } else if (moduleName === '@google-cloud/common-grpc') {
          if (!result.Service.prototype.loadProtoFile_.__wrapped) {
            shimmer.wrap(result.Service.prototype, 'loadProtoFile_', (commonLoad) => {
              const dotProp = require('dot-prop');
              // loadProtoFile_ uses a module-scope cache of loaded proto
              // objects which isn't referenced anywhere else
              const protoObjectCache = {};

              return function (protoConfig, config) {
                if (typeof protoConfig === 'string') {
                  protoConfig = { path: protoConfig };
                }

                const protoObjectCacheKey = [
                  config.protosDir,
                  protoConfig.path,
                  protoConfig.service,
                ].join('$');

                if (!protoObjectCache[protoObjectCacheKey]) {
                  const services = grpcProtobuf.loadSync(protoConfig.path, {
                    keepCase: false, // loadProtoFile_ uses hardcoded convertFieldsToCamelCase = true
                    defaults: true,
                    bytes: String, // loadProtoFile_ uses hardcoded binaryAsBase64 = true
                    longs: String,
                    enums: String,
                    oneofs: true,
                    include: [config.protosDir]
                  });
                  const service = dotProp.get(services.google, protoConfig.service);
                  protoObjectCache[protoObjectCacheKey] = service;
                }

                return protoObjectCache[protoObjectCacheKey];
              }
            });
          }
        }
        return result;
      }
    };
  });
}
