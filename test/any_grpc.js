const assert = require('assert');
const callerId = require('caller-id');
const path = require('path');
const semver = require('semver');
const shimmer = require('shimmer');
const Module = require('module');

const http2Available = semver.satisfies(process.version, '8.x');

// Handle Promise rejections by failing
process.on('unhandledRejection', err => assert.ifError(err));

const grpcProtobuf = require('../packages/grpc-protobufjs');

/**
 * Returns a function that appears to be similar to require(), but substitutes
 * the return value of require('grpc') to grpcImpl.
 * 
 * If a module does call require('grpc'), its entry will be deleted in the
 * require cache, to prevent cross-contamination between "client-side" and
 * "server-side" modules.
 * 
 * There are likely other subtle differences between this function and require
 * itself, but we assume that this doesn't matter for our tests.
 * 
 * @param grpcImpl The gRPC implementation to use.
 */
const requireAsFn = (grpcImpl) => (p) => {
  // Use caller-id to get information about the file where requireAs*
  // was called, so we can adjust the input path to be relative to this
  // file path instead.
  if (p.startsWith('.')) {
    p = path.resolve(path.dirname(callerId.getData().filePath), p);
  }
  // Wrap Module._load, which is called by require(), to short-circuit when
  // called with 'grpc'.
  shimmer.wrap(Module, '_load', (moduleLoad) => {
    const uncache = new Set();
    return function Module_load(path, parent) {
      if (path.startsWith('grpc')) {
        // Mark the module that required 'grpc' to have its entry deleted from
        // the require cache.
        uncache.add(parent.filename);
        return grpcImpl;
      } else {
        const result = moduleLoad.apply(this, arguments);
        // Get the path of the loaded module.
        const filename = Module._resolveFilename.apply(this, arguments);
        // If this module called require('grpc'), immediately delete its entry
        // from the cache.
        if (uncache.has(filename)) {
          uncache.delete(filename);
          delete require.cache[filename];
        }
        return result;
      }
    }
  });
  const result = require(p);
  shimmer.unwrap(Module, '_load');
  delete require.cache[p];
  return result;
}

// Load implementations

const implementations = {
  js: http2Available ? require('../packages/grpc-js') : {},
  native: require('../packages/grpc-native')
}

const versions = {
  js: require('../packages/grpc-js-core/package').version,
  native: require('../packages/grpc-native-core/package').version
}

const server = implementations[global._server_implementation];
const client = implementations[global._client_implementation];
const serverVersion = versions[global._server_implementation];
const clientVersion = versions[global._client_implementation];

if (!client || !server) {
  throw new Error('If running from the command line, please --require a ' +
      'fixture in ./fixtures first.');
}

// prefer requireAs* instead of these.
Object.assign(server, grpcProtobuf(server));
Object.assign(client, grpcProtobuf(client));

module.exports = {
  server,
  client,
  serverVersion,
  clientVersion,
  requireAsServer: requireAsFn(server),
  requireAsClient: requireAsFn(client),
  runAsServer: (fn) => fn(server),
  runAsClient: (fn) => fn(client),
  skipIfJsClient: (mochaVerb) => {
    if (client === implementations.js) {
      return mochaVerb.skip;
    } else {
      return mochaVerb;
    }
  }
};
