var anyGrpc = require('../any_grpc');
var assert = require('assert');
var grpc = anyGrpc.requireAsServer('grpc');

var mathProtoPath = __dirname +
    '/../../packages/grpc-native-core/deps/grpc/src/proto/math/math.proto';

var MathClient = grpc.load(mathProtoPath).math.Math;
var mathServiceAttrs = MathClient.service;

describe('surface Server', function() {
  var server;
  beforeEach(function() {
    server = new grpc.Server();
  });
  afterEach(function() {
    server.forceShutdown();
  });
  it('should error if started twice', function() {
    server.start();
    assert.throws(function() {
      server.start();
    });
  });
  it('should error if a port is bound after the server starts', function() {
    server.start();
    assert.throws(function() {
      server.bind('localhost:0', grpc.ServerCredentials.createInsecure());
    });
  });
  it('should successfully shutdown if tryShutdown is called', function(done) {
    server.start();
    server.tryShutdown(done);
  });
});

describe('Server.prototype.addService', function() {
  var server;
  var dummyImpls = {
    'div': function() {},
    'divMany': function() {},
    'fib': function() {},
    'sum': function() {}
  };
  beforeEach(function() {
    server = new grpc.Server();
  });
  afterEach(function() {
    server.forceShutdown();
  });
  it('Should succeed with a single service', function() {
    assert.doesNotThrow(function() {
      server.addService(mathServiceAttrs, dummyImpls);
    });
  });
  it('Should fail with conflicting method names', function() {
    server.addService(mathServiceAttrs, dummyImpls);
    assert.throws(function() {
      server.addService(mathServiceAttrs, dummyImpls);
    });
  });
  it('Should allow method names as originally written', function() {
    var altDummyImpls = {
      'Div': function() {},
      'DivMany': function() {},
      'Fib': function() {},
      'Sum': function() {}
    };
    assert.doesNotThrow(function() {
      server.addService(mathServiceAttrs, altDummyImpls);
    });
  });
  it('Should have a conflict between name variations', function() {
    /* This is really testing that both name variations are actually used,
      by checking that the method actually gets registered, for the
      corresponding function, in both cases */
    var altDummyImpls = {
      'Div': function() {},
      'DivMany': function() {},
      'Fib': function() {},
      'Sum': function() {}
    };
    server.addProtoService(mathServiceAttrs, altDummyImpls);
    assert.throws(function() {
      server.addProtoService(mathServiceAttrs, dummyImpls);
    });
  });
  it('Should fail if the server has been started', function() {
    server.start();
    assert.throws(function() {
      server.addService(mathServiceAttrs, dummyImpls);
    });
  });
  describe('Default handlers', function() {
    var client;
    beforeEach(function() {
      server.addService(mathServiceAttrs, {});
      var port = server.bind('localhost:0',
                             grpc.ServerCredentials.createInsecure());
      server.start();

      anyGrpc.runAsClient((grpc) => {
        var MathClient = grpc.load(mathProtoPath).math.Math;
        client = new MathClient('localhost:' + port,
                                grpc.credentials.createInsecure());
      });
    });
    it('should respond to a unary call with UNIMPLEMENTED', function(done) {
      client.div({divisor: 4, dividend: 3}, function(error, response) {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNIMPLEMENTED);
        done();
      });
    });
    it('should respond to a client stream with UNIMPLEMENTED', function(done) {
      var call = client.sum(function(error, respones) {
        assert(error);
        assert.strictEqual(error.code, grpc.status.UNIMPLEMENTED);
        done();
      });
      call.end();
    });
    it('should respond to a server stream with UNIMPLEMENTED', function(done) {
      var call = client.fib({limit: 5});
      call.on('data', function(value) {
        assert.fail('No messages expected');
      });
      call.on('error', function(err) {
        assert.strictEqual(err.code, grpc.status.UNIMPLEMENTED);
        done();
      });
      call.on('error', function(status) { /* Do nothing */ });
    });
    it('should respond to a bidi call with UNIMPLEMENTED', function(done) {
      var call = client.divMany();
      call.on('data', function(value) {
        assert.fail('No messages expected');
      });
      call.on('error', function(err) {
        assert.strictEqual(err.code, grpc.status.UNIMPLEMENTED);
        done();
      });
      call.on('error', function(status) { /* Do nothing */ });
      call.end();
    });
  });
});
