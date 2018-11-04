// TODO: Instead of attempting to expose both implementations of gRPC in
// a single object, the tests should be re-written in a way that makes it clear
// that two separate implementations are being tested against one another.

const _ = require('lodash');

function getImplementation(globalField) {
  const impl = global[globalField];

  if (impl === 'js') {
    return require(`../packages/grpc-${impl}`);
  } else if (impl === 'native') {
    return require(`../packages/grpc-${impl}-core`);
  }

  throw new Error([
    `Invalid value for global.${globalField}: ${global.globalField}.`,
    'If running from the command line, please --require a fixture first.'
  ].join(' '));
}

const clientImpl = getImplementation('_client_implementation');
const serverImpl = getImplementation('_server_implementation');

module.exports = {
  client: clientImpl,
  server: serverImpl
};
