This is the static code generation variant of the Hello World. Code in these examples is pre-generated using protoc and the Node gRPC protoc plugin, and the generated code can be found in various `*_pb.js` files. The command line sequence for generating those files is as follows (assuming that `protoc` and `grpc_node_plugin` are present, and starting in the directory which contains this README.md file):

```sh
cd ../protos
npm install -g grpc-tools @bufbuild/protoc-gen-es
grpc_tools_node_protoc --es_out=target=js,js_import_style=legacy_commonjs:../helloworld/static_codegen_es/ --grpc_out=grpc_js,runtime=bufbuild-protobuf:../helloworld/static_codegen_es/ helloworld.proto
```
