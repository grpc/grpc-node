This is the static code generation variant of the Route Guide example. Code in these examples is pre-generated using protoc and the Node gRPC protoc plugin, and the generated code can be found in various `*_pb.js` files. The command line sequence for generating those files is as follows (assuming that `protoc` and `grpc_node_plugin` are present, and starting in the directory which contains this README.md file):

```sh
cd ../protos
npm install -g grpc-tools
grpc_tools_node_protoc --js_out=import_style=commonjs,binary:../routeguide/static_codegen/ --grpc_out=grpc_js:../routeguide/static_codegen/ route_guide.proto
```
