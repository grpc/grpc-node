# Pure JavaScript gRPC Client

## Installation

Node 12 is recommended. The exact set of compatible Node versions can be found in the `engines` field of the `package.json` file.

```sh
npm install @grpc/grpc-js
```

## Features

 - Clients
 - Automatic reconnection
 - Servers
 - Streaming
 - Metadata
 - Partial compression support: clients can decompress response messages
 - Pick first and round robin load balancing policies
 - Client Interceptors
 - Connection Keepalives
 - HTTP Connect support (proxies)


This library does not directly handle `.proto` files. To use `.proto` files with this library we recommend using the `@grpc/proto-loader` package.

## Some Notes on API Guarantees

The public API of this library follows semantic versioning, with some caveats:

 - Some methods are prefixed with an underscore. These methods are internal and should not be considered part of the public API.
 - The class `Call` is only exposed due to limitations of TypeScript. It should not be considered part of the public API.
 - In general, any API that is exposed by this library but is not exposed by the `grpc` library is likely an error and should not be considered part of the public API.
