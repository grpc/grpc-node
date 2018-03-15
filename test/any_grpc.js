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
  return require(`../packages/grpc-${impl}-core`);
}

const clientImpl = getImplementation('_client_implementation');
const serverImpl = getImplementation('_server_implementation');

module.exports = {
  client: clientImpl,
  server: serverImpl
};
