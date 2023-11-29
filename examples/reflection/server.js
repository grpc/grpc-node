var path = require('path');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var reflection = require('@grpc/reflection');

var PROTO_PATH = path.join(__dirname, '../protos/helloworld.proto');

var server = new grpc.Server();
var packageDefinition = protoLoader.loadSync(PROTO_PATH);
var proto = grpc.loadPackageDefinition(packageDefinition);
var reflection = new reflection.ReflectionService(packageDefinition);

reflection.addToServer(server);
server.addService(proto.helloworld.Greeter.service, {
  sayHello: (call, callback) => { callback(null, { message: 'Hello' }) }
});

server.bindAsync('localhost:5000', grpc.ServerCredentials.createInsecure(), () => {
  server.start();
});
