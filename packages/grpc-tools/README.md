# grpc-tools

This package distributes the Protocol Buffers compiler `protoc` along with the
plugin for generating client and service objects for use with the Node gRPC
libraries.

## Usage

This library exports the `grpc_tools_node_protoc` executable, which accepts
the same arguments as `protoc` itself. The `grpc_tools_node_protoc` automatically
includes the Node gRPC plugin, so it also accepts the `--grpc_out=[option:]path`
argument. The option can be one of the following:

 - `grpc_js`: Generates code with `require('@grpc/grpc-js')` instead of
   `require('grpc')`
 - `generate_package_definition`: Generates code that does not `require` any
   gRPC library, and instead generates `PackageDefinition` objects that can
   be passed to the `loadPackageDefinition` function provided by both the
   `grpc` and `@grpc/grpc-js` libraries.

For use in a Node application, examples of pre-compiling a gRPC and protobuf
integration and integrating dynamically at runtime can be found in [the Node gRPC docs](https://grpc.io/docs/languages/node/).
