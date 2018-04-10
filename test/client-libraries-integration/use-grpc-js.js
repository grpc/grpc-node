require('source-map-support/register');
const Module = require('module');
const shimmer = require('shimmer');

const grpcPJson = require('../../packages/grpc-js-core/package');
const grpcImpl = require('../../packages/grpc-js-core');
const grpcProtobuf = require('../../packages/grpc-protobufjs');

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
                const packageDef = grpcProtobuf.loadSync(filename.file, {
                  keepCase: false,
                  defaults: true,
                  enums: String,
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
                const packageDef = grpcProtobuf.loadSync(filename, {
                  keepCase: false,
                  defaults: true,
                  enums: String,
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
                    keepCase: false,
                    bytes: 'string',
                    defaults: true,
                    enums: String,
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
