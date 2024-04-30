const loader = require('@grpc/proto-loader');
const path = require('node:path');

// eslint-disable-next-line node/no-unpublished-import
const { loadPackageDefinition } = require('../../build/src/make-client');

const protoLoaderOptions = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

function loadProtoFile(file) {
  const packageDefinition = loader.loadSync(file, protoLoaderOptions);
  return loadPackageDefinition(packageDefinition);
}

const protoFile = path.join(
  __dirname,
  '../../test/fixtures',
  'echo_service.proto'
);
const echoService = loadProtoFile(protoFile).EchoService;

exports.loadProtoFile = loadProtoFile;
exports.echoService = echoService;
