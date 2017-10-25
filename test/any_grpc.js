module.exports = {
  packageJson: {},
  core: {
    packageJson: {}
  }
};

function assignExportsFromGlobal(globalField, exportsField) {
  if (global[globalField] !== 'js' && global[globalField] !== 'native') {
    throw new Error([
      `Invalid value for global.${globalField}: ${global.globalField}.`,
      'If running from the command line, please --require a fixture first.'
    ].join(' '));
  }
  const impl = global[globalField];
  // (1) set global field.
  module.exports[exportsField] = require(`../packages/grpc-${impl}`);
  // (2) make package's package.json file accessible thru packageJson path.
  module.exports.packageJson[exportsField] = require(`../packages/grpc-${impl}/package.json`);
  // (3) make package's underlying core dependency accessible thru core path.
  module.exports.core[exportsField] = require(`../packages/grpc-${impl}-core`);
  // (4) make (3) x (2) accessible thru core.packageJson path.
  module.exports.core.packageJson[exportsField] = require(`../packages/grpc-${impl}-core/package.json`);
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
  module.exports.core.all = module.exports.core.client;
  module.exports.packageJson.all = module.exports.packageJson.client;
  module.exports.core.packageJson.all = module.exports.core.packageJson.client;
}
