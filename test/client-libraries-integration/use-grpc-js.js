const Module = require('module');
const shimmer = require('shimmer');

const grpcImpl = require('../../packages/grpc-js-core');
const grpcPJson = require('../../packages/grpc-js-core/package');

shimmer.wrap(Module, '_load', (moduleLoad) => {
  return function Module_load(path, parent) {
    if (path === 'grpc') {
      return grpcImpl;
    } else if (path.startsWith('grpc/package')) {
      return grpcPJson;
    } else {
      const result = moduleLoad.apply(this, arguments);
      return result;
    }
  };
});
