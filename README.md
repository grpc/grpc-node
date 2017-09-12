# gRPC on Node.js

## Implementations

### C-based Client and Server

Directory: `packages/grpc-native-core`

npm package: [grpc](https://www.npmjs.com/package/grpc).

This library will continue to be the canonical, feature rich implementation of gRPC, with broad but incomplete platform support.

### Pure JavaScript Client

Directory: `packages/grpc-js-core`

**This library is currently incomplete and experimental, built on the [experimental http2 Node module](https://nodejs.org/api/http2.html).**

This library is a minimally-featured implementation of gRPC purely in JavaScript, without a C++ addon. It is intended for use in libraries that need complete platform support and only basic gRPC features.

## Other Packages

### gRPC Tools

Directory: `packages/grpc-tools`

npm package: [grpc-tools](https://www.npmjs.com/package/grpc-tools)

Distribution of protoc and the gRPC Node protoc plugin for ease of installation with npm.

### gRPC Health Check Service

Directory: `packages/grpc-health-check`

npm package: [grpc-health-check](https://www.npmjs.com/package/grpc-health-check)

Health check service for gRPC servers.
