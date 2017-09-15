[![Build Status](https://travis-ci.org/grpc/grpc-node.svg?branch=master)](https://travis-ci.org/grpc/grpc-node)
# gRPC on Node.js

## Implementations

### C-based Client and Server

Directory: [`packages/grpc-native-core`](https://github.com/grpc/grpc-node/tree/master/packages/grpc-native-core) (see here for installation information)

npm package: [grpc](https://www.npmjs.com/package/grpc).

This is the existing, feature-rich implementation of gRPC using a C++ addon. It works on all LTS versions of Node.js on most platforms that Node.js runs on.

### Pure JavaScript Client

Directory: [`packages/grpc-js-core`](https://github.com/grpc/grpc-node/tree/master/packages/grpc-js-core)

**This library is currently incomplete and experimental, built on the [experimental http2 Node module](https://nodejs.org/api/http2.html).**

This library implements the core functionality of gRPC purely in JavaScript, without a C++ addon. It works on the latest version of Node.js (with the `--expose-http2` flag set) on all platforms that Node.js runs on.

## Other Packages

### gRPC Tools

Directory: `packages/grpc-tools`

npm package: [grpc-tools](https://www.npmjs.com/package/grpc-tools)

Distribution of protoc and the gRPC Node protoc plugin for ease of installation with npm.

### gRPC Health Check Service

Directory: `packages/grpc-health-check`

npm package: [grpc-health-check](https://www.npmjs.com/package/grpc-health-check)

Health check service for gRPC servers.
