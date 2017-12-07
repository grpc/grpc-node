const proxyquire = require('proxyquire');

module.exports = function getMathClientConstructor(grpc) {
  const makeGenericClientConstructor = proxyquire('./math_grpc_pb', {
    // note: this mutates the incoming grpc object.
    // for or purposes it's unlikely to matter, though.
    grpc: Object.assign(grpc, {'@noCallThru': true})
  });
  return makeGenericClientConstructor();
}
