# grpc-tools

This package distributes the Protocol Buffers compiler `protoc` along with the
plugin for generating client and service objects for use with the Node gRPC
libraries.

## Usage

This library exports the `grpc_tools_node_protoc` executable, which accepts all
of the same arguments as `protoc` itself. For use with Node, you most likely
want to use CommonJS-style imports. An example of generating code this way can
be found in [this guide](https://developers.google.com/protocol-buffers/docs/reference/javascript-generated#commonjs-imports).
The `grpc_tools_node_protoc` automatically includes the Node gRPC plugin, so
it also accepts the `--grpc_out=[option:]path` argument. The option can be
one of the following:

 - `grpc_js`: Generates code with `require('@grpc/grpc-js')` instead of
   `require('grpc')`
 - `generate_package_definition`: Generates code that does not `require` any
   gRPC library, and instead generates `PackageDefinition` objects that can
   be passed to the `loadPackageDefinition` function provided by both the
   `grpc` and `@grpc/grpc-js` libraries.

### Building gprc-tools

I needed to compile `gprc-tools` from source to be able to run it on Apple Silicon because builds are not provided.

My steps:

```sh
git clone git@github.com:grpc/grpc-node.git
cd grpc-node
brew install cmake # ./build_binaries.sh needs cmake. also tried xcode-select --install but it didn't seem to work
cd packages/grpc-tools && git submodule update --init --recursive && ./build_binaries.sh
# then to install in pnpm (does not support npm flag)
npm_config_grpc_tools_binary_host_mirror="https://github.com/maschwenk/grpc-node/raw/2dd28e1ab8211533007dd2df5ae632de60006983/artifacts/" pnpm install
# checkout https://github.com/mapbox/node-pre-gyp/blob/master/lib/util/versioning.js#L316
# seems passing as an ENV also works (so will probably work for PNPM and Yarn)
```
