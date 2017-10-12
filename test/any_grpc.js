module.exports = {};

function assignExportsFromGlobal(globalField, exportsField) {
  if (global[globalField] === 'js') {
    module.exports[exportsField] = require('../packages/grpc-js');
  } else if (global[globalField] === 'native') {
    module.exports[exportsField] = require('../packages/grpc-native');
  } else {
    throw new Error([
      `Invalid value for global.${globalField}: ${global.globalField}.`,
      'If running from the command line, please --require a fixture first.'
    ].join(' '));
  }
}

// Set 'server' and 'client' fields on this module's exports.
// These don't refer to the portions of the gRPC interface that are
// relevant to an application behaving as a server or a client respectively.
// Instead, they refer to the entire gRPC module as it's visible to the
// application.
// In other words, a test that simulates a gRPC client should treat
// require('any-grpc').client as the value of require('grpc'), and would simply
// not be expected to use server components.
assignExportsFromGlobal('_server_implementation', 'server');
assignExportsFromGlobal('_client_implementation', 'client');
// Increase clarity when there's no distinction between client/server
if (module.exports.client === module.exports.server) {
  module.exports.all = module.exports.client;
}
