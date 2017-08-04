# Pure JavaScript Node gRPC Client

**This library is currently incomplete and experimental, built on the [upcoming experimental http2 Node module](https://github.com/nodejs/node/pull/14239).** The existing, working gRPC Node.js module can be found [on npm](https://www.npmjs.com/package/grpc) and [on github](https://github.com/grpc/grpc/tree/master/src/node).

This library is a minimally-featured implementation of gRPC purely in JavaScript, without a C++ addon. It is intended for use in libraries that need complete platform support and only basic gRPC features.

The existing gRPC Node.js module will continue to be the canonical, feature rich implementation of gRPC, with broad but incomplete platform support.
