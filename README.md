[![Build Status](https://travis-ci.org/grpc/grpc-node.svg?branch=master)](https://travis-ci.org/grpc/grpc-node)
# gRPC on Node.js

## Implementations

For a comparison of the features available in these two libraries, see [this document](https://github.com/grpc/grpc-node/tree/master/PACKAGE-COMPARISON.md)

### Pure JavaScript Client and Server

Directory: [`packages/grpc-js`](https://github.com/grpc/grpc-node/tree/master/packages/grpc-js)

npm package: [@grpc/grpc-js](https://www.npmjs.com/package/@grpc/grpc-js)

This library implements the core functionality of gRPC purely in JavaScript, without a C++ addon. It works on the latest versions of Node.js on all platforms that Node.js runs on.

### C-based Client and Server (deprecated)

Directory: [`packages/grpc-native-core`](https://github.com/grpc/grpc-node/tree/grpc@1.24.x/packages/grpc-native-core) (lives in the `grpc@1.24.x` branch) (see here for installation information)

npm package: [grpc](https://www.npmjs.com/package/grpc).

This is the deprecated implementation of gRPC using a C++ addon. It works on versions of Node.js up to 14 on most platforms that Node.js runs on.

## Other Packages

### gRPC Protobuf Loader

Directory: [`packages/proto-loader`](https://github.com/grpc/grpc-node/tree/master/packages/proto-loader)

npm package: [@grpc/proto-loader](https://www.npmjs.com/package/@grpc/proto-loader)

This library loads `.proto` files into objects that can be passed to the gRPC libraries.

### gRPC Tools

Directory: [`packages/grpc-tools`](https://github.com/grpc/grpc-node/tree/master/packages/grpc-tools)

npm package: [grpc-tools](https://www.npmjs.com/package/grpc-tools)

Distribution of protoc and the gRPC Node protoc plugin for ease of installation with npm.

### gRPC Health Check Service

Directory: [`packages/grpc-health-check`](https://github.com/grpc/grpc-node/tree/master/packages/grpc-health-check)

npm package: [grpc-health-check](https://www.npmjs.com/package/grpc-health-check)

Health check service for gRPC servers.
