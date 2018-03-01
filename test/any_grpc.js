// TODO: Instead of attempting to expose both implementations of gRPC in
// a single object, the tests should be re-written in a way that makes it clear
// that two separate implementations are being tested against one another.

const _ = require('lodash');

function getImplementation(globalField) {
  if (global[globalField] !== 'js' && global[globalField] !== 'native') {
    throw new Error([
      `Invalid value for global.${globalField}: ${global.globalField}.`,
      'If running from the command line, please --require a fixture first.'
    ].join(' '));
  }
  const impl = global[globalField];
  return {
    surface: require(`../packages/grpc-${impl}`),
    pjson: require(`../packages/grpc-${impl}/package.json`),
    core: require(`../packages/grpc-${impl}-core`),
    corePjson: require(`../packages/grpc-${impl}-core/package.json`)
  };
}

const clientImpl = getImplementation('_client_implementation');
const serverImpl = getImplementation('_server_implementation');

// We export a "merged" gRPC API by merging client and server specified
// APIs together. Any function that is unspecific to client/server defaults
// to client-side implementation.
// This object also has a test-only field from which details about the
// modules may be read.
module.exports = Object.assign({
  '$implementationInfo': {
    client: clientImpl,
    server: serverImpl
  }
}, clientImpl.surface, _.pick(serverImpl.surface, [
  'Server',
  'ServerCredentials'
]));
